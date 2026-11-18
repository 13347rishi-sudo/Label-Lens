"""
LabelLens UI Components
Custom HTML components injected via st.markdown(html, unsafe_allow_html=True)
All functions return complete, self-contained HTML strings.
"""

from __future__ import annotations
from typing import Any
import functools


import re


def clean_html(func_or_str: Any) -> Any:
    """
    Decorator or helper to clean HTML of leading indentation and comments.
    Guarantees CommonMark/Streamlit markdown NEVER interprets HTML as code blocks,
    and ensures all HTML opening tags (<div style="...">) are closed on a single line
    without mid-tag line breaks.
    """
    def _sanitize(raw: str) -> str:
        if not raw:
            return ""
        # 1. Remove comments
        s = re.sub(r"<!--[\s\S]*?-->", "", str(raw))
        # 2. Collapse newlines and extra spaces inside tags so <div style="\n..."> becomes <div style="...">
        def _collapse_tag(m: re.Match) -> str:
            return re.sub(r"\s+", " ", m.group(0))
        s = re.sub(r"<[^>]+>", _collapse_tag, s)
        # 3. Strip leading indentation from each line
        lines = [line.strip() for line in s.splitlines() if line.strip()]
        return "\n".join(lines)

    if callable(func_or_str):
        @functools.wraps(func_or_str)
        def wrapper(*args, **kwargs):
            res = func_or_str(*args, **kwargs)
            return _sanitize(res) if isinstance(res, str) else res
        return wrapper
    else:
        return _sanitize(func_or_str)


# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------

GRADE_COLORS: dict[str, str] = {
    "A": "#00C851",
    "B": "#7BC67E",
    "C": "#FFD700",
    "D": "#FF9800",
    "E": "#FF4444",
}

GRADE_TEXT_DARK: set[str] = {"A", "B", "C"}  # grades where black text reads better

FLAG_COLORS: dict[str, str] = {
    "sugar":    "#FFB347",
    "allergen": "#FF4757",
    "additive": "#A78BFA",
    "palm":     "#F97316",
    "good":     "#00FF87",
    "bad":      "#FF4757",
    "neutral":  "#94A3B8",
}


# ---------------------------------------------------------------------------
# verdict_card
# ---------------------------------------------------------------------------

