import type { Per100g, ScoringResult, NutriGrade, FactorBreakdown } from './types';

// General Food Thresholds (Official Nutri-Score 2023 revision)
const ENERGY_THRESHOLDS = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
const SUGAR_THRESHOLDS = [3.4, 6.8, 10.0, 14.0, 17.0, 21.0, 24.0, 28.0, 31.0, 35.0, 39.0, 42.0, 46.0, 49.0, 53.0];
const SAT_FAT_THRESHOLDS = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
const SALT_THRESHOLDS = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0];
const FIBRE_THRESHOLDS = [3.0, 4.1, 5.2, 6.3, 7.4];
const PROTEIN_THRESHOLDS = [2.4, 4.8, 7.2, 9.6, 12.0, 14.0, 17.0];

function lookupPoints(value: number, thresholds: number[]): number {
  let pts = 0;
  for (const t of thresholds) {
    if (value > t) pts++;
    else break;
  }
  return pts;
}

export function scoreGeneralFood(nutrition: Per100g, fruitVegPct: number = 0): ScoringResult {
  const energy = nutrition.energy_kj ?? (nutrition.energy_kcal ? nutrition.energy_kcal * 4.184 : 0);
  const sugars = nutrition.sugars_g ?? 0;
  const satFat = nutrition.saturated_fat_g ?? 0;
  const salt = nutrition.salt_g ?? (nutrition.sodium_mg ? (nutrition.sodium_mg * 0.0025) : 0);
  const fibre = nutrition.fibre_g ?? 0;
  const protein = nutrition.protein_g ?? 0;

  const ePts = lookupPoints(energy, ENERGY_THRESHOLDS);
  const sugPts = lookupPoints(sugars, SUGAR_THRESHOLDS);
  const sfPts = lookupPoints(satFat, SAT_FAT_THRESHOLDS);
  const saltPts = lookupPoints(salt, SALT_THRESHOLDS);
  const N = ePts + sugPts + sfPts + saltPts;

  const fibrePts = lookupPoints(fibre, FIBRE_THRESHOLDS);
  const proteinPts = lookupPoints(protein, PROTEIN_THRESHOLDS);
  const fvPts = fruitVegPct > 80 ? 5 : fruitVegPct > 60 ? 2 : fruitVegPct > 40 ? 1 : 0;

  // Nutri-Score rule: if N >= 11 and FV <= 2, protein points are capped at 0 (unless 80%+ fruit/veg)
  const effectiveProteinPts = (N >= 11 && fvPts <= 2) ? 0 : proteinPts;
  const P = fibrePts + effectiveProteinPts + fvPts;

  const rawScore = N - P;

  // Grade mapping matching official scoring.py:
  let grade: NutriGrade = 'A';
  if (rawScore <= -1) grade = 'A';
  else if (rawScore <= 2) grade = 'B';
  else if (rawScore <= 10) grade = 'C';
  else if (rawScore <= 18) grade = 'D';
  else grade = 'E';

  // 1-10 display score matching Python _score_to_1_10:
  // General: [-15, 40] -> [10, 1]
  const clamped = Math.max(-15, Math.min(40, rawScore));
  const score10 = Math.round((10.0 - ((clamped - (-15)) / 55.0) * 9.0) * 10) / 10;

  const breakdown: FactorBreakdown[] = [
    { factor: 'Energy', value: `${Math.round(energy)} kJ`, points: ePts, direction: 'bad', explanation: `${Math.round(energy)} kJ/100g` },
    { factor: 'Sugars', value: `${sugars.toFixed(1)}g`, points: sugPts, direction: 'bad', explanation: `${sugars.toFixed(1)}g sugar per 100g` },
    { factor: 'Saturated Fat', value: `${satFat.toFixed(1)}g`, points: sfPts, direction: 'bad', explanation: `${satFat.toFixed(1)}g sat fat per 100g` },
    { factor: 'Salt', value: `${salt.toFixed(2)}g`, points: saltPts, direction: 'bad', explanation: `${salt.toFixed(2)}g salt per 100g` },
    { factor: 'Dietary Fibre', value: `${fibre.toFixed(1)}g`, points: fibrePts, direction: 'good', explanation: `${fibre.toFixed(1)}g fibre (+${fibrePts} pts)` },
    { factor: 'Protein', value: `${protein.toFixed(1)}g`, points: effectiveProteinPts, direction: 'good', explanation: `${protein.toFixed(1)}g protein` },
  ];

  return {
    raw_score: rawScore,
    N_points: N,
    P_points: P,
    grade,
    score_1_to_10: score10,
    breakdown,
    is_beverage: false,
  };
}

