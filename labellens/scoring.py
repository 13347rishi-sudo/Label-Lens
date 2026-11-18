"""
scoring.py - Official Nutri-Score algorithm implementation for LabelLens
Implements the European Nutri-Score grading system for general foods and beverages.
"""
from typing import Optional


# ---------------------------------------------------------------------------
# Lookup tables for general foods
# ---------------------------------------------------------------------------

# Bad points (N): thresholds are UPPER bounds for each point level (index = points)
# Index i means: value <= threshold[i] → i points (last entry = max points)

ENERGY_KJ_THRESHOLDS = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350]  # 10 entries → max 10 pts
SAT_FAT_THRESHOLDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
SUGARS_THRESHOLDS = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]
SALT_THRESHOLDS = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0]

# Good points (P): thresholds for fibre and protein (index = points, max 5)
FIBRE_THRESHOLDS = [0.9, 1.9, 2.8, 3.7, 4.7]  # 5 entries → 0-5 pts
PROTEIN_THRESHOLDS = [1.6, 3.2, 4.8, 6.4, 8.0]
FRUIT_VEG_THRESHOLDS = [40, 60, 80]  # 0,1,2 pts if <=40, <=60, <=80; 5 pts if >80

# General food grade thresholds (final score = N - P)
GENERAL_GRADES = [
    ("A", -float("inf"), -1),   # score <= -1
    ("B", -1,            2),    # -1 < score <= 2
    ("C", 2,            10),    # 2 < score <= 10
    ("D", 10,           18),    # 10 < score <= 18
    ("E", 18,  float("inf")),   # score > 18
]

# ---------------------------------------------------------------------------
# Beverage thresholds (stricter)
# ---------------------------------------------------------------------------
BEV_ENERGY_THRESHOLDS = list(range(30, 301, 30))  # [30,60,...,300] 10 entries
BEV_SUGARS_THRESHOLDS = [i * 1.5 for i in range(10)]  # [0,1.5,3,...,13.5] 10 entries

BEVERAGE_GRADES = [
    ("A",  -float("inf"), 1),
    ("B",  1,              5),
    ("C",  5,              9),
    ("D",  9,             12),
    ("E",  12, float("inf")),
]

# Score range for linear 1–10 mapping
SCORE_MIN = -15
SCORE_MAX = 40


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def _safe(value: Optional[float], default: float = 0.0) -> float:
    """Return value or default if None / NaN."""
    if value is None:
        return default
    try:
        v = float(value)
        return v if v == v else default  # NaN check
    except (TypeError, ValueError):
        return default


def _lookup_points(value: float, thresholds: list) -> int:
    """
    Given a value and a sorted list of thresholds, return the number of points.
    Points = index of first threshold the value does NOT exceed.
    If value exceeds all thresholds → len(thresholds) points (maximum).
    """
    for i, t in enumerate(thresholds):
        if value <= t:
            return i
    return len(thresholds)


def _fruit_veg_points(pct: float) -> int:
    """Return fruit/veg/nuts percentage points (0-5 scale)."""
    if pct > 80:
        return 5
    elif pct > 60:
        return 2
    elif pct > 40:
        return 1
    else:
        return 0


def _score_to_grade(score: int, grades: list) -> str:
    """Find grade from grade table."""
    for grade, low, high in grades:
        if low < score <= high:
            return grade
    # edge cases
    for grade, low, high in grades:
        if score <= high:
            return grade
    return grades[-1][0]


def _score_to_1_10(raw_score: int, is_beverage: bool = False) -> float:
    """
    Map raw Nutri-Score to [10, 1].
    For general foods: raw range [-15, 40] -> [10, 1].
    For beverages: raw range [-5, 20] -> [10, 1].
    """
    if is_beverage:
        s_min, s_max = -5, 20
    else:
        s_min, s_max = SCORE_MIN, SCORE_MAX

    clamped = max(s_min, min(s_max, raw_score))
    ratio = (clamped - s_min) / (s_max - s_min)
    result = 10 - ratio * 9  # maps s_min -> 10, s_max -> 1
    return round(max(1.0, min(10.0, result)), 1)


# ---------------------------------------------------------------------------
# Main scoring functions
# ---------------------------------------------------------------------------