@clean_html
def verdict_card(
    score: float,
    grade: str,
    product_name: str,
    reasons: list[dict],
    warnings: list[dict],
    profile: str,
) -> str:
    """
    The main verdict card — most important component.

    Parameters
    ----------
    score        : float, 1–10
    grade        : "A"|"B"|"C"|"D"|"E"
    product_name : str
    reasons      : list of {"type": "good"|"bad", "text": str}
    warnings     : list of {"severity": "CRITICAL"|"HIGH"|"MEDIUM", "message": str, "flag": str}
    profile      : str  (active user profile label)
    """
    grade = grade.upper() if grade else "C"
    grade_color = GRADE_COLORS.get(grade, "#FFD700")
    grade_text_color = "#000" if grade in GRADE_TEXT_DARK else "#fff"
    score_pct = max(0, min(100, int(score * 10)))

    # --- DO NOT BUY banner ---
    critical_warnings = [w for w in (warnings or []) if w.get("severity") == "CRITICAL"]
    do_not_buy_html = ""
    if critical_warnings:
        reason_msg = critical_warnings[0].get("message", "Allergen detected")
        do_not_buy_html = f"""
        <div style="
            background: linear-gradient(135deg, #FF1744, #D50000);
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 20px;
            animation: pulse 2s ease-in-out infinite;
            text-align: center;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: white;
            border: 2px solid rgba(255,255,255,0.2);
        ">
            ⚠️ DO NOT BUY &mdash; {reason_msg}
        </div>
        """

    # --- Warning pills (non-critical) ---
    non_critical = [w for w in (warnings or []) if w.get("severity") != "CRITICAL"]
    warning_pills_html = ""
    if non_critical:
        pills = ""
        for w in non_critical[:4]:
            flag_type = w.get("flag", "bad")
            pill_color = FLAG_COLORS.get(flag_type, FLAG_COLORS["bad"])
            pills += f"""
            <span style="
                display: inline-flex; align-items: center; gap: 6px;
                background: {pill_color}20;
                border: 1px solid {pill_color}60;
                color: {pill_color};
                border-radius: 999px;
                padding: 5px 12px;
                font-size: 12px;
                font-weight: 600;
                margin: 3px;
                letter-spacing: 0.03em;
            ">⚡ {w.get('message', '')}</span>
            """
        warning_pills_html = f"""
        <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap;">
            {pills}
        </div>
        """

    # --- Key findings rows ---
    findings_html = ""
    for r in (reasons or [])[:4]:
        is_bad = r.get("type") == "bad"
        bar_color = "#FF4757" if is_bad else "#00FF87"
        icon = "🔴" if is_bad else "🟢"
        findings_html += f"""
        <div style="
            display: flex; align-items: flex-start; gap: 12px;
            padding: 12px 16px; margin-bottom: 8px;
            background: rgba(255,255,255,0.03);
            border-radius: 10px;
            border-left: 3px solid {bar_color};
            transition: background 150ms ease;
        ">
            <span style="font-size: 16px; flex-shrink: 0; margin-top: 1px;">{icon}</span>
            <span style="font-size: 14px; color: #CBD5E1; line-height: 1.5;">{r.get('text', '')}</span>
        </div>
        """

    return f"""
    <style>
    @keyframes pulse {{
        0%, 100% {{ box-shadow: 0 0 0 0 rgba(255,23,68,0.4); }}
        50%       {{ box-shadow: 0 0 0 20px rgba(255,23,68,0); }}
    }}
    @keyframes gradeFloat {{
        0%, 100% {{ transform: translateY(0px); }}
        50%       {{ transform: translateY(-6px); }}
    }}
    @keyframes scoreReveal {{
        from {{ width: 0; opacity: 0; }}
        to   {{ width: {score_pct}%; opacity: 1; }}
    }}
    @keyframes cardFadeIn {{
        from {{ opacity: 0; transform: translateY(16px); }}
        to   {{ opacity: 1; transform: translateY(0); }}
    }}
    </style>

    {do_not_buy_html}

    <div style="
        background: #161D2F;
        border-radius: 20px;
        padding: 32px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);
        animation: cardFadeIn 500ms cubic-bezier(0.23, 1, 0.32, 1) both;
    ">

        <!-- Header: product name + grade badge -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
            <div style="flex: 1; padding-right: 20px;">
                <div style="
                    font-size: 11px; color: #64748B; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;
                ">Analysis Complete</div>
                <div style="
                    font-size: 26px; font-weight: 800; color: #F8FAFC;
                    letter-spacing: -0.02em; line-height: 1.2; max-width: 480px;
                ">{product_name}</div>
                <div style="font-size: 13px; color: #64748B; margin-top: 6px;">
                    Profile: <span style="color: #94A3B8; font-weight: 500;">{profile}</span>
                </div>
            </div>

            <!-- Animated grade badge -->
            <div style="
                text-align: center;
                animation: gradeFloat 3s ease-in-out infinite;
                flex-shrink: 0;
            ">
                <div style="
                    width: 84px; height: 84px; border-radius: 50%;
                    background: {grade_color};
                    display: flex; align-items: center; justify-content: center;
                    font-size: 38px; font-weight: 900; color: {grade_text_color};
                    box-shadow: 0 0 40px {grade_color}50, 0 8px 24px rgba(0,0,0,0.4);
                ">{grade}</div>
                <div style="font-size: 11px; color: #94A3B8; margin-top: 8px; font-weight: 600;
                            text-transform: uppercase; letter-spacing: 0.08em;">
                    Nutri-Score
                </div>
            </div>
        </div>

        <!-- Animated score bar -->
        <div style="margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 13px; color: #94A3B8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;">
                    Overall Score
                </span>
                <span style="font-size: 22px; font-weight: 800; color: #F8FAFC;">
                    {score:.1f} <span style="font-size: 14px; color: #64748B; font-weight: 400;">/ 10</span>
                </span>
            </div>
            <div style="
                height: 10px; background: rgba(255,255,255,0.08);
                border-radius: 999px; overflow: hidden;
            ">
                <div style="
                    height: 100%; width: {score_pct}%;
                    border-radius: 999px;
                    background: linear-gradient(90deg, {grade_color}, {grade_color}CC);
                    animation: scoreReveal 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                    box-shadow: 0 0 12px {grade_color}70;
                "></div>
            </div>
            <!-- Grade scale labels -->
            <div style="display: flex; justify-content: space-between; margin-top: 6px;">
                <span style="font-size: 10px; color: #475569;">Poor</span>
                <span style="font-size: 10px; color: #475569;">Excellent</span>
            </div>
        </div>

        <!-- Warning pills -->
        {warning_pills_html}

        <!-- Key findings -->
        <div style="margin-bottom: 20px;">
            <div style="
                font-size: 11px; color: #64748B; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px;
            ">Key Findings</div>
            {findings_html}
        </div>

        <!-- Disclaimer -->
        <div style="
            font-size: 12px; color: #475569; padding: 12px 16px;
            background: rgba(255,255,255,0.03); border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.05);
            line-height: 1.5;
        ">
            ℹ️ Results are informational only. Always verify allergens on the physical packaging.
        </div>
    </div>
    """


# ---------------------------------------------------------------------------
# score_gauge — animated circular SVG gauge
# ---------------------------------------------------------------------------

@clean_html
def score_gauge(score: float, grade: str) -> str:
    """Animated circular SVG gauge for score display."""
    grade = grade.upper() if grade else "C"
    grade_color = GRADE_COLORS.get(grade, "#FFD700")
    grade_text_color = "#000" if grade in GRADE_TEXT_DARK else "#fff"

    # SVG circle math: circumference of r=52 circle = 2π*52 ≈ 326.7
    radius = 52
    circumference = 2 * 3.14159 * radius
    filled = circumference * (score / 10.0)
    dash_offset = circumference - filled

    return f"""
    <style>
    @keyframes gaugeReveal {{
        from {{ stroke-dashoffset: {circumference:.1f}; }}
        to   {{ stroke-dashoffset: {dash_offset:.1f}; }}
    }}
    </style>
    <div style="
        display: flex; flex-direction: column; align-items: center;
        padding: 24px; gap: 12px;
    ">
        <div style="position: relative; width: 140px; height: 140px;">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <!-- Background ring -->
                <circle cx="70" cy="70" r="{radius}" fill="none"
                    stroke="rgba(255,255,255,0.08)" stroke-width="12"/>
                <!-- Score arc -->
                <circle cx="70" cy="70" r="{radius}" fill="none"
                    stroke="{grade_color}" stroke-width="12"
                    stroke-linecap="round"
                    stroke-dasharray="{circumference:.1f}"
                    stroke-dashoffset="{circumference:.1f}"
                    transform="rotate(-90 70 70)"
                    style="
                        animation: gaugeReveal 1.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                        filter: drop-shadow(0 0 8px {grade_color}80);
                    "/>
            </svg>
            <!-- Centre text -->
            <div style="
                position: absolute; inset: 0;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
            ">
                <span style="
                    font-size: 30px; font-weight: 800; color: #F8FAFC;
                    line-height: 1; letter-spacing: -0.03em;
                ">{score:.1f}</span>
                <span style="font-size: 11px; color: #64748B; font-weight: 500;">/10</span>
            </div>
        </div>

        <!-- Grade badge -->
        <div style="
            width: 44px; height: 44px; border-radius: 50%;
            background: {grade_color}; color: {grade_text_color};
            display: flex; align-items: center; justify-content: center;
            font-size: 20px; font-weight: 900;
            box-shadow: 0 4px 16px {grade_color}50;
        ">{grade}</div>
        <div style="font-size: 12px; color: #94A3B8; font-weight: 500;">Nutri-Score</div>
    </div>
    """


