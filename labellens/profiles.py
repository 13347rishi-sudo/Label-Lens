"""
profiles.py - User health profiles for LabelLens.
Each profile adjusts how the nutritional score is interpreted and what warnings are shown.
"""

PROFILES = {
    "General": {
        "name": "General",
        "icon": "👤",
        "description": "Standard nutritional assessment for a healthy adult.",
        "weights": {
            "sugars": 1.0,
            "saturated_fat": 1.0,
            "salt": 1.0,
            "additives": 1.0,
        },
        "hard_warnings": [],
        "thresholds": {
            "high_sugar_g": 22.5,       # sugars per 100g considered high
            "high_salt_g": 1.5,         # salt per 100g considered high
            "high_sat_fat_g": 5.0,
        },
    },
    "Diabetic": {
        "name": "Diabetic",
        "icon": "🩺",
        "description": "Extra caution on sugars and high-GI carbohydrates. Elevated weight on salt for cardiovascular protection.",
        "weights": {
            "sugars": 2.0,
            "saturated_fat": 1.0,
            "salt": 1.3,
            "additives": 1.0,
        },
        "hard_warnings": ["high_sugar"],
        "thresholds": {
            "high_sugar_g": 15.0,       # stricter sugar threshold
            "high_salt_g": 1.5,
            "high_sat_fat_g": 5.0,
        },
    },
    "Nut Allergy": {
        "name": "Nut Allergy",
        "icon": "🥜",
        "description": "Any presence of nuts or peanuts triggers a DO NOT BUY warning.",
        "weights": {
            "sugars": 1.0,
            "saturated_fat": 1.0,
            "salt": 1.0,
            "additives": 1.0,
        },
        "hard_warnings": ["nuts", "peanuts"],
        "thresholds": {
            "high_sugar_g": 22.5,
            "high_salt_g": 1.5,
            "high_sat_fat_g": 5.0,
        },
    },
    "Child (Under 10)": {
        "name": "Child (Under 10)",
        "icon": "🧒",
        "description": "Stricter limits on sugars, salt, and additives for young children.",
        "weights": {
            "sugars": 1.5,
            "saturated_fat": 1.2,
            "salt": 1.5,
            "additives": 1.5,
        },
        "hard_warnings": ["high_additives", "high_salt"],
        "thresholds": {
            "high_sugar_g": 15.0,
            "high_salt_g": 1.0,            # children need much less salt
            "high_sat_fat_g": 4.0,
        },
    },
    "High Blood Pressure": {
        "name": "High Blood Pressure",
        "icon": "❤️",
        "description": "Heavily penalises salt/sodium. Any product with >1.5g salt/100g triggers a red warning.",
        "weights": {
            "sugars": 1.0,
            "saturated_fat": 1.2,
            "salt": 2.5,
            "additives": 1.0,
        },
        "hard_warnings": ["high_salt"],
        "thresholds": {
            "high_sugar_g": 22.5,
            "high_salt_g": 1.5,            # trigger warning above this
            "high_sat_fat_g": 5.0,
        },
    },
}


def get_profile(name: str) -> dict:
    """Return a profile dict by name, defaulting to General."""
    return PROFILES.get(name, PROFILES["General"])