def score_general(nutrition: dict, fruit_veg_pct: float = 0.0) -> dict:
    """
    Score a general food product using the Nutri-Score algorithm.

    Args:
        nutrition: dict with keys from per_100g (energy_kj, saturated_fat_g,
                   sugars_g, salt_g, fibre_g, protein_g). Missing values → 0.
        fruit_veg_pct: estimated fruit/vegetable/nut content as percentage (0-100).

    Returns:
        dict with raw_score, grade, score_1_to_10, breakdown, is_beverage.
    """
    n = nutrition

    if n.get("energy_kj") is not None:
        energy = _safe(n.get("energy_kj"))
    elif n.get("energy_kcal") is not None:
        energy = _safe(n.get("energy_kcal")) * 4.184
    else:
        energy = 0.0
    sat_fat = _safe(n.get("saturated_fat_g"))
    sugars = _safe(n.get("sugars_g"))
    # Prefer salt; fallback to sodium * 2.5 / 1000 → g
    if n.get("salt_g") is not None:
        salt = _safe(n.get("salt_g"))
    elif n.get("sodium_mg") is not None:
        salt = _safe(n.get("sodium_mg")) * 0.0025
    else:
        salt = 0.0

    fibre = _safe(n.get("fibre_g"))
    protein = _safe(n.get("protein_g"))
    fv_pct = max(0.0, min(100.0, float(fruit_veg_pct)))

    # --- Bad points ---
    e_pts = _lookup_points(energy, ENERGY_KJ_THRESHOLDS)
    sf_pts = _lookup_points(sat_fat, SAT_FAT_THRESHOLDS)
    sug_pts = _lookup_points(sugars, SUGARS_THRESHOLDS)
    salt_pts = _lookup_points(salt, SALT_THRESHOLDS)
    N = e_pts + sf_pts + sug_pts + salt_pts

    # --- Good points ---
    fibre_pts = _lookup_points(fibre, FIBRE_THRESHOLDS)
    protein_pts = _lookup_points(protein, PROTEIN_THRESHOLDS)
    fv_pts = _fruit_veg_points(fv_pct)

    # Official rule: if N < 11, subtract all good points
    # If N >= 11 and fruit/veg >= 5 pts, subtract fruit/veg pts too
    if N < 11:
        P = fibre_pts + protein_pts + fv_pts
    else:
        # N >= 11: only subtract fruit/veg and fibre (not protein unless fv >= 5)
        if fv_pts >= 5:
            P = fibre_pts + protein_pts + fv_pts
        else:
            P = fibre_pts + fv_pts

    raw_score = N - P
    grade = _score_to_grade(raw_score, GENERAL_GRADES)
    score_10 = _score_to_1_10(raw_score)

    breakdown = [
        {
            "factor": "Energy",
            "value": f"{energy:.0f} kJ/100g",
            "points": e_pts,
            "direction": "bad",
            "explanation": f"{energy:.0f} kJ/100g",
        },
        {
            "factor": "Saturated Fat",
            "value": f"{sat_fat:.1f} g/100g",
            "points": sf_pts,
            "direction": "bad",
            "explanation": f"{sat_fat:.1f} g saturated fat/100g",
        },
        {
            "factor": "Sugars",
            "value": f"{sugars:.1f} g/100g",
            "points": sug_pts,
            "direction": "bad",
            "explanation": f"{sugars:.1f} g sugars/100g",
        },
        {
            "factor": "Salt",
            "value": f"{salt:.2f} g/100g",
            "points": salt_pts,
            "direction": "bad",
            "explanation": f"{salt:.2f} g salt/100g",
        },
        {
            "factor": "Fibre",
            "value": f"{fibre:.1f} g/100g",
            "points": fibre_pts,
            "direction": "good",
            "explanation": f"{fibre:.1f} g fibre/100g",
        },
        {
            "factor": "Protein",
            "value": f"{protein:.1f} g/100g",
            "points": protein_pts,
            "direction": "good",
            "explanation": f"{protein:.1f} g protein/100g",
        },
        {
            "factor": "Fruit/Veg/Nuts",
            "value": f"{fv_pct:.0f}%",
            "points": fv_pts,
            "direction": "good",
            "explanation": f"Estimated {fv_pct:.0f}% fruit/vegetable/nut content",
        },
    ]

    return {
        "raw_score": raw_score,
        "N_points": N,
        "P_points": P,
        "grade": grade,
        "score_1_to_10": score_10,
        "breakdown": breakdown,
        "is_beverage": False,
    }