# ---------------------------------------------------------------------------
# ingredient_list_with_flags — colour-coded chips
# ---------------------------------------------------------------------------

@clean_html
def ingredient_list_with_flags(
    ingredients: list[str],
    flags: dict[str, str],
) -> str:
    """
    Colour-coded ingredient chips/pills. Red = flagged.

    Parameters
    ----------
    ingredients : ordered list of ingredient names (lowercase ok)
    flags       : dict mapping ingredient name → flag type
                  ("sugar"|"allergen"|"additive"|"palm"|"good")
    """
    if not ingredients:
        return """
        <div style="color: #64748B; font-style: italic; padding: 16px;">
            No ingredients data available.
        </div>
        """

    chips_html = ""
    for ing in ingredients:
        flag_type = flags.get(ing.lower(), flags.get(ing, None))
        if not flag_type:
            # Substring match against flag keys
            ing_lower = ing.lower()
            for k, ftype in flags.items():
                if k and (k in ing_lower or ing_lower in k):
                    flag_type = ftype
                    break

        if flag_type:
            chip_color = FLAG_COLORS.get(flag_type, FLAG_COLORS["neutral"])
            icon_map = {
                "allergen": "⚠️",
                "sugar":    "🍬",
                "additive": "🧪",
                "palm":     "🌴",
                "good":     "✅",
                "bad":      "🔴",
            }
            icon = icon_map.get(flag_type, "⚡")
            label_map = {
                "allergen": "Allergen",
                "sugar":    "Hidden Sugar",
                "additive": "Additive",
                "palm":     "Palm Oil",
                "good":     "Beneficial",
                "bad":      "Flagged",
            }
            label = label_map.get(flag_type, flag_type.title())
            chips_html += f"""
            <span style="
                display: inline-flex; align-items: center; gap: 5px;
                background: {chip_color}18;
                border: 1px solid {chip_color}60;
                color: {chip_color};
                border-radius: 999px;
                padding: 5px 12px;
                font-size: 13px;
                font-weight: 600;
                margin: 3px;
                cursor: default;
                position: relative;
            " title="{label}">
                {icon} {ing}
            </span>
            """
        else:
            chips_html += f"""
            <span style="
                display: inline-flex; align-items: center;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #94A3B8;
                border-radius: 999px;
                padding: 5px 12px;
                font-size: 13px;
                margin: 3px;
            ">{ing}</span>
            """

    # Build legend
    present_flags = set(flags.values())
    legend_items = {
        "allergen": ("⚠️", "#FF4757", "Allergen"),
        "sugar":    ("🍬", "#FFB347", "Hidden Sugar"),
        "additive": ("🧪", "#A78BFA", "Additive"),
        "palm":     ("🌴", "#F97316", "Palm Oil"),
        "good":     ("✅", "#00FF87", "Beneficial"),
    }
    legend_html = ""
    for key, (icon, color, label) in legend_items.items():
        if key in present_flags:
            legend_html += f"""
            <span style="display:inline-flex;align-items:center;gap:4px;
                font-size:11px;color:{color};margin-right:12px;">
                {icon} {label}
            </span>
            """

    return f"""
    <div style="
        background: #161D2F; border-radius: 16px; padding: 24px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    ">
        <div style="
            font-size: 11px; color: #64748B; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px;
        ">Ingredients ({len(ingredients)} items)</div>

        <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;">
            {chips_html}
        </div>

        {f'<div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">{legend_html}</div>' if legend_html else ''}
    </div>
    """


# ---------------------------------------------------------------------------
# nutrition_grid — bento-style grid of nutrient cards
# ---------------------------------------------------------------------------

