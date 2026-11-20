import { useState, useMemo } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import type { NutriGrade, ProfileAdjustment, ProductItem, ScoringResult } from '../lib/types';
import { getGradeColor } from '../lib/scoring';
import { type Language } from '../lib/i18n';

interface VerdictCardProps {
  product: ProductItem;
  scoringResult: ScoringResult;
  profileAdjustment: ProfileAdjustment;
  activeProfileName: string;
  language?: Language;
}

const GRADES: NutriGrade[] = ['A', 'B', 'C', 'D', 'E'];

const NUTRI_COLORS: Record<NutriGrade, string> = {
  A: '#038141',
  B: '#85bb2f',
  C: '#fecb02',
  D: '#ee8100',
  E: '#e63e11'
};

export function VerdictCard({
  product,
  scoringResult,
  profileAdjustment,
  activeProfileName,
  language = 'en'
}: VerdictCardProps) {
  const [showDetailedMath, setShowDetailedMath] = useState(false);
  const grade = scoringResult.grade;
  const finalScore = Math.max(0, Math.min(10, profileAdjustment.adjusted_score));
  const gradeColor = getGradeColor(grade);

  // Compute Teaspoons of Sugar & Plain Statement
  const sugarStats = useMemo(() => {
    const sugarsPer100 = product.per_100g.sugars_g ?? 0;
    let factor = 1;
    const match = product.serving_size.match(/(\d+)\s*(g|ml)/i);
    if (match) {
      const amt = parseFloat(match[1]);
      if (amt > 0 && amt <= 1000) factor = amt / 100;
    }
    const sugarInServing = sugarsPer100 * factor;
    const spoons = Math.max(0, Math.round((sugarInServing / 4) * 10) / 10);
    const roundedSpoons = Math.max(0, Math.round(spoons));
    const pctWho = Math.round((sugarInServing / 25) * 100);

    let sentence = '';
    if (product.is_beverage) {
      if (roundedSpoons >= 5) {
        sentence = `${roundedSpoons} teaspoons of sugar in one serving (${pctWho}% of WHO daily limit).`;
      } else if (roundedSpoons > 0) {
        sentence = `${roundedSpoons} teaspoons of sugar in this bottle.`;
      } else {
        sentence = 'Zero added sugar drink.';
      }
    } else {
      if (roundedSpoons >= 6) {
        sentence = `${roundedSpoons} teaspoons of sugar in this pack (${pctWho}% of WHO daily limit).`;
      } else if (roundedSpoons > 0) {
        sentence = `${roundedSpoons} teaspoons of sugar in this serving.`;
      } else {
        sentence = 'Low sugar content.';
      }
    }

    if (language === 'hi') {
      if (roundedSpoons > 0) {
        sentence = `इस पैकेट में ${roundedSpoons} चम्मच चीनी है (WHO दैनिक सीमा का ${pctWho}%)।`;
      } else {
        sentence = 'कम चीनी की मात्रा।';
      }
    }

    return { spoons, roundedSpoons, pctWho, sentence, gramsInServing: sugarInServing };
  }, [product, language]);

  // Non-Food Guard
  if (product.is_food === false) {
    return (
      <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#92400E]">
          Non-Food Item
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#161616]">
          {product.product_name}
        </h2>
        <p className="text-sm text-[#6E6A63] leading-relaxed max-w-xl">
          LabelLens evaluates food and beverages. This packaging was recognized as {product.category || 'non-food'}.
        </p>
      </div>
    );
  }

  // Visual Nutrients (Sugar, Saturated Fat, Salt, Calories)
  const nutrients = [
    {
      label: 'Sugar',
      value: `${product.per_100g.sugars_g ?? 0}g`,
      pct: Math.min(100, Math.round(((product.per_100g.sugars_g ?? 0) / 25) * 100)),
      benchmark: 'WHO limit: 25g/day'
    },
    {
      label: 'Saturated Fat',
      value: `${product.per_100g.saturated_fat_g ?? 0}g`,
      pct: Math.min(100, Math.round(((product.per_100g.saturated_fat_g ?? 0) / 20) * 100)),
      benchmark: 'Daily ref: 20g/day'
    },
    {
      label: 'Salt',
      value: `${product.per_100g.salt_g ?? 0}g`,
      pct: Math.min(100, Math.round(((product.per_100g.salt_g ?? 0) / 5) * 100)),
      benchmark: 'WHO limit: 5g/day'
    },
    {
      label: 'Calories',
      value: `${Math.round((product.per_100g.energy_kj ?? 0) / 4.184)} kcal`,
      pct: Math.min(100, Math.round((((product.per_100g.energy_kj ?? 0) / 4.184) / 2000) * 100)),
      benchmark: 'Diet ref: 2000 kcal'
    }
  ];

  // Penalties vs Offsets for Stacked Bar
  const totalScale = Math.max(1, scoringResult.N_points + scoringResult.P_points);
  const penaltyWidthPct = Math.round((scoringResult.N_points / totalScale) * 100);
  const offsetWidthPct = Math.round((scoringResult.P_points / totalScale) * 100);

  return (
    <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-6 sm:p-8 space-y-7 shadow-xs">
      
      {/* 1. Real Nutri-Score A-E Strip */}
      <div className="flex items-center gap-1.5 w-full">
        {GRADES.map((g) => {
          const isActive = g === grade;
          const col = NUTRI_COLORS[g];
          return (
            <div
              key={g}
              style={{
                backgroundColor: isActive ? col : '#EFECE4',
                color: isActive ? '#FFFFFF' : '#6E6A63'
              }}
              className={`flex-1 h-9 rounded-md flex items-center justify-center font-bold font-mono transition-all ${
                isActive ? 'scale-105 z-10 text-base shadow-xs' : 'text-xs'
              }`}
            >
              {g}
            </div>
          );
        })}
      </div>

      {/* 2. Top Hero: Giant Grade, Product Name, Plain Sentence */}
      <div className="space-y-3 pt-1 border-b border-[#E2DDD4] pb-6">
        
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          {/* Product Name & Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#6E6A63]">
              <span
                style={{ backgroundColor: gradeColor }}
                className="px-2 py-0.5 rounded text-xs font-mono font-bold text-white uppercase"
              >
                Grade {grade}
              </span>
              <span>·</span>
              <span className="font-semibold text-[#161616]">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
              <span>·</span>
              <span>Serving {product.serving_size}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#161616] tracking-tight leading-tight">
              {product.product_name}
            </h1>
          </div>

          {/* Plain Secondary Health Index */}
          <div className="sm:text-right shrink-0 pt-2 sm:pt-0 font-mono">
            <div className="text-3xl sm:text-4xl font-black text-[#161616] tabular-nums">
              {finalScore.toFixed(1)}
              <span className="text-base font-normal text-[#6E6A63] ml-1">/ 10</span>
            </div>
            <div className="text-[11px] text-[#6E6A63]">
              Health Index ({activeProfileName})
            </div>
          </div>
        </div>

        {/* The One Plain Hero Sentence */}
        <p className="text-lg sm:text-xl font-medium text-[#161616] pt-1">
          {sugarStats.sentence}
        </p>

        {/* Warning if hard profile trigger */}
        {profileAdjustment.hard_warnings.length > 0 && (
          <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs font-medium text-[#92400E]">
            {profileAdjustment.hard_warnings[0].message}
          </div>
        )}

      </div>

      {/* 3. Visual Data: Teaspoons of Sugar Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[#6E6A63] uppercase tracking-wider text-[11px]">
            Sugar Visualizer
          </span>
          <span className="font-mono font-medium text-[#161616]">
            {sugarStats.roundedSpoons} Teaspoons ({sugarStats.pctWho}% of WHO daily limit)
          </span>
        </div>

        {/* Visual Teaspoon Row */}
        <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4]">
          {sugarStats.roundedSpoons > 0 ? (
            Array.from({ length: Math.min(24, sugarStats.roundedSpoons) }).map((_, idx) => (
              <span
                key={idx}
                className="w-7 h-7 rounded-md bg-white border border-[#E2DDD4] flex items-center justify-center text-xs font-mono font-bold text-[#161616] shadow-2xs"
                title={`Teaspoon ${idx + 1}`}
              >
                🥄
              </span>
            ))
          ) : (
            <span className="text-xs text-[#6E6A63] font-medium">0 teaspoons added</span>
          )}
        </div>

        {/* Single WHO Limit Comparison Bar */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-[#EFECE4] overflow-hidden flex">
            <div
              style={{
                width: `${Math.min(100, sugarStats.pctWho)}%`,
                backgroundColor: sugarStats.pctWho > 100 ? '#e63e11' : sugarStats.pctWho > 60 ? '#ee8100' : '#038141'
              }}
              className="h-full transition-all duration-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6E6A63] font-mono">
            <span>0g</span>
            <span>WHO Daily Limit (25g)</span>
          </div>
        </div>
      </div>

      {/* 4. Nutrients as Horizontal Bars (Sugar, Sat Fat, Salt, Calories) */}
      <div className="space-y-3 pt-2 border-t border-[#E2DDD4]">
        <div className="text-xs font-mono text-[#6E6A63] uppercase tracking-wider text-[11px]">
          Nutrient Levels per 100g
        </div>

        <div className="space-y-2.5">
          {nutrients.map((n) => (
            <div key={n.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#161616]">{n.label}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#6E6A63] text-[11px]">{n.benchmark}</span>
                  <span className="font-bold text-[#161616]">{n.value}</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-[#EFECE4] overflow-hidden">
                <div
                  style={{
                    width: `${n.pct}%`,
                    backgroundColor: n.pct > 80 ? '#e63e11' : n.pct > 40 ? '#ee8100' : '#038141'
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Points Deduction: Simple Stacked Bar of Penalties vs Offsets */}
      <div className="space-y-3 pt-3 border-t border-[#E2DDD4]">
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[#6E6A63] uppercase tracking-wider text-[11px]">
            Points Deduction Balance
          </span>
          <span className="font-mono text-xs text-[#161616]">
            Nutri-Score: <strong className="font-bold">{scoringResult.raw_score}</strong>
          </span>
        </div>

        {/* Stacked Horizontal Bar */}
        <div className="w-full h-3 rounded-full bg-[#EFECE4] overflow-hidden flex">
          <div
            style={{ width: `${penaltyWidthPct}%`, backgroundColor: '#e63e11' }}
            className="h-full transition-all duration-500"
            title={`Penalties: +${scoringResult.N_points}`}
          />
          <div
            style={{ width: `${offsetWidthPct}%`, backgroundColor: '#038141' }}
            className="h-full transition-all duration-500"
            title={`Offsets: -${scoringResult.P_points}`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#6E6A63] font-mono">
          <span className="text-[#e63e11] font-semibold">
            +{scoringResult.N_points} Penalty points
          </span>
          <span className="text-[#038141] font-semibold">
            -{scoringResult.P_points} Offset points
          </span>
        </div>

        {/* Expandable Breakdown Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowDetailedMath(!showDetailedMath)}
            className="w-full flex items-center justify-between py-2 text-xs text-[#6E6A63] hover:text-[#161616] transition-colors"
          >
            <span>{showDetailedMath ? 'Hide calculation details' : 'Why points were deducted (full math)'}</span>
            {showDetailedMath ? <CaretUp size={14} /> : <CaretDown size={14} />}
          </button>

          {showDetailedMath && (
            <div className="mt-2 space-y-4 pt-2 border-t border-[#E2DDD4] text-xs">
              
              {/* Penalties List */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] font-bold text-[#e63e11] uppercase">
                  Penalties Added (+N)
                </div>
                <div className="divide-y divide-[#E2DDD4] border border-[#E2DDD4] rounded-lg overflow-hidden bg-[#F6F3EC]">
                  {scoringResult.breakdown.filter((f) => f.direction === 'bad').map((f, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-[#161616]">{f.factor}</span>
                        <p className="text-[11px] text-[#6E6A63]">{f.explanation}</p>
                      </div>
                      <div className="text-right font-mono shrink-0 pl-2">
                        <span className="text-[11px] text-[#6E6A63] block">{f.value}</span>
                        <span className="font-bold text-[#e63e11]">+{f.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offsets List */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] font-bold text-[#038141] uppercase">
                  Offsets Deducted (-P)
                </div>
                <div className="divide-y divide-[#E2DDD4] border border-[#E2DDD4] rounded-lg overflow-hidden bg-[#F6F3EC]">
                  {scoringResult.breakdown.filter((f) => f.direction === 'good').map((f, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-[#161616]">{f.factor}</span>
                        <p className="text-[11px] text-[#6E6A63]">{f.explanation}</p>
                      </div>
                      <div className="text-right font-mono shrink-0 pl-2">
                        <span className="text-[11px] text-[#6E6A63] block">{f.value}</span>
                        <span className="font-bold text-[#038141]">-{f.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Quiet Footer Note */}
      <div className="pt-2 border-t border-[#E2DDD4] text-center text-xs text-[#6E6A63]">
        {activeProfileName !== 'General (Standard)' && (
          <span>Evaluated under {activeProfileName} profile rules. </span>
        )}
        <span>Based on European Nutri-Score standards.</span>
      </div>

    </div>
  );
}
