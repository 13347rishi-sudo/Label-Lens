import type { ProductItem, HealthierAlternative } from './types';

/**
 * Intelligent Category & Product-Specific Food Alternatives Engine.
 * Provides distinct, tailored healthier alternatives for noodles, biscuits,
 * chocolates, chips, namkeen, sodas, juices, breads, dairy, and traditional sweets.
 */
export function getContextualAlternatives(product: ProductItem): HealthierAlternative[] {
  const name = (product.product_name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const ingredients = (product.ingredients || []).map((i) => i.toLowerCase()).join(' ');
  const combined = `${name} ${category} ${brand} ${ingredients}`;

  const sugars = product.per_100g?.sugars_g ?? 0;
  const satFat = product.per_100g?.saturated_fat_g ?? 0;
  const sodium = product.per_100g?.sodium_mg ?? ((product.per_100g?.salt_g ?? 0) * 400);

  // 1. Instant Noodles, Pasta & Soups (Maggi, Yippee, Knorr, Ramen)
  if (
    combined.includes('noodle') ||
    combined.includes('maggi') ||
    combined.includes('yippee') ||
    combined.includes('ramen') ||
    combined.includes('pasta') ||
    combined.includes('macaroni') ||
    combined.includes('chowmein')
  ) {
    return [
      {
        name: 'Foxtail Millet Hakka Noodles',
        brand: 'Slurrp Farm',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Sun-dried noodles made of 100% foxtail millet and whole wheat with zero palm oil or MSG.',
        savings: 'Zero maida, -75% sodium load',
        target_id: 'prod_slurrp_millet'
      },
      {
        name: 'Vegetable Moong Dal Khichdi',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Complete amino acid profile pairing whole grains with split yellow mung dal and fresh greens.',
        savings: 'Zero preservatives, 14g natural protein',
        target_id: 'prod_moong_dal'
      }
    ];
  }

  // 2. Biscuits, Cookies & Wafers (Parle-G, Oreo, Bourbon, Good Day, Dark Fantasy, Hide & Seek)
  if (
    combined.includes('biscuit') ||
    combined.includes('cookie') ||
    combined.includes('oreo') ||
    combined.includes('bourbon') ||
    combined.includes('parle-g') ||
    combined.includes('good day') ||
    combined.includes('hide & seek') ||
    combined.includes('wafer') ||
    combined.includes('rusk')
  ) {
    return [
      {
        name: '100% Ragi & Oats Digestive Cookies',
        brand: 'Yoga Bar',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Baked with whole finger millet (ragi), rolled oats, and organic jaggery with zero invert syrup.',
        savings: 'Zero refined maida, -60% sugar',
        target_id: 'prod_yogabar_cookies'
      },
      {
        name: 'Roasted Sesame (Til) & Jaggery Laddoo',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Traditional mineral powerhouse dense in natural calcium, copper, and unrefined plant lignans.',
        savings: 'Zero palm oil, rich in bioavailable calcium'
      }
    ];
  }

  // 3. Chocolates, Candy & Confectionery (Dairy Milk, KitKat, 5 Star, Munch, Perk, Ferrero, Snickers)
  if (
    combined.includes('chocolate') ||
    combined.includes('dairy milk') ||
    combined.includes('kitkat') ||
    combined.includes('5 star') ||
    combined.includes('munch') ||
    combined.includes('perk') ||
    combined.includes('candy') ||
    combined.includes('toffee') ||
    combined.includes('caramel') ||
    combined.includes('snickers') ||
    combined.includes('ferrero')
  ) {
    return [
      {
        name: '75% Single-Origin Dark Chocolate',
        brand: 'Amul',
        category: 'packaged',
        nutri_grade: 'B',
        reason: 'High cocoa bean flavonoids and heart-healthy antioxidants with 70% less sugar than milk chocolate.',
        savings: '-70% added sugar load',
        target_id: 'prod_amul_dark'
      },
      {
        name: 'Medjool Dates Stuffed with Roasted Almonds',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Intact date fruit fiber naturally buffers fructose absorption, paired with vitamin E from raw nuts.',
        savings: 'Zero cane sugar or trans fats',
        target_id: 'prod_raw_walnuts'
      }
    ];
  }

  // 4. Potato Chips & Crisps (Lay's, Bingo, Pringles, Uncle Chipps, Kurkure)
  if (
    combined.includes('chip') ||
    combined.includes('crisp') ||
    combined.includes('lay\'s') ||
    combined.includes('bingo') ||
    combined.includes('pringles') ||
    combined.includes('potato wafer')
  ) {
    return [
      {
        name: 'Roasted Fox Nuts (Makhana) with Olive Oil',
        brand: 'Farmley',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Air-popped water lily lotus seeds seasoned in virgin olive oil with zero palmolein.',
        savings: '-80% saturated fat, 9g plant protein',
        target_id: 'prod_farmley_makhana'
      },
      {
        name: 'Spiced Roasted Chickpeas (Bhuna Chana)',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Oven-roasted whole legumes with 21g protein and insoluble fiber that promotes lasting satiety.',
        savings: 'Zero fried palm oil, 21g protein',
        target_id: 'prod_natureland_chana'
      }
    ];
  }

  // 5. Savory Namkeen, Bhujia, Sev & Mixtures (Haldiram's, Bikaji, Kurkure, Tedhe Medhe)
  if (
    combined.includes('namkeen') ||
    combined.includes('bhujia') ||
    combined.includes('sev') ||
    combined.includes('mixture') ||
    combined.includes('kurkure') ||
    combined.includes('tedhe medhe') ||
    combined.includes('chivda') ||
    combined.includes('gathiya')
  ) {
    return [
      {
        name: 'Baked Ragi & Jowar Masala Bites',
        brand: 'Soulfull',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Slow-baked ancient millet puffs roasted with Indian spices instead of deep-frying in palm oil.',
        savings: '-70% total fat, 12g fiber'
      },
      {
        name: 'Puffed Roasted Jowar (Jowar Dhani Popcorn)',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Traditional popped whole sorghum grains with zero added fat and low glycemic index.',
        savings: 'Zero trans-fat, gluten-free'
      }
    ];
  }

  // 6. Carbonated Sodas & Energy Drinks (Coca-Cola, Pepsi, Sprite, Thums Up, Sting, Red Bull, Monster)
  if (
    product.is_beverage &&
    (combined.includes('cola') ||
      combined.includes('coke') ||
      combined.includes('pepsi') ||
      combined.includes('sprite') ||
      combined.includes('soda') ||
      combined.includes('carbonated') ||
      combined.includes('sting') ||
      combined.includes('red bull') ||
      combined.includes('monster') ||
      combined.includes('energy drink'))
  ) {
    return [
      {
        name: 'Cold-Pressed Valencia Orange & Coconut',
        brand: 'Raw Pressery',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'High-pressure processed (HPP) raw citrus and coconut water with zero synthetic caffeine.',
        savings: '-85% glycemic load, no phosphoric acid',
        target_id: 'prod_raw_coconut'
      },
      {
        name: 'Fresh Mint Chaas (Spiced Buttermilk)',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Active probiotic churned yogurt drink with roasted cumin and mint that aids digestion.',
        savings: 'Zero added sugar, natural electrolytes',
        target_id: 'prod_amul_chaas'
      }
    ];
  }

  // 7. Sweetened Milk & Malt Health Powders (Bournvita, Horlicks, Boost, Complan, Nesquik)
  if (
    combined.includes('bournvita') ||
    combined.includes('horlicks') ||
    combined.includes('boost') ||
    combined.includes('complan') ||
    combined.includes('malt') ||
    combined.includes('milk drink')
  ) {
    return [
      {
        name: 'Sprouted Multigrain & Sattu Health Drink',
        brand: 'Manna',
        category: 'packaged',
        nutri_grade: 'A',
        reason: '100% natural roasted pulses and sprouted millets with zero added refined cane sugar or maltodextrin.',
        savings: 'Zero added cane sugar, 18g protein'
      },
      {
        name: 'Golden Turmeric & Cardamom Almond Milk',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Warm milk infused with bioavailable curcumin and crushed raw almonds for natural sustained energy.',
        savings: 'Zero liquid glucose, natural anti-inflammatory'
      }
    ];
  }

  // 8. Packaged Juices & Nectars (Real, Tropicana, Minute Maid, Frooti, Maaza, Slice)
  if (
    product.is_beverage &&
    (combined.includes('juice') ||
      combined.includes('nectar') ||
      combined.includes('frooti') ||
      combined.includes('maaza') ||
      combined.includes('slice') ||
      combined.includes('tropicana') ||
      combined.includes('real fruit'))
  ) {
    return [
      {
        name: 'Tender Coconut Water',
        brand: 'Raw Pressery',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Pure coconut water with naturally balanced sodium and potassium without added cane sugar.',
        savings: '-65% sugar load vs reconstituted juice',
        target_id: 'prod_raw_coconut'
      },
      {
        name: 'Whole Seasonal Orange or Sweet Lime (Mosambi)',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Eating whole fruit provides intact cellular pectin fibers that prevent rapid glucose spikes.',
        savings: '100% whole bioavailable fiber, zero concentrate'
      }
    ];
  }

  // 9. Ketchup, Mayonnaise, Sauces & Dips (Kissan, Maggi Sauce, Hellmann's, Veeba)
  if (
    combined.includes('ketchup') ||
    combined.includes('sauce') ||
    combined.includes('mayo') ||
    combined.includes('mayonnaise') ||
    combined.includes('dip') ||
    combined.includes('spread')
  ) {
    return [
      {
        name: 'Authentic Mediterranean Garlic Hummus',
        brand: 'Wingreens Farms',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Cooked chickpeas blended with cold-pressed sesame tahini, rich in monounsaturated fats.',
        savings: '-85% sugar vs ketchup, 8g plant protein'
      },
      {
        name: 'Fresh Homemade Tomato, Garlic & Basil Salsa',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Crushed ripe tomatoes and garlic packed with cellular lycopene and zero high-fructose corn syrup.',
        savings: 'Zero added sugar, zero synthetic preservatives'
      }
    ];
  }

  // 10. Sweet Spreads & Jams (Nutella, Hershey's, Kissan Jam)
  if (
    combined.includes('nutella') ||
    combined.includes('jam') ||
    combined.includes('chocolate spread') ||
    combined.includes('peanut butter')
  ) {
    return [
      {
        name: '100% Pure All-Natural Peanut Butter',
        brand: 'Pintola',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Single ingredient slow-roasted peanuts with zero hydrogenated palm oil or added sugar.',
        savings: '30g protein, zero added cane sugar',
        target_id: 'prod_pintola_pb'
      },
      {
        name: 'Mashed Dried Anjeer (Figs) with Raw Walnuts',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Natural dried fig puree dense in plant fiber and omega-3 ALA from crushed walnuts.',
        savings: 'Zero palm oil, high prebiotic fiber'
      }
    ];
  }

  // 11. White Breads & Bakery (White Bread, Buns, Pav, Cakes)
  if (
    combined.includes('bread') ||
    combined.includes('bun') ||
    combined.includes('pav') ||
    combined.includes('cake') ||
    combined.includes('pastry')
  ) {
    return [
      {
        name: 'Zero Maida 100% Whole Wheat Bread',
        brand: 'The Health Factory',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Stone-ground whole wheat baked with zero refined flour, artificial softeners, or palm fat.',
        savings: 'Zero refined maida, +300% dietary fiber'
      },
      {
        name: 'Traditional Multigrain Jowar & Bajra Roti',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Ancient gluten-free pearl and sorghum millets offering steady carbohydrate release.',
        savings: 'Low glycemic index, rich in dietary minerals'
      }
    ];
  }

  // 12. Packaged Dairy & Cheese (Processed Cheese, Sweetened Dahi)
  if (
    combined.includes('cheese') ||
    combined.includes('butter') ||
    combined.includes('dahi') ||
    combined.includes('yogurt') ||
    combined.includes('paneer')
  ) {
    return [
      {
        name: 'Natural Greek Yogurt (Unsweetened)',
        brand: 'Epigamia',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Double-strained probiotic curd packed with 8g bioavailable protein and zero added refined sugars.',
        savings: 'Double protein, zero added sugars'
      },
      {
        name: 'Fresh Cow Milk Paneer (Low Salt)',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Fresh unaged cottage cheese providing sustained-release micellar casein protein and calcium.',
        savings: 'Zero emulsifier salts or artificial preservatives'
      }
    ];
  }

  // 13. Indian Sweets (Gulab Jamun, Soan Papdi, Rasgulla, Kaju Katli)
  if (
    combined.includes('haldiram') ||
    combined.includes('gulab jamun') ||
    combined.includes('soan papdi') ||
    combined.includes('rasgulla') ||
    combined.includes('kaju katli') ||
    combined.includes('mithai') ||
    combined.includes('sweet')
  ) {
    return [
      {
        name: 'Dry Fruit Anjeer & Nut Barfi (No Added Sugar)',
        brand: 'Open Secret',
        category: 'packaged',
        nutri_grade: 'B',
        reason: 'Sweetened exclusively with natural dried figs and packed with cashews, almonds, and pistachios.',
        savings: 'Zero refined cane sugar, high fiber'
      },
      {
        name: 'Organic Besan & Gond Laddoo with Jaggery',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Roasted chickpea flour and edible gum (gond) bound with A2 cow ghee and unrefined jaggery.',
        savings: 'Zero hydrogenated dalda or white sugar'
      }
    ];
  }

  // 14. Breakfast Cereals (Chocos, Froot Loops, Corn Flakes)
  if (
    combined.includes('cereal') ||
    combined.includes('chocos') ||
    combined.includes('corn flakes') ||
    combined.includes('muesli') ||
    combined.includes('granola')
  ) {
    return [
      {
        name: 'Rolled White Oats',
        brand: 'Quaker',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Whole grain oats with beta-glucan soluble fiber that helps regulate blood cholesterol.',
        savings: 'Zero added sugar, 10.6g fiber',
        target_id: 'prod_oats'
      },
      {
        name: 'Foxtail Millet Grain Porridge',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Ancient whole grain with low glycemic index, slow digestion, and rich B-complex vitamins.',
        savings: 'Lowest GI, zero processing chemicals',
        target_id: 'prod_foxtail_millet'
      }
    ];
  }

  // Fallback based on specific nutritional deficits
  if (sugars > 20) {
    return [
      {
        name: '75% Dark Single-Origin Chocolate',
        brand: 'Amul',
        category: 'packaged',
        nutri_grade: 'B',
        reason: 'Rich in antioxidant cocoa mass with 70% less sugar than typical high-sugar snacks.',
        savings: '-70% sugar load',
        target_id: 'prod_amul_dark'
      },
      {
        name: 'Raw California Walnuts & Almonds',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Natural plant fats and protein that satisfy hunger without triggering insulin spikes.',
        savings: 'Zero added sugar, rich in omega-3 ALA',
        target_id: 'prod_raw_walnuts'
      }
    ];
  }

  if (sodium > 600 || satFat > 10) {
    return [
      {
        name: 'Roasted Fox Nuts (Makhana)',
        brand: 'Farmley',
        category: 'packaged',
        nutri_grade: 'A',
        reason: 'Air-popped lotus seeds with minimal sodium and zero saturated trans-fats.',
        savings: '-85% sodium, zero palm fat',
        target_id: 'prod_farmley_makhana'
      },
      {
        name: 'Sprouted Green Moong Dal',
        category: 'natural',
        nutri_grade: 'A',
        reason: 'Fresh bioavailable enzymes, high plant protein, and natural blood-pressure-friendly potassium.',
        savings: 'Zero sodium, 100% natural whole food',
        target_id: 'prod_moong_dal'
      }
    ];
  }

  // Universal Clean Baseline
  return [
    {
      name: 'Rolled White Oats',
      brand: 'Quaker',
      category: 'packaged',
      nutri_grade: 'A',
      reason: '100% whole grain with beta-glucan soluble fiber that supports long-term digestive and metabolic health.',
      savings: 'High fiber, zero added sugar',
      target_id: 'prod_oats'
    },
    {
      name: 'Sprouted Green Moong Dal',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Fresh sprouted legumes rich in live plant enzymes, dietary fiber, and plant protein.',
      savings: '100% natural whole food',
      target_id: 'prod_moong_dal'
    }
  ];
}

import { searchWebForHealthierAlternatives } from './webSearchEngine';

/**
 * On-Demand AI-Generated Healthier Alternatives using Local Ollama model grounded with Live Web Search.
 * Searches live food registries (Open Food Facts v2, Wikipedia) and feeds real-time web results into the AI.
 * If local Ollama is offline or on production cloud, seamlessly falls back to the live web search engine.
 */
export async function generateAiSwapsWithOllama(
  product: ProductItem,
  modelName = 'qwen3.5:2b'
): Promise<HealthierAlternative[]> {
  // 1. First, search live web databases for real alternatives
  let webFindings: HealthierAlternative[] = [];
  try {
    webFindings = await searchWebForHealthierAlternatives(product);
  } catch (err) {
    console.warn('Web search pre-fetch warning:', err);
  }

  // Format web search findings for RAG grounding
  const webContextText = webFindings.length > 0
    ? webFindings.map((w, i) => `${i + 1}. ${w.name} (${w.category}, Grade ${w.nutri_grade}) - ${w.reason} [Source: ${w.web_source}]`).join('\n')
    : 'No live web items found; use internal nutritional knowledge.';

  const prompt = `You are an expert food scientist and nutritionist specializing in healthy Indian and global alternatives.
Target scanned food to replace:
- Name: "${product.product_name}"
- Brand: "${product.brand}"
- Category: "${product.category}"
- Current Nutrition per 100g: ${product.per_100g.sugars_g ?? 0}g sugar, ${product.per_100g.saturated_fat_g ?? 0}g saturated fat, ${product.per_100g.salt_g ?? 0}g salt.

LIVE WEB SEARCH FINDINGS:
${webContextText}

TASK:
Recommend exactly 2 healthier alternatives (Grade A or B) to replace "${product.product_name}":
1. One healthier PACKAGED food available in India (e.g. Slurrp Farm, Yoga Bar, Amul, Farmley, Raw Pressery, Pintola).
2. One NATURAL whole food (e.g. Foxtail Millet, Tender Coconut, Roasted Makhana, Spiced Chaas, Sprouted Moong).

Respond ONLY with a valid JSON array matching this schema:
[
  {
    "name": "Healthier Packaged Product Name",
    "brand": "Brand",
    "category": "packaged",
    "nutri_grade": "A",
    "reason": "1 clear sentence explaining why it is healthier",
    "savings": "Specific savings e.g. -80% sugar, zero palm oil",
    "web_source": "Live Web Search"
  },
  {
    "name": "Natural Whole Food Name",
    "category": "natural",
    "nutri_grade": "A",
    "reason": "1 clear sentence explaining why it is healthier",
    "savings": "Specific savings e.g. 100% natural fiber, zero cane sugar",
    "web_source": "Live Web Search"
  }
]`;

  const body = {
    model: modelName,
    prompt: prompt,
    format: 'json',
    think: false,
    stream: false,
    options: {
      num_predict: 220,
      temperature: 0.1
    }
  };

  // 2. Attempt local Ollama generation (trying Vite proxy and direct localhost)
  const ollamaUrls = ['/api/ollama/api/generate', 'http://127.0.0.1:11434/api/generate'];

  for (const url of ollamaUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const rawText = data.response;
        if (rawText) {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              name: item.name || (webFindings[idx]?.name ?? 'Healthier Alternative'),
              brand: item.brand || webFindings[idx]?.brand,
              category: item.category === 'natural' ? 'natural' : 'packaged',
              nutri_grade: (['A', 'B'].includes(item.nutri_grade) ? item.nutri_grade : 'A') as 'A' | 'B',
              reason: item.reason || (webFindings[idx]?.reason ?? 'Healthier nutritional profile with lower sugar.'),
              savings: item.savings || (webFindings[idx]?.savings ?? 'Low sugar & clean ingredients'),
              target_id: webFindings[idx]?.target_id,
              web_source: `Local AI (${modelName}) + Web Search`,
              web_url: webFindings[idx]?.web_url
            }));
          }
        }
      }
    } catch {
      // Try next url or fallback to live web findings
    }
  }

  // 3. Fallback: If local Ollama is offline or running on cloud Vercel,
  // return the live web-searched recommendations!
  if (webFindings.length > 0) {
    return webFindings;
  }

  // 4. Offline Fallback: Contextual Database
  return getContextualAlternatives(product);
}
