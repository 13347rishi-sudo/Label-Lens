import type { ProductItem, HealthierAlternative } from './types';
import { resolveGs1IndiaBarcode } from './indianFmcg';

export const EXHIBITION_PRODUCTS: ProductItem[] = [
  {
    "id": "prod_coke",
    "barcode": "5449000000996",
    "qr_code_url": "https://id.gs1.org/01/05449000000996",
    "qr_payload": "{\"gtin\": \"05449000000996\", \"brand\": \"The Coca-Cola Company\", \"name\": \"Coca-Cola Classic\"}",
    "product_name": "Coca-Cola Classic",
    "brand": "The Coca-Cola Company",
    "serving_size": "330 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Soft Drinks",
    "description": "Iconic sugar-sweetened soda with high free sugars and caramel colour E150d.",
    "per_100g": {
      "energy_kcal": 42,
      "energy_kj": 180,
      "sugars_g": 10.6,
      "saturated_fat_g": 0.0,
      "salt_g": 0.0,
      "sodium_mg": 0.0,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 10.6
    },
    "ingredients": [
      "Carbonated Water",
      "Sugar",
      "Colour (Caramel E150d)",
      "Phosphoric Acid",
      "Natural Flavourings",
      "Caffeine"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Raw Coconut Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Pure natural isotonic hydration without sucrose spikes",
        "savings": "-60% sugar, zero additives",
        "target_id": "prod_raw_coconut"
      },
      {
        "name": "Pepsi Zero Sugar",
        "brand": "PepsiCo",
        "category": "packaged",
        "nutri_grade": "B",
        "reason": "Zero caloric load and zero added sugar",
        "savings": "0g sugar vs 35g per can",
        "target_id": "prod_pepsi_zero"
      },
      {
        "name": "Spiced Buttermilk / Chaas",
        "brand": "Amul",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Naturally fermented cooling drink rich in probiotics",
        "savings": "Zero added sugar, 3g protein",
        "target_id": "prod_amul_chaas"
      }
    ]
  },
  {
    "id": "prod_pepsi_zero",
    "barcode": "012000001291",
    "qr_code_url": "https://id.gs1.org/01/00012000001291",
    "qr_payload": "{\"gtin\": \"00012000001291\", \"brand\": \"PepsiCo\", \"name\": \"Pepsi Zero Sugar\"}",
    "product_name": "Pepsi Zero Sugar",
    "brand": "PepsiCo",
    "serving_size": "355 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Diet Soft Drinks",
    "description": "Zero calorie cola sweetened with Aspartame (E951) and Acesulfame K (E950).",
    "per_100g": {
      "energy_kcal": 0,
      "energy_kj": 2,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.03,
      "sodium_mg": 12,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 0.0
    },
    "ingredients": [
      "Carbonated Water",
      "Caramel Colour E150d",
      "Phosphoric Acid",
      "Aspartame",
      "Potassium Benzoate",
      "Caffeine",
      "Natural Flavour",
      "Acesulfame Potassium"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sparkling Lemon Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Zero artificial sweeteners like Aspartame",
        "savings": "Clean natural ingredients",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_redbull",
    "barcode": "90162602",
    "qr_code_url": "https://id.gs1.org/01/00000090162602",
    "qr_payload": "{\"gtin\": \"00000090162602\", \"brand\": \"Red Bull GmbH\", \"name\": \"Red Bull Energy Drink\"}",
    "product_name": "Red Bull Energy Drink",
    "brand": "Red Bull GmbH",
    "serving_size": "250 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Energy Drinks",
    "description": "High-caffeine carbonated energy beverage with taurine and excessive simple sucrose.",
    "per_100g": {
      "energy_kcal": 45,
      "energy_kj": 194,
      "sugars_g": 11.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.1,
      "sodium_mg": 40,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 11.0
    },
    "ingredients": [
      "Carbonated Water",
      "Sucrose",
      "Glucose",
      "Citric Acid",
      "Taurine",
      "Sodium Bicarbonate",
      "Magnesium Carbonate",
      "Caffeine",
      "Niacinamide",
      "Vitamin B6",
      "Vitamin B12"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Green Tea with Mint",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural L-Theanine focus without caffeine jitters or sugar crash",
        "savings": "0g sugar, antioxidant rich",
        "target_id": "prod_raw_greentea"
      }
    ]
  },
  {
    "id": "prod_monster",
    "barcode": "5060166692247",
    "qr_code_url": "https://id.gs1.org/01/05060166692247",
    "qr_payload": "{\"gtin\": \"05060166692247\", \"brand\": \"Monster Beverage\", \"name\": \"Monster Energy Original\"}",
    "product_name": "Monster Energy Original",
    "brand": "Monster Beverage",
    "serving_size": "500 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Energy Drinks",
    "description": "Extreme energy beverage containing 55g sugar per can plus synthetic glucuronolactone.",
    "per_100g": {
      "energy_kcal": 47,
      "energy_kj": 201,
      "sugars_g": 12.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.19,
      "sodium_mg": 76,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 12.0
    },
    "ingredients": [
      "Carbonated Water",
      "Sucrose",
      "Glucose Syrup",
      "Citric Acid",
      "Natural Flavourings",
      "Taurine",
      "Sodium Citrate",
      "Panax Ginseng Root Extract",
      "L-Carnitine",
      "Caffeine",
      "Sorbic Acid",
      "Caramel E150d"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Tender Coconut Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural electrolytes (potassium, magnesium) without chemicals",
        "savings": "100% natural, no synthetic caffeine",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_tropicana",
    "barcode": "048500001156",
    "qr_code_url": "https://id.gs1.org/01/00048500001156",
    "qr_payload": "{\"gtin\": \"00048500001156\", \"brand\": \"Tropicana Products\", \"name\": \"Tropicana 100% Orange Juice\"}",
    "product_name": "Tropicana 100% Orange Juice",
    "brand": "Tropicana Products",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 100,
    "category": "Fruit Juices",
    "description": "100% pure squeezed orange juice with natural fructose. No added cane sugar.",
    "per_100g": {
      "energy_kcal": 43,
      "energy_kj": 182,
      "sugars_g": 8.8,
      "saturated_fat_g": 0.0,
      "salt_g": 0.0,
      "sodium_mg": 2,
      "fibre_g": 0.2,
      "protein_g": 0.7,
      "fat_g": 0.1,
      "carbs_g": 9.5
    },
    "ingredients": [
      "100% Pure Squeezed Pasteurized Orange Juice"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Whole Fresh Oranges",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole fruit provides intact cellular fiber preventing insulin spikes",
        "savings": "+3.5g dietary fiber, slower digestion",
        "target_id": "prod_raw_orange"
      }
    ]
  },
  {
    "id": "prod_mountain_dew",
    "barcode": "012000000140",
    "qr_code_url": "https://id.gs1.org/01/00012000000140",
    "qr_payload": "{\"gtin\": \"00012000000140\", \"brand\": \"PepsiCo\", \"name\": \"Mountain Dew\"}",
    "product_name": "Mountain Dew",
    "brand": "PepsiCo",
    "serving_size": "330 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Soft Drinks",
    "description": "Citrus flavoured carbonated soda with high fructose corn syrup and yellow food dye E102.",
    "per_100g": {
      "energy_kcal": 48,
      "energy_kj": 205,
      "sugars_g": 12.3,
      "saturated_fat_g": 0.0,
      "salt_g": 0.04,
      "sodium_mg": 16,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 12.3
    },
    "ingredients": [
      "Carbonated Water",
      "High Fructose Corn Syrup",
      "Concentrated Orange Juice",
      "Citric Acid",
      "Natural Flavour",
      "Sodium Benzoate",
      "Caffeine",
      "Sodium Citrate",
      "Tartrazine E102"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Lime Soda with Mint",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural citrus vitamin C with no synthetic colorants or HFCS",
        "savings": "Zero high fructose corn syrup",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_sprite",
    "barcode": "5449000014528",
    "qr_code_url": "https://id.gs1.org/01/05449000014528",
    "qr_payload": "{\"gtin\": \"05449000014528\", \"brand\": \"The Coca-Cola Company\", \"name\": \"Sprite Lemon-Lime\"}",
    "product_name": "Sprite Lemon-Lime",
    "brand": "The Coca-Cola Company",
    "serving_size": "330 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Soft Drinks",
    "description": "Clear lemon-lime soda high in simple sugars with sodium citrate.",
    "per_100g": {
      "energy_kcal": 38,
      "energy_kj": 162,
      "sugars_g": 9.1,
      "saturated_fat_g": 0.0,
      "salt_g": 0.02,
      "sodium_mg": 9,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 9.1
    },
    "ingredients": [
      "Carbonated Water",
      "Sugar",
      "Citric Acid",
      "Malic Acid",
      "Natural Lemon and Lime Flavourings",
      "Sodium Citrate",
      "Steviol Glycosides"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sparkling Lemon Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural lemon oil and fizz without 30g cane sugar",
        "savings": "-100% sugar",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_7up",
    "barcode": "012000000850",
    "qr_code_url": "https://id.gs1.org/01/00012000000850",
    "qr_payload": "{\"gtin\": \"00012000000850\", \"brand\": \"PepsiCo\", \"name\": \"7UP Lemon Lime\"}",
    "product_name": "7UP Lemon Lime",
    "brand": "PepsiCo",
    "serving_size": "330 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Soft Drinks",
    "description": "Crisp carbonated lemon lime soda loaded with simple sugars.",
    "per_100g": {
      "energy_kcal": 41,
      "energy_kj": 174,
      "sugars_g": 10.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.03,
      "sodium_mg": 12,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 10.0
    },
    "ingredients": [
      "Carbonated Water",
      "Sugar",
      "Citric Acid",
      "Malic Acid",
      "Natural Flavour",
      "Sodium Citrate",
      "Potassium Sorbate"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Chilled Tender Coconut Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Pure potassium and hydration",
        "savings": "-70% sugar",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_fanta",
    "barcode": "5449000011527",
    "qr_code_url": "https://id.gs1.org/01/05449000011527",
    "qr_payload": "{\"gtin\": \"05449000011527\", \"brand\": \"The Coca-Cola Company\", \"name\": \"Fanta Orange\"}",
    "product_name": "Fanta Orange",
    "brand": "The Coca-Cola Company",
    "serving_size": "330 ml",
    "is_beverage": true,
    "fruit_veg_pct": 4,
    "category": "Soft Drinks",
    "description": "Orange soda with 4% orange juice from concentrate and sunset yellow E110.",
    "per_100g": {
      "energy_kcal": 43,
      "energy_kj": 183,
      "sugars_g": 10.4,
      "saturated_fat_g": 0.0,
      "salt_g": 0.01,
      "sodium_mg": 4,
      "fibre_g": 0.0,
      "protein_g": 0.0,
      "fat_g": 0.0,
      "carbs_g": 10.4
    },
    "ingredients": [
      "Carbonated Water",
      "Sugar",
      "Orange Juice from Concentrate (4%)",
      "Citric Acid",
      "Ascorbic Acid",
      "Sunset Yellow E110",
      "Carotenes"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Orange Slices",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Direct dietary fiber without Sunset Yellow dye",
        "savings": "No synthetic dyes",
        "target_id": "prod_raw_orange"
      }
    ]
  },
  {
    "id": "prod_frooti",
    "barcode": "8901725131234",
    "qr_code_url": "https://id.gs1.org/01/08901725131234",
    "qr_payload": "{\"gtin\": \"08901725131234\", \"brand\": \"Parle Agro\", \"name\": \"Frooti Mango Drink\"}",
    "product_name": "Frooti Mango Drink",
    "brand": "Parle Agro",
    "serving_size": "160 ml",
    "is_beverage": true,
    "fruit_veg_pct": 15,
    "category": "Fruit Beverages",
    "description": "Popular Indian mango drink with mango pulp, liquid glucose, and food acid 330.",
    "per_100g": {
      "energy_kcal": 65,
      "energy_kj": 275,
      "sugars_g": 15.5,
      "saturated_fat_g": 0.0,
      "salt_g": 0.02,
      "sodium_mg": 8,
      "fibre_g": 0.2,
      "protein_g": 0.2,
      "fat_g": 0.0,
      "carbs_g": 16.0
    },
    "ingredients": [
      "Water",
      "Mango Pulp (15%)",
      "Sugar",
      "Acidity Regulator (330)",
      "Antioxidant (300)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Alphonso Mango Slices",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Intact dietary fiber and natural vitamins without liquid glucose",
        "savings": "No refined syrups",
        "target_id": "prod_raw_orange"
      }
    ]
  },
  {
    "id": "prod_paperboat_aamras",
    "barcode": "8906080600015",
    "qr_code_url": "https://id.gs1.org/01/08906080600015",
    "qr_payload": "{\"gtin\": \"08906080600015\", \"brand\": \"Hector Beverages\", \"name\": \"Paper Boat Aamras\"}",
    "product_name": "Paper Boat Aamras",
    "brand": "Hector Beverages",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 45,
    "category": "Traditional Beverages",
    "description": "Indian mango drink with 45% mango pulp and cardamom.",
    "per_100g": {
      "energy_kcal": 72,
      "energy_kj": 305,
      "sugars_g": 16.8,
      "saturated_fat_g": 0.0,
      "salt_g": 0.03,
      "sodium_mg": 12,
      "fibre_g": 0.5,
      "protein_g": 0.4,
      "fat_g": 0.1,
      "carbs_g": 17.5
    },
    "ingredients": [
      "Water",
      "Mango Pulp (45%)",
      "Sugar",
      "Antioxidant (Ascorbic Acid)",
      "Cardamom Powder"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Spiced Buttermilk / Chaas",
        "brand": "Amul",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Digestive probiotic with zero added sugar",
        "savings": "-90% sugar load",
        "target_id": "prod_amul_chaas"
      }
    ]
  },
  {
    "id": "prod_real_fruit",
    "barcode": "8901207010018",
    "qr_code_url": "https://id.gs1.org/01/08901207010018",
    "qr_payload": "{\"gtin\": \"08901207010018\", \"brand\": \"Dabur\", \"name\": \"Real Fruit Power Mixed Fruit\"}",
    "product_name": "Real Fruit Power Mixed Fruit",
    "brand": "Dabur",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 30,
    "category": "Fruit Beverages",
    "description": "Mixed fruit blend with apple, orange, pineapple, and added sucrose.",
    "per_100g": {
      "energy_kcal": 56,
      "energy_kj": 238,
      "sugars_g": 13.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.01,
      "sodium_mg": 5,
      "fibre_g": 0.2,
      "protein_g": 0.3,
      "fat_g": 0.0,
      "carbs_g": 13.7
    },
    "ingredients": [
      "Water",
      "Mixed Fruit Juice Concentrate (30%)",
      "Sugar",
      "Acidity Regulator (330)",
      "Stabilizer (440)",
      "Antioxidant (300)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Tender Coconut Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural electrolytes without added fruit concentrates",
        "savings": "-70% sugar",
        "target_id": "prod_raw_coconut"
      }
    ]
  },
  {
    "id": "prod_raw_coconut",
    "barcode": "8906080601012",
    "qr_code_url": "https://id.gs1.org/01/08906080601012",
    "qr_payload": "{\"gtin\": \"08906080601012\", \"brand\": \"Nature Fresh\", \"name\": \"Tender Coconut Water (Pure)\"}",
    "product_name": "Tender Coconut Water (Pure)",
    "brand": "Nature Fresh",
    "serving_size": "250 ml",
    "is_beverage": true,
    "fruit_veg_pct": 100,
    "category": "Natural Hydration",
    "description": "100% raw tender coconut water. Naturally packed with potassium and zero added sugar. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 19,
      "energy_kj": 80,
      "sugars_g": 3.7,
      "saturated_fat_g": 0.0,
      "salt_g": 0.05,
      "sodium_mg": 20,
      "fibre_g": 0.5,
      "protein_g": 0.7,
      "fat_g": 0.1,
      "carbs_g": 3.7
    },
    "ingredients": [
      "100% Tender Coconut Water"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sparkling Mineral Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Zero caloric hydration",
        "savings": "Top Nutri-Score A choice"
      }
    ]
  },
  {
    "id": "prod_rawpressery_green",
    "barcode": "8906073100126",
    "qr_code_url": "https://id.gs1.org/01/08906073100126",
    "qr_payload": "{\"gtin\": \"08906073100126\", \"brand\": \"Raw Pressery\", \"name\": \"Raw Pressery Cold Pressed Green\"}",
    "product_name": "Raw Pressery Cold Pressed Green",
    "brand": "Raw Pressery",
    "serving_size": "250 ml",
    "is_beverage": true,
    "fruit_veg_pct": 95,
    "category": "Cold Pressed Juices",
    "description": "Cold-pressed green juice with cucumber, kale, green apple, spinach, and ginger.",
    "per_100g": {
      "energy_kcal": 28,
      "energy_kj": 118,
      "sugars_g": 5.2,
      "saturated_fat_g": 0.0,
      "salt_g": 0.04,
      "sodium_mg": 16,
      "fibre_g": 1.2,
      "protein_g": 0.8,
      "fat_g": 0.2,
      "carbs_g": 5.8
    },
    "ingredients": [
      "Cucumber Juice",
      "Green Apple Juice",
      "Spinach Juice",
      "Kale Juice",
      "Celery Juice",
      "Lemon Juice",
      "Ginger"
    ],
    "allergens_stated": [
      "Celery"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Fresh Salad Bowl",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Maximized intact cellular dietary fiber",
        "savings": "+4g fiber"
      }
    ]
  },
  {
    "id": "prod_remedy_kombucha",
    "barcode": "9344442000014",
    "qr_code_url": "https://id.gs1.org/01/09344442000014",
    "qr_payload": "{\"gtin\": \"09344442000014\", \"brand\": \"Remedy Drinks\", \"name\": \"Remedy Raw Kombucha Ginger Lemon\"}",
    "product_name": "Remedy Raw Kombucha Ginger Lemon",
    "brand": "Remedy Drinks",
    "serving_size": "250 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Fermented Beverages",
    "description": "Naturally fermented live organic tea culture with organic erythritol and stevia. Zero sugar.",
    "per_100g": {
      "energy_kcal": 6,
      "energy_kj": 25,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.01,
      "sodium_mg": 5,
      "fibre_g": 0.0,
      "protein_g": 0.1,
      "fat_g": 0.0,
      "carbs_g": 1.5
    },
    "ingredients": [
      "Organic Raw Kombucha",
      "Organic Sweeteners (Erythritol, Stevia)",
      "Ginger Juice",
      "Lemon Juice"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Ginger Mint Green Tea",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Freshly brewed warm digestive tea",
        "savings": "Zero sweeteners"
      }
    ]
  },
  {
    "id": "prod_yakult",
    "barcode": "8906037080013",
    "qr_code_url": "https://id.gs1.org/01/08906037080013",
    "qr_payload": "{\"gtin\": \"08906037080013\", \"brand\": \"Yakult Danone\", \"name\": \"Yakult Probiotic Drink\"}",
    "product_name": "Yakult Probiotic Drink",
    "brand": "Yakult Danone",
    "serving_size": "65 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Probiotic Dairy",
    "description": "Fermented skimmed milk with 6.5 billion Lactobacillus casei strain Shirota.",
    "per_100g": {
      "energy_kcal": 66,
      "energy_kj": 280,
      "sugars_g": 14.2,
      "saturated_fat_g": 0.0,
      "salt_g": 0.04,
      "sodium_mg": 17,
      "fibre_g": 0.0,
      "protein_g": 1.2,
      "fat_g": 0.1,
      "carbs_g": 15.4
    },
    "ingredients": [
      "Water",
      "Skimmed Milk Powder",
      "Glucose-Fructose Syrup",
      "Sugar",
      "Flavouring",
      "Lactobacillus casei Shirota"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Unsweetened Plain Greek Yogurt",
        "brand": "Epigamia",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "High protein probiotic with zero added glucose syrup",
        "savings": "-14g sugar per 100g, 8g protein",
        "target_id": "prod_epigamia_greek"
      }
    ]
  },
  {
    "id": "prod_silk_almond",
    "barcode": "025293000988",
    "qr_code_url": "https://id.gs1.org/01/00025293000988",
    "qr_payload": "{\"gtin\": \"00025293000988\", \"brand\": \"Danone\", \"name\": \"Silk Pure Almond Milk (Unsweetened)\"}",
    "product_name": "Silk Pure Almond Milk (Unsweetened)",
    "brand": "Danone",
    "serving_size": "240 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Plant Milks",
    "description": "Calcium-fortified unsweetened almond milk. Zero added sugar and low calorie.",
    "per_100g": {
      "energy_kcal": 13,
      "energy_kj": 55,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.1,
      "salt_g": 0.18,
      "sodium_mg": 72,
      "fibre_g": 0.4,
      "protein_g": 0.4,
      "fat_g": 1.1,
      "carbs_g": 0.3
    },
    "ingredients": [
      "Almondmilk (Filtered Water, Almonds)",
      "Calcium Carbonate",
      "Sea Salt",
      "Gellan Gum",
      "Ascorbic Acid"
    ],
    "allergens_stated": [
      "Almonds"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Almond Milk",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Homemade plant milk with no synthetic gums",
        "savings": "No stabilizers"
      }
    ]
  },
  {
    "id": "prod_oatly_barista",
    "barcode": "7394376616037",
    "qr_code_url": "https://id.gs1.org/01/07394376616037",
    "qr_payload": "{\"gtin\": \"07394376616037\", \"brand\": \"Oatly\", \"name\": \"Oatly Barista Edition Oat Milk\"}",
    "product_name": "Oatly Barista Edition Oat Milk",
    "brand": "Oatly",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Plant Milks",
    "description": "Creamy oat milk formulated with rapeseed oil and dipotassium phosphate for coffee.",
    "per_100g": {
      "energy_kcal": 59,
      "energy_kj": 247,
      "sugars_g": 4.0,
      "saturated_fat_g": 0.3,
      "salt_g": 0.1,
      "sodium_mg": 40,
      "fibre_g": 0.8,
      "protein_g": 1.0,
      "fat_g": 3.0,
      "carbs_g": 6.6
    },
    "ingredients": [
      "Oat Base (Water, Oats 10%)",
      "Rapeseed Oil",
      "Dipotassium Phosphate",
      "Calcium Carbonate",
      "Sea Salt"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Rolled Oat Milk",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "No added seed oils or phosphates",
        "savings": "Zero added oil"
      }
    ]
  },
  {
    "id": "prod_amul_taaza",
    "barcode": "8901262010053",
    "qr_code_url": "https://id.gs1.org/01/08901262010053",
    "qr_payload": "{\"gtin\": \"08901262010053\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul Taaza Toned Milk\"}",
    "product_name": "Amul Taaza Toned Milk",
    "brand": "Amul (GCMMF)",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Dairy Milk",
    "description": "Homogenised pasteurised toned milk with 3.0% fat and 8.5% SNF.",
    "per_100g": {
      "energy_kcal": 58,
      "energy_kj": 243,
      "sugars_g": 4.7,
      "saturated_fat_g": 1.9,
      "salt_g": 0.1,
      "sodium_mg": 45,
      "fibre_g": 0.0,
      "protein_g": 3.2,
      "fat_g": 3.0,
      "carbs_g": 4.7
    },
    "ingredients": [
      "Toned Milk",
      "Vitamin A",
      "Vitamin D2"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Fresh Buttermilk / Chaas",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Lower fat and cooling probiotic cultures",
        "savings": "-50% fat",
        "target_id": "prod_amul_chaas"
      }
    ]
  },
  {
    "id": "prod_amul_chaas",
    "barcode": "8901262010152",
    "qr_code_url": "https://id.gs1.org/01/08901262010152",
    "qr_payload": "{\"gtin\": \"08901262010152\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul Masti Spiced Chaas (Buttermilk)\"}",
    "product_name": "Amul Masti Spiced Chaas (Buttermilk)",
    "brand": "Amul (GCMMF)",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Traditional Cultured Dairy",
    "description": "Traditional spiced Indian buttermilk with jeera, black salt, and ginger. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 28,
      "energy_kj": 117,
      "sugars_g": 2.2,
      "saturated_fat_g": 1.0,
      "salt_g": 0.45,
      "sodium_mg": 180,
      "fibre_g": 0.0,
      "protein_g": 1.8,
      "fat_g": 1.5,
      "carbs_g": 2.2
    },
    "ingredients": [
      "Pasteurized Toned Milk",
      "Water",
      "Common Salt",
      "Spices and Condiments (Cumin, Ginger, Black Pepper)",
      "Active Lactic Cultures"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Cumin Mint Buttermilk",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Lower sodium option with fresh herbs",
        "savings": "-50% sodium"
      }
    ]
  },
  {
    "id": "prod_lays",
    "barcode": "028400017013",
    "qr_code_url": "https://id.gs1.org/01/00028400017013",
    "qr_payload": "{\"gtin\": \"00028400017013\", \"brand\": \"Frito-Lay (PepsiCo)\", \"name\": \"Lay's Classic Salted Potato Chips\"}",
    "product_name": "Lay's Classic Salted Potato Chips",
    "brand": "Frito-Lay (PepsiCo)",
    "serving_size": "28 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Deep-fried thinly sliced potatoes with high saturated lipids and sodium.",
    "per_100g": {
      "energy_kcal": 536,
      "energy_kj": 2242,
      "sugars_g": 0.3,
      "saturated_fat_g": 11.0,
      "salt_g": 1.4,
      "sodium_mg": 560,
      "fibre_g": 3.2,
      "protein_g": 6.8,
      "fat_g": 34.0,
      "carbs_g": 52.0
    },
    "ingredients": [
      "Potatoes",
      "Vegetable Oil (Sunflower, Corn, and/or Canola Oil)",
      "Salt"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Roasted Makhana (Fox Nuts)",
        "brand": "Farmley",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "High protein ancient seed puffed with minimal oil",
        "savings": "-80% fat, 3x calcium",
        "target_id": "prod_farmley_makhana"
      },
      {
        "name": "Roasted Chana (Bengal Gram)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole legume roasted with crunchy fiber and protein",
        "savings": "18g protein vs 6g",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_lays_magic_masala",
    "barcode": "8901491101837",
    "qr_code_url": "https://id.gs1.org/01/08901491101837",
    "qr_payload": "{\"gtin\": \"08901491101837\", \"brand\": \"PepsiCo India\", \"name\": \"Lay's India's Magic Masala\"}",
    "product_name": "Lay's India's Magic Masala",
    "brand": "PepsiCo India",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Spicy Indian potato chips fried in palm oil blend with maltodextrin and MSG enhancer E635.",
    "per_100g": {
      "energy_kcal": 544,
      "energy_kj": 2276,
      "sugars_g": 4.1,
      "saturated_fat_g": 13.5,
      "salt_g": 1.7,
      "sodium_mg": 680,
      "fibre_g": 3.0,
      "protein_g": 6.5,
      "fat_g": 35.0,
      "carbs_g": 51.0
    },
    "ingredients": [
      "Potato",
      "Edible Vegetable Oil (Palmolein)",
      "Seasoning (Spices & Condiments, Salt, Maltodextrin, Sugar, Acidity Regulator 330, Flavour Enhancer 627, 631)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Spiced Roasted Makhana",
        "brand": "Farmley",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Crispy lotus seeds roasted with desi spices and zero palm oil",
        "savings": "No palm oil, -70% saturated fat",
        "target_id": "prod_farmley_makhana"
      },
      {
        "name": "Roasted Bengal Gram with Chaat Masala",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole legume crunch with natural plant protein",
        "savings": "Zero palm oil, high fiber",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_doritos",
    "barcode": "028400043807",
    "qr_code_url": "https://id.gs1.org/01/00028400043807",
    "qr_payload": "{\"gtin\": \"00028400043807\", \"brand\": \"Frito-Lay (PepsiCo)\", \"name\": \"Doritos Nacho Cheese\"}",
    "product_name": "Doritos Nacho Cheese",
    "brand": "Frito-Lay (PepsiCo)",
    "serving_size": "28 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Corn tortilla chips heavily seasoned with artificial cheese powder, MSG E621, and Yellow 6 dye.",
    "per_100g": {
      "energy_kcal": 500,
      "energy_kj": 2092,
      "sugars_g": 2.5,
      "saturated_fat_g": 4.5,
      "salt_g": 1.6,
      "sodium_mg": 640,
      "fibre_g": 3.6,
      "protein_g": 7.1,
      "fat_g": 25.0,
      "carbs_g": 64.0
    },
    "ingredients": [
      "Corn",
      "Vegetable Oil",
      "Maltodextrin",
      "Salt",
      "Cheddar Cheese (Milk)",
      "Whey",
      "Monosodium Glutamate E621",
      "Yellow 6 E110"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Baked Multigrain Tortilla Crisps",
        "category": "packaged",
        "nutri_grade": "B",
        "reason": "Baked instead of deep-fried with zero artificial dyes",
        "savings": "-50% saturated fat",
        "target_id": "prod_cornitos"
      },
      {
        "name": "Roasted Pumpkin Seeds with Salt",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Magnesium rich whole seeds with clean plant fats",
        "savings": "No synthetic colorants",
        "target_id": "prod_true_pumpkin"
      }
    ]
  },
  {
    "id": "prod_pringles_orig",
    "barcode": "038000138416",
    "qr_code_url": "https://id.gs1.org/01/00038000138416",
    "qr_payload": "{\"gtin\": \"00038000138416\", \"brand\": \"Kellogg's\", \"name\": \"Pringles Original\"}",
    "product_name": "Pringles Original",
    "brand": "Kellogg's",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Processed reconstituted potato flakes extruded with palm olein, wheat starch, and emulsifier E471.",
    "per_100g": {
      "energy_kcal": 534,
      "energy_kj": 2234,
      "sugars_g": 1.2,
      "saturated_fat_g": 12.0,
      "salt_g": 1.3,
      "sodium_mg": 520,
      "fibre_g": 2.8,
      "protein_g": 5.9,
      "fat_g": 33.0,
      "carbs_g": 53.0
    },
    "ingredients": [
      "Dehydrated Potatoes",
      "Vegetable Oils (Sunflower, Corn)",
      "Rice Flour",
      "Wheat Starch",
      "Corn Flour",
      "Emulsifier (E471)",
      "Maltodextrin",
      "Salt"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Air-Popped Corn with Sea Salt",
        "category": "natural",
        "nutri_grade": "B",
        "reason": "Whole grain corn without extruded starches",
        "savings": "-80% saturated fat",
        "target_id": "prod_act2_popcorn"
      },
      {
        "name": "Roasted Fox Nuts (Makhana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Low glycemic ancient water lily seeds",
        "savings": "Zero palm oil, high calcium",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_pringles_sour_cream",
    "barcode": "038000138430",
    "qr_code_url": "https://id.gs1.org/01/00038000138430",
    "qr_payload": "{\"gtin\": \"00038000138430\", \"brand\": \"Kellogg's\", \"name\": \"Pringles Sour Cream & Onion\"}",
    "product_name": "Pringles Sour Cream & Onion",
    "brand": "Kellogg's",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Extruded potato crisps with MSG E621, dextrose, sour cream powder, and acidity regulators.",
    "per_100g": {
      "energy_kcal": 525,
      "energy_kj": 2197,
      "sugars_g": 3.1,
      "saturated_fat_g": 11.5,
      "salt_g": 1.5,
      "sodium_mg": 600,
      "fibre_g": 2.7,
      "protein_g": 5.8,
      "fat_g": 32.0,
      "carbs_g": 53.0
    },
    "ingredients": [
      "Dehydrated Potatoes",
      "Vegetable Oils",
      "Sour Cream Seasoning (Onion Powder, Whey Powder, Dextrose, Sour Cream Powder, Monosodium Glutamate E621)",
      "Wheat Starch"
    ],
    "allergens_stated": [
      "Milk",
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Fox Nuts (Sour Cream)",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Puffed lotus seeds with light olive oil",
        "savings": "-75% fat",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_kurkure",
    "barcode": "8901491501026",
    "qr_code_url": "https://id.gs1.org/01/08901491501026",
    "qr_payload": "{\"gtin\": \"08901491501026\", \"brand\": \"PepsiCo India\", \"name\": \"Kurkure Masala Munch\"}",
    "product_name": "Kurkure Masala Munch",
    "brand": "PepsiCo India",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Crispy extruded puffs cooked in palm olein oil with bold spices, maltodextrin, and salt.",
    "per_100g": {
      "energy_kcal": 558,
      "energy_kj": 2335,
      "sugars_g": 2.5,
      "saturated_fat_g": 16.0,
      "salt_g": 2.1,
      "sodium_mg": 840,
      "fibre_g": 2.2,
      "protein_g": 6.0,
      "fat_g": 35.5,
      "carbs_g": 53.0
    },
    "ingredients": [
      "Rice Meal",
      "Edible Vegetable Oil (Palmolein)",
      "Corn Meal",
      "Gram Meal",
      "Seasoning (Spices & Condiments, Salt, Maltodextrin, Sugar, Tartaric Acid E334)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Roasted Chana with Chaat Masala",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Crunchy roasted whole chickpeas with 18g protein",
        "savings": "No palm oil, -85% saturated fat",
        "target_id": "prod_natureland_chana"
      },
      {
        "name": "Roasted Makhana (Puffed Lotus Seed)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Light crunchy puffs loaded with minerals",
        "savings": "Zero palm oil, low sodium",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_cheetos",
    "barcode": "028400040110",
    "qr_code_url": "https://id.gs1.org/01/00028400040110",
    "qr_payload": "{\"gtin\": \"00028400040110\", \"brand\": \"Frito-Lay (PepsiCo)\", \"name\": \"Cheetos Crunchy Cheddar\"}",
    "product_name": "Cheetos Crunchy Cheddar",
    "brand": "Frito-Lay (PepsiCo)",
    "serving_size": "28 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Extruded fried cornmeal with high saturated fat, yellow 6 dye, and high sodium.",
    "per_100g": {
      "energy_kcal": 560,
      "energy_kj": 2343,
      "sugars_g": 2.2,
      "saturated_fat_g": 11.0,
      "salt_g": 1.7,
      "sodium_mg": 680,
      "fibre_g": 2.0,
      "protein_g": 5.5,
      "fat_g": 35.0,
      "carbs_g": 53.0
    },
    "ingredients": [
      "Enriched Corn Meal",
      "Vegetable Oil",
      "Cheese Seasoning (Whey, Cheddar Cheese, Canola Oil, Maltodextrin, Salt, MSG E621, Yellow 6 E110)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Parmesan Roasted Makhana",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Real cheese sprinkled on puffed water lily seeds",
        "savings": "-70% fat, no dyes",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_haldiram_bhujia",
    "barcode": "8904063200019",
    "qr_code_url": "https://id.gs1.org/01/08904063200019",
    "qr_payload": "{\"gtin\": \"08904063200019\", \"brand\": \"Haldiram Snacks\", \"name\": \"Haldiram's Bhujia Sev\"}",
    "product_name": "Haldiram's Bhujia Sev",
    "brand": "Haldiram Snacks",
    "serving_size": "35 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Deep-fried moth bean and gram flour noodles in palm oil with spicy condiments.",
    "per_100g": {
      "energy_kcal": 588,
      "energy_kj": 2460,
      "sugars_g": 1.5,
      "saturated_fat_g": 18.5,
      "salt_g": 1.9,
      "sodium_mg": 760,
      "fibre_g": 4.5,
      "protein_g": 13.5,
      "fat_g": 42.0,
      "carbs_g": 39.0
    },
    "ingredients": [
      "Moth Flour (41%)",
      "Edible Vegetable Oil (Palmolein)",
      "Bengal Gram Flour",
      "Common Salt",
      "Red Chilli",
      "Black Pepper",
      "Cardamom",
      "Clove Powder"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong Salad",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Freshly sprouted moth/moong with live enzymes and zero frying oil",
        "savings": "-90% fat",
        "target_id": "prod_moong_dal"
      },
      {
        "name": "Roasted Bengal Gram (Chana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Naturally roasted pulse with zero palm oil",
        "savings": "No palm oil, -75% fat",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_haldiram_aloo_bhujia",
    "barcode": "8904063200026",
    "qr_code_url": "https://id.gs1.org/01/08904063200026",
    "qr_payload": "{\"gtin\": \"08904063200026\", \"brand\": \"Haldiram Snacks\", \"name\": \"Haldiram's Aloo Bhujia\"}",
    "product_name": "Haldiram's Aloo Bhujia",
    "brand": "Haldiram Snacks",
    "serving_size": "35 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Crispy spiced potato and gram noodles deep-fried in palmolein with citric acid.",
    "per_100g": {
      "energy_kcal": 575,
      "energy_kj": 2406,
      "sugars_g": 3.0,
      "saturated_fat_g": 17.0,
      "salt_g": 1.8,
      "sodium_mg": 720,
      "fibre_g": 3.8,
      "protein_g": 9.5,
      "fat_g": 39.0,
      "carbs_g": 45.0
    },
    "ingredients": [
      "Potato (44%)",
      "Edible Vegetable Oil (Palmolein)",
      "Bengal Gram Flour",
      "Moth Flour",
      "Salt",
      "Red Chilli",
      "Cumin",
      "Cardamom",
      "Acidity Regulator 330"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Roasted Fox Nuts (Makhana)",
        "brand": "Farmley",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Satisfies the crunchy craving with zero trans fat or palm oil",
        "savings": "No palm oil, -80% saturated fat",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_haldiram_moong_dal",
    "barcode": "8904063200040",
    "qr_code_url": "https://id.gs1.org/01/08904063200040",
    "qr_payload": "{\"gtin\": \"08904063200040\", \"brand\": \"Haldiram Snacks\", \"name\": \"Haldiram's Moong Dal\"}",
    "product_name": "Haldiram's Moong Dal",
    "brand": "Haldiram Snacks",
    "serving_size": "35 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Split yellow moong dal deep-fried in palmolein and seasoned with rock salt.",
    "per_100g": {
      "energy_kcal": 485,
      "energy_kj": 2029,
      "sugars_g": 0.5,
      "saturated_fat_g": 9.5,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 6.0,
      "protein_g": 18.0,
      "fat_g": 24.0,
      "carbs_g": 49.0
    },
    "ingredients": [
      "Split Green Gram (Moong Dal) (78%)",
      "Edible Vegetable Oil (Palmolein)",
      "Salt"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Organic Green Moong Dal (Boiled)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole pulse steamed with lemon & chaat spices without deep frying",
        "savings": "1g fat vs 24g fat",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_haldiram_khatta_meetha",
    "barcode": "8904063200057",
    "qr_code_url": "https://id.gs1.org/01/08904063200057",
    "qr_payload": "{\"gtin\": \"08904063200057\", \"brand\": \"Haldiram Snacks\", \"name\": \"Haldiram's Khatta Meetha\"}",
    "product_name": "Haldiram's Khatta Meetha",
    "brand": "Haldiram Snacks",
    "serving_size": "35 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Deep-fried mixture of gram flour sev, peanuts, rice flakes, and refined sugar.",
    "per_100g": {
      "energy_kcal": 520,
      "energy_kj": 2176,
      "sugars_g": 14.0,
      "saturated_fat_g": 12.0,
      "salt_g": 1.4,
      "sodium_mg": 560,
      "fibre_g": 4.0,
      "protein_g": 9.0,
      "fat_g": 29.0,
      "carbs_g": 55.0
    },
    "ingredients": [
      "Chickpea Flour",
      "Edible Vegetable Oil (Palmolein)",
      "Sugar (14%)",
      "Rice Flakes",
      "Peanuts",
      "Green Peas",
      "Common Salt",
      "Mango Powder"
    ],
    "allergens_stated": [
      "Peanuts"
    ],
    "healthier_alternatives": [
      {
        "name": "Trail Mix (Walnuts, Seeds, Raisins)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural sweetness from dried fruit without refined white cane sugar",
        "savings": "No palm oil, natural fructose",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_4700bc_popcorn",
    "barcode": "8906059630012",
    "qr_code_url": "https://id.gs1.org/01/08906059630012",
    "qr_payload": "{\"gtin\": \"08906059630012\", \"brand\": \"Zea Maize\", \"name\": \"4700BC Gourmet Butter Popcorn\"}",
    "product_name": "4700BC Gourmet Butter Popcorn",
    "brand": "Zea Maize",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Popped corn kernels coated in butter oil and sea salt.",
    "per_100g": {
      "energy_kcal": 490,
      "energy_kj": 2050,
      "sugars_g": 1.0,
      "saturated_fat_g": 10.0,
      "salt_g": 1.5,
      "sodium_mg": 600,
      "fibre_g": 7.0,
      "protein_g": 7.5,
      "fat_g": 24.0,
      "carbs_g": 58.0
    },
    "ingredients": [
      "Corn (65%)",
      "Edible Vegetable Oil",
      "Butter (7%)",
      "Salt",
      "Antioxidant 319"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Air-Popped Corn with Pink Salt",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "100% whole grain with near zero saturated fats",
        "savings": "-70% fat",
        "target_id": "prod_act2_popcorn"
      }
    ]
  },
  {
    "id": "prod_act2_popcorn",
    "barcode": "027000412154",
    "qr_code_url": "https://id.gs1.org/01/00027000412154",
    "qr_payload": "{\"gtin\": \"00027000412154\", \"brand\": \"ConAgra Foods\", \"name\": \"Act II Microwave Popcorn Natural\"}",
    "product_name": "Act II Microwave Popcorn Natural",
    "brand": "ConAgra Foods",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Lightly salted whole grain popping corn. Good source of natural insoluble fiber.",
    "per_100g": {
      "energy_kcal": 410,
      "energy_kj": 1715,
      "sugars_g": 0.5,
      "saturated_fat_g": 4.0,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 10.0,
      "protein_g": 9.0,
      "fat_g": 12.0,
      "carbs_g": 64.0
    },
    "ingredients": [
      "Popping Corn (85%)",
      "Palm Oil",
      "Salt"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Roasted Lotus Seeds (Makhana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Low glycemic ancient snack roasted in cold-pressed oil",
        "savings": "Zero palm oil",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_farmley_makhana",
    "barcode": "8906123450012",
    "qr_code_url": "https://id.gs1.org/01/08906123450012",
    "qr_payload": "{\"gtin\": \"08906123450012\", \"brand\": \"Conn\\u5fc3 Health\", \"name\": \"Farmley Roasted Makhana (Salt & Pepper)\"}",
    "product_name": "Farmley Roasted Makhana (Salt & Pepper)",
    "brand": "Conn\u5fc3 Health",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Slow-roasted fox nuts seasoned with Himalayan pink salt and black pepper. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 360,
      "energy_kj": 1506,
      "sugars_g": 0.0,
      "saturated_fat_g": 1.5,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 8.0,
      "protein_g": 9.5,
      "fat_g": 6.0,
      "carbs_g": 66.0
    },
    "ingredients": [
      "Fox Nuts (Makhana) (90%)",
      "Olive Oil",
      "Himalayan Pink Salt",
      "Black Pepper"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Raw Popped Plain Makhana",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Dry roasted without any oil",
        "savings": "Zero oil, lowest calories",
        "target_id": "prod_plain_makhana"
      }
    ]
  },
  {
    "id": "prod_true_pumpkin",
    "barcode": "8906076430015",
    "qr_code_url": "https://id.gs1.org/01/08906076430015",
    "qr_payload": "{\"gtin\": \"08906076430015\", \"brand\": \"True Elements\", \"name\": \"True Elements Roasted Pumpkin Seeds\"}",
    "product_name": "True Elements Roasted Pumpkin Seeds",
    "brand": "True Elements",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Crunchy lightly salted pepitas packed with zinc, magnesium, and plant protein.",
    "per_100g": {
      "energy_kcal": 560,
      "energy_kj": 2343,
      "sugars_g": 1.0,
      "saturated_fat_g": 8.5,
      "salt_g": 0.4,
      "sodium_mg": 160,
      "fibre_g": 6.5,
      "protein_g": 30.0,
      "fat_g": 45.0,
      "carbs_g": 10.0
    },
    "ingredients": [
      "Pumpkin Seeds (98%)",
      "Rock Salt",
      "Natural Rosemary Extract"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Raw Organic Chia Seeds",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Rich in Omega-3 alpha-linolenic acid",
        "savings": "Higher omega-3",
        "target_id": "prod_raw_chia"
      }
    ]
  },
  {
    "id": "prod_tong_cashews",
    "barcode": "8888001000018",
    "qr_code_url": "https://id.gs1.org/01/08888001000018",
    "qr_payload": "{\"gtin\": \"08888001000018\", \"brand\": \"Tong Garden\", \"name\": \"Tong Garden Salted Cashews\"}",
    "product_name": "Tong Garden Salted Cashews",
    "brand": "Tong Garden",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Crispy roasted cashew nuts lightly salted with sea salt.",
    "per_100g": {
      "energy_kcal": 590,
      "energy_kj": 2469,
      "sugars_g": 5.0,
      "saturated_fat_g": 9.0,
      "salt_g": 0.9,
      "sodium_mg": 360,
      "fibre_g": 3.5,
      "protein_g": 18.0,
      "fat_g": 46.0,
      "carbs_g": 26.0
    },
    "ingredients": [
      "Cashews (96%)",
      "Vegetable Oil",
      "Salt"
    ],
    "allergens_stated": [
      "Cashews"
    ],
    "healthier_alternatives": [
      {
        "name": "Raw California Walnuts",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Significantly higher polyunsaturated Omega-3 fatty acids",
        "savings": "+9g Omega-3 ALA",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_natureland_chana",
    "barcode": "8906074120017",
    "qr_code_url": "https://id.gs1.org/01/08906074120017",
    "qr_payload": "{\"gtin\": \"08906074120017\", \"brand\": \"Natureland Organics\", \"name\": \"Natureland Organic Roasted Chana\"}",
    "product_name": "Natureland Organic Roasted Chana",
    "brand": "Natureland Organics",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Traditional Indian roasted chickpeas with outer skin. Extremely high in soluble fiber and protein.",
    "per_100g": {
      "energy_kcal": 380,
      "energy_kj": 1590,
      "sugars_g": 2.0,
      "saturated_fat_g": 0.8,
      "salt_g": 0.2,
      "sodium_mg": 80,
      "fibre_g": 18.0,
      "protein_g": 21.0,
      "fat_g": 5.5,
      "carbs_g": 58.0
    },
    "ingredients": [
      "Organic Roasted Bengal Gram with Skin (100%)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong Dal",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Live bioactive enzymes from sprouting",
        "savings": "Zero dry heat processing",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_tooyumm_veggie",
    "barcode": "8906090570018",
    "qr_code_url": "https://id.gs1.org/01/08906090570018",
    "qr_payload": "{\"gtin\": \"08906090570018\", \"brand\": \"RPSG FMCG\", \"name\": \"Too Yumm! Multigrain Veggie Stix\"}",
    "product_name": "Too Yumm! Multigrain Veggie Stix",
    "brand": "RPSG FMCG",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Baked snack made from rice, corn, wheat, and ragi flours.",
    "per_100g": {
      "energy_kcal": 450,
      "energy_kj": 1883,
      "sugars_g": 4.5,
      "saturated_fat_g": 4.5,
      "salt_g": 1.6,
      "sodium_mg": 640,
      "fibre_g": 5.0,
      "protein_g": 7.0,
      "fat_g": 15.0,
      "carbs_g": 68.0
    },
    "ingredients": [
      "Rice Flour",
      "Corn Flour",
      "Wheat Flour",
      "Edible Vegetable Oil (Sunflower)",
      "Ragi Flour (5%)",
      "Seasoning (Salt, Spices, Tomato Powder, Sugar)"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Makhana (Lotus Seeds)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Single-ingredient whole seed without grain flour blends",
        "savings": "-60% fat",
        "target_id": "prod_farmley_makhana"
      }
    ]
  },
  {
    "id": "prod_cornitos",
    "barcode": "8906013830014",
    "qr_code_url": "https://id.gs1.org/01/08906013830014",
    "qr_payload": "{\"gtin\": \"08906013830014\", \"brand\": \"Greendot Health\", \"name\": \"Cornitos Nacho Crisps Cheese & Herbs\"}",
    "product_name": "Cornitos Nacho Crisps Cheese & Herbs",
    "brand": "Greendot Health",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Non-GMO corn cooked in corn oil with cheese seasoning.",
    "per_100g": {
      "energy_kcal": 510,
      "energy_kj": 2134,
      "sugars_g": 3.0,
      "saturated_fat_g": 4.5,
      "salt_g": 1.5,
      "sodium_mg": 600,
      "fibre_g": 4.5,
      "protein_g": 7.5,
      "fat_g": 26.0,
      "carbs_g": 62.0
    },
    "ingredients": [
      "Corn (70%)",
      "Corn Oil",
      "Seasoning (Maltodextrin, Milk Solids, Salt, Dehydrated Onion & Garlic, Spices, Citric Acid)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Air-Popped Popcorn with Herbs",
        "category": "natural",
        "nutri_grade": "B",
        "reason": "Whole grain corn with zero added maltodextrin",
        "savings": "-65% fat",
        "target_id": "prod_act2_popcorn"
      }
    ]
  },
  {
    "id": "prod_sunbites",
    "barcode": "9310015243015",
    "qr_code_url": "https://id.gs1.org/01/09310015243015",
    "qr_payload": "{\"gtin\": \"09310015243015\", \"brand\": \"The Smith's Snackfood\", \"name\": \"Sunbites Grain Waves Sour Cream\"}",
    "product_name": "Sunbites Grain Waves Sour Cream",
    "brand": "The Smith's Snackfood",
    "serving_size": "28 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Snacks & Chips",
    "description": "Wholegrain wave crisps with corn, wheat, and oats. 30% less fat than potato chips.",
    "per_100g": {
      "energy_kcal": 470,
      "energy_kj": 1966,
      "sugars_g": 6.8,
      "saturated_fat_g": 2.5,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 6.2,
      "protein_g": 6.8,
      "fat_g": 19.5,
      "carbs_g": 63.0
    },
    "ingredients": [
      "Wholegrains (67%) (Corn, Wheat, Oats)",
      "Sunflower Oil",
      "Sugar",
      "Rice",
      "Milk Solids",
      "Salt",
      "Onion Powder",
      "Yeast Extract"
    ],
    "allergens_stated": [
      "Wheat",
      "Oats",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Bengal Gram (Chana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Significantly higher protein and zero added sugar",
        "savings": "Zero added sugar, 21g protein",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_oats",
    "barcode": "030000010408",
    "qr_code_url": "https://id.gs1.org/01/00030000010408",
    "qr_payload": "{\"gtin\": \"00030000010408\", \"brand\": \"Quaker Oats (PepsiCo)\", \"name\": \"Quaker Rolled White Oats\"}",
    "product_name": "Quaker Rolled White Oats",
    "brand": "Quaker Oats (PepsiCo)",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "100% whole grain rolled oats with beta-glucan soluble dietary fiber. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 389,
      "energy_kj": 1628,
      "sugars_g": 1.0,
      "saturated_fat_g": 1.2,
      "salt_g": 0.01,
      "sodium_mg": 4,
      "fibre_g": 10.6,
      "protein_g": 16.9,
      "fat_g": 6.9,
      "carbs_g": 66.3
    },
    "ingredients": [
      "100% Whole Grain Rolled Oats"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Steel Cut Irish Oats",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Even lower glycemic impact and zero rolling heat",
        "savings": "Lowest GI",
        "target_id": "prod_bobs_steel_oats"
      }
    ]
  },
  {
    "id": "prod_cornflakes",
    "barcode": "038000001109",
    "qr_code_url": "https://id.gs1.org/01/00038000001109",
    "qr_payload": "{\"gtin\": \"00038000001109\", \"brand\": \"Kellogg Company\", \"name\": \"Kellogg's Corn Flakes Original\"}",
    "product_name": "Kellogg's Corn Flakes Original",
    "brand": "Kellogg Company",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Milled toasted corn flakes with added barley malt, white cane sugar, and high sodium.",
    "per_100g": {
      "energy_kcal": 378,
      "energy_kj": 1582,
      "sugars_g": 8.0,
      "saturated_fat_g": 0.2,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 3.0,
      "protein_g": 7.0,
      "fat_g": 0.9,
      "carbs_g": 84.0
    },
    "ingredients": [
      "Milled Corn",
      "Sugar",
      "Malt Flavouring (Barley)",
      "High Fructose Corn Syrup",
      "Salt",
      "Iron",
      "Niacinamide",
      "Vitamin B6",
      "Vitamin B2"
    ],
    "allergens_stated": [
      "Barley"
    ],
    "healthier_alternatives": [
      {
        "name": "Rolled White Oats",
        "brand": "Quaker",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "3x more dietary fiber and zero added sugars or malt extracts",
        "savings": "-7g sugar, +7.6g fiber",
        "target_id": "prod_oats"
      },
      {
        "name": "Tata Soulfull Ragi Flakes",
        "brand": "Tata Consumer",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Ancient finger millet rich in calcium and iron",
        "savings": "+10x calcium, low GI",
        "target_id": "prod_soulfull_ragi"
      }
    ]
  },
  {
    "id": "prod_chocos",
    "barcode": "8901499008015",
    "qr_code_url": "https://id.gs1.org/01/08901499008015",
    "qr_payload": "{\"gtin\": \"08901499008015\", \"brand\": \"Kellogg India\", \"name\": \"Kellogg's Chocos\"}",
    "product_name": "Kellogg's Chocos",
    "brand": "Kellogg India",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Sugar-coated chocolate wheat scoops marketed to kids with 30% added sugar and maltodextrin.",
    "per_100g": {
      "energy_kcal": 388,
      "energy_kj": 1623,
      "sugars_g": 29.5,
      "saturated_fat_g": 1.1,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 5.0,
      "protein_g": 7.5,
      "fat_g": 3.0,
      "carbs_g": 81.0
    },
    "ingredients": [
      "Whole Wheat Flour (29%)",
      "Wheat Flour (29%)",
      "Sugar (29.5%)",
      "Cocoa Solids (5.5%)",
      "Invert Sugar",
      "Edible Vegetable Oil",
      "Maltodextrin",
      "Calcium Carbonate"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Rolled Oats with Unsweetened Cacao",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Rich chocolate flavor from natural cocoa with zero added sugar",
        "savings": "-29g refined sugar per 100g",
        "target_id": "prod_oats"
      },
      {
        "name": "Ragi Flakes with Honey",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Finger millet provides 350mg natural calcium",
        "savings": "No invert syrup or maltodextrin",
        "target_id": "prod_soulfull_ragi"
      }
    ]
  },
  {
    "id": "prod_koko_krunch",
    "barcode": "8901058852394",
    "qr_code_url": "https://id.gs1.org/01/08901058852394",
    "qr_payload": "{\"gtin\": \"08901058852394\", \"brand\": \"Nestle\", \"name\": \"Nestle Koko Krunch\"}",
    "product_name": "Nestle Koko Krunch",
    "brand": "Nestle",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Chocolate wheat curls with 28% sugar, glucose syrup, and palm oil.",
    "per_100g": {
      "energy_kcal": 385,
      "energy_kj": 1611,
      "sugars_g": 28.0,
      "saturated_fat_g": 1.2,
      "salt_g": 0.45,
      "sodium_mg": 180,
      "fibre_g": 6.5,
      "protein_g": 7.8,
      "fat_g": 3.2,
      "carbs_g": 78.0
    },
    "ingredients": [
      "Whole Grain Wheat (37%)",
      "Wheat Flour",
      "Sugar",
      "Cocoa Powder",
      "Barley Malt Extract",
      "Palm Oil",
      "Glucose Syrup",
      "Emulsifier E322"
    ],
    "allergens_stated": [
      "Wheat",
      "Barley",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Grain Oats with Berries",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Antioxidant rich whole oats with zero refined sugars",
        "savings": "-26g sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_special_k",
    "barcode": "038000016110",
    "qr_code_url": "https://id.gs1.org/01/00038000016110",
    "qr_payload": "{\"gtin\": \"00038000016110\", \"brand\": \"Kellogg Company\", \"name\": \"Kellogg's Special K Original\"}",
    "product_name": "Kellogg's Special K Original",
    "brand": "Kellogg Company",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Rice and wheat flakes promoted for weight loss, yet containing 13g sugar per 100g.",
    "per_100g": {
      "energy_kcal": 380,
      "energy_kj": 1590,
      "sugars_g": 13.0,
      "saturated_fat_g": 0.3,
      "salt_g": 1.1,
      "sodium_mg": 440,
      "fibre_g": 3.5,
      "protein_g": 14.0,
      "fat_g": 1.5,
      "carbs_g": 76.0
    },
    "ingredients": [
      "Rice",
      "Wheat Gluten",
      "Sugar",
      "Defatted Wheat Germ",
      "Salt",
      "Barley Malt",
      "Vitamins and Minerals"
    ],
    "allergens_stated": [
      "Wheat",
      "Barley"
    ],
    "healthier_alternatives": [
      {
        "name": "100% Rolled White Oats",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "True complex whole grain with 3x higher natural beta-glucan",
        "savings": "-12g sugar, low glycemic",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_alpen_muesli",
    "barcode": "5010029000015",
    "qr_code_url": "https://id.gs1.org/01/05010029000015",
    "qr_payload": "{\"gtin\": \"05010029000015\", \"brand\": \"Weetabix\", \"name\": \"Alpen No Added Sugar Swiss Muesli\"}",
    "product_name": "Alpen No Added Sugar Swiss Muesli",
    "brand": "Weetabix",
    "serving_size": "45 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "100% natural wholegrain wheat flakes, rolled oats, raisins, and roasted nuts with zero added sugar.",
    "per_100g": {
      "energy_kcal": 372,
      "energy_kj": 1556,
      "sugars_g": 16.0,
      "saturated_fat_g": 0.9,
      "salt_g": 0.1,
      "sodium_mg": 40,
      "fibre_g": 8.3,
      "protein_g": 11.5,
      "fat_g": 5.8,
      "carbs_g": 64.0
    },
    "ingredients": [
      "Wholegrain Wheat (39%)",
      "Wholegrain Rolled Oats (36%)",
      "Raisins (12%)",
      "Skimmed Milk Powder",
      "Milk Whey Powder",
      "Roasted Sliced Hazelnuts & Almonds (3%)"
    ],
    "allergens_stated": [
      "Wheat",
      "Oats",
      "Milk",
      "Hazelnuts",
      "Almonds"
    ],
    "healthier_alternatives": [
      {
        "name": "Pure Rolled Oats with Chia",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Completely nut-free option for allergy sufferers",
        "savings": "Zero nut allergens",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_bagrrys_muesli",
    "barcode": "8906001020014",
    "qr_code_url": "https://id.gs1.org/01/08906001020014",
    "qr_payload": "{\"gtin\": \"08906001020014\", \"brand\": \"Bagrry's India\", \"name\": \"Bagrry's Crunchy Muesli\"}",
    "product_name": "Bagrry's Crunchy Muesli",
    "brand": "Bagrry's India",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Oats and multigrain flakes baked with honey and raisins.",
    "per_100g": {
      "energy_kcal": 395,
      "energy_kj": 1653,
      "sugars_g": 18.5,
      "saturated_fat_g": 1.5,
      "salt_g": 0.3,
      "sodium_mg": 120,
      "fibre_g": 7.0,
      "protein_g": 8.5,
      "fat_g": 6.5,
      "carbs_g": 72.0
    },
    "ingredients": [
      "Rolled Oats (34%)",
      "Whole Wheat Flakes (28%)",
      "Invert Syrup",
      "Raisins (8%)",
      "Wheat Bran",
      "Almonds (3%)",
      "Honey (2%)",
      "Liquid Glucose"
    ],
    "allergens_stated": [
      "Wheat",
      "Oats",
      "Almonds"
    ],
    "healthier_alternatives": [
      {
        "name": "Plain Steel Cut Oats with Dates",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "No liquid glucose or invert sugar syrup",
        "savings": "Zero refined syrups",
        "target_id": "prod_bobs_steel_oats"
      }
    ]
  },
  {
    "id": "prod_soulfull_ragi",
    "barcode": "8906059630043",
    "qr_code_url": "https://id.gs1.org/01/08906059630043",
    "qr_payload": "{\"gtin\": \"08906059630043\", \"brand\": \"Tata Consumer\", \"name\": \"Tata Soulfull Ragi Flakes\"}",
    "product_name": "Tata Soulfull Ragi Flakes",
    "brand": "Tata Consumer",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Finger millet (Ragi) flakes loaded with natural calcium, dietary fiber, and jaggery. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 370,
      "energy_kj": 1548,
      "sugars_g": 6.5,
      "saturated_fat_g": 0.4,
      "salt_g": 0.2,
      "sodium_mg": 80,
      "fibre_g": 9.5,
      "protein_g": 8.0,
      "fat_g": 1.8,
      "carbs_g": 78.0
    },
    "ingredients": [
      "Ragi (Finger Millet) (70%)",
      "Rice Flakes",
      "Jaggery (6%)",
      "Cocoa Powder",
      "Salt"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Whole Grain Foxtail Millet",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Completely zero added sweeteners",
        "savings": "0g added sugar",
        "target_id": "prod_foxtail_millet"
      }
    ]
  },
  {
    "id": "prod_foxtail_millet",
    "barcode": "8904083500014",
    "qr_code_url": "https://id.gs1.org/01/08904083500014",
    "qr_payload": "{\"gtin\": \"08904083500014\", \"brand\": \"Sresta Natural\", \"name\": \"24 Mantra Organic Foxtail Millet\"}",
    "product_name": "24 Mantra Organic Foxtail Millet",
    "brand": "Sresta Natural",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "100% organic unpolished foxtail millet grain. Very low glycemic index, gluten-free, and high protein.",
    "per_100g": {
      "energy_kcal": 351,
      "energy_kj": 1469,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.6,
      "salt_g": 0.01,
      "sodium_mg": 5,
      "fibre_g": 8.0,
      "protein_g": 12.3,
      "fat_g": 3.5,
      "carbs_g": 60.9
    },
    "ingredients": [
      "100% Organic Unpolished Foxtail Millet Grain"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Organic Ragi Grain",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Exceptional calcium content for bone density",
        "savings": "350mg calcium per 100g",
        "target_id": "prod_raw_ragi"
      }
    ]
  },
  {
    "id": "prod_natures_heritage",
    "barcode": "058449770014",
    "qr_code_url": "https://id.gs1.org/01/00058449770014",
    "qr_payload": "{\"gtin\": \"00058449770014\", \"brand\": \"Nature's Path\", \"name\": \"Nature's Path Organic Heritage Flakes\"}",
    "product_name": "Nature's Path Organic Heritage Flakes",
    "brand": "Nature's Path",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Ancient grains blend of Kamut Khorasan, spelt, quinoa, millet, and oats.",
    "per_100g": {
      "energy_kcal": 375,
      "energy_kj": 1569,
      "sugars_g": 10.0,
      "saturated_fat_g": 0.3,
      "salt_g": 0.6,
      "sodium_mg": 240,
      "fibre_g": 12.5,
      "protein_g": 12.5,
      "fat_g": 2.5,
      "carbs_g": 75.0
    },
    "ingredients": [
      "Kamut Khorasan Wheat Flakes",
      "Wheat Bran",
      "Whole Wheat Meal",
      "Cane Sugar",
      "Spelt Flakes",
      "Barley Flour",
      "Whole Millet",
      "Oat Flour",
      "Honey",
      "Quinoa",
      "Sea Salt"
    ],
    "allergens_stated": [
      "Wheat",
      "Kamut",
      "Spelt",
      "Barley",
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Pure Rolled White Oats",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Zero added cane sugar or honey",
        "savings": "-10g sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_bobs_steel_oats",
    "barcode": "039978001511",
    "qr_code_url": "https://id.gs1.org/01/00039978001511",
    "qr_payload": "{\"gtin\": \"00039978001511\", \"brand\": \"Bob's Red Mill\", \"name\": \"Bob's Red Mill Steel Cut Oats\"}",
    "product_name": "Bob's Red Mill Steel Cut Oats",
    "brand": "Bob's Red Mill",
    "serving_size": "45 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Whole oat groats cleanly cut into neat pieces. Slow-digesting complex carbs with lowest GI.",
    "per_100g": {
      "energy_kcal": 380,
      "energy_kj": 1590,
      "sugars_g": 0.8,
      "saturated_fat_g": 1.1,
      "salt_g": 0.01,
      "sodium_mg": 2,
      "fibre_g": 10.0,
      "protein_g": 15.0,
      "fat_g": 6.5,
      "carbs_g": 68.0
    },
    "ingredients": [
      "Whole Grain Oats"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Organic Chia Seed Topping",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Adds soluble mucilage fiber and omega-3",
        "savings": "+5g omega-3",
        "target_id": "prod_raw_chia"
      }
    ]
  },
  {
    "id": "prod_weetabix",
    "barcode": "5010029222226",
    "qr_code_url": "https://id.gs1.org/01/05010029222226",
    "qr_payload": "{\"gtin\": \"05010029222226\", \"brand\": \"Weetabix\", \"name\": \"Weetabix Whole Grain Cereal\"}",
    "product_name": "Weetabix Whole Grain Cereal",
    "brand": "Weetabix",
    "serving_size": "38 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "95% whole grain wheat compressed into biscuits. Low sugar and very high fiber.",
    "per_100g": {
      "energy_kcal": 362,
      "energy_kj": 1515,
      "sugars_g": 4.2,
      "saturated_fat_g": 0.4,
      "salt_g": 0.28,
      "sodium_mg": 112,
      "fibre_g": 10.0,
      "protein_g": 12.0,
      "fat_g": 2.0,
      "carbs_g": 69.0
    },
    "ingredients": [
      "Wholegrain Wheat (95%)",
      "Malted Barley Extract",
      "Sugar",
      "Salt",
      "Niacin",
      "Iron",
      "Thiamin (B1)"
    ],
    "allergens_stated": [
      "Wheat",
      "Barley"
    ],
    "healthier_alternatives": [
      {
        "name": "100% Rolled White Oats",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "No malt extract or sugar",
        "savings": "-4g sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_slurrp_millet_dosa",
    "barcode": "8906112340019",
    "qr_code_url": "https://id.gs1.org/01/08906112340019",
    "qr_payload": "{\"gtin\": \"08906112340019\", \"brand\": \"Slurrp Farm\", \"name\": \"Slurrp Farm Millet Dosa Mix\"}",
    "product_name": "Slurrp Farm Millet Dosa Mix",
    "brand": "Slurrp Farm",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Nutritious instant pancake mix made from oats, ragi, and urad dal with beetroot.",
    "per_100g": {
      "energy_kcal": 365,
      "energy_kj": 1527,
      "sugars_g": 2.0,
      "saturated_fat_g": 0.8,
      "salt_g": 0.9,
      "sodium_mg": 360,
      "fibre_g": 8.5,
      "protein_g": 11.0,
      "fat_g": 3.0,
      "carbs_g": 70.0
    },
    "ingredients": [
      "Oats (35%)",
      "Ragi (Finger Millet 25%)",
      "Urad Dal",
      "Red Rice",
      "Beetroot Powder",
      "Salt",
      "Fenugreek",
      "Curry Leaves"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong Dosa (Pesarattu)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole legume batter with 24g natural protein",
        "savings": "Higher protein",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_bagrrys_white_oats",
    "barcode": "8906001020021",
    "qr_code_url": "https://id.gs1.org/01/08906001020021",
    "qr_payload": "{\"gtin\": \"08906001020021\", \"brand\": \"Bagrry's India\", \"name\": \"Bagrry's White Oats\"}",
    "product_name": "Bagrry's White Oats",
    "brand": "Bagrry's India",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "100% natural wholegrain quick-cooking oats. Great daily breakfast fiber.",
    "per_100g": {
      "energy_kcal": 390,
      "energy_kj": 1632,
      "sugars_g": 0.8,
      "saturated_fat_g": 1.2,
      "salt_g": 0.01,
      "sodium_mg": 3,
      "fibre_g": 10.2,
      "protein_g": 14.5,
      "fat_g": 7.0,
      "carbs_g": 67.0
    },
    "ingredients": [
      "100% Wholegrain Oats"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Organic Steel Cut Oats",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Less processing and lower glycemic index",
        "savings": "Lowest processing",
        "target_id": "prod_bobs_steel_oats"
      }
    ]
  },
  {
    "id": "prod_true_oats_chia",
    "barcode": "8906076430022",
    "qr_code_url": "https://id.gs1.org/01/08906076430022",
    "qr_payload": "{\"gtin\": \"08906076430022\", \"brand\": \"True Elements\", \"name\": \"True Elements Rolled Oats with Chia\"}",
    "product_name": "True Elements Rolled Oats with Chia",
    "brand": "True Elements",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Breakfast Cereals",
    "description": "Whole rolled oats blended with raw chia seeds and cranberries. High omega-3 and fiber.",
    "per_100g": {
      "energy_kcal": 395,
      "energy_kj": 1653,
      "sugars_g": 4.5,
      "saturated_fat_g": 1.4,
      "salt_g": 0.05,
      "sodium_mg": 20,
      "fibre_g": 12.0,
      "protein_g": 15.0,
      "fat_g": 8.5,
      "carbs_g": 62.0
    },
    "ingredients": [
      "Rolled Oats (85%)",
      "Chia Seeds (10%)",
      "Dried Cranberries (5%)"
    ],
    "allergens_stated": [
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Pure Rolled Oats + Fresh Berries",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Fresh berries have no added cane sugar",
        "savings": "No added sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_parleg",
    "barcode": "8901719101038",
    "qr_code_url": "https://id.gs1.org/01/08901719101038",
    "qr_payload": "{\"gtin\": \"08901719101038\", \"brand\": \"Parle Products\", \"name\": \"Parle-G Glucose Biscuits\"}",
    "product_name": "Parle-G Glucose Biscuits",
    "brand": "Parle Products",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "World's most sold glucose biscuit made with refined wheat flour, sugar, and palm oil.",
    "per_100g": {
      "energy_kcal": 464,
      "energy_kj": 1941,
      "sugars_g": 26.5,
      "saturated_fat_g": 6.5,
      "salt_g": 0.7,
      "sodium_mg": 280,
      "fibre_g": 1.5,
      "protein_g": 6.5,
      "fat_g": 14.5,
      "carbs_g": 77.0
    },
    "ingredients": [
      "Refined Wheat Flour (Maida 67%)",
      "Sugar (26.5%)",
      "Edible Vegetable Oil (Palm Oil)",
      "Invert Sugar Syrup",
      "Raising Agents (503(ii), 500(ii))",
      "Salt",
      "Milk Solids",
      "Artificial Vanilla Flavour"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "NutriChoice 5 Grain Digestive",
        "brand": "Britannia",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Whole wheat and oats with 3x higher fiber",
        "savings": "+4.5g fiber, lower sugar",
        "target_id": "prod_nutrichoice_5grain"
      },
      {
        "name": "Roasted Bengal Gram (Chana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Nutritious crunchy snack with zero added sugar or palm oil",
        "savings": "-26g sugar, 21g protein",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_oreo",
    "barcode": "044000032029",
    "qr_code_url": "https://id.gs1.org/01/00044000032029",
    "qr_payload": "{\"gtin\": \"00044000032029\", \"brand\": \"Mondelez\", \"name\": \"Oreo Classic Sandwich Cookies\"}",
    "product_name": "Oreo Classic Sandwich Cookies",
    "brand": "Mondelez",
    "serving_size": "34 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Chocolate sandwich cookies filled with sweet vanilla creme made from palm oil and high fructose corn syrup.",
    "per_100g": {
      "energy_kcal": 482,
      "energy_kj": 2017,
      "sugars_g": 38.0,
      "saturated_fat_g": 9.5,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 2.5,
      "protein_g": 4.5,
      "fat_g": 20.0,
      "carbs_g": 71.0
    },
    "ingredients": [
      "Sugar (38%)",
      "Unbleached Enriched Flour",
      "Palm Oil",
      "Cocoa (Processed with Alkali)",
      "High Fructose Corn Syrup",
      "Leavening",
      "Salt",
      "Soy Lecithin",
      "Vanillin"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Lotus Biscoff",
        "brand": "Lotus",
        "category": "packaged",
        "nutri_grade": "D",
        "reason": "No high-fructose corn syrup",
        "savings": "No HFCS",
        "target_id": "prod_biscoff"
      },
      {
        "name": "Medjool Dates with Almonds",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural caramel-like sweetness with potassium and fiber",
        "savings": "Zero refined white sugar",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_oreo_golden",
    "barcode": "044000032036",
    "qr_code_url": "https://id.gs1.org/01/00044000032036",
    "qr_payload": "{\"gtin\": \"00044000032036\", \"brand\": \"Mondelez\", \"name\": \"Oreo Golden Vanilla\"}",
    "product_name": "Oreo Golden Vanilla",
    "brand": "Mondelez",
    "serving_size": "34 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Vanilla sandwich cookies with sweet cream filling, high in saturated fats and refined sugars.",
    "per_100g": {
      "energy_kcal": 490,
      "energy_kj": 2050,
      "sugars_g": 36.0,
      "saturated_fat_g": 8.0,
      "salt_g": 0.7,
      "sodium_mg": 280,
      "fibre_g": 1.2,
      "protein_g": 4.0,
      "fat_g": 21.0,
      "carbs_g": 71.0
    },
    "ingredients": [
      "Enriched Flour",
      "Sugar",
      "Palm Oil",
      "High Fructose Corn Syrup",
      "Salt",
      "Baking Soda",
      "Soy Lecithin",
      "Artificial Flavour"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Digestive Biscuits",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Higher whole wheat content and less cream fat",
        "savings": "-50% saturated fat",
        "target_id": "prod_mcvities_digestive"
      }
    ]
  },
  {
    "id": "prod_good_day",
    "barcode": "8901063012011",
    "qr_code_url": "https://id.gs1.org/01/08901063012011",
    "qr_payload": "{\"gtin\": \"08901063012011\", \"brand\": \"Britannia\", \"name\": \"Britannia Good Day Butter\"}",
    "product_name": "Britannia Good Day Butter",
    "brand": "Britannia",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Rich butter cookies made with refined flour, 23% sugar, palm oil, and synthetic butter flavouring.",
    "per_100g": {
      "energy_kcal": 495,
      "energy_kj": 2071,
      "sugars_g": 23.0,
      "saturated_fat_g": 11.5,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 1.8,
      "protein_g": 6.8,
      "fat_g": 22.0,
      "carbs_g": 68.0
    },
    "ingredients": [
      "Refined Wheat Flour (Maida 58%)",
      "Sugar (23%)",
      "Edible Vegetable Oil (Palm)",
      "Butter (2%)",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Raising Agents (503(ii), 500(ii))",
      "Salt"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Marie Gold Biscuits",
        "brand": "Britannia",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Significantly lower fat and lighter tea biscuit",
        "savings": "-60% saturated fat",
        "target_id": "prod_marie_gold"
      }
    ]
  },
  {
    "id": "prod_bourbon",
    "barcode": "8901063012028",
    "qr_code_url": "https://id.gs1.org/01/08901063012028",
    "qr_payload": "{\"gtin\": \"08901063012028\", \"brand\": \"Britannia\", \"name\": \"Britannia Bourbon Chocolate\"}",
    "product_name": "Britannia Bourbon Chocolate",
    "brand": "Britannia",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Chocolate cream biscuits topped with sugar crystals. High in simple sucrose and palm fat.",
    "per_100g": {
      "energy_kcal": 490,
      "energy_kj": 2050,
      "sugars_g": 37.0,
      "saturated_fat_g": 10.0,
      "salt_g": 0.6,
      "sodium_mg": 240,
      "fibre_g": 2.0,
      "protein_g": 5.5,
      "fat_g": 21.0,
      "carbs_g": 70.0
    },
    "ingredients": [
      "Refined Wheat Flour",
      "Sugar (37%)",
      "Edible Vegetable Oil (Palm)",
      "Cocoa Solids (4.5%)",
      "Invert Sugar",
      "Milk Solids",
      "Raising Agents",
      "Emulsifiers 322"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "75% Dark Chocolate Square",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Real cocoa polyphenols without palm oil filling",
        "savings": "Zero palm oil, rich flavonoids",
        "target_id": "prod_amul_dark"
      }
    ]
  },
  {
    "id": "prod_mcvities_digestive",
    "barcode": "5000168001019",
    "qr_code_url": "https://id.gs1.org/01/05000168001019",
    "qr_payload": "{\"gtin\": \"05000168001019\", \"brand\": \"pladis\", \"name\": \"McVitie's Original Digestive\"}",
    "product_name": "McVitie's Original Digestive",
    "brand": "pladis",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Traditional British digestive biscuits with 54% wholewheat flour. Classic tea dunking biscuit.",
    "per_100g": {
      "energy_kcal": 471,
      "energy_kj": 1971,
      "sugars_g": 16.5,
      "saturated_fat_g": 8.0,
      "salt_g": 1.3,
      "sodium_mg": 520,
      "fibre_g": 3.6,
      "protein_g": 7.1,
      "fat_g": 20.5,
      "carbs_g": 62.5
    },
    "ingredients": [
      "Flour (Wheat Flour, Calcium, Iron, Niacin, Thiamin)",
      "Wholemeal Wheat Flour (24%)",
      "Vegetable Oil (Palm)",
      "Sugar",
      "Partially Inverted Sugar Syrup",
      "Raising Agents",
      "Salt"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "NutriChoice 5 Grain Digestive",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Higher multgrain fiber from oats and ragi",
        "savings": "+3g fiber",
        "target_id": "prod_nutrichoice_5grain"
      }
    ]
  },
  {
    "id": "prod_mcvities_hobnobs",
    "barcode": "5000168001026",
    "qr_code_url": "https://id.gs1.org/01/05000168001026",
    "qr_payload": "{\"gtin\": \"05000168001026\", \"brand\": \"pladis\", \"name\": \"McVitie's Hobnobs Oaty Biscuits\"}",
    "product_name": "McVitie's Hobnobs Oaty Biscuits",
    "brand": "pladis",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Crunchy rolled oat biscuits with golden syrup and whole wheat.",
    "per_100g": {
      "energy_kcal": 465,
      "energy_kj": 1946,
      "sugars_g": 24.0,
      "saturated_fat_g": 8.5,
      "salt_g": 1.4,
      "sodium_mg": 560,
      "fibre_g": 5.0,
      "protein_g": 7.5,
      "fat_g": 20.0,
      "carbs_g": 62.0
    },
    "ingredients": [
      "Rolled Oats (38%)",
      "Wholemeal Wheat Flour (24%)",
      "Vegetable Oil (Palm)",
      "Sugar",
      "Partially Inverted Sugar Syrup",
      "Raising Agents",
      "Salt"
    ],
    "allergens_stated": [
      "Wheat",
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Rolled Oats Porridge with Cinnamon",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole oats with zero added palm oil or golden syrup",
        "savings": "-23g sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_biscoff",
    "barcode": "5410126006957",
    "qr_code_url": "https://id.gs1.org/01/05410126006957",
    "qr_payload": "{\"gtin\": \"05410126006957\", \"brand\": \"Lotus Bakeries\", \"name\": \"Lotus Biscoff Speculoos Biscuits\"}",
    "product_name": "Lotus Biscoff Speculoos Biscuits",
    "brand": "Lotus Bakeries",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Original caramelised biscuits with candy sugar syrup and cinnamon.",
    "per_100g": {
      "energy_kcal": 484,
      "energy_kj": 2032,
      "sugars_g": 31.5,
      "saturated_fat_g": 8.0,
      "salt_g": 0.92,
      "sodium_mg": 368,
      "fibre_g": 1.3,
      "protein_g": 4.9,
      "fat_g": 19.0,
      "carbs_g": 72.6
    },
    "ingredients": [
      "Wheat Flour",
      "Sugar",
      "Vegetable Oils (Palm, Rapeseed)",
      "Candy Sugar Syrup",
      "Raising Agent (Sodium Hydrogen Carbonate)",
      "Soy Flour",
      "Salt",
      "Cinnamon"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Wheat Cinnamon Toast",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Freshly toasted whole grains with pure Ceylon cinnamon",
        "savings": "-25g sugar",
        "target_id": "prod_weetabix"
      }
    ]
  },
  {
    "id": "prod_dark_fantasy",
    "barcode": "8901725181239",
    "qr_code_url": "https://id.gs1.org/01/08901725181239",
    "qr_payload": "{\"gtin\": \"08901725181239\", \"brand\": \"ITC\", \"name\": \"Sunfeast Dark Fantasy Choco Fills\"}",
    "product_name": "Sunfeast Dark Fantasy Choco Fills",
    "brand": "ITC",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Indulgent cookie with molten liquid chocolate cream filling inside a dark crust.",
    "per_100g": {
      "energy_kcal": 512,
      "energy_kj": 2142,
      "sugars_g": 36.0,
      "saturated_fat_g": 13.0,
      "salt_g": 0.7,
      "sodium_mg": 280,
      "fibre_g": 2.2,
      "protein_g": 5.5,
      "fat_g": 26.5,
      "carbs_g": 63.0
    },
    "ingredients": [
      "Choco Creme (38%) (Sugar, Hydrogenated Vegetable Oil, Cocoa Solids, Emulsifier 322)",
      "Refined Wheat Flour",
      "Hydrogenated Vegetable Fat (Palm)",
      "Sugar",
      "Invert Syrup"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "75% Amul Dark Chocolate",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Real cocoa butter without hydrogenated vegetable fats",
        "savings": "No trans fats or palm oils",
        "target_id": "prod_amul_dark"
      }
    ]
  },
  {
    "id": "prod_marie_gold",
    "barcode": "8901063012035",
    "qr_code_url": "https://id.gs1.org/01/08901063012035",
    "qr_payload": "{\"gtin\": \"08901063012035\", \"brand\": \"Britannia\", \"name\": \"Britannia Marie Gold\"}",
    "product_name": "Britannia Marie Gold",
    "brand": "Britannia",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Light crisp tea biscuit made with wheat flour, low fat, and fortified with 10 vitamins.",
    "per_100g": {
      "energy_kcal": 440,
      "energy_kj": 1841,
      "sugars_g": 21.0,
      "saturated_fat_g": 4.5,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 2.5,
      "protein_g": 8.0,
      "fat_g": 10.0,
      "carbs_g": 79.0
    },
    "ingredients": [
      "Refined Wheat Flour (Maida 66%)",
      "Sugar (21%)",
      "Edible Vegetable Oil (Palm)",
      "Invert Sugar Syrup",
      "Milk Solids",
      "Raising Agents",
      "Iodised Salt",
      "Vitamins"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "NutriChoice 5 Grain Digestive",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Whole grain blend offering superior dietary fiber",
        "savings": "+3g fiber",
        "target_id": "prod_nutrichoice_5grain"
      }
    ]
  },
  {
    "id": "prod_nutrichoice_5grain",
    "barcode": "8901063012042",
    "qr_code_url": "https://id.gs1.org/01/08901063012042",
    "qr_payload": "{\"gtin\": \"08901063012042\", \"brand\": \"Britannia\", \"name\": \"NutriChoice 5 Grain Digestive\"}",
    "product_name": "NutriChoice 5 Grain Digestive",
    "brand": "Britannia",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Biscuits & Cookies",
    "description": "Wholesome digestive biscuits made with wheat, oats, ragi, corn, and honey.",
    "per_100g": {
      "energy_kcal": 460,
      "energy_kj": 1925,
      "sugars_g": 17.5,
      "saturated_fat_g": 6.5,
      "salt_g": 0.9,
      "sodium_mg": 360,
      "fibre_g": 6.0,
      "protein_g": 8.5,
      "fat_g": 18.0,
      "carbs_g": 66.0
    },
    "ingredients": [
      "Whole Wheat Flour (32%)",
      "Refined Wheat Flour",
      "Oats (10%)",
      "Edible Vegetable Oil (Palm)",
      "Sugar",
      "Ragi Flour (4%)",
      "Corn Flour",
      "Honey",
      "Wheat Bran"
    ],
    "allergens_stated": [
      "Wheat",
      "Oats"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Bengal Gram (Chana)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Zero palm oil with 3x higher protein",
        "savings": "No palm oil, 21g protein",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_ferrero",
    "barcode": "8000500003787",
    "qr_code_url": "https://id.gs1.org/01/08000500003787",
    "qr_payload": "{\"gtin\": \"08000500003787\", \"brand\": \"Ferrero\", \"name\": \"Ferrero Rocher Hazelnut Pralines\"}",
    "product_name": "Ferrero Rocher Hazelnut Pralines",
    "brand": "Ferrero",
    "serving_size": "37 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Crisp hazelnut and milk chocolate pralines with a whole roasted hazelnut heart.",
    "per_100g": {
      "energy_kcal": 595,
      "energy_kj": 2489,
      "sugars_g": 39.9,
      "saturated_fat_g": 14.1,
      "salt_g": 0.15,
      "sodium_mg": 60,
      "fibre_g": 3.5,
      "protein_g": 8.2,
      "fat_g": 42.7,
      "carbs_g": 44.4
    },
    "ingredients": [
      "Milk Chocolate (30%)",
      "Hazelnuts (28.5%)",
      "Palm Oil",
      "Wheat Flour",
      "Whey Powder (Milk)",
      "Fat-Reduced Cocoa",
      "Emulsifier (Soya Lecithin)",
      "Vanillin"
    ],
    "allergens_stated": [
      "Hazelnuts",
      "Milk",
      "Wheat",
      "Soya"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Hazelnuts with Dark Chocolate (85%)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole hazelnuts paired with polyphenol-rich dark chocolate with zero palm oil",
        "savings": "-70% sugar, no palm oil",
        "target_id": "prod_lindt_85"
      }
    ]
  },
  {
    "id": "prod_cadbury_dairy_milk",
    "barcode": "7622210286015",
    "qr_code_url": "https://id.gs1.org/01/07622210286015",
    "qr_payload": "{\"gtin\": \"07622210286015\", \"brand\": \"Mondelez\", \"name\": \"Cadbury Dairy Milk Chocolate\"}",
    "product_name": "Cadbury Dairy Milk Chocolate",
    "brand": "Mondelez",
    "serving_size": "40 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Classic British milk chocolate made with a glass and a half of fresh milk, sugar, and cocoa butter.",
    "per_100g": {
      "energy_kcal": 534,
      "energy_kj": 2234,
      "sugars_g": 57.0,
      "saturated_fat_g": 18.5,
      "salt_g": 0.24,
      "sodium_mg": 96,
      "fibre_g": 2.1,
      "protein_g": 7.3,
      "fat_g": 30.5,
      "carbs_g": 57.0
    },
    "ingredients": [
      "Milk Solids (20%)",
      "Sugar (57%)",
      "Cocoa Butter",
      "Cocoa Mass",
      "Vegetable Fats (Palm, Shea)",
      "Emulsifiers (E442, E476)",
      "Flavourings"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Amul 75% Dark Chocolate",
        "brand": "Amul",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "High cocoa content with less than half the sugar and zero vegetable fat fillers",
        "savings": "-32g sugar, no palm fat",
        "target_id": "prod_amul_dark"
      },
      {
        "name": "Raw California Walnuts",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Omega-3 powerhouse with zero refined sugars",
        "savings": "No sucrose spikes",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_amul_dark",
    "barcode": "8901262020014",
    "qr_code_url": "https://id.gs1.org/01/08901262020014",
    "qr_payload": "{\"gtin\": \"08901262020014\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul 75% Dark Chocolate\"}",
    "product_name": "Amul 75% Dark Chocolate",
    "brand": "Amul (GCMMF)",
    "serving_size": "35 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Rich bitter-sweet chocolate with 75% cocoa solids and zero milk fat. Rich in flavanols.",
    "per_100g": {
      "energy_kcal": 550,
      "energy_kj": 2301,
      "sugars_g": 24.0,
      "saturated_fat_g": 22.0,
      "salt_g": 0.05,
      "sodium_mg": 20,
      "fibre_g": 8.0,
      "protein_g": 8.0,
      "fat_g": 38.0,
      "carbs_g": 42.0
    },
    "ingredients": [
      "Cocoa Solids (75%)",
      "Sugar (24%)",
      "Cocoa Butter",
      "Permitted Emulsifiers (E322, E476)"
    ],
    "allergens_stated": [
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Lindt Excellence 85% Dark",
        "brand": "Lindt",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Even lower sugar (14g) and intense cocoa bean roast",
        "savings": "-10g sugar",
        "target_id": "prod_lindt_85"
      }
    ]
  },
  {
    "id": "prod_lindt_85",
    "barcode": "7610400010018",
    "qr_code_url": "https://id.gs1.org/01/07610400010018",
    "qr_payload": "{\"gtin\": \"07610400010018\", \"brand\": \"Lindt & Spr\\u00fcngli\", \"name\": \"Lindt Excellence 85% Cocoa Dark\"}",
    "product_name": "Lindt Excellence 85% Cocoa Dark",
    "brand": "Lindt & Spr\u00fcngli",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Master chocolatier dark chocolate with 85% cocoa. Extra low sugar and high antioxidant load.",
    "per_100g": {
      "energy_kcal": 584,
      "energy_kj": 2443,
      "sugars_g": 14.0,
      "saturated_fat_g": 31.0,
      "salt_g": 0.08,
      "sodium_mg": 32,
      "fibre_g": 11.0,
      "protein_g": 11.0,
      "fat_g": 46.0,
      "carbs_g": 22.0
    },
    "ingredients": [
      "Cocoa Mass",
      "Fat-Reduced Cocoa Powder",
      "Cocoa Butter",
      "Demerara Sugar",
      "Natural Bourbon Vanilla Beans"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Raw Cacao Nibs with Dates",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Unprocessed raw cacao beans naturally sweetened with fruit",
        "savings": "Zero added sugar",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_snickers",
    "barcode": "040000000011",
    "qr_code_url": "https://id.gs1.org/01/00040000000011",
    "qr_payload": "{\"gtin\": \"00040000000011\", \"brand\": \"Mars Inc.\", \"name\": \"Snickers Peanut Caramel Bar\"}",
    "product_name": "Snickers Peanut Caramel Bar",
    "brand": "Mars Inc.",
    "serving_size": "48 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Milk chocolate bar packed with roasted peanuts, nougat, and sticky caramel.",
    "per_100g": {
      "energy_kcal": 490,
      "energy_kj": 2050,
      "sugars_g": 51.0,
      "saturated_fat_g": 10.0,
      "salt_g": 0.55,
      "sodium_mg": 220,
      "fibre_g": 3.0,
      "protein_g": 8.5,
      "fat_g": 26.0,
      "carbs_g": 60.0
    },
    "ingredients": [
      "Milk Chocolate (Sugar, Cocoa Butter, Chocolate, Skim Milk, Lactose, Milkfat, Soy Lecithin)",
      "Peanuts",
      "Corn Syrup",
      "Sugar",
      "Palm Oil",
      "Skim Milk",
      "Lactose",
      "Salt",
      "Egg Whites"
    ],
    "allergens_stated": [
      "Peanuts",
      "Milk",
      "Soy",
      "Egg"
    ],
    "healthier_alternatives": [
      {
        "name": "All Natural 100% Peanut Butter on Whole Grain Toast",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Pure roasted peanuts with zero corn syrup or palm oil",
        "savings": "-45g sugar, no corn syrup",
        "target_id": "prod_pintola_pb"
      },
      {
        "name": "Roasted Peanuts with Sea Salt",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole legumes without caramel or confectionery sugar",
        "savings": "Zero confectionery sugars",
        "target_id": "prod_natureland_chana"
      }
    ]
  },
  {
    "id": "prod_kitkat",
    "barcode": "7613035390014",
    "qr_code_url": "https://id.gs1.org/01/07613035390014",
    "qr_payload": "{\"gtin\": \"07613035390014\", \"brand\": \"Nestle\", \"name\": \"KitKat 4-Finger Crisp Wafer\"}",
    "product_name": "KitKat 4-Finger Crisp Wafer",
    "brand": "Nestle",
    "serving_size": "41.5 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Crisp wafer fingers coated with smooth milk chocolate.",
    "per_100g": {
      "energy_kcal": 518,
      "energy_kj": 2167,
      "sugars_g": 45.0,
      "saturated_fat_g": 15.0,
      "salt_g": 0.24,
      "sodium_mg": 96,
      "fibre_g": 2.0,
      "protein_g": 6.5,
      "fat_g": 27.5,
      "carbs_g": 61.0
    },
    "ingredients": [
      "Sugar (45%)",
      "Wheat Flour",
      "Skimmed Milk Powder",
      "Cocoa Mass",
      "Cocoa Butter",
      "Vegetable Fats (Palm, Shea)",
      "Butterfat (Milk)",
      "Emulsifier (Sunflower Lecithin)",
      "Yeast"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Amul 75% Dark Chocolate",
        "category": "packaged",
        "nutri_grade": "C",
        "reason": "Rich cocoa antioxidants with significantly lower glycemic impact",
        "savings": "-21g sugar, no palm oil",
        "target_id": "prod_amul_dark"
      }
    ]
  },
  {
    "id": "prod_mars",
    "barcode": "5000159461122",
    "qr_code_url": "https://id.gs1.org/01/05000159461122",
    "qr_payload": "{\"gtin\": \"05000159461122\", \"brand\": \"Mars Inc.\", \"name\": \"Mars Nougat & Caramel Bar\"}",
    "product_name": "Mars Nougat & Caramel Bar",
    "brand": "Mars Inc.",
    "serving_size": "51 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Milk chocolate with soft nougat and caramel centre. Excessively high simple sugar content.",
    "per_100g": {
      "energy_kcal": 448,
      "energy_kj": 1874,
      "sugars_g": 59.5,
      "saturated_fat_g": 7.8,
      "salt_g": 0.42,
      "sodium_mg": 168,
      "fibre_g": 1.2,
      "protein_g": 3.8,
      "fat_g": 16.7,
      "carbs_g": 69.3
    },
    "ingredients": [
      "Sugar (59.5%)",
      "Glucose Syrup",
      "Skimmed Milk Powder",
      "Cocoa Butter",
      "Cocoa Mass",
      "Sunflower Oil",
      "Milk Fat",
      "Palm Fat",
      "Barley Malt Extract",
      "Egg White Powder"
    ],
    "allergens_stated": [
      "Milk",
      "Barley",
      "Egg",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Medjool Dates with Almond Butter",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Natural fruit caramel with healthy plant proteins and fiber",
        "savings": "Zero refined corn syrup",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_twix",
    "barcode": "040000422080",
    "qr_code_url": "https://id.gs1.org/01/00040000422080",
    "qr_payload": "{\"gtin\": \"00040000422080\", \"brand\": \"Mars Inc.\", \"name\": \"Twix Caramel Cookie Bar\"}",
    "product_name": "Twix Caramel Cookie Bar",
    "brand": "Mars Inc.",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Crispy biscuit topped with smooth caramel and covered in milk chocolate.",
    "per_100g": {
      "energy_kcal": 502,
      "energy_kj": 2100,
      "sugars_g": 48.0,
      "saturated_fat_g": 14.0,
      "salt_g": 0.4,
      "sodium_mg": 160,
      "fibre_g": 1.5,
      "protein_g": 4.8,
      "fat_g": 24.0,
      "carbs_g": 65.0
    },
    "ingredients": [
      "Milk Chocolate",
      "Wheat Flour",
      "Sugar",
      "Palm Oil",
      "Glucose Syrup",
      "Skimmed Milk Powder",
      "Cocoa Powder",
      "Salt",
      "Soya Lecithin"
    ],
    "allergens_stated": [
      "Wheat",
      "Milk",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Oat & Cacao Bars",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Wholesome rolled oats bound with date paste",
        "savings": "-40g sugar",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_mms_peanut",
    "barcode": "040000000028",
    "qr_code_url": "https://id.gs1.org/01/00040000000028",
    "qr_payload": "{\"gtin\": \"00040000000028\", \"brand\": \"Mars Inc.\", \"name\": \"M&M's Peanut Chocolate Candies\"}",
    "product_name": "M&M's Peanut Chocolate Candies",
    "brand": "Mars Inc.",
    "serving_size": "45 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Confectionery",
    "description": "Roasted peanuts in milk chocolate encased in colourful sugar shells (dyes E129, E133, E110).",
    "per_100g": {
      "energy_kcal": 511,
      "energy_kj": 2138,
      "sugars_g": 53.0,
      "saturated_fat_g": 10.5,
      "salt_g": 0.16,
      "sodium_mg": 64,
      "fibre_g": 3.8,
      "protein_g": 9.8,
      "fat_g": 26.0,
      "carbs_g": 59.0
    },
    "ingredients": [
      "Milk Chocolate",
      "Peanuts",
      "Sugar",
      "Cornstarch",
      "Palm Oil",
      "Corn Syrup",
      "Dextrin",
      "Colours (E133, E129, E110, E102, E132)",
      "Carnauba Wax"
    ],
    "allergens_stated": [
      "Peanuts",
      "Milk",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Roasted Peanuts with 85% Dark Chocolate",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole peanuts with cocoa and zero azo food dyes",
        "savings": "No artificial food dyes",
        "target_id": "prod_lindt_85"
      }
    ]
  },
  {
    "id": "prod_nutella",
    "barcode": "8000500179864",
    "qr_code_url": "https://id.gs1.org/01/08000500179864",
    "qr_payload": "{\"gtin\": \"08000500179864\", \"brand\": \"Ferrero\", \"name\": \"Nutella Hazelnut Spread\"}",
    "product_name": "Nutella Hazelnut Spread",
    "brand": "Ferrero",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Popular sweet spread composed of 56% refined sugar and palm oil with only 13% hazelnuts.",
    "per_100g": {
      "energy_kcal": 539,
      "energy_kj": 2252,
      "sugars_g": 56.3,
      "saturated_fat_g": 10.6,
      "salt_g": 0.1,
      "sodium_mg": 40,
      "fibre_g": 3.0,
      "protein_g": 6.3,
      "fat_g": 30.9,
      "carbs_g": 57.5
    },
    "ingredients": [
      "Sugar (56%)",
      "Palm Oil (20%)",
      "Hazelnuts (13%)",
      "Skimmed Milk Powder (8.7%)",
      "Fat-Reduced Cocoa (7.4%)",
      "Emulsifier: Lecithins (Soya)",
      "Vanillin"
    ],
    "allergens_stated": [
      "Hazelnuts",
      "Milk",
      "Soya"
    ],
    "healthier_alternatives": [
      {
        "name": "Pintola 100% Organic Peanut Butter",
        "brand": "Pintola",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Single ingredient: 100% roasted peanuts. Zero palm oil, zero sugar.",
        "savings": "-56g sugar, 30g protein vs 6g",
        "target_id": "prod_pintola_pb"
      },
      {
        "name": "Homemade Hazelnut Butter (Raw)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Pure stone-ground hazelnuts with zero palm oil or sucrose",
        "savings": "Zero added palm oil",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_pintola_pb",
    "barcode": "8906103450013",
    "qr_code_url": "https://id.gs1.org/01/08906103450013",
    "qr_payload": "{\"gtin\": \"08906103450013\", \"brand\": \"Pintola\", \"name\": \"Pintola 100% Natural Peanut Butter\"}",
    "product_name": "Pintola 100% Natural Peanut Butter",
    "brand": "Pintola",
    "serving_size": "32 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "100% pure roasted peanuts with zero added sugar, hydrogenated oils, or salt. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 625,
      "energy_kj": 2615,
      "sugars_g": 6.0,
      "saturated_fat_g": 6.5,
      "salt_g": 0.02,
      "sodium_mg": 8,
      "fibre_g": 8.0,
      "protein_g": 30.0,
      "fat_g": 50.0,
      "carbs_g": 16.0
    },
    "ingredients": [
      "100% Roasted Peanuts"
    ],
    "allergens_stated": [
      "Peanuts"
    ],
    "healthier_alternatives": [
      {
        "name": "Raw Walnut Halves",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Alternative tree nut for peanut-sensitive individuals",
        "savings": "Peanut-free omega 3",
        "target_id": "prod_raw_walnuts"
      }
    ]
  },
  {
    "id": "prod_skippy_pb",
    "barcode": "037600110715",
    "qr_code_url": "https://id.gs1.org/01/00037600110715",
    "qr_payload": "{\"gtin\": \"00037600110715\", \"brand\": \"Hormel Foods\", \"name\": \"Skippy Creamy Peanut Butter\"}",
    "product_name": "Skippy Creamy Peanut Butter",
    "brand": "Hormel Foods",
    "serving_size": "32 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Processed peanut butter blended with hydrogenated vegetable oils and added cane sugar.",
    "per_100g": {
      "energy_kcal": 594,
      "energy_kj": 2485,
      "sugars_g": 9.4,
      "saturated_fat_g": 9.4,
      "salt_g": 1.1,
      "sodium_mg": 440,
      "fibre_g": 6.2,
      "protein_g": 21.9,
      "fat_g": 50.0,
      "carbs_g": 21.9
    },
    "ingredients": [
      "Roasted Peanuts",
      "Sugar",
      "Hydrogenated Vegetable Oils (Cottonseed, Soybean, Rapeseed)",
      "Salt"
    ],
    "allergens_stated": [
      "Peanuts",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Pintola 100% Natural Peanut Butter",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Zero hydrogenated vegetable oils or added sugar",
        "savings": "No trans fat oils, no added sugar",
        "target_id": "prod_pintola_pb"
      }
    ]
  },
  {
    "id": "prod_kissan_jam",
    "barcode": "8901030010012",
    "qr_code_url": "https://id.gs1.org/01/08901030010012",
    "qr_payload": "{\"gtin\": \"08901030010012\", \"brand\": \"Hindustan Unilever\", \"name\": \"Kissan Mixed Fruit Jam\"}",
    "product_name": "Kissan Mixed Fruit Jam",
    "brand": "Hindustan Unilever",
    "serving_size": "20 g",
    "is_beverage": false,
    "fruit_veg_pct": 45,
    "category": "Spreads & Condiments",
    "description": "Sweet table jam prepared with fruit pulp, liquid glucose, citric acid, and red food dye E122.",
    "per_100g": {
      "energy_kcal": 285,
      "energy_kj": 1192,
      "sugars_g": 68.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.05,
      "sodium_mg": 20,
      "fibre_g": 0.8,
      "protein_g": 0.4,
      "fat_g": 0.0,
      "carbs_g": 71.0
    },
    "ingredients": [
      "Sugar (68%)",
      "Mixed Fruit Pulp (45%)",
      "Thickener (E440)",
      "Acidity Regulator (E330)",
      "Synthetic Food Colour (E122)",
      "Class II Preservative (E211)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Homemade Chia Berry Spread",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Fresh crushed berries gelled with chia seeds with zero cane sugar",
        "savings": "-65g sugar per 100g",
        "target_id": "prod_raw_chia"
      }
    ]
  },
  {
    "id": "prod_heinz_ketchup",
    "barcode": "013000006058",
    "qr_code_url": "https://id.gs1.org/01/00013000006058",
    "qr_payload": "{\"gtin\": \"00013000006058\", \"brand\": \"Kraft Heinz\", \"name\": \"Heinz Tomato Ketchup\"}",
    "product_name": "Heinz Tomato Ketchup",
    "brand": "Kraft Heinz",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 70,
    "category": "Spreads & Condiments",
    "description": "Classic tomato condiment containing high fructose corn syrup and distilled vinegar.",
    "per_100g": {
      "energy_kcal": 102,
      "energy_kj": 427,
      "sugars_g": 22.8,
      "saturated_fat_g": 0.1,
      "salt_g": 1.8,
      "sodium_mg": 720,
      "fibre_g": 1.5,
      "protein_g": 1.2,
      "fat_g": 0.1,
      "carbs_g": 23.2
    },
    "ingredients": [
      "Tomato Concentrate from Red Ripe Tomatoes",
      "Distilled Vinegar",
      "High Fructose Corn Syrup",
      "Corn Syrup",
      "Salt",
      "Spice",
      "Onion Powder",
      "Natural Flavouring"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Tomato Salsa with Lime & Cilantro",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Crushed fresh tomatoes with garlic, lime, and zero corn syrup",
        "savings": "-20g sugar, zero syrups"
      }
    ]
  },
  {
    "id": "prod_hellmanns_mayo",
    "barcode": "048001213485",
    "qr_code_url": "https://id.gs1.org/01/00048001213485",
    "qr_payload": "{\"gtin\": \"00048001213485\", \"brand\": \"Unilever\", \"name\": \"Hellmann's Real Mayonnaise\"}",
    "product_name": "Hellmann's Real Mayonnaise",
    "brand": "Unilever",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Emulsion of soybean oil, egg yolks, vinegar, and calcium disodium EDTA E385.",
    "per_100g": {
      "energy_kcal": 680,
      "energy_kj": 2845,
      "sugars_g": 1.5,
      "saturated_fat_g": 11.5,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 0.0,
      "protein_g": 1.0,
      "fat_g": 75.0,
      "carbs_g": 2.5
    },
    "ingredients": [
      "Soybean Oil",
      "Water",
      "Whole Eggs and Egg Yolks",
      "Vinegar",
      "Salt",
      "Sugar",
      "Lemon Juice Concentrate",
      "Calcium Disodium EDTA"
    ],
    "allergens_stated": [
      "Egg"
    ],
    "healthier_alternatives": [
      {
        "name": "Greek Yogurt Garlic Dip (Tzatziki)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "High protein strained yogurt with garlic and cucumber",
        "savings": "-70g fat, 10g protein",
        "target_id": "prod_epigamia_greek"
      }
    ]
  },
  {
    "id": "prod_dabur_honey",
    "barcode": "8901207000019",
    "qr_code_url": "https://id.gs1.org/01/08901207000019",
    "qr_payload": "{\"gtin\": \"08901207000019\", \"brand\": \"Dabur\", \"name\": \"Dabur 100% Pure Honey\"}",
    "product_name": "Dabur 100% Pure Honey",
    "brand": "Dabur",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Natural honey filtered and tested against C4/sugar syrup adulteration.",
    "per_100g": {
      "energy_kcal": 320,
      "energy_kj": 1339,
      "sugars_g": 80.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.02,
      "sodium_mg": 8,
      "fibre_g": 0.2,
      "protein_g": 0.3,
      "fat_g": 0.0,
      "carbs_g": 80.0
    },
    "ingredients": [
      "100% Pure Honey"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Whole Fruit (Banana/Apple)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Whole cellular matrix slows fructose absorption",
        "savings": "+3g fiber",
        "target_id": "prod_raw_orange"
      }
    ]
  },
  {
    "id": "prod_hersheys_syrup",
    "barcode": "034000003152",
    "qr_code_url": "https://id.gs1.org/01/00034000003152",
    "qr_payload": "{\"gtin\": \"00034000003152\", \"brand\": \"The Hershey Company\", \"name\": \"Hershey's Chocolate Syrup\"}",
    "product_name": "Hershey's Chocolate Syrup",
    "brand": "The Hershey Company",
    "serving_size": "20 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Dessert topping composed of high fructose corn syrup, water, cocoa, and potassium sorbate.",
    "per_100g": {
      "energy_kcal": 260,
      "energy_kj": 1088,
      "sugars_g": 50.0,
      "saturated_fat_g": 0.5,
      "salt_g": 0.25,
      "sodium_mg": 100,
      "fibre_g": 2.5,
      "protein_g": 2.0,
      "fat_g": 1.0,
      "carbs_g": 62.0
    },
    "ingredients": [
      "High Fructose Corn Syrup",
      "Corn Syrup",
      "Water",
      "Cocoa (Processed with Alkali)",
      "Sugar",
      "Potassium Sorbate",
      "Salt",
      "Emulsifier (E471)",
      "Xanthan Gum",
      "Vanillin"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Raw Cacao blended with Warm Oat Milk",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Pure antioxidant flavanols without HFCS",
        "savings": "No high fructose corn syrup",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_bega_cheese_spread",
    "barcode": "9310047200017",
    "qr_code_url": "https://id.gs1.org/01/09310047200017",
    "qr_payload": "{\"gtin\": \"09310047200017\", \"brand\": \"Bega Cheese\", \"name\": \"Bega Cream Cheese Spread\"}",
    "product_name": "Bega Cream Cheese Spread",
    "brand": "Bega Cheese",
    "serving_size": "20 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "Processed cheddar cheese spread with mineral emulsifying salts (339, 452).",
    "per_100g": {
      "energy_kcal": 310,
      "energy_kj": 1297,
      "sugars_g": 2.5,
      "saturated_fat_g": 17.5,
      "salt_g": 2.8,
      "sodium_mg": 1120,
      "fibre_g": 0.0,
      "protein_g": 11.5,
      "fat_g": 27.0,
      "carbs_g": 4.5
    },
    "ingredients": [
      "Cheese (Milk, Salt, Starter Culture, Rennet)",
      "Water",
      "Butter",
      "Milk Solids",
      "Mineral Salts (339, 452)",
      "Salt",
      "Preservative (200)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Traditional Fresh Hummus",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Heart healthy monounsaturated fat from tahini and chickpeas",
        "savings": "-70% saturated fat, high fiber",
        "target_id": "prod_alwadi_tahini"
      }
    ]
  },
  {
    "id": "prod_alwadi_tahini",
    "barcode": "5281001000018",
    "qr_code_url": "https://id.gs1.org/01/05281001000018",
    "qr_payload": "{\"gtin\": \"05281001000018\", \"brand\": \"Al Wadi Al Akhdar\", \"name\": \"Al Wadi 100% Sesame Tahini\"}",
    "product_name": "Al Wadi 100% Sesame Tahini",
    "brand": "Al Wadi Al Akhdar",
    "serving_size": "20 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Spreads & Condiments",
    "description": "100% pure hulled, roasted and ground sesame seed paste. Packed with calcium and copper.",
    "per_100g": {
      "energy_kcal": 640,
      "energy_kj": 2678,
      "sugars_g": 0.5,
      "saturated_fat_g": 8.0,
      "salt_g": 0.05,
      "sodium_mg": 20,
      "fibre_g": 7.0,
      "protein_g": 24.0,
      "fat_g": 58.0,
      "carbs_g": 12.0
    },
    "ingredients": [
      "100% Pure Ground Sesame Seeds"
    ],
    "allergens_stated": [
      "Sesame"
    ],
    "healthier_alternatives": [
      {
        "name": "Fresh Sprouted Hummus",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Combined with boiled chickpeas for lower caloric density",
        "savings": "Lower calorie density"
      }
    ]
  },
  {
    "id": "prod_epigamia_greek",
    "barcode": "8906073100010",
    "qr_code_url": "https://id.gs1.org/01/08906073100010",
    "qr_payload": "{\"gtin\": \"08906073100010\", \"brand\": \"Drums Food\", \"name\": \"Epigamia Natural Greek Yogurt\"}",
    "product_name": "Epigamia Natural Greek Yogurt",
    "brand": "Drums Food",
    "serving_size": "100 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Authentic strained cow milk Greek yogurt with 8g natural protein and zero added sugar. Nutri-Score A champion.",
    "per_100g": {
      "energy_kcal": 85,
      "energy_kj": 355,
      "sugars_g": 3.6,
      "saturated_fat_g": 2.2,
      "salt_g": 0.08,
      "sodium_mg": 32,
      "fibre_g": 0.0,
      "protein_g": 8.0,
      "fat_g": 3.5,
      "carbs_g": 4.5
    },
    "ingredients": [
      "Pasteurized Toned Milk",
      "Active Live Cultures (Lactobacillus bulgaricus, Streptococcus thermophilus)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Fresh Dahi (Curd)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Local live bacterial strains with zero industrial packaging",
        "savings": "Zero packaging"
      }
    ]
  },
  {
    "id": "prod_epigamia_mango",
    "barcode": "8906073100027",
    "qr_code_url": "https://id.gs1.org/01/08906073100027",
    "qr_payload": "{\"gtin\": \"08906073100027\", \"brand\": \"Drums Food\", \"name\": \"Epigamia Alphonso Mango Greek Yogurt\"}",
    "product_name": "Epigamia Alphonso Mango Greek Yogurt",
    "brand": "Drums Food",
    "serving_size": "100 g",
    "is_beverage": false,
    "fruit_veg_pct": 15,
    "category": "Dairy & Plant Dairy",
    "description": "Greek yogurt with real Alphonso mango chunk puree and added cane sugar.",
    "per_100g": {
      "energy_kcal": 115,
      "energy_kj": 481,
      "sugars_g": 13.5,
      "saturated_fat_g": 1.8,
      "salt_g": 0.07,
      "sodium_mg": 28,
      "fibre_g": 0.5,
      "protein_g": 6.0,
      "fat_g": 2.8,
      "carbs_g": 16.5
    },
    "ingredients": [
      "Pasteurized Double Toned Milk",
      "Processed Alphonso Mango Pulp (15%)",
      "Sugar (7%)",
      "Pectin (INS 440)",
      "Active Lactic Cultures"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Natural Greek Yogurt with Fresh Mango Chunks",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Add your own fresh fruit to eliminate the 7% added cane sugar",
        "savings": "-10g refined sugar",
        "target_id": "prod_epigamia_greek"
      }
    ]
  },
  {
    "id": "prod_danone_activia",
    "barcode": "3033490004018",
    "qr_code_url": "https://id.gs1.org/01/03033490004018",
    "qr_payload": "{\"gtin\": \"03033490004018\", \"brand\": \"Danone\", \"name\": \"Danone Activia Vanilla Probiotic\"}",
    "product_name": "Danone Activia Vanilla Probiotic",
    "brand": "Danone",
    "serving_size": "125 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Probiotic yogurt with Bifidobacterium lactis CNCM I-2494 and 12g sugar per pot.",
    "per_100g": {
      "energy_kcal": 98,
      "energy_kj": 412,
      "sugars_g": 12.0,
      "saturated_fat_g": 2.0,
      "salt_g": 0.14,
      "sodium_mg": 56,
      "fibre_g": 0.0,
      "protein_g": 4.0,
      "fat_g": 3.2,
      "carbs_g": 13.0
    },
    "ingredients": [
      "Yogurt (Milk)",
      "Sugar",
      "Water",
      "Modified Maize Starch",
      "Vanilla Flavouring",
      "Acidity Regulators",
      "Bifidobacterium lactis"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Plain Unsweetened Greek Yogurt",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Double the protein with zero modified starch or cane sugar",
        "savings": "-12g sugar, 2x protein",
        "target_id": "prod_epigamia_greek"
      }
    ]
  },
  {
    "id": "prod_amul_butter",
    "barcode": "8901262010015",
    "qr_code_url": "https://id.gs1.org/01/08901262010015",
    "qr_payload": "{\"gtin\": \"08901262010015\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul Pasteurized Salted Butter\"}",
    "product_name": "Amul Pasteurized Salted Butter",
    "brand": "Amul (GCMMF)",
    "serving_size": "10 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "India's favorite table butter made with pure milk fat, common salt, and annatto color.",
    "per_100g": {
      "energy_kcal": 720,
      "energy_kj": 3012,
      "sugars_g": 0.0,
      "saturated_fat_g": 52.0,
      "salt_g": 2.5,
      "sodium_mg": 1000,
      "fibre_g": 0.0,
      "protein_g": 0.8,
      "fat_g": 80.0,
      "carbs_g": 0.8
    },
    "ingredients": [
      "Butter (Milk Fat 80%)",
      "Common Salt (2.5%)",
      "Permitted Natural Colour (Annatto)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Pure Extra Virgin Olive Oil",
        "category": "natural",
        "nutri_grade": "C",
        "reason": "Monounsaturated oleic acid replaces dense saturated milk fat",
        "savings": "-75% saturated fat"
      },
      {
        "name": "100% Roasted Peanut Butter",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Plant protein spread rich in heart-healthy unsaturated lipids",
        "savings": "Zero animal saturated fat",
        "target_id": "prod_pintola_pb"
      }
    ]
  },
  {
    "id": "prod_amul_cheese",
    "barcode": "8901262010022",
    "qr_code_url": "https://id.gs1.org/01/08901262010022",
    "qr_payload": "{\"gtin\": \"08901262010022\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul Processed Cheese Slices\"}",
    "product_name": "Amul Processed Cheese Slices",
    "brand": "Amul (GCMMF)",
    "serving_size": "20 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Processed cheddar cheese slices with sodium orthophosphates and common salt.",
    "per_100g": {
      "energy_kcal": 310,
      "energy_kj": 1297,
      "sugars_g": 1.0,
      "saturated_fat_g": 16.0,
      "salt_g": 2.8,
      "sodium_mg": 1120,
      "fibre_g": 0.0,
      "protein_g": 20.0,
      "fat_g": 25.0,
      "carbs_g": 2.0
    },
    "ingredients": [
      "Cheese (Milk, Common Salt, Starter Culture, Microbial Rennet)",
      "Water",
      "Milk Solids",
      "Emulsifiers (INS 331, INS 339)",
      "Iodised Salt",
      "Preservative (INS 200)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Amul Fresh Paneer (Cottage Cheese)",
        "brand": "Amul",
        "category": "packaged",
        "nutri_grade": "B",
        "reason": "Unprocessed fresh curd cheese with zero added emulsifying sodium salts",
        "savings": "-90% sodium (no melting salts)",
        "target_id": "prod_amul_paneer"
      },
      {
        "name": "Organic Firm Tofu",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Zero saturated cholesterol with high soy isoflavones",
        "savings": "-80% saturated fat",
        "target_id": "prod_firm_tofu"
      }
    ]
  },
  {
    "id": "prod_amul_paneer",
    "barcode": "8901262010039",
    "qr_code_url": "https://id.gs1.org/01/08901262010039",
    "qr_payload": "{\"gtin\": \"08901262010039\", \"brand\": \"Amul (GCMMF)\", \"name\": \"Amul Malai Fresh Paneer\"}",
    "product_name": "Amul Malai Fresh Paneer",
    "brand": "Amul (GCMMF)",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Traditional Indian fresh cottage cheese. High in complete milk protein and calcium.",
    "per_100g": {
      "energy_kcal": 290,
      "energy_kj": 1213,
      "sugars_g": 2.0,
      "saturated_fat_g": 14.0,
      "salt_g": 0.1,
      "sodium_mg": 40,
      "fibre_g": 0.0,
      "protein_g": 18.0,
      "fat_g": 22.0,
      "carbs_g": 3.0
    },
    "ingredients": [
      "Milk",
      "Citric Acid"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Organic Firm Tofu",
        "category": "packaged",
        "nutri_grade": "A",
        "reason": "Plant-based alternative with near zero saturated fat",
        "savings": "-80% saturated fat, zero cholesterol",
        "target_id": "prod_firm_tofu"
      }
    ]
  },
  {
    "id": "prod_firm_tofu",
    "barcode": "076371000184",
    "qr_code_url": "https://id.gs1.org/01/00076371000184",
    "qr_payload": "{\"gtin\": \"00076371000184\", \"brand\": \"House Foods\", \"name\": \"House Foods Organic Firm Tofu\"}",
    "product_name": "House Foods Organic Firm Tofu",
    "brand": "House Foods",
    "serving_size": "85 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Non-GMO certified organic firm soy bean curd coagulated with calcium sulfate.",
    "per_100g": {
      "energy_kcal": 80,
      "energy_kj": 335,
      "sugars_g": 0.5,
      "saturated_fat_g": 0.5,
      "salt_g": 0.02,
      "sodium_mg": 10,
      "fibre_g": 1.0,
      "protein_g": 9.0,
      "fat_g": 4.5,
      "carbs_g": 2.0
    },
    "ingredients": [
      "Water",
      "Organic Soybeans",
      "Calcium Sulfate",
      "Magnesium Chloride"
    ],
    "allergens_stated": [
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Sprouted Green Moong Dal",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Soy-free legume protein for soy-sensitive individuals",
        "savings": "Soy-free whole pulse",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_kerrygold_butter",
    "barcode": "5011038000019",
    "qr_code_url": "https://id.gs1.org/01/05011038000019",
    "qr_payload": "{\"gtin\": \"05011038000019\", \"brand\": \"Ornua\", \"name\": \"Kerrygold Pure Irish Butter\"}",
    "product_name": "Kerrygold Pure Irish Butter",
    "brand": "Ornua",
    "serving_size": "10 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Grass-fed golden Irish sweet cream butter with high beta-carotene.",
    "per_100g": {
      "energy_kcal": 740,
      "energy_kj": 3096,
      "sugars_g": 0.6,
      "saturated_fat_g": 54.0,
      "salt_g": 1.8,
      "sodium_mg": 720,
      "fibre_g": 0.0,
      "protein_g": 0.7,
      "fat_g": 82.0,
      "carbs_g": 0.7
    },
    "ingredients": [
      "Pasteurised Cream (Milk)",
      "Salt (1.8%)"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Cold-Pressed Sesame Oil",
        "category": "natural",
        "nutri_grade": "C",
        "reason": "Monounsaturated and polyunsaturated vegetable fat balance",
        "savings": "Zero cholesterol"
      }
    ]
  },
  {
    "id": "prod_philly_cream_cheese",
    "barcode": "021000612239",
    "qr_code_url": "https://id.gs1.org/01/00021000612239",
    "qr_payload": "{\"gtin\": \"00021000612239\", \"brand\": \"Mondelez\", \"name\": \"Philadelphia Original Cream Cheese\"}",
    "product_name": "Philadelphia Original Cream Cheese",
    "brand": "Mondelez",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Classic pasteurized milk and cream spread with carob bean gum.",
    "per_100g": {
      "energy_kcal": 342,
      "energy_kj": 1431,
      "sugars_g": 4.0,
      "saturated_fat_g": 21.0,
      "salt_g": 0.8,
      "sodium_mg": 320,
      "fibre_g": 0.0,
      "protein_g": 6.0,
      "fat_g": 34.0,
      "carbs_g": 4.0
    },
    "ingredients": [
      "Pasteurized Milk and Cream",
      "Salt",
      "Carob Bean Gum",
      "Cheese Culture"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Strained Greek Yogurt Spread (Labneh)",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "3x higher protein with 75% less saturated fat",
        "savings": "-75% fat, 3x protein",
        "target_id": "prod_epigamia_greek"
      }
    ]
  },
  {
    "id": "prod_president_brie",
    "barcode": "3228020100017",
    "qr_code_url": "https://id.gs1.org/01/03228020100017",
    "qr_payload": "{\"gtin\": \"03228020100017\", \"brand\": \"Lactalis\", \"name\": \"President Brie French Soft Cheese\"}",
    "product_name": "President Brie French Soft Cheese",
    "brand": "Lactalis",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Dairy & Plant Dairy",
    "description": "Traditional soft-ripened French cheese with bloomy edible Penicillium candidum rind.",
    "per_100g": {
      "energy_kcal": 304,
      "energy_kj": 1272,
      "sugars_g": 0.5,
      "saturated_fat_g": 18.0,
      "salt_g": 1.4,
      "sodium_mg": 560,
      "fibre_g": 0.0,
      "protein_g": 17.0,
      "fat_g": 26.0,
      "carbs_g": 0.5
    },
    "ingredients": [
      "Pasteurised Cow's Milk",
      "Salt",
      "Lactic Cultures",
      "Microbial Rennet",
      "Penicillium Candidum"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Fresh Paneer (Cottage Cheese)",
        "category": "packaged",
        "nutri_grade": "B",
        "reason": "Low sodium unaged fresh cheese",
        "savings": "-90% sodium",
        "target_id": "prod_amul_paneer"
      }
    ]
  },
  {
    "id": "prod_maggi",
    "barcode": "8901058852318",
    "barcode_aliases": ["8901058862897", "8901058017687", "8901058849492", "8901058852898"],
    "qr_code_url": "https://id.gs1.org/01/08901058852318",
    "qr_payload": "{\"gtin\": \"08901058852318\", \"brand\": \"Nestle India\", \"name\": \"Maggi 2-Minute Masala Noodles\"}",
    "product_name": "Maggi 2-Minute Masala Noodles",
    "brand": "Nestle India",
    "serving_size": "70 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Pre-fried wheat noodles in palm oil with flavor tastemaker containing MSG, hydrolysed peanut protein, and excessive sodium.",
    "per_100g": {
      "energy_kcal": 427,
      "energy_kj": 1787,
      "sugars_g": 2.2,
      "saturated_fat_g": 7.0,
      "salt_g": 2.7,
      "sodium_mg": 1080,
      "fibre_g": 3.6,
      "protein_g": 8.0,
      "fat_g": 15.7,
      "carbs_g": 63.5
    },
    "ingredients": [
      "Refined Wheat Flour (Maida)",
      "Palm Oil",
      "Salt",
      "Wheat Gluten",
      "Mineral (Calcium Carbonate)",
      "Tastemaker (Hydrolysed Groundnut Protein, Mixed Spices, Noodle Powder, Sugar, Flavour Enhancer 635)"
    ],
    "allergens_stated": [
      "Wheat",
      "Peanuts"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Wheat Vegetable Sewian",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Unfried whole durum wheat vermicelli with fresh carrots & peas",
        "savings": "-75% fat, -60% sodium",
        "target_id": "prod_oats"
      },
      {
        "name": "Millet Noodles with Fresh Veggies",
        "category": "packaged",
        "nutri_grade": "B",
        "reason": "Sun-dried ragi & foxtail noodles with zero palm oil frying",
        "savings": "Zero palm oil, lower sodium",
        "target_id": "prod_foxtail_millet"
      }
    ]
  },
  {
    "id": "prod_shin_ramyun",
    "barcode": "031146150604",
    "qr_code_url": "https://id.gs1.org/01/00031146150604",
    "qr_payload": "{\"gtin\": \"00031146150604\", \"brand\": \"Nongshim\", \"name\": \"Nongshim Shin Ramyun Gourmet Spicy\"}",
    "product_name": "Nongshim Shin Ramyun Gourmet Spicy",
    "brand": "Nongshim",
    "serving_size": "120 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Deep-fried ramyun noodles with fiery beef/vegetable broth pack containing extreme sodium (1,790mg).",
    "per_100g": {
      "energy_kcal": 435,
      "energy_kj": 1820,
      "sugars_g": 3.5,
      "saturated_fat_g": 7.5,
      "salt_g": 4.5,
      "sodium_mg": 1790,
      "fibre_g": 3.0,
      "protein_g": 8.5,
      "fat_g": 14.0,
      "carbs_g": 68.0
    },
    "ingredients": [
      "Enriched Wheat Flour",
      "Palm Oil",
      "Potato Starch",
      "Modified Potato Starch",
      "Salt",
      "Hydrolyzed Soy Protein",
      "Beef Extract Powder",
      "Yeast Extract",
      "Disodium Guanylate (E627)",
      "Disodium Inosinate (E631)"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Soba Buckwheat Noodles in Miso Broth",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "100% whole buckwheat noodles with natural fermented miso",
        "savings": "-70% sodium, zero palm oil"
      }
    ]
  },
  {
    "id": "prod_top_ramen",
    "barcode": "8901014000015",
    "qr_code_url": "https://id.gs1.org/01/08901014000015",
    "qr_payload": "{\"gtin\": \"08901014000015\", \"brand\": \"Indo Nissin\", \"name\": \"Nissin Top Ramen Curry\"}",
    "product_name": "Nissin Top Ramen Curry",
    "brand": "Indo Nissin",
    "serving_size": "70 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Fried noodles seasoned with curry spices, palmolein oil, and flavor enhancers 627 and 631.",
    "per_100g": {
      "energy_kcal": 440,
      "energy_kj": 1841,
      "sugars_g": 2.5,
      "saturated_fat_g": 7.5,
      "salt_g": 2.8,
      "sodium_mg": 1120,
      "fibre_g": 3.0,
      "protein_g": 8.0,
      "fat_g": 16.5,
      "carbs_g": 65.0
    },
    "ingredients": [
      "Wheat Flour",
      "Edible Vegetable Oil (Palmolein)",
      "Iodised Salt",
      "Curry Tastemaker (Spices, Salt, Sugar, Hydrolysed Vegetable Protein, Flavour Enhancers 627, 631)"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong & Vegetable Soup",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Clean vegetable broth loaded with live sprouted legumes",
        "savings": "No deep-fried noodles",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_yippee",
    "barcode": "8901725131012",
    "qr_code_url": "https://id.gs1.org/01/08901725131012",
    "qr_payload": "{\"gtin\": \"08901725131012\", \"brand\": \"ITC\", \"name\": \"Sunfeast YiPPee! Magic Masala\"}",
    "product_name": "Sunfeast YiPPee! Magic Masala",
    "brand": "ITC",
    "serving_size": "70 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Round instant noodle block deep-fried in palmolein with dehydrated veggie tastemaker.",
    "per_100g": {
      "energy_kcal": 465,
      "energy_kj": 1946,
      "sugars_g": 3.0,
      "saturated_fat_g": 8.0,
      "salt_g": 2.6,
      "sodium_mg": 1040,
      "fibre_g": 3.2,
      "protein_g": 8.5,
      "fat_g": 19.0,
      "carbs_g": 65.0
    },
    "ingredients": [
      "Wheat Flour",
      "Edible Vegetable Oil (Palmolein)",
      "Salt",
      "Wheat Gluten",
      "Tastemaker (Spices, Salt, Sugar, Dehydrated Vegetables, Hydrolysed Soya Protein, Flavour Enhancers)"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Wheat Noodle Stir-fry",
        "category": "natural",
        "nutri_grade": "B",
        "reason": "Boiled whole wheat noodles with fresh bell peppers and ginger",
        "savings": "-60% saturated fat",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_cup_noodles",
    "barcode": "8901014000022",
    "qr_code_url": "https://id.gs1.org/01/08901014000022",
    "qr_payload": "{\"gtin\": \"08901014000022\", \"brand\": \"Indo Nissin\", \"name\": \"Nissin Cup Noodles Veggie Masala\"}",
    "product_name": "Nissin Cup Noodles Veggie Masala",
    "brand": "Indo Nissin",
    "serving_size": "70 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Portable noodle cup with fried noodles, dried green peas, and spicy broth.",
    "per_100g": {
      "energy_kcal": 430,
      "energy_kj": 1799,
      "sugars_g": 2.8,
      "saturated_fat_g": 7.0,
      "salt_g": 2.9,
      "sodium_mg": 1160,
      "fibre_g": 3.5,
      "protein_g": 8.0,
      "fat_g": 16.0,
      "carbs_g": 63.0
    },
    "ingredients": [
      "Wheat Flour",
      "Palm Oil",
      "Tapioca Starch",
      "Salt",
      "Dehydrated Vegetables (Peas, Carrots)",
      "Monosodium Glutamate"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong Dal Soup",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Fresh protein soup with zero palm oil",
        "savings": "-80% sodium",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_mtr_dal_makhani",
    "barcode": "8901042950016",
    "qr_code_url": "https://id.gs1.org/01/08901042950016",
    "qr_payload": "{\"gtin\": \"08901042950016\", \"brand\": \"MTR Foods\", \"name\": \"MTR Ready-to-Eat Dal Makhani\"}",
    "product_name": "MTR Ready-to-Eat Dal Makhani",
    "brand": "MTR Foods",
    "serving_size": "150 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Retort-pouched black lentils slow-cooked with butter and rich cream.",
    "per_100g": {
      "energy_kcal": 160,
      "energy_kj": 669,
      "sugars_g": 1.5,
      "saturated_fat_g": 4.0,
      "salt_g": 1.1,
      "sodium_mg": 440,
      "fibre_g": 4.5,
      "protein_g": 5.0,
      "fat_g": 8.0,
      "carbs_g": 17.0
    },
    "ingredients": [
      "Water",
      "Black Gram (Urad Dal 19%)",
      "Butter",
      "Tomato Paste",
      "Cream",
      "Ginger",
      "Salt",
      "Red Chilli",
      "Cumin"
    ],
    "allergens_stated": [
      "Milk"
    ],
    "healthier_alternatives": [
      {
        "name": "Home-Cooked Yellow Moong Dal Tadka",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Light cumin and turmeric tempering with zero heavy dairy cream",
        "savings": "-75% saturated fat",
        "target_id": "prod_moong_dal"
      }
    ]
  },
  {
    "id": "prod_mtr_rajma",
    "barcode": "8901042950023",
    "qr_code_url": "https://id.gs1.org/01/08901042950023",
    "qr_payload": "{\"gtin\": \"08901042950023\", \"brand\": \"MTR Foods\", \"name\": \"MTR Ready-to-Eat Rajma Masala\"}",
    "product_name": "MTR Ready-to-Eat Rajma Masala",
    "brand": "MTR Foods",
    "serving_size": "150 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Pouched red kidney beans in spiced onion and tomato gravy. Rich in dietary fiber.",
    "per_100g": {
      "energy_kcal": 135,
      "energy_kj": 565,
      "sugars_g": 2.0,
      "saturated_fat_g": 1.2,
      "salt_g": 1.2,
      "sodium_mg": 480,
      "fibre_g": 5.5,
      "protein_g": 6.0,
      "fat_g": 4.0,
      "carbs_g": 19.0
    },
    "ingredients": [
      "Water",
      "Red Kidney Beans (31%)",
      "Tomato",
      "Onion",
      "Refined Sunflower Oil",
      "Salt",
      "Spices",
      "Ginger",
      "Garlic"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Pressure-Cooked Organic Rajma",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Freshly cooked with half the sodium of commercial retort pouches",
        "savings": "-50% sodium",
        "target_id": "prod_raw_kabuli"
      }
    ]
  },
  {
    "id": "prod_knorr_soup",
    "barcode": "8901030020011",
    "qr_code_url": "https://id.gs1.org/01/08901030020011",
    "qr_payload": "{\"gtin\": \"08901030020011\", \"brand\": \"Unilever\", \"name\": \"Knorr Classic Thick Tomato Soup\"}",
    "product_name": "Knorr Classic Thick Tomato Soup",
    "brand": "Unilever",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 10,
    "category": "Instant Meals & Noodles",
    "description": "Dehydrated soup powder with tomato paste, potato starch, 26% sugar, and E412 thickener.",
    "per_100g": {
      "energy_kcal": 340,
      "energy_kj": 1423,
      "sugars_g": 26.0,
      "saturated_fat_g": 1.0,
      "salt_g": 4.5,
      "sodium_mg": 1800,
      "fibre_g": 3.0,
      "protein_g": 4.5,
      "fat_g": 2.5,
      "carbs_g": 75.0
    },
    "ingredients": [
      "Sugar (26%)",
      "Tomato Paste Solids (20%)",
      "Potato Starch",
      "Refined Wheat Flour",
      "Salt",
      "Thickener (412)",
      "Acidity Regulator (330)",
      "Spices"
    ],
    "allergens_stated": [
      "Wheat"
    ],
    "healthier_alternatives": [
      {
        "name": "Fresh Blended Tomato Basil Soup",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "100% fresh whole tomatoes with garlic and basil, zero white sugar",
        "savings": "-25g sugar, -75% sodium"
      }
    ]
  },
  {
    "id": "prod_wai_wai",
    "barcode": "8906012340018",
    "qr_code_url": "https://id.gs1.org/01/08906012340018",
    "qr_payload": "{\"gtin\": \"08906012340018\", \"brand\": \"CG Corp Global\", \"name\": \"Wai Wai Ready to Eat Noodles\"}",
    "product_name": "Wai Wai Ready to Eat Noodles",
    "brand": "CG Corp Global",
    "serving_size": "70 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Pre-cooked, seasoned, and fried noodles with onion oil and chilli powder packet.",
    "per_100g": {
      "energy_kcal": 470,
      "energy_kj": 1966,
      "sugars_g": 2.0,
      "saturated_fat_g": 9.5,
      "salt_g": 3.0,
      "sodium_mg": 1200,
      "fibre_g": 2.5,
      "protein_g": 8.5,
      "fat_g": 20.0,
      "carbs_g": 64.0
    },
    "ingredients": [
      "Wheat Flour",
      "Edible Vegetable Oil (Palm)",
      "Salt",
      "Chilli",
      "Onion",
      "Garlic",
      "Monosodium Glutamate E621",
      "Soy Sauce Powder"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Whole Wheat Noodles in Vegetable Broth",
        "category": "natural",
        "nutri_grade": "B",
        "reason": "Zero pre-frying with palm oil",
        "savings": "-60% saturated fat",
        "target_id": "prod_oats"
      }
    ]
  },
  {
    "id": "prod_samyang_buldak",
    "barcode": "8801073113428",
    "qr_code_url": "https://id.gs1.org/01/08801073113428",
    "qr_payload": "{\"gtin\": \"08801073113428\", \"brand\": \"Samyang Foods\", \"name\": \"Samyang Buldak 2x Spicy Hot Chicken\"}",
    "product_name": "Samyang Buldak 2x Spicy Hot Chicken",
    "brand": "Samyang Foods",
    "serving_size": "140 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Instant Meals & Noodles",
    "description": "Korean fried ramen famous for extreme habanero capsaicin, palm oil, and high sodium.",
    "per_100g": {
      "energy_kcal": 420,
      "energy_kj": 1757,
      "sugars_g": 7.1,
      "saturated_fat_g": 6.8,
      "salt_g": 3.2,
      "sodium_mg": 1280,
      "fibre_g": 2.5,
      "protein_g": 8.0,
      "fat_g": 14.0,
      "carbs_g": 65.0
    },
    "ingredients": [
      "Wheat Flour",
      "Tapioca Starch",
      "Palm Oil",
      "Wheat Gluten",
      "Soy Sauce",
      "Sugar",
      "Chicken Flavour Powder",
      "Habanero Pepper",
      "Red Pepper Oil",
      "Curry Powder"
    ],
    "allergens_stated": [
      "Wheat",
      "Soy"
    ],
    "healthier_alternatives": [
      {
        "name": "Homemade Kimchi Soba Bowl",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Naturally fermented probiotic kimchi with buckwheat noodles",
        "savings": "-60% sodium, zero palm oil"
      }
    ]
  },
  {
    "id": "prod_moong_dal",
    "barcode": "8904083500021",
    "qr_code_url": "https://id.gs1.org/01/08904083500021",
    "qr_payload": "{\"gtin\": \"08904083500021\", \"brand\": \"24 Mantra\", \"name\": \"Organic Green Moong Dal (Whole)\"}",
    "product_name": "Organic Green Moong Dal (Whole)",
    "brand": "24 Mantra",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "100% organic unpolished whole green gram. Excellent plant protein, potassium, and dietary fiber.",
    "per_100g": {
      "energy_kcal": 347,
      "energy_kj": 1452,
      "sugars_g": 2.0,
      "saturated_fat_g": 0.3,
      "salt_g": 0.01,
      "sodium_mg": 4,
      "fibre_g": 16.0,
      "protein_g": 24.0,
      "fat_g": 1.2,
      "carbs_g": 60.0
    },
    "ingredients": [
      "100% Organic Whole Green Gram (Moong)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Sprouted Moong Salad",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Sprouting triples vitamin C and boosts bioavailable enzymes",
        "savings": "Maximum nutrient density"
      }
    ]
  },
  {
    "id": "prod_raw_ragi",
    "barcode": "8906059630067",
    "qr_code_url": "https://id.gs1.org/01/08906059630067",
    "qr_payload": "{\"gtin\": \"08906059630067\", \"brand\": \"24 Mantra\", \"name\": \"Organic Finger Millet (Ragi Grain)\"}",
    "product_name": "Organic Finger Millet (Ragi Grain)",
    "brand": "24 Mantra",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "100% unpolished finger millet grain. Contains 344mg natural calcium per 100g (30x more than rice).",
    "per_100g": {
      "energy_kcal": 328,
      "energy_kj": 1372,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.4,
      "salt_g": 0.01,
      "sodium_mg": 5,
      "fibre_g": 11.5,
      "protein_g": 7.3,
      "fat_g": 1.3,
      "carbs_g": 72.0
    },
    "ingredients": [
      "100% Organic Finger Millet (Ragi) Grain"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Ragi Malt Porridge",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Traditional bone-strengthening morning drink",
        "savings": "344mg natural calcium"
      }
    ]
  },
  {
    "id": "prod_plain_makhana",
    "barcode": "8906123450029",
    "qr_code_url": "https://id.gs1.org/01/08906123450029",
    "qr_payload": "{\"gtin\": \"08906123450029\", \"brand\": \"Farmley Raw\", \"name\": \"Plain Popped Fox Nuts (Makhana)\"}",
    "product_name": "Plain Popped Fox Nuts (Makhana)",
    "brand": "Farmley Raw",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Raw popped water lily seeds. Zero added oil, zero salt. Very high magnesium and potassium.",
    "per_100g": {
      "energy_kcal": 347,
      "energy_kj": 1452,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.1,
      "salt_g": 0.01,
      "sodium_mg": 3,
      "fibre_g": 7.6,
      "protein_g": 9.7,
      "fat_g": 0.5,
      "carbs_g": 76.0
    },
    "ingredients": [
      "100% Raw Popped Fox Nuts (Euryale Ferox)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Dry Roasted Makhana with Rock Salt",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Crispy satisfying volume snack with near zero calories",
        "savings": "Zero fat"
      }
    ]
  },
  {
    "id": "prod_raw_chia",
    "barcode": "8906076430039",
    "qr_code_url": "https://id.gs1.org/01/08906076430039",
    "qr_payload": "{\"gtin\": \"08906076430039\", \"brand\": \"True Elements\", \"name\": \"Organic Raw Whole Chia Seeds\"}",
    "product_name": "Organic Raw Whole Chia Seeds",
    "brand": "True Elements",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Whole raw chia seeds. Over 30% dietary fiber and 17g Omega-3 ALA fatty acids.",
    "per_100g": {
      "energy_kcal": 486,
      "energy_kj": 2033,
      "sugars_g": 0.8,
      "saturated_fat_g": 3.3,
      "salt_g": 0.04,
      "sodium_mg": 16,
      "fibre_g": 34.4,
      "protein_g": 16.5,
      "fat_g": 30.7,
      "carbs_g": 42.1
    },
    "ingredients": [
      "100% Organic Whole Raw Chia Seeds (Salvia Hispanica)"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Chia Seed Pudding in Almond Milk",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Soluble gel stabilizes post-prandial blood sugar",
        "savings": "34g dietary fiber"
      }
    ]
  },
  {
    "id": "prod_raw_walnuts",
    "barcode": "070662000018",
    "qr_code_url": "https://id.gs1.org/01/00070662000018",
    "qr_payload": "{\"gtin\": \"00070662000018\", \"brand\": \"Diamond Foods\", \"name\": \"Raw California Walnut Halves\"}",
    "product_name": "Raw California Walnut Halves",
    "brand": "Diamond Foods",
    "serving_size": "30 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Whole raw shelled walnut halves. Rich in plant-based omega-3 alpha-linolenic acid (ALA).",
    "per_100g": {
      "energy_kcal": 654,
      "energy_kj": 2736,
      "sugars_g": 2.6,
      "saturated_fat_g": 6.1,
      "salt_g": 0.01,
      "sodium_mg": 2,
      "fibre_g": 6.7,
      "protein_g": 15.2,
      "fat_g": 65.2,
      "carbs_g": 13.7
    },
    "ingredients": [
      "100% Raw California Walnut Halves"
    ],
    "allergens_stated": [
      "Walnuts"
    ],
    "healthier_alternatives": [
      {
        "name": "Chia and Walnut Trail Mix",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Optimal neuro-protective fatty acid profile",
        "savings": "Cardiovascular protective ALA"
      }
    ]
  },
  {
    "id": "prod_raw_pumpkin",
    "barcode": "8906076430046",
    "qr_code_url": "https://id.gs1.org/01/08906076430046",
    "qr_payload": "{\"gtin\": \"08906076430046\", \"brand\": \"True Elements\", \"name\": \"Raw Shelled Pumpkin Seeds (Pepitas)\"}",
    "product_name": "Raw Shelled Pumpkin Seeds (Pepitas)",
    "brand": "True Elements",
    "serving_size": "25 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Green raw pumpkin seed kernels. Dense in bioavailable zinc, magnesium, and phytosterols.",
    "per_100g": {
      "energy_kcal": 559,
      "energy_kj": 2339,
      "sugars_g": 1.4,
      "saturated_fat_g": 8.7,
      "salt_g": 0.02,
      "sodium_mg": 7,
      "fibre_g": 6.0,
      "protein_g": 30.2,
      "fat_g": 49.0,
      "carbs_g": 10.7
    },
    "ingredients": [
      "100% Raw Shelled Pumpkin Seeds"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Lightly Toasted Pepitas with Sea Salt",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Boosts testosterone, immunity, and sleep quality",
        "savings": "Rich bioavailable zinc"
      }
    ]
  },
  {
    "id": "prod_raw_kabuli",
    "barcode": "8904083500038",
    "qr_code_url": "https://id.gs1.org/01/08904083500038",
    "qr_payload": "{\"gtin\": \"08904083500038\", \"brand\": \"24 Mantra\", \"name\": \"Organic Whole Kabuli Chana (Chickpeas)\"}",
    "product_name": "Organic Whole Kabuli Chana (Chickpeas)",
    "brand": "24 Mantra",
    "serving_size": "50 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Whole white chickpeas. Packed with resistant starch, folate, and plant protein.",
    "per_100g": {
      "energy_kcal": 364,
      "energy_kj": 1523,
      "sugars_g": 4.8,
      "saturated_fat_g": 0.6,
      "salt_g": 0.06,
      "sodium_mg": 24,
      "fibre_g": 17.0,
      "protein_g": 19.3,
      "fat_g": 6.0,
      "carbs_g": 61.0
    },
    "ingredients": [
      "100% Organic Kabuli Chickpeas"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Boiled Chana Chaat with Tomatoes & Lime",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Nutrient dense meal with slow-digesting complex carbs",
        "savings": "17g fiber, zero oil"
      }
    ]
  },
  {
    "id": "prod_raw_orange",
    "barcode": "000000000101",
    "qr_code_url": "https://id.gs1.org/01/00000000000101",
    "qr_payload": "{\"gtin\": \"00000000000101\", \"brand\": \"Nature Fresh\", \"name\": \"Fresh Whole Citrus Orange\"}",
    "product_name": "Fresh Whole Citrus Orange",
    "brand": "Nature Fresh",
    "serving_size": "150 g",
    "is_beverage": false,
    "fruit_veg_pct": 100,
    "category": "Natural Superfoods",
    "description": "Whole fresh ripe citrus orange with natural pectin fiber and vitamin C.",
    "per_100g": {
      "energy_kcal": 47,
      "energy_kj": 197,
      "sugars_g": 9.4,
      "saturated_fat_g": 0.0,
      "salt_g": 0.0,
      "sodium_mg": 0.0,
      "fibre_g": 2.4,
      "protein_g": 0.9,
      "fat_g": 0.1,
      "carbs_g": 11.8
    },
    "ingredients": [
      "100% Fresh Whole Orange Fruit"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Fresh Orange Segments with Pith",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Pith contains highest concentration of citrus bioflavonoids",
        "savings": "Natural intact cellular matrix"
      }
    ]
  },
  {
    "id": "prod_raw_greentea",
    "barcode": "8901207010049",
    "qr_code_url": "https://id.gs1.org/01/08901207010049",
    "qr_payload": "{\"gtin\": \"08901207010049\", \"brand\": \"Twinings\", \"name\": \"Pure Green Tea with Mint Leaves\"}",
    "product_name": "Pure Green Tea with Mint Leaves",
    "brand": "Twinings",
    "serving_size": "200 ml",
    "is_beverage": true,
    "fruit_veg_pct": 0,
    "category": "Natural Hydration",
    "description": "Freshly brewed green tea with spearmint leaves. Loaded with epigallocatechin gallate (EGCG).",
    "per_100g": {
      "energy_kcal": 2,
      "energy_kj": 8,
      "sugars_g": 0.0,
      "saturated_fat_g": 0.0,
      "salt_g": 0.0,
      "sodium_mg": 1,
      "fibre_g": 0.0,
      "protein_g": 0.2,
      "fat_g": 0.0,
      "carbs_g": 0.3
    },
    "ingredients": [
      "Brewed Green Tea (Water, Camellia Sinensis)",
      "Spearmint Leaves"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Matcha Ceremonial Japanese Tea",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "137x higher EGCG concentration than bagged green tea",
        "savings": "Peak cellular antioxidant"
      }
    ]
  },
  {
    "id": "prod_raw_flax",
    "barcode": "8906076430053",
    "qr_code_url": "https://id.gs1.org/01/08906076430053",
    "qr_payload": "{\"gtin\": \"08906076430053\", \"brand\": \"True Elements\", \"name\": \"Cold Pressed Ground Flaxseed\"}",
    "product_name": "Cold Pressed Ground Flaxseed",
    "brand": "True Elements",
    "serving_size": "15 g",
    "is_beverage": false,
    "fruit_veg_pct": 0,
    "category": "Natural Superfoods",
    "description": "Freshly cold-milled organic brown flaxseeds. Highest dietary lignan content of any plant food.",
    "per_100g": {
      "energy_kcal": 534,
      "energy_kj": 2234,
      "sugars_g": 1.5,
      "saturated_fat_g": 3.7,
      "salt_g": 0.08,
      "sodium_mg": 30,
      "fibre_g": 27.3,
      "protein_g": 18.3,
      "fat_g": 42.2,
      "carbs_g": 28.9
    },
    "ingredients": [
      "100% Milled Cold-Ground Organic Brown Flaxseeds"
    ],
    "allergens_stated": [],
    "healthier_alternatives": [
      {
        "name": "Flaxseed Powder in Warm Water",
        "category": "natural",
        "nutri_grade": "A",
        "reason": "Soothes intestinal lining and supplies 22g Omega-3 ALA",
        "savings": "Over 20g natural ALA"
      }
    ]
  }
];

