# 🔬 LabelLens: Offline AI Food Packaging Scanner & Health Engine

> **Science Exhibition Project** — Turning deceptive, microscopic food labels into instant, transparent nutritional intelligence on local edge hardware and mobile phones.

---

## 🌟 Overview

**LabelLens** is a fully offline, private AI food label scanner built for laptop and kiosk hardware at science exhibitions, and fully responsive for smartphones. It combines local multimodal computer vision (**Ollama + `qwen3-vl:8b`**) with the official European **Nutri-Score 2.0** algorithm, Open Food Facts global live resolution, and an ingredient intelligence knowledge graph:

- 📊 **Official European Nutri-Score**: Exact bad ($N$) and good ($P$) points calculation with separate stricter beverage thresholds.
- 🥗 **Healthier Smart Alternatives & Whole Food Swaps**: Evidence-based recommendations for every product — including clean packaged swaps and unprocessed natural foods (millets, pulses, seeds, fresh tender coconut).
- 🌍 **Universal Barcode & Product Recognition**: Scans and identifies **any product in the world** — instant 0ms offline match against 115+ benchmark items, with real-time live fallback to Open Food Facts (3.3M+ global foods).
- 🍬 **50+ Hidden Sugar Aliases**: Detects maltodextrin, high-fructose corn syrup, dextrose, invert syrup, and 45+ other covert sweeteners.
- 🌴 **Palm Oil Tracker**: Flags palm fat, palmolein, and elaeis guineensis derivatives.
- ⚠️ **14 EU Major Allergens**: Automatic detection of gluten, peanuts, tree nuts, dairy, eggs, soy, etc., triggering emergency **DO NOT BUY** alert banners.
- 📱 **Mobile Phone Camera Ready**: Direct native phone camera shutter (`Snap with Phone`) that bypasses browser HTTPS limitations, plus live stream webcam scanning.
- 📱 **GS1 Digital Link 2.0 & 2D QR Code Intelligence**: Decodes modern 2D packaging QR codes, SmartLabel URLs, and OpenFoodFacts payloads alongside standard 1D barcodes.
- 📦 **115+ Benchmark Food Database**: Pre-loaded catalog spanning ancient millets, pulses, beverages, snacks, breakfast cereals, confectionery, biscuits, dairy, and instant meals.
- 🧪 **E-Number Chemical Inspector**: Classifies food additives by European Food Safety Authority (EFSA) concern levels (High / Medium / Low).
- 👤 **5 Personalized Health Profiles**: General Adult, Diabetic / Pre-diabetic, Severe Nut Allergy, Child (Under 10), and High Blood Pressure.
- 🧪 **Interactive Reformulation Sandbox**: Sliders allow judges to drag sugar/salt down and watch the Nutri-Score recalculate live in real time!
- 🥊 **Side-by-Side Product Duel**: Compare two snacks side-by-side with automated nutritional differential meters and winner trophy.

---

## 📁 Repository Structure

```
science-exhibition/
├── README.md               # Master setup & exhibition pitch guide (this file)
├── labellens/              # Python Streamlit Backend & Algorithm Engine
│   ├── app.py              # Main Streamlit web application
│   ├── extractor.py        # Ollama multimodal vision extraction (qwen3-vl:8b / qwen3.5:2b)
│   ├── scoring.py          # Official European Nutri-Score calculation engine
│   ├── knowledge.py        # Fuzzy matching detector (sugars, palm oil, allergens, additives)
│   ├── profiles.py         # 5 health profile modifier rules
│   ├── barcode_engine.py   # Offline product database with EAN-13 barcodes
│   ├── history.py          # SQLite persistence for scan records
│   ├── demo_data.py        # Offline sample products
│   ├── requirements.txt    # Python package dependencies
│   ├── run.bat / run.ps1   # Quick Windows run scripts
│   ├── data/               # JSON reference knowledge bases
│   ├── ui/                 # Custom kiosk CSS and HTML components
│   └── tests/              # 21 unit tests (100% passing)
└── labellens-ui/           # Senior UI/UX Exhibition Kiosk Web App (React 19 + Vite)
    ├── src/
    │   ├── components/     # High-polish kiosk components (HUD, Sliders, Verdict, Duel, Alternatives)
    │   ├── lib/            # 115+ products database, live OpenFoodFacts resolver, types, sound
    │   ├── App.tsx         # Main interactive kiosk application (mobile swipe-ready)
    │   └── index.css       # Tailwind v4 theme, SF Pro font stack & Apple frosted glass
    ├── package.json        # Node.js dependencies
    └── vite.config.ts      # Vite bundler configuration & local Ollama proxy
```

---

## 🛠️ Prerequisites

