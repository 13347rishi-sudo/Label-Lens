import type { ProductItem, HealthierAlternative, NutriGrade } from './types';
import { EXHIBITION_PRODUCTS } from './database';

export interface WebSearchResult {
  title: string;
  brand?: string;
  category: 'packaged' | 'natural';
  grade: NutriGrade;
  reason: string;
  savings: string;
  source: string;
  url?: string;
  target_id?: string;
}

// Category keywords to search terms map for healthier swaps
const SEARCH_INTENT_MAP: Record<string, { query: string; categoryTag: string; naturalSwap: string; naturalWiki: string }> = {
  noodles: {
    query: 'millet noodles',
    categoryTag: 'noodles',
    naturalSwap: 'Moong Dal Khichdi with Vegetables',
    naturalWiki: 'Khichdi'
  },
  pasta: {
    query: 'whole wheat pasta',
    categoryTag: 'pastas',
    naturalSwap: 'Sprouted Moong Dal Salad',
    naturalWiki: 'Sprouting'
  },
  biscuit: {
    query: 'oats ragi digestive biscuits',
    categoryTag: 'biscuits',
    naturalSwap: 'Roasted Sesame & Jaggery Til Chikki',
    naturalWiki: 'Chikki'
  },
  cookie: {
    query: 'almond ragi cookies',
    categoryTag: 'biscuits',
    naturalSwap: 'Medjool Dates Stuffed with Almonds',
    naturalWiki: 'Date_palm'
  },
  chocolate: {
    query: '75 dark chocolate cocoa',
    categoryTag: 'dark-chocolates',
    naturalSwap: 'Raw Dried Figs and Walnuts',
    naturalWiki: 'Walnut'
  },
  chips: {
    query: 'roasted makhana fox nuts olive oil',
    categoryTag: 'crisps',
    naturalSwap: 'Roasted Spiced Chickpeas (Bhuna Chana)',
    naturalWiki: 'Roasted_gram'
  },
  crisps: {
    query: 'vacuum cooked vegetable crisps',
    categoryTag: 'crisps',
    naturalSwap: 'Spiced Puffed Sorghum (Jowar Dhani)',
    naturalWiki: 'Sorghum'
  },
  namkeen: {
    query: 'baked ragi jowar masala puffs',
    categoryTag: 'salty-snacks',
    naturalSwap: 'Roasted Peanuts with Rock Salt',
    naturalWiki: 'Peanut'
  },
  cola: {
    query: 'tender coconut water cold pressed',
    categoryTag: 'coconut-waters',
    naturalSwap: 'Fresh Coconut Water or Spiced Buttermilk (Chaas)',
    naturalWiki: 'Coconut_water'
  },
  soda: {
    query: 'cold pressed sparkling lemon water zero sugar',
    categoryTag: 'beverages',
    naturalSwap: 'Fresh Lime Soda with Mint & Salt (Nimbu Pani)',
    naturalWiki: 'Lemonade'
  },
  juice: {
    query: 'cold pressed orange carrot juice no added sugar',
    categoryTag: 'fruit-juices',
    naturalSwap: 'Whole Orange with Natural Fruit Fiber',
    naturalWiki: 'Orange_(fruit)'
  },
  butter: {
    query: 'peanut butter 100 unsweetened',
    categoryTag: 'butters',
    naturalSwap: 'Homemade Desi Cow Ghee (A2 Ghee)',
    naturalWiki: 'Ghee'
  },
  bread: {
    query: '100 whole wheat sourdough bread',
    categoryTag: 'breads',
    naturalSwap: 'Multigrain Jowar / Bajra Rotla',
    naturalWiki: 'Bhakri'
  }
};

/**
 * Determine best search query for a product
 */
export function getProductSearchIntent(product: ProductItem): { query: string; categoryTag: string; naturalSwap: string; naturalWiki: string } {
  const combined = `${product.product_name} ${product.category} ${product.brand} ${(product.ingredients || []).join(' ')}`.toLowerCase();

  for (const [key, config] of Object.entries(SEARCH_INTENT_MAP)) {
    if (combined.includes(key)) {
      return config;
    }
  }

  if (product.is_beverage) {
    return {
      query: 'cold pressed coconut water',
      categoryTag: 'beverages',
      naturalSwap: 'Fresh Mint Buttermilk (Chaas)',
      naturalWiki: 'Buttermilk'
    };
  }

  return {
    query: 'whole grain millet snack',
    categoryTag: 'snacks',
    naturalSwap: 'Roasted Fox Nuts (Makhana)',
    naturalWiki: 'Euryale_ferox'
  };
}

/**
 * Live search on Open Food Facts API v2 for verified Grade A/B alternatives
 */
