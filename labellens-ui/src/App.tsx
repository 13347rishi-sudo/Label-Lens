import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerHUD } from './components/ScannerHUD';
import { JudgeDemoDeck } from './components/JudgeDemoDeck';
import { VerdictCard } from './components/VerdictCard';
import { InteractiveBentoGrid } from './components/InteractiveBentoGrid';
import { ChemicalInspector } from './components/ChemicalInspector';
import { ComparisonArena } from './components/ComparisonArena';
import { ExhibitionPitchModal } from './components/ExhibitionPitchModal';
import { HealthierAlternativesCard } from './components/HealthierAlternativesCard';

import { EXHIBITION_PRODUCTS } from './lib/database';
import { scoreProduct } from './lib/scoring';
import { analyzeIngredients } from './lib/knowledge';
import { applyHealthProfile, HEALTH_PROFILES } from './lib/profiles';
import type { HealthProfileId, ProductItem, Per100g } from './lib/types';
import { Camera, Scales } from '@phosphor-icons/react';

type TabType = 'overview' | 'duel';

export function App() {
  const [selectedModel, setSelectedModel] = useState<string>('qwen3.5:2b');
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
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        
        {/* Apple Style Segmented View Switcher */}
        <div className="w-full flex items-center justify-center py-1 px-1">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Camera size={15} />
              <span>Scan & Health Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('duel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[40px] ${
                activeTab === 'duel'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Scales size={15} />
              <span>Compare Foods</span>
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
                    <h3 className="text-sm font-semibold text-white">Sample Foods ({EXHIBITION_PRODUCTS.length}+ Items)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Tap any product to inspect its health rating</p>
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

            {/* Verdict Card (Official European Nutri-Score OR Non-Food Warning) */}
            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
            />

            {/* If Edible Food: show Swaps, Ingredients & Additives Breakdown, and Nutrition Grid */}
            {currentProduct.is_food !== false && (
              <>
                {/* Healthier Alternatives & Natural Swaps Card */}
                <HealthierAlternativesCard
                  key={`swaps-${currentProduct.id}`}
                  product={currentProduct}
                  onSelectProduct={handleSelectProduct}
                />

                {/* Ingredients & Chemical Additives Breakdown */}
                <ChemicalInspector
                  ingredients={currentProduct.ingredients}
                  knowledge={knowledgeResult}
                />

                {/* Nutritional Facts Grid (includes recipe reformulation sliders) */}
                <InteractiveBentoGrid
                  key={currentProduct.id}
                  initialNutrition={currentProduct.per_100g}
                  isBeverage={currentProduct.is_beverage}
                  onNutritionChange={setLiveNutrition}
                />
              </>
            )}

          </div>
        )}

        {/* Tab 2: Side-by-Side Product Duel */}
        {activeTab === 'duel' && (
          <div className="animate-fadeIn">
            <ComparisonArena />
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