Before setting up, make sure your machine has:
1. **Python 3.10 to 3.13**: [python.org](https://www.python.org/downloads/)
2. **Node.js 18+ (20 or 22 recommended)**: [nodejs.org](https://nodejs.org/)
3. **pnpm** (or npm): Install via `npm install -g pnpm`
4. **Ollama** (for live AI vision scanning): [ollama.com](https://ollama.com)

---

## 🚀 Complete Setup from Scratch (Cloning the Repo)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/labellens.git
cd "labellens"
```

### Step 2: Set Up the Python Backend (`labellens`)
```bash
cd labellens

# Install Python requirements
pip install -r requirements.txt

# Run the 21 automated unit tests to verify algorithms
python -m pytest tests/test_scoring.py
```

### Step 3: Set Up the React Kiosk Frontend (`labellens-ui`)
```bash
cd ../labellens-ui

# Install frontend dependencies
pnpm install

# Verify the production build (compiles in ~2 seconds)
pnpm run build
```

### Step 4: Pull the AI Vision Model in Ollama
Open a terminal and run:

```bash
# PRIMARY (Recommended for packaging OCR):
ollama pull qwen3-vl:8b

# LIGHTWEIGHT ALTERNATIVE (For low-RAM laptops, 4GB-8GB):
ollama pull qwen2.5:2b
```

*(Note: Both the Python app and React Kiosk run 100% offline without Ollama or GPU using the pre-loaded 115-product exhibition database).*

---

## 🏃 Launching the Application

### Option A: High-Tech Exhibition Kiosk (React 19 + Apple Design + Web Audio)
*Recommended for presenting to science exhibition judges and opening on mobile phones:*

```bash
cd labellens-ui

# To run locally on your laptop:
pnpm dev

# To open on your mobile phone over Wi-Fi:
pnpm dev --host
```
1. Laptop: Open **`http://localhost:5173`** in your browser.  
2. Mobile Phone: Open the Network IP displayed in the terminal (e.g. `http://192.168.1.5:5173`).
3. Tap **"Snap with Phone"** to take a crystal-clear photo using your phone's camera!

---

### Option B: Python Streamlit Application
*Pure Python backend running on Streamlit:*

```bash
cd labellens

# Windows Quick-Run:
.\run.bat

# Or direct Python command:
python -m streamlit run app.py
```
Open **`http://localhost:8501`** in your browser.

---

## 📱 Mobile Phone Camera & Scanning Guide

When accessing LabelLens from a smartphone:
1. **Snap with Phone Camera (Recommended)**: Tap the green **"Snap with Phone"** button in the camera viewfinder. Your phone will immediately launch its native camera app, capture the barcode or food packaging in full resolution, and ZXing will decode it directly! This works on 100% of Android and iOS phones without HTTPS requirements.
2. **Live Webcam Stream**: If running on desktop or via HTTPS, click **"Live Stream"** to enable real-time 30fps barcode reticle scanning.
3. **Universal Global Search**: If you don't have the physical box with you, switch to the **"Barcode & Search"** tab and type any product name (e.g. *Maggi*, *Oreos*, *Red Bull*, *Kombucha*, *Nutella*) or enter any 8-to-14 digit barcode. LabelLens queries the live Open Food Facts global database in real-time!

---

## ⏱️ 60-Second Exhibition Demo Pitch for Judges

*Stand by the laptop screen and guide the judge:*

1. **The Hook (10s):**  
   *"Respected judges, food companies use 50 different deceptive names for sugar and microscopic print to hide unhealthy ingredients behind 'healthy' marketing claims. LabelLens makes packaging transparent in seconds."*

2. **The Tech Stack (15s):**  
   *"We combine local Vision-Language AI (`qwen3-vl:8b`) with the official European Nutri-Score 2023 algorithm. The AI reads the packaging label, and deterministic algorithms compute the score with zero hallucinations."*

3. **Hidden Traps & Profiles (20s):**  
   *"Our engine scans for 50+ hidden sugar aliases, palm oil derivatives, and 14 EU major allergens. Watch what happens when I switch to the 'Nut Allergy' profile: Nutella immediately triggers a pulsing red 'DO NOT BUY — FATAL ALLERGEN' emergency banner."*

4. **Healthier Swaps & Natural Foods (15s):**  
   *"Notice the section right below: LabelLens doesn't just critique; it recommends evidence-based swaps — both clean packaged alternatives and unprocessed whole foods like foxtail millet, sprouted moong dal, and roasted chana."*

5. **Live Food Reformulation Sandbox (15s):**  
   *"Judges can test recipe reformulations live: drag the Sugar slider on Coca-Cola down from 10.6g to 2g, and watch the Nutri-Score climb from Grade E to Grade B in real time!"*

---

## 📄 License & Credits
Developed for Science Exhibition 2026. Built with Python, Streamlit, React 19, Vite, Tailwind CSS v4, Motion, Phosphor Icons, and Ollama.
Nutri-Score is an official public health mark by Santé Publique France.