def apply_profile(
    base_score: dict,
    knowledge_result: dict,
    nutrition: dict,
    profile_name: str = "General",
) -> dict:
    """
    Apply profile-specific adjustments to a scored product.

    Args:
        base_score: result from scoring.score_product().
        knowledge_result: result from knowledge.analyze_ingredients().
        nutrition: per_100g nutrition dict.
        profile_name: name of the profile to apply.

    Returns:
        dict with profile_name, adjusted_score_1_to_10, verdict, hard_warnings, advice.
    """
    profile = get_profile(profile_name)
    weights = profile["weights"]
    thresholds = profile["thresholds"]
    hard_warning_keys = profile["hard_warnings"]

    # Start from the base score + knowledge modifier
    raw_modifier = knowledge_result.get("score_modifier", 0.0)
    adjusted = base_score["score_1_to_10"] + raw_modifier

    # Apply profile-specific sugar weight penalty
    sugars = nutrition.get("sugars_g") or 0.0
    if sugars > thresholds["high_sugar_g"] and weights["sugars"] > 1.0:
        extra_penalty = (weights["sugars"] - 1.0) * 1.5
        adjusted -= extra_penalty

    # Apply profile-specific salt weight penalty
    salt = nutrition.get("salt_g") or 0.0
    if salt > thresholds["high_salt_g"] and weights["salt"] > 1.0:
        extra_penalty = (weights["salt"] - 1.0) * 1.5
        adjusted -= extra_penalty

    # Apply additive weight
    high_additives = knowledge_result.get("additives", {}).get("HIGH_CONCERN", [])
    if high_additives and weights["additives"] > 1.0:
        extra_penalty = len(high_additives) * (weights["additives"] - 1.0) * 0.3
        adjusted -= extra_penalty

    adjusted = round(max(1.0, min(10.0, adjusted)), 1)

    # --- Hard warnings (DO NOT BUY / RED ALERT) ---
    active_hard_warnings = []
    allergen_flags = knowledge_result.get("flags", {})

    for hw in hard_warning_keys:
        if hw == "high_sugar" and sugars > thresholds["high_sugar_g"]:
            active_hard_warnings.append(
                f"🚨 HIGH SUGAR: {sugars:.1f}g/100g exceeds the {profile_name} safe limit of {thresholds['high_sugar_g']}g"
            )
        elif hw == "high_salt" and salt > thresholds["high_salt_g"]:
            active_hard_warnings.append(
                f"🚨 HIGH SALT: {salt:.2f}g/100g exceeds the {profile_name} safe limit of {thresholds['high_salt_g']}g"
            )
        elif hw == "nuts" and allergen_flags.get("nuts"):
            active_hard_warnings.append(
                "🚨 DO NOT BUY: Contains NUTS — dangerous for nut allergy sufferers"
            )
        elif hw == "peanuts" and allergen_flags.get("peanuts"):
            active_hard_warnings.append(
                "🚨 DO NOT BUY: Contains PEANUTS — dangerous for peanut allergy sufferers"
            )
        elif hw == "high_additives" and len(high_additives) >= 2:
            active_hard_warnings.append(
                f"🚨 HIGH ADDITIVES: {len(high_additives)} concerning additives detected — not recommended for children"
            )

    # --- Overall verdict ---
    grade = base_score.get("grade", "C")
    is_critical = bool(active_hard_warnings)

    if is_critical:
        verdict = "⛔ AVOID"
        verdict_color = "#cc0000"
    elif adjusted >= 7.5:
        verdict = "✅ GOOD CHOICE"
        verdict_color = "#038141"
    elif adjusted >= 5.0:
        verdict = "⚠️ MODERATE"
        verdict_color = "#EE8100"
    elif adjusted >= 3.0:
        verdict = "❌ POOR CHOICE"
        verdict_color = "#cc3300"
    else:
        verdict = "⛔ VERY POOR"
        verdict_color = "#990000"

    # --- Advice bullets ---
    advice = []
    if grade in ("D", "E"):
        advice.append("Consider this only as an occasional treat, not a daily food.")
    if sugars > thresholds["high_sugar_g"]:
        advice.append(f"High in sugars ({sugars:.1f}g/100g). Check for hidden sugar aliases in ingredients.")
    if salt > thresholds["high_salt_g"]:
        advice.append(f"High in salt ({salt:.2f}g/100g). Excess salt raises blood pressure.")
    sat_fat = nutrition.get("saturated_fat_g") or 0.0
    if sat_fat > thresholds["high_sat_fat_g"]:
        advice.append(f"High in saturated fat ({sat_fat:.1f}g/100g). Linked to cardiovascular disease.")
    if knowledge_result.get("flags", {}).get("palm_oil"):
        advice.append("Contains palm oil — environmental and health concerns.")
    if not advice:
        advice.append("This product looks reasonable for most people.")

    return {
        "profile_name": profile_name,
        "profile_icon": profile["icon"],
        "adjusted_score_1_to_10": adjusted,
        "grade": grade,
        "verdict": verdict,
        "verdict_color": verdict_color,
        "hard_warnings": active_hard_warnings,
        "advice": advice,
        "is_critical": is_critical,
    }