@clean_html
def nutrition_grid(per_100g: dict[str, Any]) -> str:
    """
    Bento-style nutrition grid of cards — NOT a table.

    per_100g keys: energy_kcal, energy_kj, sugars_g, saturated_fat_g,
                   salt_g, sodium_mg, fibre_g, protein_g, fat_g, carbs_g
    """
    def _val(key: str, unit: str = "", decimals: int = 1) -> str:
        v = per_100g.get(key)
        if v is None:
            return "—"
        try:
            return f"{float(v):.{decimals}f}{unit}"
        except (TypeError, ValueError):
            return str(v)

    def _traffic_light(key: str, bad_above: float | None, warn_above: float | None) -> str:
        """Return colour based on thresholds (bad_above is red, warn_above is amber)."""
        v = per_100g.get(key)
        if v is None:
            return "#64748B"
        try:
            fv = float(v)
        except (TypeError, ValueError):
            return "#64748B"
        if bad_above is not None and fv > bad_above:
            return "#FF4444"
        if warn_above is not None and fv > warn_above:
            return "#FFD700"
        return "#00FF87"

    nutrients = [
        {
            "label": "Energy",
            "value": _val("energy_kcal", " kcal", 0),
            "sub":   _val("energy_kj", " kJ", 0),
            "icon":  "⚡",
            "color": "#60A5FA",
            "span":  2,
        },
        {
            "label": "Total Fat",
            "value": _val("fat_g", "g"),
            "sub":   "per 100g",
            "icon":  "🫙",
            "color": _traffic_light("fat_g", 20, 10),
            "span":  1,
        },
        {
            "label": "Saturated Fat",
            "value": _val("saturated_fat_g", "g"),
            "sub":   "per 100g",
            "icon":  "🧈",
            "color": _traffic_light("saturated_fat_g", 5, 2),
            "span":  1,
        },
        {
            "label": "Carbohydrates",
            "value": _val("carbs_g", "g"),
            "sub":   "per 100g",
            "icon":  "🌾",
            "color": "#94A3B8",
            "span":  1,
        },
        {
            "label": "Sugars",
            "value": _val("sugars_g", "g"),
            "sub":   "per 100g",
            "icon":  "🍬",
            "color": _traffic_light("sugars_g", 22.5, 9),
            "span":  1,
        },
        {
            "label": "Protein",
            "value": _val("protein_g", "g"),
            "sub":   "per 100g",
            "icon":  "💪",
            "color": "#00FF87",
            "span":  1,
        },
        {
            "label": "Dietary Fibre",
            "value": _val("fibre_g", "g"),
            "sub":   "per 100g",
            "icon":  "🌿",
            "color": "#00C851",
            "span":  1,
        },
        {
            "label": "Salt",
            "value": _val("salt_g", "g"),
            "sub":   f"Na: {_val('sodium_mg', 'mg', 0)}",
            "icon":  "🧂",
            "color": _traffic_light("salt_g", 1.5, 0.6),
            "span":  1,
        },
    ]

    cards_html = ""
    for n in nutrients:
        span_style = "grid-column: span 2;" if n["span"] == 2 else ""
        cards_html += f"""
        <div style="
            {span_style}
            background: #1E2A3A;
            border-radius: 12px;
            padding: 18px 20px;
            border: 1px solid rgba(255,255,255,0.07);
            transition: transform 180ms ease, box-shadow 180ms ease;
            position: relative;
            overflow: hidden;
        ">
            <!-- Accent bar -->
            <div style="
                position: absolute; top: 0; left: 0; right: 0; height: 3px;
                background: {n['color']};
                border-radius: 12px 12px 0 0;
            "></div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="font-size: 20px; margin-bottom: 6px;">{n['icon']}</div>
                    <div style="font-size: 11px; color: #64748B; font-weight: 600;
                                text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                        {n['label']}
                    </div>
                    <div style="font-size: 24px; font-weight: 800; color: {n['color']};
                                letter-spacing: -0.02em; line-height: 1;">
                        {n['value']}
                    </div>
                    <div style="font-size: 11px; color: #475569; margin-top: 4px;">{n['sub']}</div>
                </div>
            </div>
        </div>
        """

    return f"""
    <div style="
        background: #161D2F; border-radius: 16px; padding: 24px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);
    ">
        <div style="
            font-size: 11px; color: #64748B; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px;
        ">Nutrition per 100g</div>
        <div style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
        ">
            {cards_html}
        </div>
        <div style="
            margin-top: 16px; padding-top: 12px;
            border-top: 1px solid rgba(255,255,255,0.06);
            font-size: 11px; color: #475569;
            display: flex; gap: 16px; align-items: center;
        ">
            <span>🟢 Low</span><span>🟡 Medium</span><span>🔴 High</span>
            <span style="margin-left: auto;">per 100g</span>
        </div>
    </div>
    """


# ---------------------------------------------------------------------------
# comparison_card
# ---------------------------------------------------------------------------

