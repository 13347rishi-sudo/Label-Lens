import { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle, ShieldCheck, CircleNotch, Brain } from '@phosphor-icons/react';
import type { ProductItem, HealthierAlternative } from '../lib/types';
import { getHealthierAlternatives, findProductById } from '../lib/database';
import { generateAiSwapsWithOllama } from '../lib/alternativesEngine';
import { getGradeColor } from '../lib/scoring';
import { playSuccessChime, playBarcodeBeep, playAlertBuzzer } from '../lib/sound';

interface HealthierAlternativesCardProps {
  product: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
}

export function HealthierAlternativesCard({
  product,
  onSelectProduct
}: HealthierAlternativesCardProps) {
  const [customAiSwaps, setCustomAiSwaps] = useState<HealthierAlternative[] | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const alternatives = useMemo(() => {
    return customAiSwaps || getHealthierAlternatives(product);
  }, [product, customAiSwaps]);

  const packagedSwaps = useMemo(
    () => alternatives.filter((a) => a.category === 'packaged'),
    [alternatives]
  );

  const naturalSwaps = useMemo(
    () => alternatives.filter((a) => a.category === 'natural'),
    [alternatives]
  );

  const handleSwapClick = (swap: HealthierAlternative) => {
    if (swap.target_id) {
      const targetProd = findProductById(swap.target_id);
      if (targetProd) {
        playBarcodeBeep();
        setTimeout(() => {
          playSuccessChime();
          onSelectProduct(targetProd);
        }, 60);
      }
    }
  };

  const handleGenerateAiSwaps = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const aiResults = await generateAiSwapsWithOllama(product);
      if (aiResults && aiResults.length > 0) {
        playSuccessChime();
        setCustomAiSwaps(aiResults);
      } else {
        throw new Error('No alternatives returned.');
      }
    } catch {
      playAlertBuzzer();
      setAiError('Unable to generate AI swaps right now. Showing benchmark swaps.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  if (product.is_food === false) {
    return null;
  }

  return (
    <div className="w-full rounded-3xl apple-glass p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Healthier Alternatives & Natural Swaps
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                {customAiSwaps ? 'AI Tailored' : 'Grade A / B'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Evidence-based nutritional alternatives for <span className="text-zinc-200 font-medium">{product.product_name}</span>
            </p>
          </div>
        </div>

        {/* Header Right: AI Swaps Button & Info */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateAiSwaps}
            disabled={isGeneratingAi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 min-h-[36px]"
            title="Ask local AI model to generate custom swaps for this exact product"
          >
            {isGeneratingAi ? (
              <>
                <CircleNotch size={14} className="animate-spin text-emerald-400" />
                <span>Thinking with AI...</span>
              </>
            ) : (
              <>
                <Brain size={14} weight="fill" className="text-emerald-400" />
                <span>Ask AI for Swaps</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Less sugar & fat</span>
          </div>
        </div>
      </div>

      {aiError && (
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
          {aiError}
        </div>
      )}

      {/* Grid: Packaged Swaps & Natural Whole Food Swaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Column 1: Packaged Clean Swaps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 px-1">
            <span>Packaged Alternatives ({packagedSwaps.length})</span>
          </div>

          <div className="space-y-3">
            {packagedSwaps.map((swap, idx) => {
              const gradeColor = getGradeColor(swap.nutri_grade);
              const targetProd = swap.target_id ? findProductById(swap.target_id) : undefined;

              return (
                <div
                  key={`pkg-${idx}`}
                  className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.07] p-4 transition-all duration-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        {swap.brand && <span className="font-medium text-zinc-300">{swap.brand}</span>}
                        {swap.brand && <span>·</span>}
                        <span className="text-sky-400 text-[11px] font-medium">Packaged</span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {swap.name}
                      </h4>
                    </div>

                    {/* Nutri-Score Capsule */}
                    <div
                      className="px-2.5 py-1 rounded-xl text-xs font-black uppercase text-white shadow-sm flex items-center gap-1 shrink-0"
                      style={{ backgroundColor: gradeColor }}
                    >
                      <span>Grade</span>
                      <span>{swap.nutri_grade}</span>
                    </div>
                  </div>

                  {/* Reason & Savings Tag */}
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {swap.reason}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {swap.savings}
                    </span>

                    {targetProd ? (
                      <button
                        onClick={() => handleSwapClick(swap)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold transition-all active:scale-95 hover:bg-zinc-200 shadow-sm min-h-[36px]"
                      >
                        <span>Inspect Swap</span>
                        <ArrowRight size={13} weight="bold" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <CheckCircle size={13} /> Recommended in Market
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Natural Whole Foods (Pulses, Millets, Fruits) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 px-1">
            <span>Natural Whole Foods ({naturalSwaps.length})</span>
          </div>

          <div className="space-y-3">
            {naturalSwaps.map((swap, idx) => {
              const gradeColor = getGradeColor(swap.nutri_grade);
              const targetProd = swap.target_id ? findProductById(swap.target_id) : undefined;

              return (
                <div
                  key={`nat-${idx}`}
                  className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-emerald-500/20 p-4 transition-all duration-200 space-y-3 relative overflow-hidden"
                >
                  {/* Subtle Natural Glow Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.04] rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                          Natural Food
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {swap.name}
                      </h4>
                    </div>

                    {/* Grade A Badge */}
                    <div
                      className="px-2.5 py-1 rounded-xl text-xs font-black uppercase text-white shadow-sm shrink-0"
                      style={{ backgroundColor: gradeColor }}
                    >
                      Grade {swap.nutri_grade}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed relative z-10">
                    {swap.reason}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] relative z-10">
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {swap.savings}
                    </span>

                    {targetProd ? (
                      <button
                        onClick={() => handleSwapClick(swap)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-semibold transition-all active:scale-95 hover:bg-emerald-400 shadow-sm min-h-[36px]"
                      >
                        <span>Analyze Food</span>
                        <ArrowRight size={13} weight="bold" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400/80 flex items-center gap-1">
                        <CheckCircle size={13} /> Zero Additives
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Educational Micronutrient Note */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-2">
        <p className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-semibold">Tip:</span> Whole foods like millets, pulses, and seeds contain complex fiber that slows digestion and prevents rapid blood sugar spikes.
        </p>
        <span className="text-[11px] text-zinc-500 font-mono">WHO & FSSAI Guidelines</span>
      </div>

    </div>
  );
}