/**
 * Strictly extracts a valid GTIN/EAN barcode from any payload (GS1 Digital Link, OpenFoodFacts URL, query param, or raw barcode).
 * Returns undefined if no valid barcode sequence is found.
 */
export function extractBarcodeFromPayload(rawText: string): string | undefined {
  if (!rawText) return undefined;
  const raw = rawText.trim();

  // A. Check if raw is pure barcode digits (8, 12, 13, 14 digits)
  if (/^\d{8,14}$/.test(raw)) {
    return raw;
  }

  // B. Check GS1 Digital Link standard (/01/{gtin})
  const gs1Match = raw.match(/\/01\/(\d{8,14})(?:\/|\?|$)/);
  if (gs1Match) {
    return gs1Match[1];
  }

  // C. Check Open Food Facts or generic product URL (/product/{barcode})
  const offMatch = raw.match(/\/(?:product|item|api\/v\d\/product)\/(\d{8,14})(?:\.json|\/|\?|$)/i);
  if (offMatch) {
    return offMatch[1];
  }

  // D. Check query parameters: ?gtin=... or ?barcode=... or ?upc=... or ?ean=...
  const queryParamMatch = raw.match(/[?&](?:gtin|barcode|upc|ean|code)=(\d{8,14})(?:&|$)/i);
  if (queryParamMatch) {
    return queryParamMatch[1];
  }

  // E. JSON SmartLabel payload
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw);
      const val = parsed.gtin || parsed.barcode || parsed.upc || parsed.ean || parsed.code;
      if (val && /^\d{8,14}$/.test(String(val))) {
        return String(val);
      }
    } catch {
      // Ignore
    }
  }

  // F. Embedded standalone barcode in text/URL (check 13-14 first, then 12, then 8)
  const standaloneMatch = raw.match(/\b(\d{13,14}|\d{12}|\d{8})\b/);
  if (standaloneMatch) {
    return standaloneMatch[1];
  }

  return undefined;
}

