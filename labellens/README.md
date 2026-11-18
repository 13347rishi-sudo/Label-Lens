# 🔍 LabelLens: AI Food Packaging Scanner & Health Intelligence

> **Science Exhibition Project** — Turning complex, misleading nutrition labels into instant, transparent health intelligence for everyday consumers.

LabelLens uses local AI computer vision (Ollama + `qwen3-vl:8b`) and the official European **Nutri-Score** algorithm combined with ingredient intelligence (50+ hidden sugar aliases, 14 EU major allergens, concerning E-numbers, palm oil variants, and personalized health profiles) to demystify what's really inside your food.

---

## 🚀 Key Features

1. **Instant Barcode Scanner & Quick Deck**: Point your camera at any product barcode (EAN-13 / UPC-A) or select from the 10+ packaged foods deck (Coca-Cola, Lay's, Quaker Oats, Nutella, Snickers, Maggi, Oreo, Ferrero Rocher, etc.) with real-time holographic HUD laser scan animation and instant resolution.
2. **Local Vision AI Extraction**: Reads nutrition tables, ingredient lists, and declared allergens directly from camera snaps or image uploads using Ollama's `qwen3-vl:8b` vision model (100% private, runs offline).
3. **Official Nutri-Score Algorithm**: Calculates bad points (Energy, Sugars, Saturated Fat, Salt) and good points (Fibre, Protein, Fruit/Veg/Nuts%) with separate stricter thresholds for beverages.
4. **Hidden Ingredient Intelligence**:
   - **50+ Sugar Aliases**: Detects deceptive sweeteners like maltodextrin, high-fructose corn syrup, dextrose, invert syrup, etc.
   - **14 EU Allergens**: Automatic fuzzy scanning for gluten, milk, peanuts, tree nuts, eggs, soy, celery, mustard, sesame, sulphites, etc.
   - **E-Numbers & Additives**: Classifies additives into High (e.g., Tartrazine, Sodium Benzoate, MSG, Nitrites), Medium, and Low concern.
   - **Palm Oil Tracker**: Detects palm oil derivatives and fractions.
5. **Personalized Health Profiles**:
   - 👤 **General**: Standard adult health assessment.
   - 🩺 **Diabetic**: Penalises sugars 2x; hard warning for >15g sugars/100g.
   - 🥜 **Nut Allergy**: Instant red "DO NOT BUY" banner on any nut detection.
   - 🧒 **Child (Under 10)**: Strict limits on additives, sugars, and salt.
   - ❤️ **High Blood Pressure**: Salt weighted 2.5x; hard warning for >1.5g salt/100g.
6. **Product Comparison Mode**: Side-by-side comparative analysis of two products with automated verdict.
7. **Scan History**: SQLite-backed history tracking all scans and scores.
8. **Offline Demo Mode**: 6 realistic pre-loaded products (Coca-Cola, Corn Flakes, Lay's Chips, Greek Yogurt, Quaker Oats, Oreo Cookies) for presentation without a camera or GPU.

---

## 🤖 AI Models Supported

1. **`qwen3-vl:8b` (PRIMARY — Recommended)**:
   - Full 8B Vision-Language model for multimodal packaging OCR.
   - Accurately parses nutrition grids, ingredient lists in decreasing order, and allergen callouts.
   - Pull command: `ollama pull qwen3-vl:8b`
2. **`qwen3.5:2b` / `qwen2.5:2b` (LIGHTWEIGHT — Low-RAM Laptops)**:
   - Compact 2B model for laptops with limited memory (4GB–8GB RAM).
   - Pull command: `ollama pull qwen2.5:2b` (or `qwen3.5:2b`)
3. **`minicpm-v4.5` / `qwen2.5-vl:7b` (BACKUP VL)**:
   - Alternative high-accuracy multimodal vision models.

---

## 🏃 Launching LabelLens (Choose Your Preferred Interface)

LabelLens offers two complete offline frontends for your Science Exhibition:

### Option A: High-Tech Exhibition Kiosk (React 19 + Vite + Tailwind + Web Audio)
*Recommended for judging booths — 60fps animations, Web Audio scanner sound effects, live webcam barcode scanner, and interactive recipe reformulation sliders:*

```bash
# In PowerShell or Command Prompt:
cd "c:\Users\Rishi Raj\Downloads\Antigravity\School Work\science exhibition\labellens-ui"
pnpm dev
```
Open **`http://localhost:5173`** in your browser. Press the **Fullscreen** button on the top right for a true kiosk display!

### Option B: Python Streamlit Application
*Pure Python backend running on Streamlit with zero HTML leaks and full Ollama integration:*

```bash
# In PowerShell:
cd "c:\Users\Rishi Raj\Downloads\Antigravity\School Work\science exhibition\labellens"
python -m streamlit run app.py
# Or double-click run.bat
```
Open **`http://localhost:8501`** in your browser.

---

## 🧪 Running Automated Tests

A comprehensive suite of 20 unit tests verifies scoring thresholds, beverage formulas, allergen detection, and profiles:

```bash
# Direct runner
python tests/test_scoring.py

# Or with pytest (if installed)
pytest tests/test_scoring.py -v
```

---

## 💡 Exhibition Demo Mode (No Camera or Ollama Needed)

If presenting at an exhibition booth without a GPU or active Ollama server:
1. Open the **Demo** tab in the main navigation.
2. Select any of the 6 realistic sample items:
   - 🥤 **Coca-Cola** (Grade E beverage — 10.6g sugar)
   - 🌾 **Kellogg's Corn Flakes** (Grade B/C — hidden high salt warning)
   - 🥔 **Lay's Classic Chips** (Grade D — high fat)
   - 🥛 **Dannon Plain Greek Yogurt** (Grade A/B — high protein, low sugar)
   - 🌾 **Quaker Oats** (Grade A — clean single-ingredient champion)
   - 🍪 **Oreo Cookies** (Grade E — high sugar, palm oil, high fructose corn syrup)
3. Switch user profiles in the sidebar (e.g. switch to **Diabetic** or **Nut Allergy**) to watch the verdict and warnings update dynamically!

---

## ⏱️ 60-Second Exhibition Demo Script

*Stand by the screen and guide the judge or visitor:*

1. **The Problem (10s):**  
   *"Look at this food box. Food companies use 50 different names for sugar, tiny font sizes, and confusing 'per serving' metrics to hide unhealthy ingredients."*

2. **The Vision AI Scan (15s):**  
   *"With LabelLens, we take one snapshot with our camera or upload an image. Our local vision AI (`qwen3-vl:8b`) extracts the exact nutrition numbers, ingredients, and allergens in seconds—completely privately on the device."*

3. **The Intelligence Engine (15s):**  
   *"LabelLens immediately computes the official European Nutri-Score (Grade A to E). But we go further: our ingredient intelligence engine scans for hidden sugars like maltodextrin, flags concerning additives like Tartrazine (E102), and detects allergens."*

4. **Personalized Health Profiles (15s):**  
   *"Watch what happens when I switch to the 'Diabetic' profile: Oreo cookies get an immediate RED ALERT banner for excessive sugars. Switch to 'Nut Allergy' or 'Child', and the algorithm adapts weights specifically for their health."*

5. **Closing (5s):**  
   *"LabelLens empowers every consumer to see through marketing claims and make healthier choices in seconds."*
