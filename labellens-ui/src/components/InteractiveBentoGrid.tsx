import { useState } from 'react';
import type { Per100g } from '../lib/types';
import { Sliders, ArrowCounterClockwise } from '@phosphor-icons/react';

interface InteractiveBentoGridProps {
  initialNutrition: Per100g;
  isBeverage: boolean;
  onNutritionChange: (updated: Per100g) => void;
}

export function InteractiveBentoGrid({
  initialNutrition,
  isBeverage,
  onNutritionChange
}: InteractiveBentoGridProps) {
  const [nutrition, setNutrition] = useState<Per100g>({ ...initialNutrition });
  const [reformulationActive, setReformulationActive] = useState(false);
  const [showSliders, setShowSliders] = useState(false);

  const updateValue = (key: keyof Per100g, val: number) => {
    const updated = { ...nutrition, [key]: val };
    setNutrition(updated);
    setReformulationActive(true);
    onNutritionChange(updated);
  };

  const applyPreset = (type: 'zero_sugar' | 'low_salt' | 'high_fibre') => {
    const updated = { ...nutrition };
    if (type === 'zero_sugar') updated.sugars_g = 0.5;
    if (type === 'low_salt') updated.salt_g = Math.max(0.1, (nutrition.salt_g ?? 1.0) * 0.4);
    if (type === 'high_fibre') updated.fibre_g = (nutrition.fibre_g ?? 0) + 6.0;
    setNutrition(updated);
    setReformulationActive(true);
    setShowSliders(true);
    onNutritionChange(updated);
  };

  const handleReset = () => {
    setNutrition({ ...initialNutrition });
    setReformulationActive(false);
    onNutritionChange(initialNutrition);
  };

  const getTrafficColor = (val: number | null, low: number, high: number) => {
    if (val === null || val === undefined) return { text: 'text-zinc-400', badge: 'bg-zinc-500/10 text-zinc-400' };
    if (val <= low) return { text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' };
    if (val <= high) return { text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400' };
    return { text: 'text-red-400', badge: 'bg-red-500/10 text-red-400' };
  };

  return (
    <div className="w-full rounded-3xl apple-glass p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Nutrition per 100g
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Standard amounts per 100g (or 100ml for drinks)
          </p>
        </div>

        {/* Reformulation Toggle & Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
              showSliders
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'bg-white/[0.04] text-zinc-300 hover:text-white border border-white/[0.06]'
            }`}
          >
            <Sliders size={14} />
            <span>{showSliders ? 'Hide Sliders' : 'Adjust Recipe'}</span>
          </button>

          {showSliders && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => applyPreset('zero_sugar')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 transition-all border border-white/[0.06]"
              >
                Zero Sugar
              </button>
              <button
                onClick={() => applyPreset('low_salt')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 transition-all border border-white/[0.06]"
              >
                Low Salt
              </button>
              {reformulationActive && (
                <button
                  onClick={handleReset}
                  title="Reset to original packaging values"
                  className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white"
                >
                  <ArrowCounterClockwise size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apple Health Metric Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* 1. Energy */}
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Energy</span>
            <span className="font-mono text-[11px]">
              {Math.round((nutrition.energy_kj ?? 0) / 4.184)} kcal
            </span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              {Math.round(nutrition.energy_kj ?? 0)}
            </span>
            <span className="text-xs text-zinc-400 ml-1">kJ</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {isBeverage ? 'Beverage scale' : 'General food scale'}
          </span>
        </div>

        {/* 2. Sugars */}
        {(() => {
          const sug = nutrition.sugars_g ?? 0;
          const tf = getTrafficColor(sug, 5, isBeverage ? 7 : 12.5);
          return (
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Sugars</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tf.badge}`}>
                  {sug <= 5 ? 'Low' : sug <= 12.5 ? 'Moderate' : 'High'}
                </span>
              </div>
              <div className="my-3">
                <span className={`text-2xl font-bold tracking-tight ${tf.text}`}>
                  {sug.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-400 ml-1">g</span>
              </div>
              {showSliders ? (
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.5"
                  value={sug}
                  onChange={(e) => updateValue('sugars_g', parseFloat(e.target.value))}
                />
              ) : (
                <span className="text-[11px] text-zinc-500">Simple & added sugars</span>
              )}
            </div>
          );
        })()}

        {/* 3. Saturated Fat */}
        {(() => {
          const sf = nutrition.saturated_fat_g ?? 0;
          const tf = getTrafficColor(sf, 1.5, 4.0);
          return (
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Saturated Fat</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tf.badge}`}>
                  {sf <= 1.5 ? 'Low' : sf <= 4.0 ? 'Moderate' : 'High'}
                </span>
              </div>
              <div className="my-3">
                <span className={`text-2xl font-bold tracking-tight ${tf.text}`}>
                  {sf.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-400 ml-1">g</span>
              </div>
              {showSliders ? (
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={sf}
                  onChange={(e) => updateValue('saturated_fat_g', parseFloat(e.target.value))}
                />
              ) : (
                <span className="text-[11px] text-zinc-500">Lipids & fatty acids</span>
              )}
            </div>
          );
        })()}

        {/* 4. Salt */}
        {(() => {
          const salt = nutrition.salt_g ?? 0;
          const tf = getTrafficColor(salt, 0.3, 1.5);
          return (
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Salt</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tf.badge}`}>
                  {salt <= 0.3 ? 'Low' : salt <= 1.5 ? 'Moderate' : 'High'}
                </span>
              </div>
              <div className="my-3">
                <span className={`text-2xl font-bold tracking-tight ${tf.text}`}>
                  {salt.toFixed(2)}
                </span>
                <span className="text-xs text-zinc-400 ml-1">g</span>
              </div>
              {showSliders ? (
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.05"
                  value={salt}
                  onChange={(e) => updateValue('salt_g', parseFloat(e.target.value))}
                />
              ) : (
                <span className="text-[11px] text-zinc-500">Sodium equivalent</span>
              )}
            </div>
          );
        })()}

        {/* 5. Dietary Fiber */}
        {(() => {
          const fib = nutrition.fibre_g ?? 0;
          return (
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Fiber</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                  Beneficial
                </span>
              </div>
              <div className="my-3">
                <span className="text-2xl font-bold tracking-tight text-emerald-400">
                  {fib.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-400 ml-1">g</span>
              </div>
              {showSliders ? (
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={fib}
                  onChange={(e) => updateValue('fibre_g', parseFloat(e.target.value))}
                />
              ) : (
                <span className="text-[11px] text-zinc-500">Dietary roughage</span>
              )}
            </div>
          );
        })()}

        {/* 6. Protein */}
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Protein</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
              Beneficial
            </span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {(nutrition.protein_g ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 ml-1">g</span>
          </div>
          <span className="text-[11px] text-zinc-500">Muscle & tissue building</span>
        </div>

        {/* 7. Carbohydrates */}
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Carbohydrates</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {(nutrition.carbs_g ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 ml-1">g</span>
          </div>
          <span className="text-[11px] text-zinc-500">Total complex + simple</span>
        </div>

        {/* 8. Total Fat */}
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Fat</span>
          </div>
          <div className="my-3">
            <span className="text-2xl font-bold tracking-tight text-white">
              {(nutrition.fat_g ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 ml-1">g</span>
          </div>
          <span className="text-[11px] text-zinc-500">All lipid categories</span>
        </div>

      </div>

    </div>
  );
}