/**
 * Resolves a scanned 2D QR code or 1D barcode against the local benchmark catalog.
 * Uses strict exact matching (NO fuzzy substring or endsWith tricks that cause false positives).
 */
export function resolveQrOrBarcode(rawText: string): ProductItem | undefined {
  if (!rawText) return undefined;
  const raw = rawText.trim();

  // 1. Direct match on official exhibition QR code URL
  const urlMatch = EXHIBITION_PRODUCTS.find((p) => p.qr_code_url && (p.qr_code_url === raw || raw.startsWith(p.qr_code_url)));
  if (urlMatch) return urlMatch;

  // 2. Direct match on JSON payload
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.gtin || parsed.barcode) {
        const c = String(parsed.gtin || parsed.barcode).replace(/^0+/, '');
        const match = EXHIBITION_PRODUCTS.find((p) => p.barcode.replace(/^0+/, '') === c);
        if (match) return match;
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // 3. Extract barcode digits strictly from payload
  const barcode = extractBarcodeFromPayload(raw);
  if (barcode) {
    const unpadded = barcode.replace(/^0+/, '');
    const match = EXHIBITION_PRODUCTS.find((p) => {
      const pUnpadded = p.barcode.replace(/^0+/, '');
      if (p.barcode === barcode || pUnpadded === unpadded) return true;
      if (p.barcode_aliases && p.barcode_aliases.some((a) => a === barcode || a.replace(/^0+/, '') === unpadded)) {
        return true;
      }
      return false;
    });
    if (match) return match;
  }

  return undefined;
}

