import type { HealthProfile, HealthProfileId, Per100g, KnowledgeAnalysis, ScoringResult, ProfileAdjustment } from './types';

export const HEALTH_PROFILES: HealthProfile[] = [
  {
    id: 'general',
    name: 'General Adult',
    icon: '🛡️',
    tagline: 'Standard Health Score',
    description: 'Standard health scoring for everyday adults with no special restrictions.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'diabetic',
    name: 'Diabetic / Pre-diabetic',
    icon: '🩸',
    tagline: 'Low Sugar Focus',
    description: 'Stricter on sugar. Warns when sugar exceeds 15g per 100g.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  {
    id: 'nut_allergy',
    name: 'Severe Nut Allergy',
    icon: '🥜',
    tagline: 'Nut Allergy Safe',
    description: 'Warns immediately if peanuts or tree nuts are found.',
    badgeColor: 'border-red-500/30 text-red-400 bg-red-500/10'
  },
  {
    id: 'child',
    name: 'Child (Under 10)',
    icon: '👶',
    tagline: 'Kids Nutrition',
    description: 'Watches out for artificial food dyes, caffeine, high sugar, and saturated fat.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  },
  {
    id: 'blood_pressure',
    name: 'High Blood Pressure',
    icon: '🫀',
    tagline: 'Low Sodium & Salt',
    description: 'Stricter on salt. Warns if salt exceeds 1.5g per 100g.',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  }
];

export function applyHealthProfile(
  baseScore: ScoringResult,
  knowledge: KnowledgeAnalysis,
  nutrition: Per100g,
  profileId: HealthProfileId
): ProfileAdjustment {
  let adjustedScore = baseScore.score_1_to_10 - knowledge.deductions;
  let penaltyApplied = knowledge.deductions;
  const hardWarnings: Array<{ severity: 'CRITICAL' | 'WARNING' | 'INFO'; message: string; flag: string }> = [];
  const reasons: string[] = [];

  const sugars = nutrition.sugars_g ?? 0;
  const salt = nutrition.salt_g ?? (nutrition.sodium_mg ? nutrition.sodium_mg * 0.0025 : 0);

  // 1. Nut Allergy Profile
  if (profileId === 'nut_allergy') {
    const nutMatches = knowledge.allergens.filter(a => a.name === 'Peanuts' || a.name === 'Tree Nuts');
    if (nutMatches.length > 0) {
      hardWarnings.push({
        severity: 'CRITICAL',
        message: `⚠️ Contains ${nutMatches.map(n => n.name).join(' & ')}! Do not eat if allergic to nuts.`,
        flag: 'allergen'
      });
      adjustedScore = 1.0;
      reasons.push('Contains peanuts or tree nuts.');
    }
  }

  // 2. Diabetic Profile
  else if (profileId === 'diabetic') {
    if (sugars > 15) {
      const extraPenalty = Math.min(3.0, (sugars - 15) * 0.15);
      adjustedScore -= extraPenalty;
      penaltyApplied += extraPenalty;
      hardWarnings.push({
        severity: 'CRITICAL',
        message: `⚠️ HIGH GLYCEMIC SPIKE: ${sugars.toFixed(1)}g sugar/100g exceeds safe diabetic thresholds (>15g).`,
        flag: 'sugar'
      });
      reasons.push(`Rapid blood glucose elevation risk: contains ${sugars.toFixed(1)}g total sugars.`);
    } else if (sugars > 5) {
      reasons.push(`Moderate sugar content: ${sugars.toFixed(1)}g sugar per 100g.`);
    }
    if (knowledge.hidden_sugars.length > 0) {
      reasons.push(`Contains hidden refined sweeteners: ${knowledge.hidden_sugars.map(s => s.name).slice(0, 2).join(', ')}.`);
    }
  }

  // 3. Child Profile
  else if (profileId === 'child') {
    const azoDyes = knowledge.additives.filter(a => a.name.includes('E102') || a.name.includes('E110') || a.name.includes('E122') || a.name.includes('E129'));
    if (azoDyes.length > 0) {
      hardWarnings.push({
        severity: 'WARNING',
        message: `⚠️ Pediatric Attention Risk: Contains EU-flagged artificial azo dyes (${azoDyes.map(d => d.name).join(', ')}).`,
        flag: 'additive'
      });
      reasons.push('Synthetic food colorants linked to behavioral hyperactivity in young children.');
    }
    if (sugars > 18) {
      hardWarnings.push({
        severity: 'WARNING',
        message: `⚠️ High sugar for growing children: ${sugars.toFixed(1)}g sugar/100g.`,
        flag: 'sugar'
      });
    }
  }

  // 4. High Blood Pressure Profile
  else if (profileId === 'blood_pressure') {
    if (salt > 1.5) {
      const extraPenalty = Math.min(3.0, (salt - 1.5) * 1.5);
      adjustedScore -= extraPenalty;
      penaltyApplied += extraPenalty;
      hardWarnings.push({
        severity: 'CRITICAL',
        message: `⚠️ DANGEROUS SODIUM LOAD: ${salt.toFixed(2)}g salt/100g exceeds cardiac limits (>1.5g).`,
        flag: 'salt'
      });
      reasons.push(`Significant arterial strain: contains ${salt.toFixed(2)}g salt (approx ${Math.round(salt * 400)}mg sodium).`);
    } else if (salt > 0.8) {
      reasons.push(`Moderate salt content: ${salt.toFixed(2)}g salt/100g.`);
    }
  }

  // General profile top reasons if not populated
  if (reasons.length < 3) {
    if (sugars > 12) reasons.push(`High free sugar concentration (${sugars.toFixed(1)}g/100g) degrades score.`);
    if (salt > 1.0) reasons.push(`Elevated salt level (${salt.toFixed(2)}g/100g).`);
    if ((nutrition.saturated_fat_g ?? 0) > 4.0) reasons.push(`High saturated fat (${(nutrition.saturated_fat_g ?? 0).toFixed(1)}g/100g).`);
    if ((nutrition.fibre_g ?? 0) > 4.0) reasons.push(`High beneficial dietary fibre (+${(nutrition.fibre_g ?? 0).toFixed(1)}g/100g).`);
    if ((nutrition.protein_g ?? 0) > 8.0) reasons.push(`Substantial protein content (+${(nutrition.protein_g ?? 0).toFixed(1)}g/100g).`);
  }

  return {
    adjusted_score: Math.min(10, Math.max(1, Math.round(adjustedScore * 10) / 10)),
    hard_warnings: hardWarnings,
    penalty_applied: Math.round(penaltyApplied * 10) / 10,
    reasons: reasons.slice(0, 3)
  };
}