def score_beverage(nutrition: dict) -> dict:
    """
    Score a beverage using stricter Nutri-Score beverage thresholds.

    Args:
        nutrition: dict with keys from per_100g.

    Returns:
        dict with raw_score, grade, score_1_to_10, breakdown, is_beverage.
    """
    n = nutrition

    if n.get("energy_kj") is not None:
        energy = _safe(n.get("energy_kj"))
    elif n.get("energy_kcal") is not None:
        energy = _safe(n.get("energy_kcal")) * 4.184
    else:
        energy = 0.0
    sugars = _safe(n.get("sugars_g"))

    if n.get("salt_g") is not None:
        salt = _safe(n.get("salt_g"))
    elif n.get("sodium_mg") is not None:
        salt = _safe(n.get("sodium_mg")) * 0.0025
    else:
        salt = 0.0

    sat_fat = _safe(n.get("saturated_fat_g"))
    fibre = _safe(n.get("fibre_g"))
    protein = _safe(n.get("protein_g"))

    # Beverage energy: 1pt per 30 kJ
    e_pts = min(10, int(energy / 30))
    # Beverage sugar: 1pt per 1.5g
    sug_pts = min(10, int(sugars / 1.5))
    sf_pts = _lookup_points(sat_fat, SAT_FAT_THRESHOLDS)
    salt_pts = _lookup_points(salt, SALT_THRESHOLDS)

    N = e_pts + sug_pts + sf_pts + salt_pts

    fibre_pts = _lookup_points(fibre, FIBRE_THRESHOLDS)
    protein_pts = _lookup_points(protein, PROTEIN_THRESHOLDS)
    P = fibre_pts + protein_pts

    raw_score = N - P
    grade = _score_to_grade(raw_score, BEVERAGE_GRADES)
    score_10 = _score_to_1_10(raw_score, is_beverage=True)

    breakdown = [
        {
            "factor": "Energy",
            "value": f"{energy:.0f} kJ/100ml",
            "points": e_pts,
            "direction": "bad",
            "explanation": f"{energy:.0f} kJ/100ml (beverage scale)",
        },
        {
            "factor": "Sugars",
            "value": f"{sugars:.1f} g/100ml",
            "points": sug_pts,
            "direction": "bad",
            "explanation": f"{sugars:.1f} g sugars/100ml (beverage scale)",
        },
        {
            "factor": "Saturated Fat",
            "value": f"{sat_fat:.1f} g/100ml",
            "points": sf_pts,
            "direction": "bad",
            "explanation": f"{sat_fat:.1f} g saturated fat/100ml",
        },
        {
            "factor": "Salt",
            "value": f"{salt:.2f} g/100ml",
            "points": salt_pts,
            "direction": "bad",
            "explanation": f"{salt:.2f} g salt/100ml",
        },
        {
            "factor": "Fibre",
            "value": f"{fibre:.1f} g/100ml",
            "points": fibre_pts,
            "direction": "good",
            "explanation": f"{fibre:.1f} g fibre/100ml",
        },
        {
            "factor": "Protein",
            "value": f"{protein:.1f} g/100ml",
            "points": protein_pts,
            "direction": "good",
            "explanation": f"{protein:.1f} g protein/100ml",
        },
    ]

    return {
        "raw_score": raw_score,
        "N_points": N,
        "P_points": P,
        "grade": grade,
        "score_1_to_10": score_10,
        "breakdown": breakdown,
        "is_beverage": True,
    }


def score_product(nutrition: dict, is_beverage: bool = False, fruit_veg_pct: float = 0.0) -> dict:
    """
    Unified scoring entry point.

    Args:
        nutrition: per_100g nutrition dict.
        is_beverage: use beverage scoring thresholds if True.
        fruit_veg_pct: estimated fruit/veg/nut percentage (general foods only).

    Returns:
        Scoring result dict.
    """
    if is_beverage:
        return score_beverage(nutrition)
    else:
        return score_general(nutrition, fruit_veg_pct)


def grade_color(grade: str) -> str:
    """Return a hex colour associated with the Nutri-Score grade."""
    colors = {
        "A": "#038141",
        "B": "#85BB2F",
        "C": "#FECB02",
        "D": "#EE8100",
        "E": "#E63312",
    }
    return colors.get(grade, "#888888")


def grade_emoji(grade: str) -> str:
    """Return an emoji for the grade."""
    emojis = {"A": "🟢", "B": "🟡", "C": "🟠", "D": "🔴", "E": "🛑"}
    return emojis.get(grade, "⚪")
