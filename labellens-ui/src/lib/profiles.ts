import type { HealthProfile, HealthProfileId, Per100g, KnowledgeAnalysis, ScoringResult, ProfileAdjustment } from './types';

export const HEALTH_PROFILES: HealthProfile[] = [
  {
    id: 'general',
    name: 'Standard',
    icon: '',
    tagline: 'Standard Health Rating',
    description: 'Standard health scoring based on European Nutri-Score & FSSAI benchmarks.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'diabetic',
    name: 'Diabetic',
    icon: '',
    tagline: 'Sugar Watch',
    description: 'Stricter penalty on free sugars, refined carbs, and high-glycemic sweeteners.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
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

  // Diabetic Profile
  if (profileId === 'diabetic') {
    if (sugars > 15) {
      const extraPenalty = Math.min(3.0, (sugars - 15) * 0.15);
      adjustedScore -= extraPenalty;
      penaltyApplied += extraPenalty;
      hardWarnings.push({
        severity: 'CRITICAL',
        message: `High Glycemic Index: ${sugars.toFixed(1)}g sugar per 100g exceeds diabetic limits (>15g).`,
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

  // General profile top reasons if not populated
  if (reasons.length < 3) {
    if (sugars > 12) reasons.push(`High free sugar concentration (${sugars.toFixed(1)}g/100g).`);
    if (salt > 1.0) reasons.push(`Elevated salt level (${salt.toFixed(2)}g/100g).`);
    if ((nutrition.saturated_fat_g ?? 0) > 4.0) reasons.push(`High saturated fat (${(nutrition.saturated_fat_g ?? 0).toFixed(1)}g/100g).`);
    if ((nutrition.fibre_g ?? 0) > 4.0) reasons.push(`Beneficial dietary fiber (+${(nutrition.fibre_g ?? 0).toFixed(1)}g/100g).`);
    if ((nutrition.protein_g ?? 0) > 8.0) reasons.push(`Protein content (+${(nutrition.protein_g ?? 0).toFixed(1)}g/100g).`);
  }

  return {
    adjusted_score: Math.min(10, Math.max(1, Math.round(adjustedScore * 10) / 10)),
    hard_warnings: hardWarnings,
    penalty_applied: Math.round(penaltyApplied * 10) / 10,
    reasons: reasons.slice(0, 3)
  };
}
