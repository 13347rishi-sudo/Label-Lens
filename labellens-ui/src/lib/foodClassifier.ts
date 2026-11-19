/**
 * Non-Food Item Detection & Classification Engine.
 * Ensures LabelLens correctly flags cosmetics, personal care, stationery,
 * household detergents, and electronics if scanned, preventing them from being
 * scored as food.
 */

export interface NonFoodCheckResult {
  isFood: boolean;
  itemType?: string;
  reason?: string;
}

const NON_FOOD_PATTERNS: Array<{
  category: string;
  keywords: string[];
}> = [
  {
    category: 'Personal Care & Cosmetics',
    keywords: [
      'shampoo', 'conditioner', 'body wash', 'shower gel', 'face wash', 'facial cleanser',
      'lotion', 'body lotion', 'moisturizer', 'sunscreen', 'cream', 'face cream', 'night cream',
      'toothpaste', 'toothbrush', 'mouthwash', 'dental floss', 'deodorant', 'antiperspirant',
      'perfume', 'cologne', 'body spray', 'deo spray', 'lipstick', 'lip balm', 'foundation',
      'concealer', 'eyeliner', 'mascara', 'nail polish', 'hair oil', 'hair color', 'hair dye',
      'serum', 'petroleum jelly', 'vaseline', 'shaving cream', 'razor', 'aftershave', 'soap bar',
      'beauty soap', 'bathing soap', 'hand soap'
    ]
  },
  {
    category: 'Household Cleaning & Detergents',
    keywords: [
      'detergent', 'dishwash', 'dish soap', 'washing powder', 'liquid detergent', 'fabric softener',
      'floor cleaner', 'toilet cleaner', 'glass cleaner', 'surface cleaner', 'bleach',
      'antiseptic', 'disinfectant', 'handwash', 'hand sanitizer', 'sanitizer', 'rubbing alcohol',
      'mosquito repellent', 'mosquito coil', 'insecticide', 'air freshener', 'bathroom cleaner'
    ]
  },
  {
    category: 'Stationery & Electronics',
    keywords: [
      'notebook', 'pen', 'ball pen', 'gel pen', 'pencil', 'eraser', 'sharpener', 'ruler',
      'marker', 'highlighter', 'stapler', 'paper', 'copy', 'register', 'diary', 'calculator',
      'battery', 'duracell', 'charger', 'cable', 'usb', 'headphone', 'earphone', 'phone',
      'mobile', 'laptop', 'mouse', 'keyboard', 'bulb', 'led bulb', 'socket', 'plug', 'adapter'
    ]
  },
  {
    category: 'Sanitary & Medical Products',
    keywords: [
      'diaper', 'pampers', 'mamy poko', 'sanitary pad', 'whisper', 'stayfree', 'napkin',
      'tissue paper', 'wet wipes', 'paracetamol', 'crocin', 'disprin', 'combiflam',
      'cough syrup', 'tablet', 'capsule', 'ointment', 'volini', 'moov', 'iodex', 'bandage',
      'band-aid', 'betadine'
    ]
  },
  {
    category: 'Pet Care',
    keywords: [
      'dog food', 'cat food', 'pet food', 'pedigree', 'whiskas', 'royal canin', 'drools', 'bird seed'
    ]
  }
];

// Well-known Indian & global non-food brand keywords
const NON_FOOD_BRAND_KEYWORDS = [
  'dettol', 'harpic', 'lizol', 'colgate', 'pepsodent', 'sensodyne', 'close up',
  'dove soap', 'lifebuoy', 'lux soap', 'pears soap', 'fiama', 'cinthol', 'medimix',
  'head & shoulders', 'pantene', 'sunsilk', 'clinic plus', 'tresemme', 'garnier',
  'loreal', 'nivea', 'surf excel', 'ariel', 'tide', 'vim bar', 'rin', 'comfort',
  'pril', 'good knight', 'hit spray', 'all out', 'duracell', 'classmate'
];

// Chemical ingredients common in cosmetics/cleaning products, never in pure food
const NON_FOOD_CHEMICAL_MARKERS = [
  'sodium laureth sulfate', 'sodium lauryl sulfate', 'sles', 'sls',
  'cocamidopropyl betaine', 'dimethicone', 'parfum / fragrance',
  'cetearyl alcohol', 'disodium edta', 'methylparaben', 'propylparaben',
  'phenoxyethanol', 'carbomer', 'triethanolamine', 'polyethylene glycol',
  'benzalkonium chloride', 'chloroxylenol', 'titanium dioxide (cosmetic)'
];

/**
 * Checks whether an item is non-food based on its name, category, brand, and ingredients.
 */
export function checkIsNonFood(
  productName: string,
  category = '',
  brand = '',
  ingredients: string[] = []
): NonFoodCheckResult {
  const combined = `${productName} ${category} ${brand}`.toLowerCase();

  // 1. Check patterns
  for (const group of NON_FOOD_PATTERNS) {
    for (const kw of group.keywords) {
      if (combined.includes(kw)) {
        return {
          isFood: false,
          itemType: group.category,
          reason: `Detected keywords matching ${group.category} ("${kw}").`
        };
      }
    }
  }

  // 2. Check non-food specific brands
  for (const b of NON_FOOD_BRAND_KEYWORDS) {
    if (combined.includes(b)) {
      return {
        isFood: false,
        itemType: 'Personal Care / Household',
        reason: `Matched brand known primarily for non-edible goods ("${b}").`
      };
    }
  }

  // 3. Check for cosmetic / industrial surfactant ingredients
  const ingLower = ingredients.map((i) => i.toLowerCase()).join(' ');
  for (const marker of NON_FOOD_CHEMICAL_MARKERS) {
    if (ingLower.includes(marker)) {
      return {
        isFood: false,
        itemType: 'Cosmetics / Chemical Product',
        reason: `Contains cosmetic or industrial ingredients ("${marker}") not intended for human digestion.`
      };
    }
  }

  return { isFood: true };
}
