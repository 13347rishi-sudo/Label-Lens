export type NutriGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Per100g {
  energy_kcal: number | null;
  energy_kj: number | null;
  sugars_g: number | null;
  saturated_fat_g: number | null;
  salt_g: number | null;
  sodium_mg: number | null;
  fibre_g: number | null;
  protein_g: number | null;
  fat_g: number | null;
  carbs_g: number | null;
}

export interface FactorBreakdown {
  factor: string;
  value: string;
  points: number;
  direction: 'good' | 'bad';
  explanation: string;
}

export interface ScoringResult {
  raw_score: number;
  N_points: number;
  P_points: number;
  grade: NutriGrade;
  score_1_to_10: number;
  breakdown: FactorBreakdown[];
  is_beverage: boolean;
}

export interface FlagItem {
  name: string;
  matched_text: string;
  category: 'sugar' | 'palm' | 'allergen' | 'additive';
  severity?: 'high' | 'medium' | 'low';
  description?: string;
}

export interface KnowledgeAnalysis {
  hidden_sugars: FlagItem[];
  palm_oil: FlagItem[];
  allergens: FlagItem[];
  additives: FlagItem[];
  deductions: number;
  warnings: string[];
}

export type HealthProfileId = 'general' | 'diabetic';

export interface HealthProfile {
  id: HealthProfileId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  badgeColor: string;
}

export interface HealthierAlternative {
  name: string;
  brand?: string;
  category: 'packaged' | 'natural';
  nutri_grade: NutriGrade;
  reason: string;
  savings: string;
  target_id?: string;
}

export interface ProductItem {
  id: string;
  barcode: string;
  barcode_aliases?: string[];
  qr_code_url?: string;
  qr_payload?: string;
  product_name: string;
  brand: string;
  serving_size: string;
  is_beverage: boolean;
  fruit_veg_pct: number;
  category: string;
  image_url?: string;
  per_100g: Per100g;
  ingredients: string[];
  allergens_stated: string[];
  description: string;
  is_veg?: boolean;
  fssai_license?: string;
  source_engine?: 'local' | 'openfoodfacts' | 'gs1_india' | 'ollama_vision';
  is_food?: boolean;
  non_food_reason?: string;
  healthier_alternatives?: HealthierAlternative[];
}

export interface ProfileAdjustment {
  adjusted_score: number;
  hard_warnings: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    flag: string;
  }>;
  penalty_applied: number;
  reasons: string[];
}
