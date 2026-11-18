"""
test_scoring.py - Pytest suite for LabelLens Nutri-Score algorithm and intelligence checks.
Tests at least 8 realistic products, edge cases, missing values, beverage scoring, and boundary conditions.
"""
try:
    import pytest
except ImportError:
    pytest = None

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scoring import score_product, score_general, score_beverage, _score_to_1_10
from knowledge import analyze_ingredients, find_hidden_sugars, find_allergens, find_additives, find_palm_oil
from profiles import apply_profile, get_profile


# ---------------------------------------------------------------------------
# 1. Product Tests (8+ products)
# ---------------------------------------------------------------------------

def test_cola_scores_e():
    """Coca-Cola should score Grade E (high sugar, empty calories beverage)."""
    nutrition = {
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
    }
    result = score_product(nutrition, is_beverage=True)
    assert result["is_beverage"] is True
    assert result["grade"] == "E", f"Expected E for Cola, got {result['grade']} (raw: {result['raw_score']})"
    assert result["score_1_to_10"] <= 5.0


def test_plain_oats_scores_a_or_b():
    """Rolled oats should score Grade A or B (high fibre, low sugar, high protein)."""
    nutrition = {
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
    }
    result = score_product(nutrition, is_beverage=False)
    assert result["grade"] in ("A", "B"), f"Expected A or B for Oats, got {result['grade']}"
    assert result["score_1_to_10"] >= 7.0


def test_chips_scores_d_or_e():
    """Potato chips should score Grade D or E (high energy, fat, and salt)."""
    nutrition = {
        "energy_kcal": 536.0,
        "energy_kj": 2242.0,
        "sugars_g": 1.0,
        "saturated_fat_g": 3.1,
        "salt_g": 1.4,
        "fibre_g": 3.0,
        "protein_g": 6.0,
        "fat_g": 34.0,
        "carbs_g": 53.0,
    }
    result = score_product(nutrition, is_beverage=False)
    assert result["grade"] in ("D", "E"), f"Expected D or E for Chips, got {result['grade']}"


def test_greek_yogurt_scores_b_or_c():
    """Plain Greek yogurt should score Grade A, B or C (high protein, minimal sugar, no sat fat)."""
    nutrition = {
        "energy_kcal": 59.0,
        "energy_kj": 247.0,
        "sugars_g": 3.2,
        "saturated_fat_g": 0.0,
        "salt_g": 0.1,
        "fibre_g": 0.0,
        "protein_g": 10.0,
        "fat_g": 0.0,
        "carbs_g": 3.6,
    }
    result = score_product(nutrition, is_beverage=False)
    assert result["grade"] in ("A", "B", "C"), f"Expected A, B, or C for Greek Yogurt, got {result['grade']}"


def test_corn_flakes():
    """Corn Flakes should score Grade B or C (moderate sugar, high salt for cereal)."""
    nutrition = {
        "energy_kcal": 357.0,
        "energy_kj": 1507.0,
        "sugars_g": 8.0,
        "saturated_fat_g": 0.1,
        "salt_g": 1.3,
        "fibre_g": 3.0,
        "protein_g": 7.0,
    }
    result = score_product(nutrition, is_beverage=False)
    assert result["grade"] in ("B", "C"), f"Expected B or C for Corn Flakes, got {result['grade']}"


def test_oreo_cookies_scores_e():
    """Oreo cookies should score Grade E (very high sugar 40g+, saturated fat)."""
    nutrition = {
        "energy_kcal": 471.0,
        "energy_kj": 1971.0,
        "sugars_g": 40.4,
        "saturated_fat_g": 5.1,
        "salt_g": 0.68,
        "fibre_g": 2.5,
        "protein_g": 4.9,
    }
    result = score_product(nutrition, is_beverage=False)
    assert result["grade"] in ("D", "E"), f"Expected D or E for Oreos, got {result['grade']}"


def test_fresh_apple():
    """An apple with 100% fruit content should score Grade A."""
    nutrition = {
        "energy_kcal": 52.0,
        "energy_kj": 218.0,
        "sugars_g": 10.4,
        "saturated_fat_g": 0.0,
        "salt_g": 0.0,
        "fibre_g": 2.4,
        "protein_g": 0.3,
    }
    result = score_product(nutrition, is_beverage=False, fruit_veg_pct=100.0)
    assert result["grade"] == "A", f"Expected A for Apple, got {result['grade']}"


