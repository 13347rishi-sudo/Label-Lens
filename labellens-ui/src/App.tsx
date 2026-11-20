import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerHUD } from './components/ScannerHUD';
import { VerdictCard } from './components/VerdictCard';
import { InteractiveBentoGrid } from './components/InteractiveBentoGrid';
import { ChemicalInspector } from './components/ChemicalInspector';
import { ComparisonArena } from './components/ComparisonArena';
import { ExhibitionPitchModal } from './components/ExhibitionPitchModal';
import { HealthierAlternativesCard } from './components/HealthierAlternativesCard';

import { EXHIBITION_PRODUCTS, findProductById } from './lib/database';
import { scoreProduct } from './lib/scoring';
import { analyzeIngredients } from './lib/knowledge';
import { applyHealthProfile, HEALTH_PROFILES } from './lib/profiles';
import type { HealthProfileId, ProductItem, Per100g } from './lib/types';
import { TRANSLATIONS, type Language } from './lib/i18n';
import { CaretDown, CaretUp, ArrowCounterClockwise } from '@phosphor-icons/react';

type TabType = 'overview' | 'duel';

// 5 Familiar Indian benchmark foods for instant 1-tap testing at kiosk
const QUICK_BENCHMARKS = [
  { id: 'prod_maggi', name: 'Maggi' },
  { id: 'prod_parleg', name: 'Parle-G' },
  { id: 'prod_frooti', name: 'Frooti' },
  { id: 'prod_amul_butter', name: 'Amul Butter' },
  { id: 'prod_coke', name: 'Coca-Cola' }
];

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

  // Quick benchmark select
  const handleSelectQuick = (id: string) => {
    const found = findProductById(id);
    if (found) {
      handleSelectProduct(found);
    }
  };

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
    <div className="min-h-screen bg-[#F6F3EC] text-[#161616] font-sans antialiased selection:bg-[#161616] selection:text-[#F6F3EC]">
      
      {/* Navigation Bar */}
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
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#161616] text-[#F6F3EC] text-xs font-semibold shadow-md flex items-center gap-2">
          <ArrowCounterClockwise size={14} />
          <span>{t.idleNotice}</span>
        </div>
      )}

      {/* Main Content Container with Macro-Whitespace */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Segmented View Switcher: Scan & Analysis vs Compare Foods */}
        <div className="w-full flex items-center justify-center">
          <div className="inline-flex p-1 rounded-xl bg-[#EFECE4] border border-[#E2DDD4]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#161616] text-[#F6F3EC] shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              {t.scanAnalysisTab}
            </button>

            <button
              onClick={() => setActiveTab('duel')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'duel'
                  ? 'bg-[#161616] text-[#F6F3EC] shadow-xs'
                  : 'text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              {t.compareFoodsTab}
            </button>
          </div>
        </div>

        {/* Tab 1: One-Screen Scan & Result Flow */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Top Row: Camera Viewfinder */}
            <div>
              <ScannerHUD
                onProductResolved={handleSelectProduct}
                selectedModel={selectedModel}
                language={language}
              />
            </div>

            {/* Quick 1-Tap Demo Row for Exhibition Visitors (Zero-Camera Setup) */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#6E6A63] font-mono mr-1">Quick test:</span>
              {QUICK_BENCHMARKS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectQuick(item.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    currentProduct.id === item.id
                      ? 'bg-[#161616] text-[#F6F3EC] border-[#161616]'
                      : 'bg-white hover:bg-[#EFECE4] border-[#E2DDD4] text-[#161616]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Result Card First (Giant Grade Letter + Product Name + One Plain Sentence) */}
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
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-[#EFECE4] border border-[#E2DDD4] text-xs sm:text-sm font-semibold text-[#161616] transition-all shadow-xs"
                >
                  <span>{showAdvancedTools ? t.hideAdvanced : t.exploreAdvanced}</span>
                  <div className="flex items-center gap-1.5 text-[#6E6A63] text-xs">
                    <span>{showAdvancedTools ? 'Collapse' : 'Expand'}</span>
                    {showAdvancedTools ? <CaretUp size={14} /> : <CaretDown size={14} />}
                  </div>
                </button>

                {/* Expanded Deep Ingredients & Reformulation Sliders */}
                {showAdvancedTools && (
                  <div className="space-y-6 pt-5">
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
          <div>
            <ComparisonArena />
          </div>
        )}

      </main>

      {/* Exhibition Judge Brief Modal */}
      <ExhibitionPitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

      {/* Clean Exhibition Footer: One Quiet Line */}
      <footer className="w-full border-t border-[#E2DDD4] py-8 px-6 mt-16 text-center text-xs text-[#6E6A63]">
        <p>{t.disclaimer}</p>
      </footer>

    </div>
  );
}

export default App;