@clean_html
def comparison_card(
    product_a: dict,
    product_b: dict,
    verdict: str,
) -> str:
    """
    Side-by-side comparison card.

    product_a / product_b keys:
        name, score (float), grade (str), per_100g (dict)
    verdict: "A" | "B" | "tie"
    """
    def _side(product: dict, side: str, is_winner: bool) -> str:
        grade = (product.get("grade") or "C").upper()
        grade_color = GRADE_COLORS.get(grade, "#FFD700")
        grade_text = "#000" if grade in GRADE_TEXT_DARK else "#fff"
        score = product.get("score", 0.0)
        name = product.get("name", "Unknown")
        p100 = product.get("per_100g") or {}

        winner_badge = ""
        if is_winner:
            winner_badge = """
            <div style="
                display: inline-flex; align-items: center; gap: 6px;
                background: rgba(0,255,135,0.15); border: 1px solid #00FF87;
                color: #00FF87; border-radius: 999px;
                padding: 4px 12px; font-size: 11px; font-weight: 700;
                text-transform: uppercase; letter-spacing: 0.08em;
                margin-bottom: 12px;
            ">🏆 Better Choice</div>
            """

        def row(label: str, key: str, unit: str = "g") -> str:
            v = p100.get(key)
            val_str = f"{float(v):.1f}{unit}" if v is not None else "—"
            return f"""
            <div style="display:flex; justify-content:space-between;
                padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span style="font-size:13px; color:#64748B;">{label}</span>
                <span style="font-size:13px; font-weight:600; color:#F8FAFC;">{val_str}</span>
            </div>
            """

        return f"""
        <div style="
            background: {'rgba(0,255,135,0.05)' if is_winner else '#1E2A3A'};
            border-radius: 14px; padding: 24px;
            border: {'2px solid rgba(0,255,135,0.4)' if is_winner else '1px solid rgba(255,255,255,0.07)'};
            flex: 1;
        ">
            {winner_badge}
            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;
                        letter-spacing: 0.08em; margin-bottom: 6px;">Product {side}</div>
            <div style="font-size: 20px; font-weight: 800; color: #F8FAFC;
                        margin-bottom: 20px; line-height: 1.2;">{name}</div>

            <!-- Grade + score -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                <div style="
                    width: 56px; height: 56px; border-radius: 50%;
                    background: {grade_color}; color: {grade_text};
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px; font-weight: 900;
                    box-shadow: 0 4px 16px {grade_color}50;
                ">{grade}</div>
                <div>
                    <div style="font-size: 28px; font-weight: 800; color: {grade_color};
                                letter-spacing: -0.02em;">{score:.1f}</div>
                    <div style="font-size: 11px; color: #64748B;">/ 10 score</div>
                </div>
            </div>

            <!-- Key nutrients -->
            <div>
                {row("Sugar", "sugars_g")}
                {row("Sat. Fat", "saturated_fat_g")}
                {row("Salt", "salt_g")}
                {row("Protein", "protein_g")}
                {row("Fibre", "fibre_g")}
                {row("Calories", "energy_kcal", " kcal")}
            </div>
        </div>
        """

    winner_a = verdict == "A"
    winner_b = verdict == "B"
    tie_html = ""
    if verdict == "tie":
        tie_html = """
        <div style="
            text-align: center; font-size: 15px; font-weight: 700; color: #94A3B8;
            padding: 12px; background: rgba(255,255,255,0.03);
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
            margin-bottom: 16px;
        ">🤝 It's a tie — both products are very similar</div>
        """

    return f"""
    <div style="
        background: #161D2F; border-radius: 20px; padding: 28px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    ">
        <div style="
            font-size: 11px; color: #64748B; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px;
        ">Head-to-Head Comparison</div>

        {tie_html}

        <div style="display: flex; gap: 16px;">
            {_side(product_a, 'A', winner_a)}
            {_side(product_b, 'B', winner_b)}
        </div>
    </div>
    """


# ---------------------------------------------------------------------------
# status_indicator — sidebar Ollama status pill
# ---------------------------------------------------------------------------

@clean_html
def status_indicator(ollama_running: bool, model_name: str) -> str:
    """Sidebar status pill for Ollama connection."""
    if ollama_running:
        dot_color = "#00FF87"
        status_text = "Connected"
        bg_color = "rgba(0, 255, 135, 0.1)"
        border_color = "rgba(0, 255, 135, 0.3)"
        label_color = "#00FF87"
        pulse_anim = "animation: statusPulse 2s ease-in-out infinite;"
    else:
        dot_color = "#FF4757"
        status_text = "Offline"
        bg_color = "rgba(255, 71, 87, 0.1)"
        border_color = "rgba(255, 71, 87, 0.3)"
        label_color = "#FF4757"
        pulse_anim = ""

    return f"""
    <style>
    @keyframes statusPulse {{
        0%, 100% {{ box-shadow: 0 0 0 0 {dot_color}60; }}
        50%       {{ box-shadow: 0 0 0 6px {dot_color}00; }}
    }}
    </style>

    <div style="
        background: {bg_color};
        border: 1px solid {border_color};
        border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
    ">
        <!-- Status pill -->
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="
                width: 10px; height: 10px; border-radius: 50%;
                background: {dot_color};
                flex-shrink: 0;
                {pulse_anim}
            "></div>
            <span style="font-size: 13px; font-weight: 700; color: {label_color};
                         text-transform: uppercase; letter-spacing: 0.08em;">
                Ollama {status_text}
            </span>
        </div>

        <!-- Model name -->
        <div style="
            display: flex; align-items: center; gap: 8px;
            padding: 8px 10px; background: rgba(0,0,0,0.3); border-radius: 8px;
        ">
            <span style="font-size: 11px; color: #64748B; flex-shrink: 0;">MODEL</span>
            <span style="
                font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
                font-size: 12px; color: #CBD5E1; font-weight: 600;
            ">{model_name}</span>
        </div>

        {f'<div style="font-size:11px;color:#64748B;margin-top:10px;line-height:1.5;">Start Ollama and run:<br><code style=\'color:#A78BFA\'>ollama pull qwen3-vl:8b</code></div>' if not ollama_running else ''}
    </div>
    """


# ---------------------------------------------------------------------------
# loading_skeleton — matches verdict card shape
# ---------------------------------------------------------------------------

