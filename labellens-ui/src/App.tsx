import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerHUD } from './components/ScannerHUD';
import { FoodCatalogDeck } from './components/FoodCatalogDeck';
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
import { TRANSLATIONS, type Language } from './lib/i18n';
import { Camera, Scales, SlidersHorizontal, CaretDown, CaretUp, ArrowCounterClockwise } from '@phosphor-icons/react';

type TabType = 'overview' | 'duel';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedModel, setSelectedModel] = useState<string>('qwen3.5:2b');
  const [activeProfile, setActiveProfile] = useState<HealthProfileId>('general');
  const [currentProduct, setCurrentProduct] = useState<ProductItem>(EXHIBITION_PRODUCTS[0]);
  const [liveNutrition, setLiveNutrition] = useState<Per100g>(EXHIBITION_PRODUCTS[0].per_100g);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [idleResetNotice, setIdleResetNotice] = useState(false);

  const t = TRANSLATIONS[language];
  const lastActivityRef = useRef<number>(Date.now());

  // Handle product selection
  const handleSelectProduct = useCallback((prod: ProductItem) => {
    setCurrentProduct(prod);
    setLiveNutrition({ ...prod.per_100g });
    lastActivityRef.current = Date.now();
  }, []);

  // Profile selection
  const handleSelectProfile = (id: HealthProfileId) => {
    setActiveProfile(id);
    lastActivityRef.current = Date.now();
  };

  // Idle Timer (60s inactivity auto-reset for science fair visitors)
  useEffect(() => {
    const handleUserInteraction = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true });

    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > 60000) {
        // Reset to initial clean state
        setCurrentProduct(EXHIBITION_PRODUCTS[0]);
        setLiveNutrition({ ...EXHIBITION_PRODUCTS[0].per_100g });
        setActiveProfile('general');
        setActiveTab('overview');
        setShowAdvancedTools(false);
        setIdleResetNotice(true);
        lastActivityRef.current = Date.now();
        setTimeout(() => setIdleResetNotice(false), 4000);
      }
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      clearInterval(checkInterval);
    };
  }, []);

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
      
      {/* Kiosk Translucent Navigation Bar */}
      <Navbar
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        language={language}
        onToggleLanguage={setLanguage}
      />

      {/* Subtle Idle Reset Notification */}
      {idleResetNotice && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-white/90 text-black text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <ArrowCounterClockwise size={16} />
          <span>{t.idleNotice}</span>
        </div>
      )}

      {/* Main Content Container with Macro-Whitespace */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-7">
        
        {/* Segmented View Switcher: Scan & Analysis vs Compare Foods */}
        <div className="w-full flex items-center justify-center py-1 px-1">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 min-h-[44px] ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Camera size={18} />
              <span>{t.scanAnalysisTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('duel')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 min-h-[44px] ${
                activeTab === 'duel'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Scales size={18} />
              <span>{t.compareFoodsTab}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: One-Screen Kiosk Scan & Result Flow */}
        {activeTab === 'overview' && (
          <div className="space-y-7 animate-fadeIn">
            
            {/* Top Row: Camera HUD & Fast Catalog Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left (5 cols): Camera Viewfinder */}
              <div className="lg:col-span-5">
                <ScannerHUD
                  onProductResolved={handleSelectProduct}
                  selectedModel={selectedModel}
                  language={language}
                />
              </div>

              {/* Right (7 cols): Catalog Shelf for Quick Testing */}
              <div className="lg:col-span-7 apple-glass p-5 sm:p-6 rounded-3xl space-y-4 border border-white/[0.08]">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {language === 'en' ? `Sample Foods (${EXHIBITION_PRODUCTS.length}+ Items)` : `नमूना खाद्य पदार्थ (${EXHIBITION_PRODUCTS.length}+)`}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {language === 'en' ? 'Tap any food to inspect its Nutri-Score rating instantly' : 'न्यूट्री-स्कोर जांचने के लिए किसी भी खाद्य वस्तु पर टैप करें'}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-400 hidden sm:block">
                    Active: <span className="font-bold text-white">{currentProduct.product_name}</span>
                  </div>
                </div>

                <FoodCatalogDeck
                  onSelectProduct={handleSelectProduct}
                  selectedProductId={currentProduct.id}
                />
              </div>

            </div>

            {/* Result Card First (Giant Grade Letter + 1-10 Score + Top 3 Findings) */}
            <VerdictCard
              product={currentProduct}
              scoringResult={scoringResult}
              profileAdjustment={profileAdjustment}
              activeProfileName={activeProfileData.name}
              language={language}
            />

            {/* Healthier Alternatives & Natural Whole-Food Swaps */}
            {currentProduct.is_food !== false && (
              <HealthierAlternativesCard
                key={`swaps-${currentProduct.id}`}
                product={currentProduct}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {/* Advanced Tools & Sliders (Expandable Accordion to Keep Kiosk Uncluttered) */}
            {currentProduct.is_food !== false && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs sm:text-sm font-bold text-zinc-200 transition-all active:scale-98 min-h-[52px]"
                >
                  <span className="flex items-center gap-2.5">
                    <SlidersHorizontal size={20} className="text-sky-400" />
                    <span>{showAdvancedTools ? t.hideAdvanced : t.exploreAdvanced}</span>
                  </span>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <span>{showAdvancedTools ? 'Collapse' : 'Expand'}</span>
                    {showAdvancedTools ? <CaretUp size={16} /> : <CaretDown size={16} />}
                  </div>
                </button>

                {/* Expanded Deep Ingredients & Reformulation Sliders */}
                {showAdvancedTools && (
                  <div className="space-y-6 pt-5 animate-fadeIn">
                    <ChemicalInspector
                      ingredients={currentProduct.ingredients}
                      knowledge={knowledgeResult}
                      language={language}
                    />

                    <InteractiveBentoGrid
                      key={currentProduct.id}
                      initialNutrition={currentProduct.per_100g}
                      isBeverage={currentProduct.is_beverage}
                      onNutritionChange={setLiveNutrition}
                    />
                  </div>
                )}
              </div>
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

      {/* Clean Exhibition Kiosk Footer (Zero Clutter) */}
      <footer className="w-full border-t border-white/[0.06] py-8 px-6 mt-16 text-center text-xs text-zinc-400 space-y-1">
        <p className="font-semibold text-zinc-300">LabelLens · Science Exhibition 2026 · Local Multimodal Vision & Nutri-Score Analysis</p>
        <p className="text-[11px] text-zinc-500">Built for public education and nutritional transparency. Informational tool — not medical advice.</p>
      </footer>

    </div>
  );
}

export default App;
