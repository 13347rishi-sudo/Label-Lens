import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerHUD } from './components/ScannerHUD';
import { JudgeDemoDeck } from './components/JudgeDemoDeck';
import { VerdictCard } from './components/VerdictCard';
import { InteractiveBentoGrid } from './components/InteractiveBentoGrid';
import { ChemicalInspector } from './components/ChemicalInspector';
import { ComparisonArena } from './components/ComparisonArena';
import { ExhibitionPitchModal } from './components/ExhibitionPitchModal';
import { QrCodeInspector } from './components/QrCodeInspector';
import { HealthierAlternativesCard } from './components/HealthierAlternativesCard';

import { EXHIBITION_PRODUCTS, lookupProductLive } from './lib/database';
import { scoreProduct } from './lib/scoring';
import { analyzeIngredients } from './lib/knowledge';
import { applyHealthProfile, HEALTH_PROFILES } from './lib/profiles';
import { playAlertBuzzer, playSuccessChime } from './lib/sound';
import type { HealthProfileId, ProductItem, Per100g } from './lib/types';
import { Camera, Flask, Sliders, Scales, QrCode } from '@phosphor-icons/react';

type TabType = 'overview' | 'ingredients' | 'reformulate' | 'duel' | 'qr';

export function App() {
  const [selectedModel, setSelectedModel] = useState<string>('qwen3-vl:8b');
  const [activeProfile, setActiveProfile] = useState<HealthProfileId>('general');
  const [currentProduct, setCurrentProduct] = useState<ProductItem>(EXHIBITION_PRODUCTS[0]);
  const [liveNutrition, setLiveNutrition] = useState<Per100g>(EXHIBITION_PRODUCTS[0].per_100g);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Handle product selection
  const handleSelectProduct = (prod: ProductItem) => {
    setCurrentProduct(prod);
    setLiveNutrition({ ...prod.per_100g });
  };

  // Profile selection
  const handleSelectProfile = (id: HealthProfileId) => {
    setActiveProfile(id);
    if (id === 'nut_allergy') {
      const isNutProduct = ['prod_nutella', 'prod_snickers', 'prod_ferrero', 'prod_cadbury_fruit_nut'].includes(currentProduct.id);
      if (isNutProduct) {
        playAlertBuzzer();
      }
    }
  };

  const handleScanQrPayload = async (payload: string) => {
    const prod = await lookupProductLive(payload);
    if (prod) {
      playSuccessChime();
      handleSelectProduct(prod);
    } else {
      playAlertBuzzer();
    }
  };

  // Calculate live score
  const scoringResult = useMemo(() => {
    return scoreProduct(liveNutrition, currentProduct.is_beverage, currentProduct.fruit_veg_pct);
  }, [liveNutrition, currentProduct]);

  // Calculate knowledge analysis
  const knowledgeResult = useMemo(() => {
    return analyzeIngredients(currentProduct.ingredients, currentProduct.allergens_stated);
  }, [currentProduct]);

  // Apply profile adjustments
  const profileAdjustment = useMemo(() => {
    return applyHealthProfile(scoringResult, knowledgeResult, liveNutrition, activeProfile);
  }, [scoringResult, knowledgeResult, liveNutrition, activeProfile]);

  const activeProfileData = HEALTH_PROFILES.find((p) => p.id === activeProfile) || HEALTH_PROFILES[0];

  return (
    <div className="min-h-screen bg-[#090A0E] text-[#F5F5F7] font-sans antialiased selection:bg-white/20">
      
      {/* Apple Translucent Navigation Bar */}
      <Navbar
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
      />

      {/* Main Content Container with Macro-Whitespace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-7">
        
        {/* Apple Style Segmented View Switcher - Horizontally scrollable on mobile */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none py-1 px-1">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-sm shrink-0 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Camera size={15} />
              <span>Scanner & Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] shrink-0 ${
                activeTab === 'ingredients'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Flask size={15} />
              <span>Ingredients & Additives</span>
            </button>

            <button
              onClick={() => setActiveTab('reformulate')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] shrink-0 ${
                activeTab === 'reformulate'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Sliders size={15} />
              <span>Reformulation Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('duel')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] shrink-0 ${
                activeTab === 'duel'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Scales size={15} />
              <span>Product Duel</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] shrink-0 ${
                activeTab === 'qr'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <QrCode size={15} />
              <span>2D QR Bench</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Scanner & Main Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Row: Camera Viewfinder & Catalog Shelf */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <ScannerHUD
                  onProductResolved={handleSelectProduct}
                  selectedModel={selectedModel}
                />
              </div>

              <div className="lg:col-span-7 apple-glass p-5 sm:p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Food Catalog ({EXHIBITION_PRODUCTS.length}+ Items)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Instant benchmark analysis across staples, snacks, drinks & sweets</p>
                  </div>
                  <div className="text-xs text-zinc-400 hidden sm:block">
                    Active: <span className="font-semibold text-white">{currentProduct.product_name}</span>
                  </div>
                </div>

                <JudgeDemoDeck
                  onSelectProduct={handleSelectProduct}
                  selectedProductId={currentProduct.id}
                />
              </div>
            </div>

            {/* Verdict Card (Official European Nutri-Score) */}
            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
            />

            {/* Healthier Alternatives & Natural Swaps Card */}
            <HealthierAlternativesCard
              product={currentProduct}
              onSelectProduct={handleSelectProduct}
            />

            {/* Nutritional Facts Grid */}
            <InteractiveBentoGrid
              key={currentProduct.id}
              initialNutrition={currentProduct.per_100g}
              isBeverage={currentProduct.is_beverage}
              onNutritionChange={setLiveNutrition}
            />

          </div>
        )}

        {/* Tab 2: Ingredients & Chemical Intelligence */}
        {activeTab === 'ingredients' && (
          <div className="space-y-8 animate-fadeIn">
            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
            />

            <ChemicalInspector
              ingredients={currentProduct.ingredients}
              knowledge={knowledgeResult}
            />

            <HealthierAlternativesCard
              product={currentProduct}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}

        {/* Tab 3: Interactive Reformulation Sandbox */}
        {activeTab === 'reformulate' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Food Industry Reformulation Sandbox
              </h2>
              <p className="text-xs text-zinc-400">
                Adjust key nutrients below to test how recipe changes immediately elevate or penalize the European Nutri-Score.
              </p>
            </div>

            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
            />

            <InteractiveBentoGrid
              key={`reform-${currentProduct.id}`}
              initialNutrition={currentProduct.per_100g}
              isBeverage={currentProduct.is_beverage}
              onNutritionChange={setLiveNutrition}
            />

            <HealthierAlternativesCard
              product={currentProduct}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}

        {/* Tab 4: Side-by-Side Product Duel */}
        {activeTab === 'duel' && (
          <div className="animate-fadeIn">
            <ComparisonArena />
          </div>
        )}

        {/* Tab 5: 2D QR Code Intelligence Bench */}
        {activeTab === 'qr' && (
          <div className="space-y-8 animate-fadeIn">
            <QrCodeInspector
              product={currentProduct}
              onScanQr={handleScanQrPayload}
            />

            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
            />

            <HealthierAlternativesCard
              product={currentProduct}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        )}

      </main>

      {/* Exhibition Judge Brief Modal */}
      <ExhibitionPitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

      {/* Minimalist Apple Footer */}
      <footer className="w-full border-t border-white/[0.06] py-8 px-6 mt-16 text-center text-xs text-zinc-500">
        <p>LabelLens · Science Exhibition 2026 · Local Multimodal Vision & Nutri-Score 2.0</p>
      </footer>

    </div>
  );
}

export default App;