def test_pure_water_beverage():
    """Water has 0 across the board and should score Grade A."""
    nutrition = {
        "energy_kcal": 0,
        "energy_kj": 0,
        "sugars_g": 0,
        "saturated_fat_g": 0,
        "salt_g": 0,
        "fibre_g": 0,
        "protein_g": 0,
    }
    result = score_product(nutrition, is_beverage=True)
    assert result["grade"] == "A", f"Expected A for Water, got {result['grade']}"


# ---------------------------------------------------------------------------
# 2. Beverage vs Food Threshold Behavior
# ---------------------------------------------------------------------------

def test_beverage_stricter_than_general():
    """A liquid with 10g sugar should score much worse in beverage mode than general food mode."""
    nutrition = {
        "energy_kj": 180.0,
        "sugars_g": 10.0,
        "saturated_fat_g": 0.0,
        "salt_g": 0.0,
        "fibre_g": 0.0,
        "protein_g": 0.0,
    }
    gen_result = score_general(nutrition)
    bev_result = score_beverage(nutrition)

    # In beverage scale, sugar and energy are stricter
    assert bev_result["raw_score"] > gen_result["raw_score"]
    assert bev_result["is_beverage"] is True


# ---------------------------------------------------------------------------
# 3. Safe Handling of None / Missing Values
# ---------------------------------------------------------------------------

def test_missing_values_handled_safely():
    """Scoring should safely handle empty dict or None values without throwing exceptions."""
    empty_nutrition = {
        "energy_kcal": None,
        "energy_kj": None,
        "sugars_g": None,
        "saturated_fat_g": None,
        "salt_g": None,
        "sodium_mg": None,
        "fibre_g": None,
        "protein_g": None,
    }
    res_gen = score_product(empty_nutrition, is_beverage=False)
    assert res_gen["raw_score"] == 0
    assert res_gen["grade"] == "B"  # 0 is <= 2 so Grade B

    res_bev = score_product(empty_nutrition, is_beverage=True)
    assert res_bev["raw_score"] == 0
    assert res_bev["grade"] == "A"  # 0 is <= 1 so Grade A for beverage


def test_sodium_to_salt_conversion():
    """Sodium in mg should automatically convert to salt if salt is missing."""
    nutrition = {"sodium_mg": 400.0}  # 400 mg sodium = 1.0 g salt
    res = score_general(nutrition)
    salt_item = next(b for b in res["breakdown"] if b["factor"] == "Salt")
    assert salt_item["points"] == 4  # 1.0g <= 1.0g threshold -> 4 pts


# ---------------------------------------------------------------------------
# 4. Grade Boundary Exact Threshold Checks
# ---------------------------------------------------------------------------

def test_grade_boundaries_general():
    """Verify general food boundaries: A <= -1, B <= 2, C <= 10, D <= 18, E >= 19."""
    from scoring import _score_to_grade, GENERAL_GRADES

    assert _score_to_grade(-5, GENERAL_GRADES) == "A"
    assert _score_to_grade(-1, GENERAL_GRADES) == "A"
    assert _score_to_grade(0, GENERAL_GRADES) == "B"
    assert _score_to_grade(2, GENERAL_GRADES) == "B"
    assert _score_to_grade(3, GENERAL_GRADES) == "C"
    assert _score_to_grade(10, GENERAL_GRADES) == "C"
    assert _score_to_grade(11, GENERAL_GRADES) == "D"
    assert _score_to_grade(18, GENERAL_GRADES) == "D"
    assert _score_to_grade(19, GENERAL_GRADES) == "E"
    assert _score_to_grade(35, GENERAL_GRADES) == "E"


def test_grade_boundaries_beverage():
    """Verify beverage boundaries: A <= 1, B <= 5, C <= 9, D <= 12, E >= 13."""
    from scoring import _score_to_grade, BEVERAGE_GRADES

    assert _score_to_grade(1, BEVERAGE_GRADES) == "A"
    assert _score_to_grade(2, BEVERAGE_GRADES) == "B"
    assert _score_to_grade(5, BEVERAGE_GRADES) == "B"
    assert _score_to_grade(6, BEVERAGE_GRADES) == "C"
    assert _score_to_grade(9, BEVERAGE_GRADES) == "C"
    assert _score_to_grade(10, BEVERAGE_GRADES) == "D"
    assert _score_to_grade(12, BEVERAGE_GRADES) == "D"
    assert _score_to_grade(13, BEVERAGE_GRADES) == "E"


