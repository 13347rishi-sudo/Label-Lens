"""
demo_data.py - Pre-saved demo scans for LabelLens exhibition mode.
6 realistic products with full nutrition data for demonstration without a camera or Ollama.
"""

DEMO_SCANS = [
    {
        "id": "demo_001",
        "label": "🥤 Coca-Cola 330ml Can",
        "is_beverage": True,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Coca-Cola Classic",
            "serving_size": "330ml (1 can)",
            "per_100g": {
                "energy_kcal": 42.0,
                "energy_kj": 180.0,
                "sugars_g": 10.6,
                "saturated_fat_g": 0.0,
                "salt_g": 0.0,
                "sodium_mg": 0.0,
                "fibre_g": 0.0,
                "protein_g": 0.0,
                "fat_g": 0.0,
                "carbs_g": 10.6,
            },
            "ingredients": [
                "Carbonated Water",
                "Sugar",
                "Colour (Caramel E150d)",
                "Phosphoric Acid",
                "Natural Flavourings",
                "Caffeine",
            ],
            "allergens_stated": [],
        },
        "description": "Classic cola beverage — the benchmark of high-sugar drinks.",
    },
    {
        "id": "demo_002",
        "label": "🌾 Kellogg's Corn Flakes",
        "is_beverage": False,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Kellogg's Corn Flakes",
            "serving_size": "30g (with 125ml semi-skimmed milk)",
            "per_100g": {
                "energy_kcal": 357.0,
                "energy_kj": 1507.0,
                "sugars_g": 8.0,
                "saturated_fat_g": 0.1,
                "salt_g": 1.3,
                "sodium_mg": 520.0,
                "fibre_g": 3.0,
                "protein_g": 7.0,
                "fat_g": 0.9,
                "carbs_g": 83.6,
            },
            "ingredients": [
                "Maize (93%)",
                "Sugar",
                "Salt",
                "Barley Malt Flavouring",
                "Niacin",
                "Iron",
                "Vitamin B6",
                "Riboflavin (B2)",
                "Thiamin (B1)",
                "Folic Acid",
                "Vitamin D",
                "Vitamin B12",
            ],
            "allergens_stated": ["Gluten (from barley malt)", "May contain wheat"],
        },
        "description": "Breakfast cereal — popular but relatively high in salt for a cereal.",
    },
    {
        "id": "demo_003",
        "label": "🥔 Lay's Classic Chips",
        "is_beverage": False,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Lay's Classic Potato Chips",
            "serving_size": "28g (about 15 chips)",
            "per_100g": {
                "energy_kcal": 536.0,
                "energy_kj": 2242.0,
                "sugars_g": 1.0,
                "saturated_fat_g": 3.1,
                "salt_g": 0.75,
                "sodium_mg": 300.0,
                "fibre_g": 4.9,
                "protein_g": 5.4,
                "fat_g": 34.0,
                "carbs_g": 53.6,
            },
            "ingredients": [
                "Potatoes",
                "Vegetable Oil (Sunflower, Corn, and/or Canola Oil)",
                "Salt",
            ],
            "allergens_stated": [],
        },
        "description": "Classic potato chips — high fat and energy but simple ingredients.",
    },
    {
        "id": "demo_004",
        "label": "🥛 Dannon Plain Greek Yogurt",
        "is_beverage": False,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Dannon Plain Nonfat Greek Yogurt",
            "serving_size": "170g (1 container)",
            "per_100g": {
                "energy_kcal": 59.0,
                "energy_kj": 247.0,
                "sugars_g": 3.2,
                "saturated_fat_g": 0.0,
                "salt_g": 0.1,
                "sodium_mg": 40.0,
                "fibre_g": 0.0,
                "protein_g": 10.0,
                "fat_g": 0.0,
                "carbs_g": 3.6,
            },
            "ingredients": [
                "Cultured Nonfat Milk",
                "Live and Active Cultures (S. thermophilus, L. bulgaricus, L. acidophilus, Bifidus, L. casei)",
            ],
            "allergens_stated": ["Milk"],
        },
        "description": "Plain Greek yogurt — high protein, low sugar, excellent choice.",
    },
    {
        "id": "demo_005",
        "label": "🌾 Quaker Old Fashioned Oats",
        "is_beverage": False,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Quaker Old Fashioned Rolled Oats",
            "serving_size": "40g dry (about ½ cup)",
            "per_100g": {
                "energy_kcal": 379.0,
                "energy_kj": 1586.0,
                "sugars_g": 1.1,
                "saturated_fat_g": 1.3,
                "salt_g": 0.0,
                "sodium_mg": 0.0,
                "fibre_g": 10.0,
                "protein_g": 13.4,
                "fat_g": 6.9,
                "carbs_g": 67.7,
            },
            "ingredients": [
                "Whole Grain Rolled Oats",
            ],
            "allergens_stated": ["May contain wheat"],
        },
        "description": "Plain rolled oats — excellent fibre and protein, minimal processing.",
    },
    {
        "id": "demo_006",
        "label": "🍪 Oreo Cookies",
        "is_beverage": False,
        "fruit_veg_pct": 0.0,
        "extracted": {
            "product_name": "Oreo Original Chocolate Sandwich Cookies",
            "serving_size": "34g (3 cookies)",
            "per_100g": {
                "energy_kcal": 471.0,
                "energy_kj": 1971.0,
                "sugars_g": 40.4,
                "saturated_fat_g": 5.1,
                "salt_g": 0.68,
                "sodium_mg": 272.0,
                "fibre_g": 2.5,
                "protein_g": 4.9,
                "fat_g": 20.0,
                "carbs_g": 71.0,
            },
            "ingredients": [
                "Unbleached Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid)",
                "Sugar",
                "Palm and/or Canola Oil",
                "Cocoa (Processed with Alkali)",
                "High Fructose Corn Syrup",
                "Leavening (Baking Soda and/or Calcium Phosphate)",
                "Salt",
                "Soy Lecithin",
                "Chocolate",
                "Artificial Flavour",
                "Vanillin",
            ],
            "allergens_stated": ["Wheat", "Soy", "May contain milk, peanuts, sesame, tree nuts"],
        },
        "description": "Popular sandwich cookie — very high sugar, palm oil, and high fructose corn syrup.",
    },
]


def get_demo_scan(demo_id: str) -> dict:
    """Return a demo scan dict by ID."""
    for scan in DEMO_SCANS:
        if scan["id"] == demo_id:
            return scan
    return DEMO_SCANS[0]


def get_demo_labels() -> list:
    """Return a list of (id, label) tuples for display in the UI."""
    return [(s["id"], s["label"]) for s in DEMO_SCANS]