@clean_html
def loading_skeleton() -> str:
    """Skeleton loader matching the verdict card shape."""
    return """
    <style>
    @keyframes shimmer {
        0%   { background-position: -800px 0; }
        100% { background-position:  800px 0; }
    }
    .sk {
        background: linear-gradient(
            90deg,
            #161D2F 25%, #1E2A3A 50%, #161D2F 75%
        );
        background-size: 800px 100%;
        animation: shimmer 1.6s infinite linear;
        border-radius: 8px;
    }
    </style>

    <div style="
        background: #161D2F; border-radius: 20px; padding: 32px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    ">
        <!-- Header row -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
            <div style="flex: 1; padding-right: 20px;">
                <div class="sk" style="height: 10px; width: 120px; margin-bottom: 12px;"></div>
                <div class="sk" style="height: 28px; width: 280px; margin-bottom: 10px;"></div>
                <div class="sk" style="height: 12px; width: 100px;"></div>
            </div>
            <!-- Grade badge skeleton -->
            <div class="sk" style="width: 84px; height: 84px; border-radius: 50%; flex-shrink: 0;"></div>
        </div>

        <!-- Score bar skeleton -->
        <div style="margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div class="sk" style="height: 12px; width: 100px;"></div>
                <div class="sk" style="height: 22px; width: 60px;"></div>
            </div>
            <div class="sk" style="height: 10px; width: 100%;"></div>
        </div>

        <!-- Findings skeleton -->
        <div style="margin-bottom: 20px;">
            <div class="sk" style="height: 10px; width: 80px; margin-bottom: 14px;"></div>
            <div class="sk" style="height: 50px; width: 100%; margin-bottom: 8px;"></div>
            <div class="sk" style="height: 50px; width: 100%; margin-bottom: 8px;"></div>
            <div class="sk" style="height: 50px; width: 100%;"></div>
        </div>

        <!-- Disclaimer skeleton -->
        <div class="sk" style="height: 40px; width: 100%;"></div>
    </div>
    """


# ---------------------------------------------------------------------------
# demo_product_card — grid card for the Demo tab
# ---------------------------------------------------------------------------

@clean_html
def demo_product_card(
    product: dict,
    index: int = 0,
) -> str:
    """
    Animated card for the demo product grid.

    product keys: name, score, grade, category, description, per_100g
    """
    grade = (product.get("grade") or "C").upper()
    grade_color = GRADE_COLORS.get(grade, "#FFD700")
    grade_text = "#000" if grade in GRADE_TEXT_DARK else "#fff"
    score = product.get("score", 5.0)
    score_pct = max(0, min(100, int(score * 10)))
    name = product.get("name", "Unknown Product")
    category = product.get("category", "Food")
    description = product.get("description", "")
    delay = index * 80

    return f"""
    <div style="
        background: #161D2F;
        border-radius: 16px; padding: 24px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
        animation: fadeInUp 500ms {delay}ms cubic-bezier(0.23, 1, 0.32, 1) both;
        transition: transform 220ms cubic-bezier(0.23,1,0.32,1),
                    box-shadow 220ms ease;
        height: 100%;
        position: relative;
        overflow: hidden;
    ">
        <!-- Top accent line -->
        <div style="
            position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: {grade_color};
            border-radius: 16px 16px 0 0;
        "></div>

        <!-- Grade badge -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
                <div style="font-size: 11px; color: #64748B; font-weight: 600;
                            text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                    {category}
                </div>
                <div style="font-size: 17px; font-weight: 800; color: #F8FAFC;
                            letter-spacing: -0.01em; line-height: 1.2;">
                    {name}
                </div>
            </div>
            <div style="
                width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
                background: {grade_color}; color: {grade_text};
                display: flex; align-items: center; justify-content: center;
                font-size: 20px; font-weight: 900; margin-left: 12px;
                box-shadow: 0 4px 12px {grade_color}50;
            ">{grade}</div>
        </div>

        <!-- Description -->
        <div style="font-size: 13px; color: #64748B; margin-bottom: 16px; line-height: 1.5;">
            {description}
        </div>

        <!-- Score bar -->
        <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; color: #64748B; text-transform: uppercase;
                             letter-spacing: 0.08em;">Score</span>
                <span style="font-size: 15px; font-weight: 800; color: {grade_color};">{score:.1f}</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.08);
                        border-radius: 999px; overflow: hidden;">
                <div style="
                    height: 100%; width: {score_pct}%;
                    background: {grade_color};
                    border-radius: 999px;
                    box-shadow: 0 0 8px {grade_color}50;
                "></div>
            </div>
        </div>
    </div>
    <style>
    @keyframes fadeInUp {{
        from {{ opacity: 0; transform: translateY(20px); }}
        to   {{ opacity: 1; transform: translateY(0); }}
    }}
    </style>
    """


# ---------------------------------------------------------------------------
# history_card — single scan history entry
# ---------------------------------------------------------------------------