export async function searchOpenFoodFactsAlternatives(
  categoryTag: string,
  searchQuery: string
): Promise<WebSearchResult[]> {
  const results: WebSearchResult[] = [];

  const endpoints = [
    `https://world.openfoodfacts.net/api/v2/search?categories_tags_en=${encodeURIComponent(categoryTag)}&nutrition_grades_tags=a&page_size=4`,
    `https://world.openfoodfacts.net/api/v2/search?categories_tags_en=${encodeURIComponent(categoryTag)}&nutrition_grades_tags=b&page_size=4`,
    `https://world.openfoodfacts.net/api/v2/search?search_terms=${encodeURIComponent(searchQuery)}&nutrition_grades_tags=a&page_size=3`
  ];

  for (const endpoint of endpoints) {
    if (results.length >= 3) break;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { 'User-Agent': 'LabelLens-Kiosk/2.0 (student-science-fair)' }
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        for (const item of data.products) {
          if (!item.product_name) continue;
          const grade = (item.nutrition_grades?.toUpperCase() || 'A') as NutriGrade;
          if (grade !== 'A' && grade !== 'B') continue;

          // Avoid duplicate titles
          if (results.some((r) => r.title.toLowerCase() === item.product_name.toLowerCase())) continue;

          const sugars = item.nutriments?.sugars_100g ?? 0;
          const satFat = item.nutriments?.['saturated-fat_100g'] ?? 0;

          results.push({
            title: item.product_name,
            brand: item.brands || 'Certified Brand',
            category: 'packaged',
            grade: grade,
            reason: `Verified on Open Food Facts with only ${sugars}g sugar and ${satFat}g saturated fat per 100g.`,
            savings: sugars <= 5 ? `Low sugar (${sugars}g/100g) · Grade ${grade}` : `Grade ${grade} · Minimal saturated fat`,
            source: 'Open Food Facts Database',
            url: item.url || `https://world.openfoodfacts.org/product/${item.code}`
          });

          if (results.length >= 3) break;
        }
      }
    } catch {
      // Continue to next endpoint if one fails
    }
  }

  return results;
}

/**
 * Fetch Wikipedia summary for a natural whole food
 */
export async function fetchWikipediaFoodSummary(wikiTitle: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.extract) {
        return data.extract.split('.')[0] + '.';
      }
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

/**
 * Main Web Search & Recommendation Engine for Food Alternatives.
 * Searches live food databases, queries Wikipedia nutrition summaries,
 * and matches with local benchmark inventory.
 */
export async function searchWebForHealthierAlternatives(
  product: ProductItem
): Promise<HealthierAlternative[]> {
  const intent = getProductSearchIntent(product);
  const webAlternatives: HealthierAlternative[] = [];

  // 1. Parallel Web Search across Open Food Facts & Wikipedia
  const [offResults, wikiSummary] = await Promise.all([
    searchOpenFoodFactsAlternatives(intent.categoryTag, intent.query).catch(() => []),
    fetchWikipediaFoodSummary(intent.naturalWiki).catch(() => null)
  ]);

  // Check if we have an exact matching product in our local exhibition catalog for instant inspection
  const findMatchingCatalogItem = (title: string, brand?: string) => {
    const lower = `${title} ${brand || ''}`.toLowerCase();
    return EXHIBITION_PRODUCTS.find((p) => {
      const pCombined = `${p.product_name} ${p.brand}`.toLowerCase();
      return lower.includes(p.product_name.toLowerCase()) || pCombined.includes(title.toLowerCase());
    });
  };

  // 2. Add Top Verified Packaged Alternative
  if (offResults.length > 0) {
    const topPackaged = offResults[0];
    const catalogMatch = findMatchingCatalogItem(topPackaged.title, topPackaged.brand);

    const currentSugar = product.per_100g.sugars_g ?? 0;
    const sugarDiff = Math.max(0, Math.round(currentSugar - 3));

    webAlternatives.push({
      name: topPackaged.title,
      brand: topPackaged.brand,
      category: 'packaged',
      nutri_grade: topPackaged.grade,
      reason: topPackaged.reason,
      savings: sugarDiff > 5 ? `Save ~${sugarDiff}g sugar · Grade ${topPackaged.grade}` : topPackaged.savings,
      target_id: catalogMatch?.id,
      web_source: 'Open Food Facts Live Web Registry',
      web_url: topPackaged.url
    });
  }

  // 3. Add Verified Natural Whole-Food Alternative
  const naturalReason = wikiSummary
    ? `${wikiSummary} Rich in intact dietary fiber and micronutrients with zero industrial processing.`
    : 'Traditional whole food providing complex carbohydrates, clean protein, and zero added sugars or industrial palm oil.';

  const currentSugar = product.per_100g.sugars_g ?? 0;
  const tspDiff = Math.max(1, Math.round(currentSugar / 4));

  // Check natural catalog matches (e.g. coconut water, moong dal, oats, makhana)
  let naturalTargetId: string | undefined;
  if (intent.naturalSwap.toLowerCase().includes('coconut')) {
    naturalTargetId = 'prod_raw_coconut';
  } else if (intent.naturalSwap.toLowerCase().includes('khichdi') || intent.naturalSwap.toLowerCase().includes('moong')) {
    naturalTargetId = 'prod_moong_dal';
  } else if (intent.naturalSwap.toLowerCase().includes('makhana')) {
    naturalTargetId = 'prod_farmley_makhana';
  } else if (intent.naturalSwap.toLowerCase().includes('chana')) {
    naturalTargetId = 'prod_natureland_chana';
  } else if (intent.naturalSwap.toLowerCase().includes('chaas') || intent.naturalSwap.toLowerCase().includes('buttermilk')) {
    naturalTargetId = 'prod_amul_chaas';
  }

  webAlternatives.push({
    name: intent.naturalSwap,
    category: 'natural',
    nutri_grade: 'A',
    reason: naturalReason,
    savings: `Save ${currentSugar.toFixed(0)}g sugar (${tspDiff} tsp less) · Zero additives`,
    target_id: naturalTargetId,
    web_source: 'Wikipedia & WHO Nutrition Guide',
    web_url: `https://en.wikipedia.org/wiki/${intent.naturalWiki}`
  });

  return webAlternatives;
}
