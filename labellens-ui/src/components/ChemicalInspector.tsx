import { useState, useMemo } from 'react';
import type { KnowledgeAnalysis } from '../lib/types';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { TRANSLATIONS, type Language } from '../lib/i18n';

interface ChemicalInspectorProps {
  ingredients: string[];
  knowledge: KnowledgeAnalysis;
  language?: Language;
}

export function ChemicalInspector({ ingredients, knowledge, language = 'en' }: ChemicalInspectorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'sugars' | 'palm' | 'allergens' | 'additives'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const t = TRANSLATIONS[language];

  const hasPalm = knowledge.palm_oil.length > 0;
  const hasHiddenSugars = knowledge.hidden_sugars.length > 0;
  const hasAdditives = knowledge.additives.length > 0;

  // Precompute O(1) ingredient flag lookups to avoid thousands of substring iterations per render
  const ingredientFlagsMap = useMemo(() => {
    const map = new Map<string, { isSugar: boolean; isPalm: boolean; isAllergen: boolean; isAdditive: boolean }>();
    const lowerSugars = knowledge.hidden_sugars.map(s => s.name.toLowerCase());
    const lowerPalm = knowledge.palm_oil.map(p => p.name.toLowerCase());
    const lowerAllergens = knowledge.allergens.map(a => a.name.toLowerCase());
    const lowerAdditives = knowledge.additives.map(ad => [ad.name.toLowerCase(), ad.matched_text.toLowerCase()]);

    for (const ing of ingredients) {
      const lower = ing.toLowerCase();
      const isSugar = lowerSugars.some(s => lower.includes(s));
      const isPalm = lowerPalm.some(p => lower.includes(p));
      const isAllergen = lowerAllergens.some(a => lower.includes(a));
      const isAdditive = lowerAdditives.some(([n, m]) => lower.includes(n) || lower.includes(m));
      map.set(ing, { isSugar, isPalm, isAllergen, isAdditive });
    }
    return map;
  }, [ingredients, knowledge]);

  return (
    <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DDD4]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#161616] tracking-tight">
            {language === 'en' ? 'Ingredients & Additives Check' : 'सामग्री एवं योजक जांच'}
          </h3>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            {t.additivesDisclaimer}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E2DDD4] bg-[#F6F3EC] hover:bg-[#EFECE4] text-xs font-semibold text-[#161616] transition-all self-start sm:self-auto"
        >
          <span>{isExpanded ? 'Hide List' : `View Full List (${ingredients.length})`}</span>
          {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* 1. Palm Oil */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#6E6A63] uppercase">Palm Oil</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              hasPalm ? 'bg-[#ee8100]/15 text-[#ee8100]' : 'bg-[#038141]/10 text-[#038141]'
            }`}>
              {hasPalm ? 'DETECTED' : 'CLEAR'}
            </span>
          </div>
          <div className="font-bold text-[#161616] text-sm pt-1">
            {hasPalm ? 'Contains Palm Oil' : 'Zero Palm Oil'}
          </div>
          <div className="text-xs text-[#6E6A63]">
            {hasPalm ? 'Refined palm fats detected' : 'Free of industrial palm fats'}
          </div>
        </div>

        {/* 2. Hidden Sweeteners */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#6E6A63] uppercase">Hidden Sweeteners</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              hasHiddenSugars ? 'bg-[#fecb02]/30 text-[#854d0e]' : 'bg-[#038141]/10 text-[#038141]'
            }`}>
              {hasHiddenSugars ? `${knowledge.hidden_sugars.length} FOUND` : '0 FOUND'}
            </span>
          </div>
          <div className="font-bold text-[#161616] text-sm pt-1">
            {hasHiddenSugars ? `${knowledge.hidden_sugars.length} Sugar Aliases` : 'Clean Sweeteners'}
          </div>
          <div className="text-xs text-[#6E6A63] truncate">
            {hasHiddenSugars ? knowledge.hidden_sugars.map((s) => s.name).join(', ') : 'No hidden syrups or maltodextrin'}
          </div>
        </div>

        {/* 3. Additives to Watch */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#6E6A63] uppercase">Additives to Watch</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              hasAdditives ? 'bg-[#e63e11]/10 text-[#e63e11]' : 'bg-[#038141]/10 text-[#038141]'
            }`}>
              {hasAdditives ? `${knowledge.additives.length} FLAGGED` : 'CLEAR'}
            </span>
          </div>
          <div className="font-bold text-[#161616] text-sm pt-1">
            {hasAdditives ? `${knowledge.additives.length} Flagged Additives` : 'No Flagged Additives'}
          </div>
          <div className="text-xs text-[#6E6A63]">
            {hasAdditives ? 'Flagged for sensitive people/children' : 'Approved standard additives'}
          </div>
        </div>

      </div>

      {/* Expanded Ingredients List */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-[#E2DDD4]">
          
          {/* Tab Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-[#161616] text-[#F6F3EC]'
                  : 'bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              All ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('sugars')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'sugars'
                  ? 'bg-[#161616] text-[#F6F3EC]'
                  : 'bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              Hidden Sugars ({knowledge.hidden_sugars.length})
            </button>
            <button
              onClick={() => setActiveTab('palm')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'palm'
                  ? 'bg-[#161616] text-[#F6F3EC]'
                  : 'bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              Palm Oil ({knowledge.palm_oil.length})
            </button>
            <button
              onClick={() => setActiveTab('allergens')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'allergens'
                  ? 'bg-[#161616] text-[#F6F3EC]'
                  : 'bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              Allergens ({knowledge.allergens.length})
            </button>
            <button
              onClick={() => setActiveTab('additives')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'additives'
                  ? 'bg-[#161616] text-[#F6F3EC]'
                  : 'bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616]'
              }`}
            >
              Additives ({knowledge.additives.length})
            </button>
          </div>

          {/* List Display */}
          <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] max-h-64 overflow-y-auto">
            <div className="flex flex-wrap gap-2 text-xs">
              {ingredients.map((ing, idx) => {
                const flags = ingredientFlagsMap.get(ing) || { isSugar: false, isPalm: false, isAllergen: false, isAdditive: false };
                const { isSugar, isPalm, isAllergen, isAdditive } = flags;

                if (activeTab === 'sugars' && !isSugar) return null;
                if (activeTab === 'palm' && !isPalm) return null;
                if (activeTab === 'allergens' && !isAllergen) return null;
                if (activeTab === 'additives' && !isAdditive) return null;

                return (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium ${
                      isSugar
                        ? 'bg-[#fecb02]/20 border-[#fecb02]/50 text-[#854d0e]'
                        : isPalm
                        ? 'bg-[#ee8100]/20 border-[#ee8100]/50 text-[#9a3412]'
                        : isAllergen
                        ? 'bg-[#e63e11]/20 border-[#e63e11]/50 text-[#991b1b]'
                        : isAdditive
                        ? 'bg-[#7c3aed]/15 border-[#7c3aed]/40 text-[#5b21b6]'
                        : 'bg-white border-[#E2DDD4] text-[#161616]'
                    }`}
                  >
                    {ing}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
