"""
knowledge.py - Ingredient intelligence for LabelLens.
Detects hidden sugars, palm oil, allergens, and concerning E-numbers in ingredient lists.
"""
import json
import os
import difflib
from typing import Optional

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

_DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def _load_json(filename: str) -> object:
    path = os.path.join(_DATA_DIR, filename)
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


_HIDDEN_SUGARS: list = []
_PALM_OIL_VARIANTS: list = []
_ALLERGENS: dict = {}
_ADDITIVES: dict = {}


def _ensure_loaded():
    global _HIDDEN_SUGARS, _PALM_OIL_VARIANTS, _ALLERGENS, _ADDITIVES
    if not _HIDDEN_SUGARS:
        _HIDDEN_SUGARS = _load_json("hidden_sugars.json") or []
    if not _PALM_OIL_VARIANTS:
        _PALM_OIL_VARIANTS = _load_json("palm_oil.json") or []
    if not _ALLERGENS:
        _ALLERGENS = _load_json("allergens.json") or {}
    if not _ADDITIVES:
        _ADDITIVES = _load_json("additives.json") or {}


# ---------------------------------------------------------------------------
# Text normalisation helpers
# ---------------------------------------------------------------------------

def _normalize(text: str) -> str:
    """Lowercase, strip, collapse multiple spaces."""
    return " ".join(str(text).lower().strip().split())


def _fuzzy_match(query: str, candidates: list, threshold: float = 0.80) -> Optional[str]:
    """
    Return the best-matching candidate if similarity >= threshold.
    Uses SequenceMatcher for fuzzy comparison.
    """
    q_norm = _normalize(query)
    best_match = None
    best_ratio = 0.0

    for candidate in candidates:
        c_norm = _normalize(candidate)
        # Exact substring first (fastest path)
        if c_norm in q_norm or q_norm in c_norm:
            return candidate
        ratio = difflib.SequenceMatcher(None, q_norm, c_norm).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = candidate

    if best_ratio >= threshold:
        return best_match
    return None


def _ingredient_contains(ingredient: str, term: str) -> bool:
    """Check if an ingredient string contains a term (case-insensitive, word boundary aware)."""
    i_norm = _normalize(ingredient)
    t_norm = _normalize(term)
    # Check substring match
    if t_norm in i_norm:
        return True
    # Fuzzy check
    ratio = difflib.SequenceMatcher(None, i_norm, t_norm).ratio()
    return ratio >= 0.85


# ---------------------------------------------------------------------------
# Detection functions
# ---------------------------------------------------------------------------

def find_hidden_sugars(ingredients: list, top_n: int = None) -> list:
    """
    Find hidden sugar aliases in the ingredients list.

    Args:
        ingredients: list of ingredient strings.
        top_n: if set, only check the first top_n ingredients.

    Returns:
        List of dicts: {ingredient_text, sugar_alias, position}.
    """
    _ensure_loaded()
    found = []
    check_list = ingredients[:top_n] if top_n else ingredients

    for idx, ingredient in enumerate(check_list):
        for alias in _HIDDEN_SUGARS:
            if _ingredient_contains(ingredient, alias):
                found.append({
                    "ingredient_text": ingredient,
                    "sugar_alias": alias,
                    "position": idx + 1,  # 1-indexed
                    "in_top_5": idx < 5,
                })
                break  # one match per ingredient

    return found


def find_palm_oil(ingredients: list) -> list:
    """
    Find palm oil variants in the ingredients list.

    Returns:
        List of dicts: {ingredient_text, palm_variant, position}.
    """
    _ensure_loaded()
    found = []
    for idx, ingredient in enumerate(ingredients):
        for variant in _PALM_OIL_VARIANTS:
            if _ingredient_contains(ingredient, variant):
                found.append({
                    "ingredient_text": ingredient,
                    "palm_variant": variant,
                    "position": idx + 1,
                })
                break
    return found


def find_allergens(ingredients: list, stated_allergens: list = None) -> dict:
    """
    Find allergens in the ingredients list and from stated allergens.

    Returns:
        Dict mapping allergen label → list of matches.
    """
    _ensure_loaded()
    results = {}

    all_text = ingredients + (stated_allergens or [])

    for allergen_key, allergen_data in _ALLERGENS.items():
        label = allergen_data["label"]
        synonyms = allergen_data["synonyms"]
        matches = []

        for text_item in all_text:
            for synonym in synonyms:
                if _ingredient_contains(text_item, synonym):
                    matches.append({
                        "text": text_item,
                        "matched_synonym": synonym,
                    })
                    break  # one match per text item

        if matches:
            results[allergen_key] = {
                "label": label,
                "eu_number": allergen_data["eu_number"],
                "matches": matches,
            }

    return results


