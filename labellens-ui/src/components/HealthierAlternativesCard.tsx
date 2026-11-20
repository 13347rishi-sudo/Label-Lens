import { useState, useMemo } from 'react';
import { ArrowRight, CircleNotch } from '@phosphor-icons/react';
import type { ProductItem, HealthierAlternative } from '../lib/types';
import { getHealthierAlternatives, findProductById } from '../lib/database';
import { generateAiSwapsWithOllama } from '../lib/alternativesEngine';
import { getGradeColor, scoreProduct } from '../lib/scoring';
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

  const handleSwapClick = (swap: HealthierAlternative) => {
    if (swap.target_id) {
      const targetProd = findProductById(swap.target_id);
      if (targetProd) {
        playBarcodeBeep();
        setTimeout(() => {
          playSuccessChime();
          onSelectProduct(targetProd);
        }, 50);
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
      setAiError('Unable to generate AI swaps right now. Showing standard swaps.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  if (product.is_food === false || alternatives.length === 0) {
    return null;
  }

  const currentGrade = scoreProduct(product.per_100g, product.is_beverage, product.fruit_veg_pct).grade;
  const currentGradeColor = getGradeColor(currentGrade);

  return (
    <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DDD4]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#161616] tracking-tight">
            Better Alternatives
          </h3>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Healthier swaps with less sugar and fewer processed additives
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiSwaps}
          disabled={isGeneratingAi}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-[#E2DDD4] bg-[#F6F3EC] hover:bg-[#EFECE4] text-xs font-semibold text-[#161616] transition-all disabled:opacity-50"
        >
          {isGeneratingAi ? (
            <span className="flex items-center gap-1.5">
              <CircleNotch size={14} className="animate-spin" />
              Thinking...
            </span>
          ) : (
            'Ask AI for Custom Swaps'
          )}
        </button>
      </div>

      {aiError && (
        <div className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
          {aiError}
        </div>
      )}

      {/* Plain Comparison List: [Current Product] → [Alternative] */}
      <div className="divide-y divide-[#E2DDD4] border border-[#E2DDD4] rounded-xl overflow-hidden bg-white">
        {alternatives.map((swap, idx) => {
          const swapGradeColor = getGradeColor(swap.nutri_grade);
          const targetProd = swap.target_id ? findProductById(swap.target_id) : undefined;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F6F3EC]/50 transition-colors"
            >
              
              {/* Left: Before → After comparison */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#161616]">
                  {/* Current Product */}
                  <span className="text-[#6E6A63] line-through font-normal">{product.product_name}</span>
                  
                  {/* Before Grade Badge */}
                  <span
                    style={{ backgroundColor: currentGradeColor }}
                    className="px-1.5 py-0.2 rounded text-[11px] font-mono font-bold text-white uppercase"
                  >
                    {currentGrade}
                  </span>

                  <span className="text-[#969188]">→</span>

                  {/* Swap Product */}
                  <span className="text-[#161616]">{swap.name}</span>

                  {/* After Grade Badge */}
                  <span
                    style={{ backgroundColor: swapGradeColor }}
                    className="px-1.5 py-0.2 rounded text-[11px] font-mono font-bold text-white uppercase"
                  >
                    {swap.nutri_grade}
                  </span>
                </div>

                {/* Savings & Reason */}
                <p className="text-xs text-[#6E6A63] leading-relaxed">
                  {swap.reason}
                </p>

                <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                  <span className="text-[#038141] font-semibold">
                    {swap.savings}
                  </span>
                  {swap.category === 'natural' && (
                    <span className="text-[#6E6A63]">· Natural Whole Food</span>
                  )}
                </div>
              </div>

              {/* Right: Action Button */}
              {targetProd && (
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSwapClick(swap)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#161616] hover:bg-black text-[#F6F3EC] text-xs font-semibold transition-all active:scale-98 shadow-xs"
                  >
                    <span>Inspect Swap</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
