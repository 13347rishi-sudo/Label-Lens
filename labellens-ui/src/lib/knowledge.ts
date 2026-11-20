import type { FlagItem, KnowledgeAnalysis } from './types';

// 50+ Hidden Sugar Aliases
export const HIDDEN_SUGAR_LIST = [
  'maltodextrin', 'dextrose', 'invert sugar', 'invert syrup', 'high fructose corn syrup',
  'hfcs', 'corn syrup', 'glucose syrup', 'fructose', 'sucrose', 'maltose', 'galactose',
  'agave nectar', 'molasses', 'cane juice', 'evaporated cane juice', 'barley malt',
  'rice syrup', 'brown rice syrup', 'maple syrup', 'honey', 'treacle', 'golden syrup',
  'caramel', 'dextrin', 'isoglucose', 'grape sugar', 'beet sugar', 'turbinado sugar',
  'demerara sugar', 'panela', 'muscovado', 'coconut sugar', 'palm sugar', 'sorghum syrup',
  'date syrup', 'fruit juice concentrate', 'maltitol', 'sorbitol', 'mannitol', 'xylitol',
  'erythritol', 'polydextrose', 'tagatose', 'trehalose', 'ethyl maltol', 'malt extract',
  'sweet sorghum', 'crystalline fructose', 'florida crystals', 'sucanat'
];

// Palm Oil Variants
export const PALM_OIL_LIST = [
  'palm oil', 'palm fat', 'palm kernel oil', 'palmate', 'palmitate', 'palmolein',
  'fractionated palm oil', 'hydrogenated palm oil', 'elaeis guineensis',
  'sodium palm kernelate', 'sodium palmate', 'palmitic acid', 'palm superolein'
];

// 14 EU Major Allergens
export const ALLERGENS_MAP: Record<string, string[]> = {
  'Peanuts': ['peanut', 'peanuts', 'groundnut', 'arachis oil'],
  'Tree Nuts': ['hazelnut', 'hazelnuts', 'almond', 'almonds', 'walnut', 'walnuts', 'cashew', 'cashews', 'pistachio', 'pistachios', 'pecan', 'pecans', 'brazil nut', 'macadamia'],
  'Milk': ['milk', 'dairy', 'whey', 'casein', 'caseinate', 'lactose', 'butter', 'cream', 'cheese', 'ghee'],
  'Eggs': ['egg', 'eggs', 'egg white', 'egg yolk', 'albumin', 'ovalbumin', 'lysozyme'],
  'Gluten / Cereals': ['wheat', 'barley', 'rye', 'oats', 'spelt', 'kamut', 'semolina', 'durum', 'gluten'],
  'Soy': ['soy', 'soya', 'soybean', 'soy lecithin', 'tofu', 'edamame'],
  'Fish': ['fish', 'salmon', 'tuna', 'cod', 'anchovy', 'gelatin (fish)'],
  'Crustaceans': ['prawn', 'shrimp', 'crab', 'lobster', 'crayfish'],
  'Molluscs': ['mussel', 'oyster', 'squid', 'octopus', 'snail'],
  'Celery': ['celery', 'celeriac', 'celery seed'],
  'Mustard': ['mustard', 'mustard seed', 'mustard flour'],
  'Sesame': ['sesame', 'sesame seed', 'tahini', 'sesame oil'],
  'Sulphites': ['sulphite', 'sulfite', 'sulphur dioxide', 'e220', 'e221', 'e222', 'e223', 'e224', 'e228'],
  'Lupin': ['lupin', 'lupine', 'lupin flour']
};

// Known Additives with EFSA Risk Ratings
export const ADDITIVES_DB: Record<string, { name: string; severity: 'high' | 'medium' | 'low'; description: string }> = {
  'e102': { name: 'Tartrazine (Yellow 5)', severity: 'high', description: 'Artificial azo dye linked to hyperactivity in children' },
  'e110': { name: 'Sunset Yellow FCF', severity: 'high', description: 'Synthetic coal-tar dye; banned in parts of Europe' },
  'e122': { name: 'Carmoisine / Azorubine', severity: 'high', description: 'Red azo food dye; subject to warning label in EU' },
  'e124': { name: 'Ponceau 4R', severity: 'high', description: 'Synthetic red dye linked to hypersensitivity' },
  'e129': { name: 'Allura Red AC', severity: 'high', description: 'Azo dye linked to ADHD flare-ups in kids' },
  'e150d': { name: 'Ammonia Caramel (Caramel IV)', severity: 'medium', description: 'Manufactured with ammonium sulfite; suspected 4-MEI traces' },
  'e211': { name: 'Sodium Benzoate', severity: 'high', description: 'Preservative; forms carcinogenic benzene when paired with Vitamin C' },
  'e250': { name: 'Sodium Nitrite', severity: 'high', description: 'Curing agent in processed meats; forms carcinogenic nitrosamines' },
  'e621': { name: 'Monosodium Glutamate (MSG)', severity: 'medium', description: 'Flavor enhancer; triggers headaches in sensitive individuals' },
  'e951': { name: 'Aspartame', severity: 'medium', description: 'Artificial sweetener; WHO IARC classified as possibly carcinogenic' },
  'e950': { name: 'Acesulfame K', severity: 'medium', description: 'Calorie-free artificial sweetener' },
  'e330': { name: 'Citric Acid', severity: 'low', description: 'Natural antioxidant & acid regulator' },
  'e322': { name: 'Lecithins', severity: 'low', description: 'Natural emulsifier from soy or sunflower' },
  'e412': { name: 'Guar Gum', severity: 'low', description: 'Natural vegetable thickening gum' },
  'e415': { name: 'Xanthan Gum', severity: 'low', description: 'Fermented plant thickening agent' },
};

