import { useState } from 'react';
import type { KnowledgeAnalysis } from '../lib/types';
import { CheckCircle, CaretDown, CaretUp, ListMagnifyingGlass, Info } from '@phosphor-icons/react';
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

  return (
    <div className="w-full rounded-3xl apple-glass p-5 sm:p-7 space-y-5 border border-white/[0.08]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {language === 'en' ? 'Ingredients & Additives Check' : 'सामग्री एवं योजक जांच'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            {t.additivesDisclaimer}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs sm:text-sm font-semibold text-zinc-200 border border-white/[0.09] transition-all active:scale-95 self-start sm:self-auto min-h-[44px]"
        >
          <ListMagnifyingGlass size={18} className="text-sky-400" />
          <span>{isExpanded ? (language === 'en' ? 'Hide Full Ingredients' : 'सामग्री सूची छुपाएं') : `${language === 'en' ? 'View Ingredients List' : 'पूरी सामग्री देखें'} (${ingredients.length})`}</span>
          {isExpanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
        </button>
      </div>

      {/* 3-Card High-Impact Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* 1. Palm Oil Status */}
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
          hasPalm
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <span className="text-2xl mt-0.5">{hasPalm ? '🌴' : '✅'}</span>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              {hasPalm 
                ? (language === 'en' ? 'Contains Palm Oil' : 'पाम तेल शामिल है') 
                : (language === 'en' ? 'Zero Palm Oil' : 'पाम तेल रहित')}
            </div>
            <div className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {hasPalm 
                ? (language === 'en' ? 'Refined palm olein or palm fat detected' : 'रिफाइंड पाम तेल या वसा पाई गई')
                : (language === 'en' ? 'Free of industrial palm fats' : 'औद्योगिक पाम वसा से मुक्त')}
            </div>
          </div>
        </div>

        {/* 2. Hidden Sweeteners */}
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
          hasHiddenSugars
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <span className="text-2xl mt-0.5">{hasHiddenSugars ? '🍬' : '✅'}</span>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              {hasHiddenSugars 
                ? `${knowledge.hidden_sugars.length} ${language === 'en' ? 'Hidden Sugar Aliases' : 'छिपी चीनी के नाम'}` 
                : (language === 'en' ? 'Clean Sweeteners' : 'कोई छिपी चीनी नहीं')}
            </div>
            <div className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {hasHiddenSugars
                ? knowledge.hidden_sugars.map((s) => s.name).slice(0, 2).join(', ')
                : (language === 'en' ? 'No maltodextrin or covert syrups' : 'माल्टोडेक्सट्रिन या सिरप नहीं')}
            </div>
          </div>
        </div>

        {/* 3. Additives to Watch (Approved but flagged for sensitive groups) */}
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
          hasAdditives
            ? 'bg-violet-500/10 border-violet-500/30 text-violet-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <span className="text-2xl mt-0.5">{hasAdditives ? '🧪' : '✅'}</span>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              {hasAdditives 
                ? `${knowledge.additives.length} ${language === 'en' ? 'Additives to Watch' : 'सावधानी योग्य योजक'}` 
                : (language === 'en' ? 'No Additives to Watch' : 'कोई योजक चिन्हित नहीं')}
            </div>
            <div className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
              {hasAdditives
                ? (language === 'en' ? 'Approved additives flagged for sensitivity' : 'संवेदनशीलता हेतु चिन्हित स्वीकृत योजक')
                : (language === 'en' ? 'Free of flagged synthetic colors/sweeteners' : 'कृत्रिम रंगों या योजकों से मुक्त')}
            </div>
          </div>
        </div>

      </div>

      {/* Expanded Deep Ingredients & Tabs */}
      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-white/[0.08] animate-fadeIn">
          
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('sugars')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'sugars'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t.hiddenSugars}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">{knowledge.hidden_sugars.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('palm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'palm'
                  ? 'bg-orange-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t.palmOil}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">{knowledge.palm_oil.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('allergens')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'allergens'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t.allergens}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">{knowledge.allergens.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('additives')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'additives'
                  ? 'bg-violet-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t.additivesToWatch}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">{knowledge.additives.length}</span>
            </button>
          </div>

          {/* Tab 1: All Ingredients */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, idx) => {
                  const isSugar = knowledge.hidden_sugars.some((s) => s.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(s.matched_text.toLowerCase()));
                  const isPalm = knowledge.palm_oil.some((p) => p.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(p.matched_text.toLowerCase()));
                  const isAllergen = knowledge.allergens.some((a) => a.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(a.matched_text.toLowerCase()));
                  const isAdditive = knowledge.additives.some((ad) => ad.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(ad.matched_text.toLowerCase()));

                  let badgeStyle = 'bg-white/[0.04] text-zinc-300 border-white/[0.07]';
                  if (isAllergen) badgeStyle = 'bg-red-500/15 text-red-200 border-red-500/40 font-bold';
                  else if (isSugar) badgeStyle = 'bg-amber-500/15 text-amber-200 border-amber-500/40 font-medium';
                  else if (isPalm) badgeStyle = 'bg-orange-500/15 text-orange-200 border-orange-500/40 font-medium';
                  else if (isAdditive) badgeStyle = 'bg-violet-500/15 text-violet-200 border-violet-500/40 font-medium';

                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm border transition-all ${badgeStyle}`}
                    >
                      {ing}
                    </span>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-400 pt-1">
                Ingredients listed in descending order of predominance by weight as printed on packaging.
              </p>
            </div>
          )}

          {/* Tab 2: Sugars */}
          {activeTab === 'sugars' && (
            <div className="space-y-3">
              {knowledge.hidden_sugars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {knowledge.hidden_sugars.map((s, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs sm:text-sm">
                      <div className="font-bold text-amber-200">{s.name}</div>
                      <div className="text-zinc-300 mt-1">Matched text: <span className="text-white font-mono">"{s.matched_text}"</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span>No covert sweeteners or syrups found in this food.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Palm Oil */}
          {activeTab === 'palm' && (
            <div className="space-y-3">
              {knowledge.palm_oil.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {knowledge.palm_oil.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-xs sm:text-sm">
                      <div className="font-bold text-orange-200">{p.name}</div>
                      <div className="text-zinc-300 mt-1">Found in label: <span className="text-white font-mono">"{p.matched_text}"</span></div>
                      {p.description && <div className="text-xs text-orange-200/80 mt-1">{p.description}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span>No palm oil or palm derivatives found in this product.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Allergens */}
          {activeTab === 'allergens' && (
            <div className="space-y-3">
              {knowledge.allergens.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {knowledge.allergens.map((a, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-200">{a.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-500/25 text-red-300 font-bold">
                          Allergen Alert
                        </span>
                      </div>
                      <div className="text-zinc-300 mt-1">Found in label: <span className="text-white font-mono">"{a.matched_text}"</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span>No major allergens detected in ingredients list. Always verify directly on packaging if severely allergic.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Additives to Watch */}
          {activeTab === 'additives' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-2 text-xs text-zinc-300">
                <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <span>Note for Science Fair Judges: These are legally approved additives flagged for consumers with specific dietary sensitivities (e.g., intense sweeteners or synthetic food dyes).</span>
              </div>

              {knowledge.additives.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {knowledge.additives.map((ad, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/25 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-200">{ad.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-200 font-mono">
                          Watch List
                        </span>
                      </div>
                      <div className="text-zinc-300 mt-1">Found in label: <span className="text-white font-mono">"{ad.matched_text}"</span></div>
                      {ad.description && <div className="text-xs text-zinc-400 mt-1">{ad.description}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <span>No additives flagged for sensitivity found in this product.</span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