export function findProductByBarcode(code: string): ProductItem | undefined {
  return resolveQrOrBarcode(code);
}

export function findProductById(id: string): ProductItem | undefined {
  return EXHIBITION_PRODUCTS.find((p) => p.id === id);
}

/**
 * Returns tailored healthier alternatives (both packaged and whole natural foods).
 * If the product has explicit alternatives, returns those. Otherwise generates smart swaps dynamically.
 */
export function getHealthierAlternatives(product: ProductItem): HealthierAlternative[] {
  if (product.healthier_alternatives && product.healthier_alternatives.length > 0) {
    return product.healthier_alternatives;
  }

  const category = (product.category || '').toLowerCase();
  const sugars = product.per_100g?.sugars_g ?? 0;
  const isBeverage = product.is_beverage;

  const swaps: HealthierAlternative[] = [];

  if (isBeverage || category.includes('drink') || category.includes('juice') || category.includes('soda')) {
    swaps.push({
      name: 'Tender Coconut Water',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Natural potassium-rich hydration with zero added cane sugar or phosphoric acid',
      savings: '-75% sugar load',
      target_id: 'prod_raw_coconut'
    });
    swaps.push({
      name: 'Spiced Buttermilk (Chaas)',
      brand: 'Amul',
      category: 'packaged',
      nutri_grade: 'A',
      reason: 'Active probiotic digestive drink with high electrolytes',
      savings: 'Zero added sugar, 3g protein',
      target_id: 'prod_amul_chaas'
    });
  } else if (category.includes('snack') || category.includes('chip') || category.includes('crisp')) {
    swaps.push({
      name: 'Roasted Fox Nuts (Makhana)',
      brand: 'Farmley',
      category: 'packaged',
      nutri_grade: 'A',
      reason: 'High protein water lily seeds roasted in olive oil with zero palm fat',
      savings: '-80% saturated fat',
      target_id: 'prod_farmley_makhana'
    });
    swaps.push({
      name: 'Roasted Bengal Gram (Chana)',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Whole roasted legumes packed with 21g plant protein and insoluble fiber',
      savings: 'No palm oil, 21g protein',
      target_id: 'prod_natureland_chana'
    });
  } else if (category.includes('cereal') || category.includes('breakfast')) {
    swaps.push({
      name: 'Rolled White Oats',
      brand: 'Quaker',
      category: 'packaged',
      nutri_grade: 'A',
      reason: '100% whole grain with beta-glucan soluble fiber that lowers cholesterol',
      savings: 'Zero added sugar, 10.6g fiber',
      target_id: 'prod_oats'
    });
    swaps.push({
      name: 'Foxtail Millet Grain',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Ancient low-glycemic grain naturally rich in minerals and B vitamins',
      savings: 'Lowest GI, gluten-free',
      target_id: 'prod_foxtail_millet'
    });
  } else if (category.includes('confectionery') || category.includes('sweet') || sugars > 25) {
    swaps.push({
      name: '100% Pure Peanut Butter',
      brand: 'Pintola',
      category: 'packaged',
      nutri_grade: 'A',
      reason: 'Single ingredient roasted peanuts with zero palm oil or corn syrup',
      savings: 'Zero added cane sugar, 30g protein',
      target_id: 'prod_pintola_pb'
    });
    swaps.push({
      name: 'Raw California Walnuts',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Dense in heart-protective Omega-3 alpha-linolenic acid (ALA)',
      savings: 'Zero sugar spikes',
      target_id: 'prod_raw_walnuts'
    });
  } else {
    swaps.push({
      name: 'Sprouted Green Moong Dal',
      category: 'natural',
      nutri_grade: 'A',
      reason: 'Fresh bioavailable enzymes, high protein, and low calorie density',
      savings: '100% natural whole food',
      target_id: 'prod_moong_dal'
    });
    swaps.push({
      name: 'Rolled White Oats',
      brand: 'Quaker',
      category: 'packaged',
      nutri_grade: 'A',
      reason: 'Heart-healthy dietary fiber benchmark',
      savings: 'Low saturated fat',
      target_id: 'prod_oats'
    });
  }

  return swaps;
}