export function scoreBeverage(nutrition: Per100g): ScoringResult {
  const energy = nutrition.energy_kj ?? (nutrition.energy_kcal ? nutrition.energy_kcal * 4.184 : 0);
  const sugars = nutrition.sugars_g ?? 0;
  const satFat = nutrition.saturated_fat_g ?? 0;
  const salt = nutrition.salt_g ?? (nutrition.sodium_mg ? (nutrition.sodium_mg * 0.0025) : 0);
  const fibre = nutrition.fibre_g ?? 0;
  const protein = nutrition.protein_g ?? 0;

  // Stricter beverage points
  const ePts = Math.min(10, Math.floor(energy / 30));
  const sugPts = Math.min(10, Math.floor(sugars / 1.5));
  const sfPts = lookupPoints(satFat, SAT_FAT_THRESHOLDS);
  const saltPts = lookupPoints(salt, SALT_THRESHOLDS);
  const N = ePts + sugPts + sfPts + saltPts;

  const fibrePts = lookupPoints(fibre, FIBRE_THRESHOLDS);
  const proteinPts = lookupPoints(protein, PROTEIN_THRESHOLDS);
  const P = fibrePts + proteinPts;

  const rawScore = N - P;

  let grade: NutriGrade = 'A';
  if (rawScore <= 1) grade = 'A';
  else if (rawScore <= 5) grade = 'B';
  else if (rawScore <= 9) grade = 'C';
  else if (rawScore <= 12) grade = 'D';
  else grade = 'E';

  // Beverage 1-10 mapping matching Python: [-5, 15] -> [10, 1]
  const clamped = Math.max(-5, Math.min(15, rawScore));
  const score10 = Math.round((10.0 - ((clamped - (-5)) / 20.0) * 9.0) * 10) / 10;

  const breakdown: FactorBreakdown[] = [
    { factor: 'Energy (Beverage)', value: `${Math.round(energy)} kJ`, points: ePts, direction: 'bad', explanation: `${Math.round(energy)} kJ per 100ml` },
    { factor: 'Sugars (Beverage)', value: `${sugars.toFixed(1)}g`, points: sugPts, direction: 'bad', explanation: `${sugars.toFixed(1)}g sugar per 100ml (strict)` },
    { factor: 'Saturated Fat', value: `${satFat.toFixed(1)}g`, points: sfPts, direction: 'bad', explanation: `${satFat.toFixed(1)}g sat fat` },
    { factor: 'Salt', value: `${salt.toFixed(2)}g`, points: saltPts, direction: 'bad', explanation: `${salt.toFixed(2)}g salt` },
    { factor: 'Protein', value: `${protein.toFixed(1)}g`, points: proteinPts, direction: 'good', explanation: `${protein.toFixed(1)}g protein` },
  ];

  return {
    raw_score: rawScore,
    N_points: N,
    P_points: P,
    grade,
    score_1_to_10: score10,
    breakdown,
    is_beverage: true,
  };
}

export function scoreProduct(nutrition: Per100g, isBeverage: boolean = false, fruitVegPct: number = 0): ScoringResult {
  return isBeverage ? scoreBeverage(nutrition) : scoreGeneralFood(nutrition, fruitVegPct);
}

export function getGradeColor(grade: NutriGrade): string {
  switch (grade) {
    case 'A': return '#22C55E';
    case 'B': return '#84CC16';
    case 'C': return '#EAB308';
    case 'D': return '#F97316';
    case 'E': return '#EF4444';
  }
}