@clean_html
def history_card(scan: dict, index: int = 0) -> str:
    """
    Card for a single history entry.

    scan keys: product_name, grade, score, profile, timestamp,
               warnings (list), scan_id
    """
    grade = (scan.get("grade") or "C").upper()
    grade_color = GRADE_COLORS.get(grade, "#FFD700")
    grade_text = "#000" if grade in GRADE_TEXT_DARK else "#fff"
    score = scan.get("score", 0.0)
    score_pct = max(0, min(100, int(score * 10)))
    name = scan.get("product_name", "Unknown Product")
    profile = scan.get("profile", "General")
    ts = scan.get("timestamp", "")
    delay = index * 50

    warning_count = len(scan.get("warnings", []))
    warning_badge = ""
    if warning_count > 0:
        warning_badge = f"""
        <span style="
            background: rgba(255,71,87,0.15); border: 1px solid rgba(255,71,87,0.4);
            color: #FF4757; border-radius: 999px; padding: 3px 10px;
            font-size: 11px; font-weight: 700;
        ">⚠ {warning_count} warning{'s' if warning_count > 1 else ''}</span>
        """

    return f"""
    <div style="
        background: #161D2F; border-radius: 14px; padding: 20px 24px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        display: flex; align-items: center; gap: 20px;
        margin-bottom: 12px;
        animation: fadeInUp 400ms {delay}ms cubic-bezier(0.23, 1, 0.32, 1) both;
        transition: transform 180ms ease, box-shadow 180ms ease;
    ">
        <!-- Grade badge -->
        <div style="
            width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
            background: {grade_color}; color: {grade_text};
            display: flex; align-items: center; justify-content: center;
            font-size: 22px; font-weight: 900;
            box-shadow: 0 4px 16px {grade_color}40;
        ">{grade}</div>

        <!-- Main info -->
        <div style="flex: 1; min-width: 0;">
            <div style="font-size: 16px; font-weight: 700; color: #F8FAFC;
                        margin-bottom: 4px; white-space: nowrap; overflow: hidden;
                        text-overflow: ellipsis;">
                {name}
            </div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; color: #64748B;">{profile}</span>
                <span style="font-size: 12px; color: #374151;">•</span>
                <span style="font-size: 12px; color: #64748B;">{ts}</span>
                {warning_badge}
            </div>
        </div>

        <!-- Score + mini bar -->
        <div style="text-align: right; flex-shrink: 0; min-width: 80px;">
            <div style="font-size: 20px; font-weight: 800; color: {grade_color};
                        letter-spacing: -0.02em;">{score:.1f}</div>
            <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">/ 10</div>
            <div style="height: 4px; background: rgba(255,255,255,0.08);
                        border-radius: 999px; overflow: hidden; width: 80px;">
                <div style="height: 100%; width: {score_pct}%;
                            background: {grade_color}; border-radius: 999px;"></div>
            </div>
        </div>
    </div>
    """


# ---------------------------------------------------------------------------
# hero_header — full-width branded header
# ---------------------------------------------------------------------------

@clean_html
def hero_header() -> str:
    """Full-width branded hero header for the app."""
    return """
    <style>
    @keyframes heroReveal {
        from { opacity: 0; transform: translateY(-12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes accentPulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.7; }
    }
    </style>
    <div style="
        text-align: center; padding: 48px 24px 36px;
        animation: heroReveal 600ms cubic-bezier(0.23, 1, 0.32, 1) both;
        position: relative;
    ">
        <!-- Glow backdrop -->
        <div style="
            position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
            width: 300px; height: 100px;
            background: radial-gradient(ellipse, rgba(0,255,135,0.12) 0%, transparent 70%);
            pointer-events: none;
        "></div>

        <!-- Icon + wordmark -->
        <div style="
            display: inline-flex; align-items: center; gap: 16px;
            margin-bottom: 16px;
        ">
            <div style="
                font-size: 48px; line-height: 1;
                filter: drop-shadow(0 0 20px rgba(0,255,135,0.5));
                animation: accentPulse 3s ease-in-out infinite;
            ">🔬</div>
            <div style="
                font-size: 48px; font-weight: 900;
                color: #F8FAFC;
                letter-spacing: -0.04em;
                line-height: 1;
            ">Label<span style="color: #00FF87;">Lens</span></div>
        </div>

        <!-- Subtitle -->
        <div style="
            font-size: 16px; color: #64748B; font-weight: 400;
            max-width: 480px; margin: 0 auto; line-height: 1.6;
        ">
            AI-powered food label analysis. <span style="color: #94A3B8;">100% offline. </span>
            Instant Nutri-Score. No internet required.
        </div>

        <!-- Tag chips -->
        <div style="
            display: flex; gap: 8px; justify-content: center;
            flex-wrap: wrap; margin-top: 20px;
        ">
            <span style="
                background: rgba(0,255,135,0.1); border: 1px solid rgba(0,255,135,0.3);
                color: #00FF87; border-radius: 999px; padding: 5px 14px; font-size: 12px;
                font-weight: 600; letter-spacing: 0.04em;
            ">🤖 Offline AI</span>
            <span style="
                background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.3);
                color: #60A5FA; border-radius: 999px; padding: 5px 14px; font-size: 12px;
                font-weight: 600; letter-spacing: 0.04em;
            ">📊 Nutri-Score</span>
            <span style="
                background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.3);
                color: #A78BFA; border-radius: 999px; padding: 5px 14px; font-size: 12px;
                font-weight: 600; letter-spacing: 0.04em;
            ">👤 5 Profiles</span>
            <span style="
                background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3);
                color: #F97316; border-radius: 999px; padding: 5px 14px; font-size: 12px;
                font-weight: 600; letter-spacing: 0.04em;
            ">⚠️ Allergen Check</span>
        </div>
    </div>
    """


# ---------------------------------------------------------------------------
# warning_banner — full-width alert banner
# ---------------------------------------------------------------------------