def _find_e_number_in_text(text: str) -> list:
    """Extract E-number codes from ingredient text (e.g. 'E211', 'E102')."""
    import re
    # Match E followed by 3-4 digits, optionally followed by letters
    pattern = re.compile(r'\bE\d{3,4}[a-z]?\b', re.IGNORECASE)
    return [m.group().upper() for m in pattern.finditer(text)]


def find_additives(ingredients: list) -> dict:
    """
    Find E-number additives in the ingredients list.

    Returns:
        Dict with 'HIGH_CONCERN', 'MEDIUM_CONCERN', 'LOW_CONCERN' keys,
        each containing list of found additives.
    """
    _ensure_loaded()
    found = {"HIGH_CONCERN": [], "MEDIUM_CONCERN": [], "LOW_CONCERN": []}

    full_text = " ".join(ingredients)
    e_codes_found = _find_e_number_in_text(full_text)

    # Also match by name from each concern level
    for concern_level, additives_dict in _ADDITIVES.items():
        if concern_level not in found:
            continue
        for e_code, additive_info in additives_dict.items():
            # Check E-code
            if e_code in e_codes_found:
                found[concern_level].append({
                    "code": e_code,
                    "name": additive_info["name"],
                    "description": additive_info["description"],
                    "matched_as": e_code,
                })
                continue
            # Check by name/alias in ingredients text
            for alias in additive_info.get("also_known_as", []):
                alias_norm = _normalize(alias)
                if alias_norm in _normalize(full_text) and len(alias_norm) > 3:
                    found[concern_level].append({
                        "code": e_code,
                        "name": additive_info["name"],
                        "description": additive_info["description"],
                        "matched_as": alias,
                    })
                    break

    return found


# ---------------------------------------------------------------------------
# Combined analysis + score modifier
# ---------------------------------------------------------------------------

def analyze_ingredients(
    ingredients: list,
    stated_allergens: list = None,
    base_score_10: float = 5.0,
) -> dict:
    """
    Full ingredient intelligence pass.

    Returns:
        {
            hidden_sugars: [...],
            palm_oil: [...],
            allergens: {...},
            additives: {...},
            score_modifier: float,  # positive = better, negative = worse
            warnings: [str],        # human-readable warning strings
            flags: {str: bool},     # machine-readable flag keys
        }
    """
    hidden_sugars = find_hidden_sugars(ingredients)
    palm_oil = find_palm_oil(ingredients)
    allergens = find_allergens(ingredients, stated_allergens or [])
    additives = find_additives(ingredients)

    score_modifier = 0.0
    warnings = []
    flags = {}

    # Hidden sugars in top 5 ingredients
    top5_sugars = [s for s in hidden_sugars if s.get("in_top_5")]
    if top5_sugars:
        deduction = len(top5_sugars) * 0.5
        score_modifier -= deduction
        sugar_names = list({s["sugar_alias"] for s in top5_sugars})
        warnings.append(
            f"⚠️ Hidden sugars in top ingredients: {', '.join(sugar_names[:3])}"
        )
        flags["hidden_sugars"] = True
    elif hidden_sugars:
        flags["hidden_sugars"] = True
        warnings.append(
            f"ℹ️ Sugar aliases detected: {', '.join({s['sugar_alias'] for s in hidden_sugars})}"
        )

    # Palm oil
    if palm_oil:
        score_modifier -= 0.3
        flags["palm_oil"] = True
        warnings.append("🌴 Contains palm oil or derivatives")

    # Additives
    high_concern = additives.get("HIGH_CONCERN", [])
    medium_concern = additives.get("MEDIUM_CONCERN", [])

    if high_concern:
        deduction = len(high_concern) * 0.5
        score_modifier -= deduction
        flags["high_concern_additives"] = True
        for a in high_concern:
            warnings.append(f"🔴 High-concern additive: {a['code']} ({a['name']}) — {a['description']}")

    if medium_concern:
        deduction = len(medium_concern) * 0.2
        score_modifier -= deduction
        flags["medium_concern_additives"] = True
        if len(medium_concern) <= 3:
            for a in medium_concern:
                warnings.append(f"🟡 Medium-concern additive: {a['code']} ({a['name']})")
        else:
            warnings.append(f"🟡 {len(medium_concern)} medium-concern additives detected")

    # Allergen flags
    for key, data in allergens.items():
        flags[key] = True

    return {
        "hidden_sugars": hidden_sugars,
        "palm_oil": palm_oil,
        "allergens": allergens,
        "additives": additives,
        "score_modifier": round(score_modifier, 2),
        "warnings": warnings,
        "flags": flags,
    }
