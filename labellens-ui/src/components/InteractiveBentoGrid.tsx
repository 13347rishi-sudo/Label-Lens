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

  return (
    <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DDD4]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#161616] tracking-tight">
            Nutrition Reformulation per 100g
          </h3>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Test how reducing sugar or salt improves the Nutri-Score in real time
          </p>
        </div>

        {/* Reformulation Toggle & Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showSliders
                ? 'bg-[#161616] text-[#F6F3EC]'
                : 'bg-[#F6F3EC] text-[#161616] border border-[#E2DDD4] hover:bg-[#EFECE4]'
            }`}
          >
            <Sliders size={14} />
            <span>{showSliders ? 'Hide Sliders' : 'Adjust Recipe'}</span>
          </button>

          {showSliders && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => applyPreset('zero_sugar')}
                className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] hover:bg-[#EFECE4] border border-[#E2DDD4] text-xs font-medium text-[#161616]"
              >
                Zero Sugar
              </button>
              <button
                onClick={() => applyPreset('low_salt')}
                className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] hover:bg-[#EFECE4] border border-[#E2DDD4] text-xs font-medium text-[#161616]"
              >
                Low Salt
              </button>
              {reformulationActive && (
                <button
                  onClick={handleReset}
                  title="Reset to original values"
                  className="p-1.5 rounded-lg bg-[#F6F3EC] hover:bg-[#EFECE4] border border-[#E2DDD4] text-xs text-[#161616]"
                >
                  <ArrowCounterClockwise size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* 1. Energy */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] flex flex-col justify-between">
          <span className="text-xs font-mono text-[#6E6A63] uppercase">Energy</span>
          <div className="my-2">
            <span className="text-2xl font-black font-mono text-[#161616]">
              {Math.round((nutrition.energy_kj ?? 0) / 4.184)}
            </span>
            <span className="text-xs text-[#6E6A63] ml-1">kcal</span>
          </div>
          <span className="text-[11px] text-[#6E6A63] font-mono">
            {isBeverage ? 'Drink scale' : 'Food scale'}
          </span>
        </div>

        {/* 2. Sugars */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] flex flex-col justify-between">
          <span className="text-xs font-mono text-[#6E6A63] uppercase">Sugars</span>
          <div className="my-2">
            <span className="text-2xl font-black font-mono text-[#161616]">
              {(nutrition.sugars_g ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-[#6E6A63] ml-1">g</span>
          </div>
          {showSliders ? (
            <input
              type="range"
              min="0"
              max="60"
              step="0.5"
              value={nutrition.sugars_g ?? 0}
              onChange={(e) => updateValue('sugars_g', parseFloat(e.target.value))}
            />
          ) : (
            <span className="text-[11px] text-[#6E6A63] font-mono">Simple & added sugars</span>
          )}
        </div>

        {/* 3. Saturated Fat */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] flex flex-col justify-between">
          <span className="text-xs font-mono text-[#6E6A63] uppercase">Saturated Fat</span>
          <div className="my-2">
            <span className="text-2xl font-black font-mono text-[#161616]">
              {(nutrition.saturated_fat_g ?? 0).toFixed(1)}
            </span>
            <span className="text-xs text-[#6E6A63] ml-1">g</span>
          </div>
          {showSliders ? (
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={nutrition.saturated_fat_g ?? 0}
              onChange={(e) => updateValue('saturated_fat_g', parseFloat(e.target.value))}
            />
          ) : (
            <span className="text-[11px] text-[#6E6A63] font-mono">Fatty acids</span>
          )}
        </div>

        {/* 4. Salt */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] flex flex-col justify-between">
          <span className="text-xs font-mono text-[#6E6A63] uppercase">Salt</span>
          <div className="my-2">
            <span className="text-2xl font-black font-mono text-[#161616]">
              {(nutrition.salt_g ?? 0).toFixed(2)}
            </span>
            <span className="text-xs text-[#6E6A63] ml-1">g</span>
          </div>
          {showSliders ? (
            <input
              type="range"
              min="0"
              max="5"
              step="0.05"
              value={nutrition.salt_g ?? 0}
              onChange={(e) => updateValue('salt_g', parseFloat(e.target.value))}
            />
          ) : (
            <span className="text-[11px] text-[#6E6A63] font-mono">Sodium chloride</span>
          )}
        </div>

      </div>

    </div>
  );
}