/**
 * Helper to parse Open Food Facts raw product JSON into a standardized ProductItem.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOffProduct(p: any, fallbackBarcode: string): ProductItem {
  const nut = p.nutriments || {};
  const isBeverage =
    (p.categories_tags || []).some((c: string) => c.includes('beverage') || c.includes('drink')) ||
    (p.categories || '').toLowerCase().includes('beverage');

  const getNum = (val: unknown): number | null => {
    if (val === null || val === undefined) return null;
    const n = parseFloat(String(val));
    return isNaN(n) ? null : n;
  };

  let ingredients: string[] = [];
  if (p.ingredients_text) {
    ingredients = p.ingredients_text
      .split(/[,;()[\]]/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 1);
  } else if (Array.isArray(p.ingredients)) {
    ingredients = p.ingredients
      .map((i: { text?: string; id?: string }) => i.text || i.id || '')
      .filter(Boolean);
  }
  if (ingredients.length === 0) {
    ingredients = ['Ingredients not specified on packaging'];
  }

  const allergens = (p.allergens_tags || [])
    .map((a: string) => a.replace(/^[a-z]+:/, '').replace(/-/g, ' '))
    .filter(Boolean);

  const barcode = p.code || fallbackBarcode;
  const analysisTags = (p.ingredients_analysis_tags || []) as string[];
  const isVeg = !analysisTags.includes('en:non-vegetarian');

  const liveItem: ProductItem = {
    id: `off_${barcode}`,
    barcode: barcode,
    product_name: p.product_name || p.product_name_en || `Scanned Product (${barcode})`,
    brand: p.brands || 'Packaged Goods',
    serving_size: p.serving_size || '100g',
    is_beverage: isBeverage,
    is_veg: isVeg,
    fruit_veg_pct:
      getNum(p.fruit_vegetables_nuts_100g) ??
      (getNum(nut['fruits-vegetables-nuts-estimate-from-ingredients_100g']) ?? 0),
    category: p.categories ? p.categories.split(',')[0].trim() : isBeverage ? 'Beverages' : 'Packaged Foods',
    description: p.generic_name || `Live package retrieved via Open Food Facts database.`,
    source_engine: 'openfoodfacts',
    per_100g: {
      energy_kcal: getNum(nut['energy-kcal_100g']) ?? getNum(nut['energy-kcal']),
      energy_kj: getNum(nut['energy-kj_100g']) ?? getNum(nut['energy_100g']),
      sugars_g: getNum(nut.sugars_100g) ?? getNum(nut.sugars),
      saturated_fat_g: getNum(nut['saturated-fat_100g']) ?? getNum(nut['saturated-fat']),
      salt_g: getNum(nut.salt_100g) ?? getNum(nut.salt),
      sodium_mg: (getNum(nut.sodium_100g) ?? getNum(nut.sodium))
        ? (getNum(nut.sodium_100g) ?? 0) * 1000
        : null,
      fibre_g: getNum(nut.fiber_100g) ?? getNum(nut.fiber),
      protein_g: getNum(nut.proteins_100g) ?? getNum(nut.proteins),
      fat_g: getNum(nut.fat_100g) ?? getNum(nut.fat),
      carbs_g: getNum(nut.carbohydrates_100g) ?? getNum(nut.carbohydrates)
    },
    ingredients: ingredients,
    allergens_stated: allergens
  };

  liveItem.healthier_alternatives = getHealthierAlternatives(liveItem);
  return liveItem;
}

/**
 * Universal product resolution engine:
 * 1. Fast local offline database (0ms)
 * 2. Dedicated Open Food Facts India Gateway (in.openfoodfacts.org holding 150k+ Indian SKUs)
 * 3. Parallel Open Food Facts Global Gateway (world.openfoodfacts.org)
 * 4. GS1 India Manufacturer Intelligence (resolves 100% of 890... barcodes)
 */
