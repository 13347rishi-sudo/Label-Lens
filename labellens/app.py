"""
LabelLens - Offline AI Food Label & Barcode Scanner for Science Exhibition
Runs completely offline with Ollama (qwen3-vl:8b), local Nutri-Score engine,
hidden ingredient detector, health profiles, and interactive laser barcode scanner.
"""

from __future__ import annotations
import os
import sys
import time
from typing import Optional

import streamlit as st

# Ensure labellens root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

import extractor
import scoring
import knowledge
import profiles
import history
import demo_data
import barcode_engine
import ui.components as ui_comp


# ---------------------------------------------------------------------------
# Streamlit Page Config & Styling
# ---------------------------------------------------------------------------

st.set_page_config(
    page_title="LabelLens — AI Food Label & Barcode Scanner",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize database
history.init_db()


def render_html(html_str: str):
    """Safely render HTML using st.html (direct native DOM injection) with markdown fallback."""
    if not html_str:
        return
    cleaned = ui_comp.clean_html(html_str)
    try:
        st.html(cleaned)
    except Exception:
        st.markdown(cleaned, unsafe_allow_html=True)


def load_custom_css():
    """Inject custom exhibition kiosk CSS and holographic laser scanner styles."""
    css_path = os.path.join(CURRENT_DIR, "ui", "styles.css")
    custom_css = ""
    if os.path.exists(css_path):
        with open(css_path, "r", encoding="utf-8") as f:
            custom_css = f.read()

    # Laser scanner and HUD animations
    scanner_hud_css = """
    <style>
    /* Holographic Laser Scanner Reticle */
    .laser-scanner-container {
        position: relative;
        width: 100%;
        max-width: 580px;
        margin: 0 auto 24px;
        border-radius: 20px;
        overflow: hidden;
        background: #0A0F1E;
        border: 1px solid rgba(0, 255, 135, 0.25);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 255, 135, 0.05);
    }
    .laser-scanner-viewport {
        position: relative;
        min-height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at center, rgba(0, 255, 135, 0.06) 0%, transparent 70%);
    }
    .laser-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, #00FF87, #00FF87, transparent);
        box-shadow: 0 0 16px #00FF87, 0 0 30px #00FF87;
        animation: scanSweep 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
        z-index: 10;
    }
    @keyframes scanSweep {
        0% { top: 8%; opacity: 0.2; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { top: 92%; opacity: 0.2; }
    }
    /* Corner Brackets for HUD Reticle */
    .hud-corner {
        position: absolute;
        width: 24px;
        height: 24px;
        border-color: #00FF87;
        border-style: solid;
        pointer-events: none;
        z-index: 5;
    }
    .hud-tl { top: 16px; left: 16px; border-width: 3px 0 0 3px; border-top-left-radius: 6px; }
    .hud-tr { top: 16px; right: 16px; border-width: 3px 3px 0 0; border-top-right-radius: 6px; }
    .hud-bl { bottom: 16px; left: 16px; border-width: 0 0 3px 3px; border-bottom-left-radius: 6px; }
    .hud-br { bottom: 16px; right: 16px; border-width: 0 3px 3px 0; border-bottom-right-radius: 6px; }

    /* Barcode Target Box in Center */
    .hud-target-box {
        position: absolute;
        width: 260px;
        height: 120px;
        border: 1px dashed rgba(0, 255, 135, 0.4);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        background: rgba(0, 255, 135, 0.02);
    }
    .hud-target-text {
        font-family: monospace;
        font-size: 11px;
        letter-spacing: 0.15em;
        color: #00FF87;
        text-transform: uppercase;
        margin-top: 6px;
    }

    /* Barcode Deck Grid */
    .barcode-chip-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 18px;
        background: #141E33;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 180ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .barcode-chip-btn:hover {
        background: #1E2A45;
        border-color: #00FF87;
        transform: translateY(-2px);
    }

    /* Smooth Button Scaling */
    .stButton > button:active {
        transform: scale(0.97) !important;
    }
    </style>
    """
    render_html(f"<style>{custom_css}</style>{scanner_hud_css}")


load_custom_css()


# ---------------------------------------------------------------------------
# Session State Setup
# ---------------------------------------------------------------------------

if "active_profile" not in st.session_state:
    st.session_state.active_profile = "General"
if "scan_data" not in st.session_state:
    st.session_state.scan_data = None
if "scan_result" not in st.session_state:
    st.session_state.scan_result = None
if "compare_prod_a" not in st.session_state:
    st.session_state.compare_prod_a = None
if "compare_prod_b" not in st.session_state:
    st.session_state.compare_prod_b = None


# ---------------------------------------------------------------------------
# Analysis & Scoring Pipeline
# ---------------------------------------------------------------------------

def process_nutrition_analysis(product_data: dict, profile_name: str) -> dict:
    """Run full pipeline: Nutri-Score, knowledge check, health profile adjustments."""
    nutrition = product_data.get("per_100g", {})
    is_bev = product_data.get("is_beverage", False)
    fv_pct = product_data.get("fruit_veg_pct", 0.0)

    # 1. Official Nutri-Score
    score_res = scoring.score_product(nutrition, is_beverage=is_bev, fruit_veg_pct=fv_pct)

    # 2. Knowledge intelligence (hidden sugars, palm oil, allergens, E-numbers)
    ingredients = product_data.get("ingredients", [])
    allergens_stated = product_data.get("allergens_stated", [])
    know_res = knowledge.analyze_ingredients(ingredients, stated_allergens=allergens_stated)

    # 3. Apply active health profile
    prof_res = profiles.apply_profile(
        base_score=score_res,
        knowledge_result=know_res,
        nutrition=nutrition,
        profile_name=profile_name
    )

    return {
        "product": product_data,
        "scoring": score_res,
        "knowledge": know_res,
        "profile": prof_res,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }


# ---------------------------------------------------------------------------
# Sidebar: System Status & Profile Configuration
# ---------------------------------------------------------------------------

with st.sidebar:
    st.markdown("### 🔬 System Telemetry")
    
    # Model Selection (qwen3-vl:8b primary, qwen3.5:2b / qwen2.5:2b compatible)
    if "selected_model" not in st.session_state:
        st.session_state.selected_model = extractor.PRIMARY_MODEL

    ollama_info = extractor.check_ollama_status(st.session_state.selected_model)
    
    model_options = [
        extractor.PRIMARY_MODEL,
        "qwen3.5:2b",
        "qwen2.5:2b",
        "minicpm-v4.5",
        "qwen2.5-vl:7b",
    ]
    # Add any other locally installed models from Ollama
    for m in ollama_info.get("available_models", []):
        if m not in model_options:
            model_options.append(m)

    curr_idx = model_options.index(st.session_state.selected_model) if st.session_state.selected_model in model_options else 0
    chosen_model = st.selectbox(
        "AI Vision / LLM Model:",
        options=model_options,
        index=curr_idx,
        help="qwen3-vl:8b is the primary vision OCR model. qwen3.5:2b / qwen2.5:2b is lightweight for low-resource laptops."
    )
    if chosen_model != st.session_state.selected_model:
        st.session_state.selected_model = chosen_model
        st.rerun()

    is_primary = (chosen_model == extractor.PRIMARY_MODEL)
    if is_primary:
        st.caption("🌟 **Primary Model**: 8B Vision-Language OCR (Recommended)")
    elif "2b" in chosen_model.lower():
        st.caption("⚡ **Lightweight Model**: 2B Compact Model for low-spec laptops")

    render_html(
        ui_comp.status_indicator(
            ollama_running=ollama_info["running"],
            model_name=st.session_state.selected_model if ollama_info["model_available"] else "Fallback / Offline"
        )
    )
    
    if not ollama_info["running"]:
        st.caption("ℹ️ Ollama not detected. Barcode scanning, offline database, and demo mode work 100% offline.")
    elif not ollama_info["model_available"]:
        st.warning(f"⚠️ `{st.session_state.selected_model}` not yet pulled in Ollama. Run: `ollama pull {st.session_state.selected_model}`")

    st.markdown("---")
    st.markdown("### 👤 User Health Profile")
    st.caption("Profiles adjust scoring weights and trigger emergency banners:")

    profile_keys = list(profiles.PROFILES.keys())
    selected_prof = st.selectbox(
        "Select Active Profile:",
        options=profile_keys,
        index=profile_keys.index(st.session_state.active_profile),
        key="prof_select"
    )
    
    if selected_prof != st.session_state.active_profile:
        st.session_state.active_profile = selected_prof
        # Automatically re-calculate current scan if present
        if st.session_state.scan_data:
            st.session_state.scan_result = process_nutrition_analysis(
                st.session_state.scan_data,
                selected_prof
            )
        st.rerun()

    prof_info = profiles.get_profile(st.session_state.active_profile)
    st.markdown(f"**{prof_info.get('icon', '')} {st.session_state.active_profile} Mode**")
    st.caption(prof_info.get("description", ""))

    st.markdown("---")
    st.markdown("### ⚡ Exhibition Quick Controls")
    if st.button("🔄 Reset Scan State", use_container_width=True):
        st.session_state.scan_data = None
        st.session_state.scan_result = None
        st.rerun()


# ---------------------------------------------------------------------------
# Main Stage: Hero Header
# ---------------------------------------------------------------------------

render_html(ui_comp.hero_header())

# Main Navigation Tabs
tab_scan, tab_barcodes, tab_compare, tab_demo, tab_history = st.tabs([
    "🎯 Barcode & Label Scanner",
    "⚡ Quick Barcode Deck",
    "⚖️ Side-by-Side Compare",
    "🧪 Exhibition Demos",
    "📜 Scan History"
])


# ===========================================================================
# TAB 1: Real-time Barcode & Label Scanner
# ===========================================================================

with tab_scan:
    st.markdown("### 📷 Live Camera & Image Scanner")
    st.caption("Aim your camera at either the **Barcode (UPC/EAN)** or the **Nutrition & Ingredients label**:")

    col_cam, col_opts = st.columns([1.3, 1], gap="large")

    with col_cam:
        # Animated Holographic Laser Viewfinder
        render_html("""
        <div class="laser-scanner-container">
            <div class="laser-line"></div>
            <div class="hud-corner hud-tl"></div>
            <div class="hud-corner hud-tr"></div>
            <div class="hud-corner hud-bl"></div>
            <div class="hud-corner hud-br"></div>
            <div class="laser-scanner-viewport">
                <div class="hud-target-box">
                    <svg width="48" height="48" viewBox="0 0 256 256" fill="#00FF87" style="opacity: 0.85;">
                        <path d="M224,40V80a8,8,0,0,1-16,0V48H176a8,8,0,0,1,0-16h40A8,8,0,0,1,224,40ZM80,208H48V176a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H80a8,8,0,0,0,0-16Zm128-40a8,8,0,0,0-8,8v32H176a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V176A8,8,0,0,0,208,168ZM48,80V48H80a8,8,0,0,0,0-16H40a8,8,0,0,0-8,8V80a8,8,0,0,0,16,0ZM72,88a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,72,88Zm32,0a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,104,88Zm48,0a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,152,88Zm32,0a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,184,88Z"/>
                    </svg>
                    <div class="hud-target-text">ALIGN BARCODE / LABEL</div>
                </div>
            </div>
        </div>
        """)

        input_mode = st.radio("Input Source:", ["📷 Webcam / Camera Input", "📁 Upload Image File"], horizontal=True)
        
        image_bytes: Optional[bytes] = None
        if input_mode == "📷 Webcam / Camera Input":
            st.caption("💡 *If your webcam doesn't open, click the 🔒 lock icon in your browser URL bar and set Camera to **Allow**.*")
            cam_pic = st.camera_input("Capture Product Label or Barcode")
            if cam_pic:
                image_bytes = cam_pic.getvalue()
        else:
            up_file = st.file_uploader("Upload food packet photo", type=["jpg", "jpeg", "png", "webp"])
            if up_file:
                image_bytes = up_file.getvalue()

    with col_opts:
        st.markdown("#### 🔍 Detection Controls")
        st.markdown("""
        **How the Scanner Works:**
        1. **Instant Barcode Extraction:** Decodes EAN-13/UPC barcode or reads numbers under the bars.
        2. **Vision Model OCR:** If a nutrition facts panel is detected, `qwen3-vl:8b` extracts per-100g nutrients and ingredients.
        3. **Nutri-Score Rating:** Calculates official European Nutri-Score (Grades A through E).
        4. **Health Screen:** Flags hidden sugars, palm oil, allergens, and additives.
        """)

        manual_barcode = st.text_input("Or Enter / Scan Barcode (EAN-13):", placeholder="e.g. 5449000000996")
        
        col_scan_btn1, col_scan_btn2 = st.columns(2)
        with col_scan_btn1:
            btn_scan_barcode = st.button("⚡ Scan Barcode", use_container_width=True, type="primary")
        with col_scan_btn2:
            btn_scan_vision = st.button("🧠 AI Label OCR", use_container_width=True)

    # Trigger Processing
    detected_product = None
    
    # 1. Manual or Image Barcode Scan
    if btn_scan_barcode:
        target_code = manual_barcode.strip() if manual_barcode else None
        
        # If no text barcode entered but image uploaded, attempt image extraction
        if not target_code and image_bytes:
            with st.spinner("🔍 Reading barcode from image..."):
                found_bc = barcode_engine.scan_barcode_from_image(image_bytes)
                if found_bc:
                    target_code = found_bc["barcode"]
                    st.success(f"🎯 Detected Barcode: **{target_code}** via {found_bc.get('method','scan')}")

        if target_code:
            with st.spinner(f"⚡ Resolving product data for barcode `{target_code}`..."):
                resolved = barcode_engine.lookup_barcode(target_code, allow_online=True)
                if resolved:
                    detected_product = resolved
                    st.success(f"✅ Product Identified: **{resolved.get('product_name')}** ({resolved.get('source')})")
                else:
                    st.error(f"❌ Barcode `{target_code}` not in offline database. You can scan the nutrition label with AI OCR or try one from the Quick Barcode Deck!")
        else:
            st.warning("Please capture an image with a visible barcode or enter a barcode number.")

    # 2. Vision Model OCR Scan
    elif btn_scan_vision:
        if image_bytes:
            active_model = st.session_state.get("selected_model", extractor.PRIMARY_MODEL)
            with st.spinner(f"🧠 Scanning packaging label with {active_model} (Ollama)..."):
                ocr_result = extractor.extract_label(image_bytes, model=active_model)
                if ocr_result["error"]:
                    st.error(f"Ollama Error: {ocr_result['error']}")
                    st.info("Tip: You can use the Quick Barcode Deck or Demo Mode without Ollama running!")
                else:
                    parsed = ocr_result["parsed"]
                    detected_product = {
                        "product_name": parsed.get("product_name") or "Scanned Product",
                        "serving_size": parsed.get("serving_size") or "100g",
                        "is_beverage": False,
                        "fruit_veg_pct": 0.0,
                        "per_100g": parsed.get("per_100g", {}),
                        "ingredients": parsed.get("ingredients", []),
                        "allergens_stated": parsed.get("allergens_stated", []),
                        "source": active_model
                    }
                    st.success(f"✅ Extracted data with {active_model} in {ocr_result['elapsed_seconds']:.1f}s")
        else:
            st.warning("Please take a photo or upload an image first!")

    # If product was scanned/resolved, store and process
    if detected_product:
        st.session_state.scan_data = detected_product
        st.session_state.scan_result = process_nutrition_analysis(
            detected_product,
            st.session_state.active_profile
        )
        # Save to SQLite history
        try:
            history.save_scan(
                product_name=detected_product.get("product_name"),
                grade=st.session_state.scan_result["scoring"]["grade"],
                score_1_to_10=st.session_state.scan_result["scoring"]["score_1_to_10"],
                adjusted_score=st.session_state.scan_result["profile"]["adjusted_score_1_to_10"],
                profile_name=st.session_state.active_profile,
                verdict=st.session_state.scan_result["profile"]["verdict"],
                nutrition=detected_product.get("per_100g", {}),
                ingredients=detected_product.get("ingredients", []),
                score_result=st.session_state.scan_result["scoring"],
                knowledge_result=st.session_state.scan_result["knowledge"],
                profile_result=st.session_state.scan_result["profile"]
            )
        except Exception:
            pass

    # Display Current Scan Result if Available
    if st.session_state.scan_result:
        res = st.session_state.scan_result
        prod = res["product"]
        sc = res["scoring"]
        prof = res["profile"]
        know = res["knowledge"]

        st.markdown("---")
        st.markdown("## 📊 Scan Analysis & Rating Verdict")

        # Format reasons and warnings using ui_comp helper
        reasons, warnings = ui_comp.prepare_verdict_inputs(sc, know, prof)

        render_html(
            ui_comp.verdict_card(
                score=prof.get("adjusted_score_1_to_10", sc.get("score_1_to_10", 5.0)),
                grade=sc.get("grade", "C"),
                product_name=prod.get("product_name", "Scanned Product"),
                reasons=reasons,
                warnings=warnings,
                profile=st.session_state.active_profile
            )
        )

        render_html("<br>")

        # Bento Grid Nutrition Display
        col_nutr, col_ingr = st.columns([1.2, 1], gap="large")

        with col_nutr:
            st.markdown("### 🥗 Nutritional Profile (per 100g)")
            render_html(ui_comp.nutrition_grid(prod.get("per_100g", {})))

            # Editable adjustment expansion
            with st.expander("✏️ Adjust Nutrition Values Live (Exhibition Simulation)"):
                st.caption("Change values to observe how Nutri-Score dynamically updates:")
                p100 = prod.get("per_100g", {})
                e_col1, e_col2, e_col3 = st.columns(3)
                with e_col1:
                    new_sugar = st.number_input("Sugars (g)", value=float(p100.get("sugars_g") or 0.0), step=1.0)
                    new_energy = st.number_input("Energy (kJ)", value=float(p100.get("energy_kj") or 0.0), step=50.0)
                with e_col2:
                    new_satfat = st.number_input("Sat Fat (g)", value=float(p100.get("saturated_fat_g") or 0.0), step=0.5)
                    new_protein = st.number_input("Protein (g)", value=float(p100.get("protein_g") or 0.0), step=0.5)
                with e_col3:
                    new_salt = st.number_input("Salt (g)", value=float(p100.get("salt_g") or 0.0), step=0.1)
                    new_fibre = st.number_input("Fibre (g)", value=float(p100.get("fibre_g") or 0.0), step=0.5)

                if st.button("⚡ Recalculate Score with New Values"):
                    prod["per_100g"].update({
                        "sugars_g": new_sugar,
                        "energy_kj": new_energy,
                        "saturated_fat_g": new_satfat,
                        "protein_g": new_protein,
                        "salt_g": new_salt,
                        "fibre_g": new_fibre
                    })
                    st.session_state.scan_result = process_nutrition_analysis(prod, st.session_state.active_profile)
                    st.rerun()

        with col_ingr:
            st.markdown("### 🧪 Ingredients & Flags Screen")
            
            # Map detected knowledge flags to ingredient names using ui_comp helper
            flags_dict = ui_comp.extract_flags_dict(know)

            render_html(
                ui_comp.ingredient_list_with_flags(
                    ingredients=prod.get("ingredients", []),
                    flags=flags_dict
                )
            )


# ===========================================================================
# TAB 2: Quick Barcode Deck (Instant Exhibition Demonstrations)
# ===========================================================================

with tab_barcodes:
    st.markdown("### ⚡ Exhibition Quick Barcode Deck")
    st.caption("Click any packaged food below to simulate an instantaneous barcode scan and see the live rating:")

    all_barcodes = barcode_engine.get_all_offline_barcodes()
    
    deck_cols = st.columns(2, gap="medium")
    for idx, item in enumerate(all_barcodes):
        with deck_cols[idx % 2]:
            render_html(f"""
            <div style="background: #141E33; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #F8FAFC;">{item['product_name']}</div>
                        <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">{item['brand']} &bull; {item['category']}</div>
                        <div style="font-family: monospace; font-size: 11px; color: #00FF87; margin-top: 4px;">BARCODE: {item['barcode']}</div>
                    </div>
                </div>
            </div>
            """)
            
            if st.button(f"🎯 Scan Barcode: {item['product_name']}", key=f"btn_deck_{item['barcode']}", use_container_width=True):
                st.session_state.scan_data = item
                st.session_state.scan_result = process_nutrition_analysis(item, st.session_state.active_profile)
                st.success(f"🎯 Scanned Barcode {item['barcode']} — Switching to Analysis...")
                time.sleep(0.3)
                st.rerun()


# ===========================================================================
# TAB 3: Side-by-Side Product Comparison
# ===========================================================================

with tab_compare:
    st.markdown("### ⚖️ Side-by-Side Product Comparison")
    st.caption("Select two items to see which one is objectively healthier according to Nutri-Score:")

    comp_options = {item["product_name"]: item for item in barcode_engine.get_all_offline_barcodes()}
    names = list(comp_options.keys())

    col_sel_a, col_sel_b = st.columns(2, gap="large")
    with col_sel_a:
        choice_a = st.selectbox("Product A:", options=names, index=0)
    with col_sel_b:
        choice_b = st.selectbox("Product B:", options=names, index=min(4, len(names)-1))

    if choice_a and choice_b:
        prod_a = comp_options[choice_a]
        prod_b = comp_options[choice_b]

        res_a = process_nutrition_analysis(prod_a, st.session_state.active_profile)
        res_b = process_nutrition_analysis(prod_b, st.session_state.active_profile)

        score_a = res_a["profile"]["adjusted_score_1_to_10"]
        score_b = res_b["profile"]["adjusted_score_1_to_10"]

        if score_a > score_b:
            diff = score_a - score_b
            winner_text = f"🏆 <b>{prod_a['product_name']}</b> is significantly healthier (+{diff:.1f} pts higher)."
        elif score_b > score_a:
            diff = score_b - score_a
            winner_text = f"🏆 <b>{prod_b['product_name']}</b> is significantly healthier (+{diff:.1f} pts higher)."
        else:
            winner_text = "🤝 Both products have an identical nutritional score."

        render_html(
            ui_comp.comparison_card(
                product_a={
                    "name": prod_a["product_name"],
                    "grade": res_a["scoring"]["grade"],
                    "score": score_a,
                    "highlights": res_a["profile"].get("advice", [])[:2]
                },
                product_b={
                    "name": prod_b["product_name"],
                    "grade": res_b["scoring"]["grade"],
                    "score": score_b,
                    "highlights": res_b["profile"].get("advice", [])[:2]
                },
                verdict=winner_text
            )
        )


# ===========================================================================
# TAB 4: Exhibition Demos
# ===========================================================================

with tab_demo:
    st.markdown("### 🧪 Curated Science Exhibition Demos")
    st.caption("Demonstrate LabelLens without waiting for live camera scans or model downloads:")

    demo_grid = st.columns(3, gap="medium")
    for i, scan in enumerate(demo_data.DEMO_SCANS):
        with demo_grid[i % 3]:
            ext = scan["extracted"]
            is_bev = scan.get("is_beverage", False)
            calc_score = scoring.score_product(ext["per_100g"], is_beverage=is_bev)
            
            prod_card = {
                "name": scan.get("label", ext.get("product_name", "Demo")),
                "score": calc_score["score_1_to_10"],
                "grade": calc_score["grade"],
                "category": "Beverage" if is_bev else "Food",
                "description": scan.get("description", "")
            }
            render_html(
                ui_comp.demo_product_card(
                    product=prod_card,
                    index=i
                )
            )
            
            if st.button(f"Load {scan['label']}", key=f"demo_load_{scan['id']}", use_container_width=True):
                st.session_state.scan_data = {
                    "product_name": ext["product_name"],
                    "serving_size": ext["serving_size"],
                    "is_beverage": is_bev,
                    "fruit_veg_pct": scan.get("fruit_veg_pct", 0.0),
                    "per_100g": ext["per_100g"],
                    "ingredients": ext["ingredients"],
                    "allergens_stated": ext["allergens_stated"]
                }
                st.session_state.scan_result = process_nutrition_analysis(
                    st.session_state.scan_data,
                    st.session_state.active_profile
                )
                st.rerun()


# ===========================================================================
# TAB 5: Scan History & Audit Log
# ===========================================================================

with tab_history:
    st.markdown("### 📜 Scan History & Audit Trail")
    st.caption("All scans are persistently recorded in SQLite:")

    history_records = history.get_history(limit=15)
    if not history_records:
        st.info("No scans recorded yet. Scan a barcode or label to see history!")
    else:
        for idx, rec in enumerate(history_records):
            card_scan = {
                "product_name": rec.get("product_name") or "Unknown Product",
                "grade": rec.get("grade", "C"),
                "score": rec.get("adjusted_score") or rec.get("score_1_to_10", 0.0),
                "profile": rec.get("profile_name", "General"),
                "timestamp": rec.get("timestamp", ""),
                "warnings": rec.get("profile_result", {}).get("hard_warnings", []),
                "scan_id": rec.get("id")
            }
            render_html(ui_comp.history_card(card_scan, index=idx))
            render_html("<div style='height: 8px;'></div>")
