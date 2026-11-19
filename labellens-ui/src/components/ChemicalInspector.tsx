import { useState } from 'react';
import type { KnowledgeAnalysis } from '../lib/types';
import { CheckCircle } from '@phosphor-icons/react';

interface ChemicalInspectorProps {
  ingredients: string[];
  knowledge: KnowledgeAnalysis;
}

export function ChemicalInspector({ ingredients, knowledge }: ChemicalInspectorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'sugars' | 'palm' | 'allergens' | 'additives'>('all');

  return (
    <div className="w-full rounded-3xl apple-glass p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      
      {/* Header & Apple Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Ingredients Breakdown
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Checks for hidden sugars, palm oils, food additives, and allergens
          </p>
        </div>

        {/* Clean Segmented Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveTab('sugars')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'sugars'
                ? 'bg-amber-400 text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Hidden Sugars</span>
            <span className="text-[10px] px-1 rounded-full bg-white/20">{knowledge.hidden_sugars.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('palm')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'palm'
                ? 'bg-orange-400 text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Palm Oil</span>
            <span className="text-[10px] px-1 rounded-full bg-white/20">{knowledge.palm_oil.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('allergens')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'allergens'
                ? 'bg-red-500 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Allergens</span>
            <span className="text-[10px] px-1 rounded-full bg-white/20">{knowledge.allergens.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('additives')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'additives'
                ? 'bg-violet-400 text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Additives</span>
            <span className="text-[10px] px-1 rounded-full bg-white/20">{knowledge.additives.length}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'all' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => {
              const isSugar = knowledge.hidden_sugars.some((s) => s.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(s.matched_text.toLowerCase()));
              const isPalm = knowledge.palm_oil.some((p) => p.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(p.matched_text.toLowerCase()));
              const isAllergen = knowledge.allergens.some((a) => a.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(a.matched_text.toLowerCase()));
              const isAdditive = knowledge.additives.some((ad) => ad.matched_text.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(ad.matched_text.toLowerCase()));

              let badgeStyle = 'bg-white/[0.04] text-zinc-300 border-white/[0.06]';
              if (isAllergen) badgeStyle = 'bg-red-500/10 text-red-300 border-red-500/30 font-medium';
              else if (isSugar) badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
              else if (isPalm) badgeStyle = 'bg-orange-500/10 text-orange-300 border-orange-500/30';
              else if (isAdditive) badgeStyle = 'bg-violet-500/10 text-violet-300 border-violet-500/30';

              return (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${badgeStyle}`}
                >
                  {ing}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-500 pt-1">
            Ingredients listed in descending order of predominance by weight as printed on packaging.
          </p>
        </div>
      )}

      {activeTab === 'sugars' && (
        <div className="space-y-3">
          {knowledge.hidden_sugars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {knowledge.hidden_sugars.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-semibold text-amber-200">{s.name}</div>
                  <div className="text-zinc-400 mt-1">Matched text: <span className="text-zinc-200">"{s.matched_text}"</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>No hidden sugars found in this product.</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'palm' && (
        <div className="space-y-3">
          {knowledge.palm_oil.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {knowledge.palm_oil.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs">
                  <div className="font-semibold text-orange-200">{p.name}</div>
                  <div className="text-zinc-400 mt-1">Found in label: <span className="text-zinc-200">"{p.matched_text}"</span></div>
                  {p.description && <div className="text-[11px] text-orange-300/80 mt-1">{p.description}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>No palm oil found in this product.</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'allergens' && (
        <div className="space-y-3">
          {knowledge.allergens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {knowledge.allergens.map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-200">{a.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                      Allergen
                    </span>
                  </div>
                  <div className="text-zinc-400 mt-1">Found in label: <span className="text-zinc-200">"{a.matched_text}"</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>No major allergens listed in ingredients. Check packet if severely allergic.</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'additives' && (
        <div className="space-y-3">
          {knowledge.additives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {knowledge.additives.map((ad, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-violet-200">{ad.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      ad.severity === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-zinc-300'
                    }`}>
                      {ad.severity?.toUpperCase() || 'INFO'}
                    </span>
                  </div>
                  <div className="text-zinc-400 mt-1">Found in label: <span className="text-zinc-200">"{ad.matched_text}"</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>No concerning additives or artificial preservatives found.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}