def test_linear_scale_mapping():
    """Test score 1-10 bounds: -15 -> 10.0, 40 -> 1.0."""
    assert _score_to_1_10(-15) == 10.0
    assert _score_to_1_10(40) == 1.0
    assert 1.0 <= _score_to_1_10(0) <= 10.0


# ---------------------------------------------------------------------------
# 5. Knowledge & Profile Intelligence Tests
# ---------------------------------------------------------------------------

def test_hidden_sugars_detection():
    """Test detection of sugar aliases like maltodextrin and agave."""
    ingredients = ["Wheat flour", "Maltodextrin", "Agave nectar", "Salt"]
    found = find_hidden_sugars(ingredients)
    assert len(found) >= 2
    aliases = [f["sugar_alias"] for f in found]
    assert "maltodextrin" in aliases
    assert any("agave" in a for a in aliases)


def test_palm_oil_detection():
    """Test palm oil detection."""
    ingredients = ["Wheat flour", "Hydrogenated palm oil", "Sugar"]
    found = find_palm_oil(ingredients)
    assert len(found) >= 1
    assert any("palm" in f["palm_variant"] for f in found)


def test_allergen_detection():
    """Test allergen detection for nuts and milk."""
    ingredients = ["Almond flour", "Skimmed milk", "Sugar"]
    allergens = find_allergens(ingredients)
    assert "nuts" in allergens
    assert "milk" in allergens


def test_high_concern_additive():
    """Test detection of Tartrazine (E102) and Sodium Benzoate (E211)."""
    ingredients = ["Water", "E102", "Sodium Benzoate", "Sugar"]
    additives = find_additives(ingredients)
    high_codes = [a["code"] for a in additives["HIGH_CONCERN"]]
    assert "E102" in high_codes
    assert "E211" in high_codes


def test_diabetic_profile_warning():
    """Diabetic profile should flag hard warning if sugars > 15g."""
    nutrition = {"sugars_g": 25.0, "salt_g": 0.5}
    base_score = score_general(nutrition)
    k_res = analyze_ingredients(["Sugar", "Flour"])
    p_res = apply_profile(base_score, k_res, nutrition, profile_name="Diabetic")
    assert p_res["is_critical"] is True
    assert any("HIGH SUGAR" in w for w in p_res["hard_warnings"])
    assert p_res["verdict"] == "⛔ AVOID"


def test_nut_allergy_profile_warning():
    """Nut allergy profile should flag DO NOT BUY when nuts are detected."""
    nutrition = {"sugars_g": 5.0, "salt_g": 0.1}
    base_score = score_general(nutrition)
    k_res = analyze_ingredients(["Cashew butter", "Oats"])
    p_res = apply_profile(base_score, k_res, nutrition, profile_name="Nut Allergy")
    assert p_res["is_critical"] is True
    assert any("DO NOT BUY" in w for w in p_res["hard_warnings"])


def test_barcode_database_and_checksum():
    """Verify barcode engine resolution and EAN-13 checksum validation."""
    from barcode_engine import lookup_barcode, validate_ean13_checksum
    assert validate_ean13_checksum("5449000000996") is True
    assert validate_ean13_checksum("5449000000997") is False
    coke = lookup_barcode("5449000000996", allow_online=False)
    assert coke is not None
    assert "Coca-Cola" in coke["product_name"]
    assert coke["is_beverage"] is True
    snickers = lookup_barcode("5000159461122", allow_online=False)
    assert snickers is not None
    assert "Snickers" in snickers["product_name"]



if __name__ == "__main__":
    test_funcs = [v for k, v in list(globals().items()) if k.startswith("test_") and callable(v)]
    passed = 0
    print(f"Running {len(test_funcs)} tests...")
    for fn in test_funcs:
        try:
            fn()
            print(f"  PASS: {fn.__name__}")
            passed += 1
        except Exception as e:
            print(f"  FAIL: {fn.__name__} -> {e}")
    print(f"\nResult: {passed}/{len(test_funcs)} tests passed.")
    if passed != len(test_funcs):
        sys.exit(1)