// Pre-index additive entries with lowercased names once at module level
const PREINDEXED_ADDITIVES = Object.entries(ADDITIVES_DB).map(([eCode, data]) => ({
  eCode,
  lowerName: data.name.toLowerCase(),
  data
}));

export function analyzeIngredients(ingredients: string[], statedAllergens: string[] = []): KnowledgeAnalysis {
  const hiddenSugars: FlagItem[] = [];
  const palmOil: FlagItem[] = [];
  const allergens: FlagItem[] = [];
  const additives: FlagItem[] = [];
  const warnings: string[] = [];

  const lowerIngredients = ingredients.map((ing) => ({ raw: ing, lower: ing.toLowerCase() }));
  const fullText = ingredients.join(' ').toLowerCase();

  // 1. Detect Hidden Sugars (using pre-lowercased items)
  for (const sugar of HIDDEN_SUGAR_LIST) {
    for (const ing of lowerIngredients) {
      if (ing.lower.includes(sugar)) {
        if (!hiddenSugars.some(s => s.name === sugar.toUpperCase())) {
          hiddenSugars.push({
            name: sugar.toUpperCase(),
            matched_text: ing.raw,
            category: 'sugar',
            description: 'Refined sugar alias with high glycemic index'
          });
        }
      }
    }
  }

  // 2. Detect Palm Oil (using pre-lowercased items)
  for (const palm of PALM_OIL_LIST) {
    for (const ing of lowerIngredients) {
      if (ing.lower.includes(palm)) {
        if (!palmOil.some(p => p.name === palm.toUpperCase())) {
          palmOil.push({
            name: palm.toUpperCase(),
            matched_text: ing.raw,
            category: 'palm',
            description: 'High in saturated palmitic acid; environmental deforestation driver'
          });
        }
      }
    }
  }

  // 3. Detect Allergens
  for (const [allergenName, keywords] of Object.entries(ALLERGENS_MAP)) {
    const isStated = statedAllergens.some(a => a.toLowerCase().includes(allergenName.toLowerCase()));
    let matched = false;

    for (const kw of keywords) {
      if (fullText.includes(kw) || isStated) {
        matched = true;
        break;
      }
    }

    if (matched) {
      allergens.push({
        name: allergenName,
        matched_text: isStated ? `Stated: ${allergenName}` : `Detected in ingredient list`,
        category: 'allergen',
        severity: 'high',
        description: `Official EU Major Allergen Annex II: ${allergenName}`
      });
    }
  }

  // 4. Detect Additives & E-Numbers (using pre-indexed list)
  for (const item of PREINDEXED_ADDITIVES) {
    if (fullText.includes(item.eCode) || fullText.includes(item.lowerName)) {
      additives.push({
        name: `${item.eCode.toUpperCase()}: ${item.data.name}`,
        matched_text: item.data.name,
        category: 'additive',
        severity: item.data.severity,
        description: item.data.description
      });
    }
  }

  // Deductions:
  // -0.5 for each hidden sugar (max -2.0)
  // -1.0 for palm oil
  // -0.8 for high concern additive, -0.3 for medium
  let deductions = 0;
  if (hiddenSugars.length > 0) deductions += Math.min(2.0, hiddenSugars.length * 0.5);
  if (palmOil.length > 0) deductions += 1.0;
  for (const add of additives) {
    if (add.severity === 'high') deductions += 0.8;
    else if (add.severity === 'medium') deductions += 0.3;
  }

  if (hiddenSugars.length > 0) {
    warnings.push(`⚠️ Detected ${hiddenSugars.length} hidden sugar aliases (${hiddenSugars.map(s => s.name).slice(0, 3).join(', ')})`);
  }
  if (palmOil.length > 0) {
    warnings.push(`🌴 Contains Palm Oil derivatives (${palmOil[0].name})`);
  }
  if (additives.some(a => a.severity === 'high')) {
    warnings.push(`🔴 Contains high-concern food additives / artificial colorings`);
  }

  return {
    hidden_sugars: hiddenSugars,
    palm_oil: palmOil,
    allergens,
    additives,
    deductions: Math.min(4.0, Math.round(deductions * 10) / 10),
    warnings
  };
}