@clean_html
def warning_banner(warnings: list[dict]) -> str:
    """Full-width animated warning banner for HIGH-severity items."""
    if not warnings:
        return ""

    items_html = ""
    for w in warnings:
        severity = w.get("severity", "MEDIUM")
        flag = w.get("flag", "bad")
        msg = w.get("message", "")
        icon_map = {
            "allergen": "⚠️",
            "sugar":    "🍬",
            "additive": "🧪",
            "palm":     "🌴",
            "bad":      "🔴",
        }
        icon = icon_map.get(flag, "⚡")
        color = FLAG_COLORS.get(flag, FLAG_COLORS["bad"])

        items_html += f"""
        <div style="
            display: flex; align-items: center; gap: 10px;
            padding: 10px 16px; margin-bottom: 6px;
            background: {color}18;
            border: 1px solid {color}40;
            border-radius: 10px;
        ">
            <span style="font-size: 18px;">{icon}</span>
            <span style="font-size: 14px; color: #CBD5E1; font-weight: 500;">
                {msg}
            </span>
            <span style="
                margin-left: auto;
                font-size: 10px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.08em; color: {color};
            ">{severity}</span>
        </div>
        """

    return f"""
    <div style="
        background: rgba(255,71,87,0.06);
        border: 1px solid rgba(255,71,87,0.25);
        border-radius: 14px; padding: 20px;
        margin-bottom: 20px;
    ">
        <div style="
            font-size: 11px; color: #FF4757; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px;
            display: flex; align-items: center; gap: 8px;
        ">⚡ Flags Detected</div>
        {items_html}
    </div>
    """


# ---------------------------------------------------------------------------
# Data conversion helpers
# ---------------------------------------------------------------------------

def extract_flags_dict(k_res: dict) -> dict[str, str]:
    """
    Build an ingredient -> flag_type dict from knowledge analysis result.
    flag_type in {"sugar", "palm", "allergen", "additive"}.
    """
    flags: dict[str, str] = {}
    if not k_res:
        return flags

    for s in k_res.get("hidden_sugars", []):
        text = s.get("ingredient_text") or s.get("sugar_alias", "")
        if text:
            flags[text.lower()] = "sugar"

    for p in k_res.get("palm_oil", []):
        text = p.get("ingredient_text") or p.get("matched_variant", "")
        if text:
            flags[text.lower()] = "palm"

    for _, a_info in k_res.get("allergens", {}).items():
        if isinstance(a_info, dict):
            for term in a_info.get("matched_terms", []):
                flags[term.lower()] = "allergen"

    additives = k_res.get("additives", {})
    for item in additives.get("HIGH_CONCERN", []):
        for key in ("code", "name", "matched_as"):
            val = item.get(key)
            if val:
                flags[val.lower()] = "additive"

    for item in additives.get("MEDIUM_CONCERN", []):
        for key in ("code", "name", "matched_as"):
            val = item.get(key)
            if val:
                flags[val.lower()] = "additive"

    return flags


def prepare_verdict_inputs(score_res: dict, k_res: dict, prof_res: dict) -> tuple[list[dict], list[dict]]:
    """
    Convert raw score_res, k_res, and prof_res into structured (reasons, warnings)
    for verdict_card.
    """
    reasons: list[dict] = []
    warnings: list[dict] = []

    # 1. Critical hard warnings from user profile
    for hw in prof_res.get("hard_warnings", []):
        msg = hw.replace("🚨 ", "")
        is_allergen = any(term in hw for term in ["NUTS", "PEANUTS", "Allergen"])
        warnings.append({
            "severity": "CRITICAL",
            "message": msg,
            "flag": "allergen" if is_allergen else "bad",
        })

    # 2. General ingredient warnings from knowledge pass
    for w in k_res.get("warnings", []):
        clean_msg = (
            w.replace("⚠️ ", "")
             .replace("🔴 ", "")
             .replace("🟡 ", "")
             .replace("🌴 ", "")
             .replace("ℹ️ ", "")
        )
        w_lower = w.lower()
        if "high-concern" in w_lower or "hidden sugars in top" in w_lower:
            sev = "HIGH"
        else:
            sev = "MEDIUM"

        if "sugar" in w_lower:
            flag = "sugar"
        elif "palm" in w_lower:
            flag = "palm"
        elif "additive" in w_lower:
            flag = "additive"
        else:
            flag = "bad"

        warnings.append({
            "severity": sev,
            "message": clean_msg,
            "flag": flag,
        })

    # 3. Reasons: derived from breakdown points
    breakdown = score_res.get("breakdown", [])
    # Sort bad items by highest points first
    bad_items = sorted(
        [b for b in breakdown if b.get("direction") == "bad" and b.get("points", 0) > 0],
        key=lambda x: x.get("points", 0),
        reverse=True,
    )
    # Sort good items by highest points first
    good_items = sorted(
        [b for b in breakdown if b.get("direction") == "good" and b.get("points", 0) > 0],
        key=lambda x: x.get("points", 0),
        reverse=True,
    )

    for item in bad_items[:2]:
        reasons.append({
            "type": "bad",
            "text": f"High {item['factor']}: {item['value']} (+{item['points']} bad points)",
        })
    for item in good_items[:2]:
        reasons.append({
            "type": "good",
            "text": f"Beneficial {item['factor']}: {item['value']} (-{item['points']} points)",
        })

    # If few reasons, fall back to advice or general remarks
    if not reasons and prof_res.get("advice"):
        for adv in prof_res["advice"][:3]:
            reasons.append({"type": "good" if "reasonable" in adv else "bad", "text": adv})

    return reasons, warnings