export async function lookupProductLive(codeOrQuery: string): Promise<ProductItem | undefined> {
  if (!codeOrQuery) return undefined;
  const clean = codeOrQuery.trim();

  // 1. Try local offline database first (exact barcode or official QR URL)
  const localMatch = resolveQrOrBarcode(clean);
  if (localMatch) return localMatch;

  // 2. Extract barcode strictly
  const barcode = extractBarcodeFromPayload(clean);

  if (barcode) {
    // 2a. Check if local database matches unpadded barcode or alias
    const unpadded = barcode.replace(/^0+/, '');
    const localBarcodeMatch = EXHIBITION_PRODUCTS.find((p) => {
      const pUnpadded = p.barcode.replace(/^0+/, '');
      if (p.barcode === barcode || pUnpadded === unpadded) return true;
      if (p.barcode_aliases && p.barcode_aliases.some((a) => a === barcode || a.replace(/^0+/, '') === unpadded)) {
        return true;
      }
      return false;
    });
    if (localBarcodeMatch) return localBarcodeMatch;

    // 2b. Query Open Food Facts India + Global in parallel
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3800);

      const fetchOffBarcode = async (url: string) => {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'LabelLens-Kiosk/2.0 (ScienceExhibition; student-project)' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 1 && data.product) {
            return data.product;
          }
        }
        return null;
      };

      // Query India portal and World portal simultaneously
      const offUrls = [
        `https://in.openfoodfacts.org/api/v2/product/${barcode}.json`,
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
      ];

      if (unpadded !== barcode) {
        offUrls.push(`https://in.openfoodfacts.org/api/v2/product/${unpadded}.json`);
        offUrls.push(`https://world.openfoodfacts.org/api/v2/product/${unpadded}.json`);
      }

      // Race requests to get fastest valid response
      const results = await Promise.allSettled(offUrls.map((u) => fetchOffBarcode(u)));
      clearTimeout(timeoutId);

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) {
          return parseOffProduct(r.value, barcode);
        }
      }
    } catch {
      // Offline fallback: continue to GS1 India
    }

    // 2c. GS1 India Manufacturer Intelligence Layer (Guarantees 100% resolution for Indian 890... barcodes)
    if (barcode.startsWith('890') || unpadded.startsWith('890')) {
      const targetBc = barcode.startsWith('890') ? barcode : unpadded;
      const gs1Match = resolveGs1IndiaBarcode(targetBc);
      if (gs1Match) {
        gs1Match.healthier_alternatives = getHealthierAlternatives(gs1Match);
        return gs1Match;
      }
    }
  }

  // 3. Text Search Query Fallback
  if (!clean.includes('://') && clean.length >= 2) {
    const queryLower = clean.toLowerCase();
    const searchMatch = EXHIBITION_PRODUCTS.find(
      (p) =>
        p.product_name.toLowerCase().includes(queryLower) ||
        p.brand.toLowerCase().includes(queryLower)
    );
    if (searchMatch) return searchMatch;

    // Try Open Food Facts search API (India portal first, then world)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const searchUrls = [
        `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          clean
        )}&search_simple=1&action=process&json=1&page_size=1`,
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          clean
        )}&search_simple=1&action=process&json=1&page_size=1`
      ];

      for (const sUrl of searchUrls) {
        try {
          const res = await fetch(sUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'LabelLens-Kiosk/2.0' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.count > 0 && data.products && data.products[0]) {
              clearTimeout(timeoutId);
              return parseOffProduct(data.products[0], data.products[0].code || 'unknown');
            }
          }
        } catch {
          // Try next url
        }
      }
      clearTimeout(timeoutId);
    } catch {
      // Ignore network errors
    }
  }

  return undefined;
}
