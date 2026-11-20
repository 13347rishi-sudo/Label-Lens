import { useState } from 'react';
import { CaretDown, CaretUp, Info } from '@phosphor-icons/react';
import type { NutriGrade, ProfileAdjustment, ProductItem, ScoringResult } from '../lib/types';
import { getGradeColor } from '../lib/scoring';
import { TRANSLATIONS, type Language } from '../lib/i18n';

interface VerdictCardProps {
  product: ProductItem;
  scoringResult: ScoringResult;
  profileAdjustment: ProfileAdjustment;
  activeProfileName: string;
  language?: Language;
}

const GRADES: NutriGrade[] = ['A', 'B', 'C', 'D', 'E'];

// Nutri-Score Color Palette
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
  const [showSpectrum, setShowSpectrum] = useState(false);
  const t = TRANSLATIONS[language];
  const grade = scoringResult.grade;
  const finalScore = Math.max(0, Math.min(10, profileAdjustment.adjusted_score));
  const gradeColor = getGradeColor(grade);

  // FSSAI High Fat, Sugar, Salt (HFSS) Checks
  const isHighSugar =
    product.per_100g.sugars_g !== null &&
    ((product.is_beverage && product.per_100g.sugars_g > 10) ||
      (!product.is_beverage && product.per_100g.sugars_g > 21));

  const isHighSatFat =
    product.per_100g.saturated_fat_g !== null && product.per_100g.saturated_fat_g > 6.0;

  const isHighSodium =
    (product.per_100g.sodium_mg !== null && product.per_100g.sodium_mg > 600) ||
    (product.per_100g.salt_g !== null && product.per_100g.salt_g > 1.5);

  // Circular Activity Ring Geometry
  const circleRadius = 42;
  const circumference = 2 * Math.PI * circleRadius;
  const progressRatio = Math.min(Math.max(finalScore / 10, 0), 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Colour-Blind Safe Grade Descriptors (Modern 2026 Typographic)
  const gradeDetails = {
    A: {
      label: t.grades.A,
      badgeText: 'GRADE A · OPTIMAL',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    B: {
      label: t.grades.B,
      badgeText: 'GRADE B · GOOD',
      badgeBg: 'bg-lime-500/10 text-lime-400 border-lime-500/30'
    },
    C: {
      label: t.grades.C,
      badgeText: 'GRADE C · MODERATE',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    D: {
      label: t.grades.D,
      badgeText: 'GRADE D · CAUTION',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    },
    E: {
      label: t.grades.E,
      badgeText: 'GRADE E · HIGH RISK',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30'
    }
  }[grade];

  // Dynamic Findings with clean typography (No emojis, Apple/Linear style)
  const topFindings: Array<{ tag: string; title: string; detail: string; severity: 'critical' | 'warning' | 'positive' }> = [];

  // Finding 1: Allergens or Critical Warnings
  if (profileAdjustment.hard_warnings.length > 0) {
    topFindings.push({
      tag: 'HEALTH PROFILE NOTICE',
      title: profileAdjustment.hard_warnings[0].message,
      detail: `Evaluated against ${activeProfileName} clinical rules`,
      severity: 'critical'
    });
  }

  // Finding 2: Sugar Impact
  if (isHighSugar) {
    topFindings.push({
      tag: 'FREE SUGARS',
      title: language === 'en' 
        ? `${product.per_100g.sugars_g}g Sugar per 100g` 
        : `उच्च चीनी: ${product.per_100g.sugars_g}g प्रति 100g`,
      detail: language === 'en' ? 'Exceeds recommended healthy daily threshold' : 'दैनिक अनुशंसित सीमा से अधिक',
      severity: 'warning'
    });
  } else {
    topFindings.push({
      tag: 'FREE SUGARS',
      title: language === 'en' ? `${product.per_100g.sugars_g ?? 0}g Sugar per 100g` : `संतुलित चीनी (${product.per_100g.sugars_g ?? 0}g)`,
      detail: language === 'en' ? 'Within recommended healthy limit' : 'दैनिक स्वास्थ्य मानकों के अनुरूप',
      severity: 'positive'
    });
  }

  // Finding 3: Saturated Fat / Palm Oil or Sodium
  if (isHighSatFat) {
    topFindings.push({
      tag: 'SATURATED FAT',
      title: language === 'en'
        ? `${product.per_100g.saturated_fat_g}g Saturated Fat / 100g`
        : `उच्च संतृप्त वसा: ${product.per_100g.saturated_fat_g}g / 100g`,
      detail: language === 'en' ? 'Often derived from refined palm oils' : 'अक्सर रिफाइंड पाम तेल से आता है',
      severity: 'warning'
    });
  } else if (isHighSodium) {
    topFindings.push({
      tag: 'SODIUM & SALT',
      title: language === 'en'
        ? `${product.per_100g.salt_g ?? 'High'}g Salt / Sodium`
        : `अधिक नमक/सोडियम (${product.per_100g.salt_g ?? 'अधिक'}g)`,
      detail: language === 'en' ? 'Keep intake low for cardiovascular health' : 'हृदय स्वास्थ्य के लिए कम मात्रा रखें',
      severity: 'warning'
    });
  } else {
    topFindings.push({
      tag: 'LIPIDS & SODIUM',
      title: language === 'en' ? 'Balanced Fats & Salt' : 'संतुलित नमक एवं वसा',
      detail: language === 'en' ? 'Within recommended cardiovascular guidelines' : 'दैनिक स्वास्थ्य मानकों के अनुरूप',
      severity: 'positive'
    });
  }

  const displayFindings = topFindings.slice(0, 3);
  const isVegetarian = product.is_veg !== false;

  // Non-Food Guard
  if (product.is_food === false) {
    return (
      <div className="w-full rounded-3xl apple-glass p-6 sm:p-8 space-y-4 border border-amber-500/30 bg-amber-500/[0.04] relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <span>Non-Food Item</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {product.product_name}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            LabelLens evaluates <strong>edible food and beverage products</strong>. This package was recognized as <strong>{product.category || 'a non-food item'}</strong>. Nutrition facts and Nutri-Scores are not applicable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl apple-glass p-5 sm:p-8 space-y-7 relative overflow-hidden border border-white/[0.09]">
      
      {/* Background Radial Glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: gradeColor }}
      />

      {/* Science Exhibition Educational Notice */}
      <div className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" />
          <span>{t.disclaimer}</span>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 hidden sm:inline">Exhibition Standard</span>
      </div>

      {/* Primary Kiosk Showcase: Giant Grade & Score (Readable from 1 Metre) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-white/[0.08]">
        
        {/* Left Col (7 cols): Giant Product Name & Category */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Veg / Non-Veg Mark */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${
                isVegetarian
                  ? 'bg-emerald-950/50 border-emerald-600/60 text-emerald-300'
                  : 'bg-amber-950/50 border-amber-700/60 text-amber-300'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-[2px] border flex items-center justify-center ${
                  isVegetarian ? 'border-emerald-500' : 'border-amber-600'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isVegetarian ? 'bg-emerald-500' : 'bg-amber-600'
                  }`}
                />
              </div>
              <span className="font-mono text-[11px]">{isVegetarian ? '100% VEG' : 'NON-VEG'}</span>
            </div>

            <span className="text-zinc-600">·</span>
            <span className="text-zinc-200 font-semibold text-xs sm:text-sm">{product.brand}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 text-xs sm:text-sm">{product.category}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {product.product_name}
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-400 pt-1 font-mono">
            <span>Serving: <strong className="text-white font-sans">{product.serving_size}</strong></span>
            <span>·</span>
            <span>Barcode: <strong className="text-zinc-300">{product.barcode}</strong></span>
          </div>
        </div>

        {/* Right Col (5 cols): Giant Color-Blind Safe Grade & Health Index */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-4 w-full">
          
          {/* Card A: Giant Nutri-Score Letter (Colour-Blind Safe Badge) */}
          <div className="w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.09] backdrop-blur-md shadow-xl text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
              {t.nutriScoreTitle}
            </span>

            {/* Giant Letter Badge */}
            <div
              style={{
                backgroundColor: gradeColor,
                color: grade === 'C' ? '#18181b' : '#ffffff',
                boxShadow: `0 8px 30px ${gradeColor}55`
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl font-black my-2 font-mono"
            >
              {grade}
            </div>

            <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold mt-1 tracking-wider uppercase ${gradeDetails.badgeBg}`}>
              {gradeDetails.badgeText}
            </div>

            <span className="text-[10px] text-zinc-400 text-center mt-2 leading-tight max-w-[170px]">
              {t.basedOnNutriScore}
            </span>
          </div>

          {/* Card B: Giant Health Index Dial (1 to 10) */}
          <div className="w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.09] backdrop-blur-md shadow-xl text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
              {t.healthIndex}
            </span>

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  stroke={gradeColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: `drop-shadow(0 0 8px ${gradeColor}80)`,
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  style={{ color: gradeColor }}
                  className="text-3xl sm:text-4xl font-black tracking-tight leading-none font-mono tabular-nums"
                >
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider mt-0.5">
                  / 10
                </span>
              </div>
            </div>

            <span className="text-xs text-zinc-300 font-medium mt-1">
              Profile: {activeProfileName}
            </span>
          </div>

        </div>

      </div>

      {/* Top 3 Health Findings Section (Clean Typographic Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{t.topWarningsTitle}</span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              Key Metrics
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayFindings.map((finding, idx) => {
            const styles = {
              critical: 'bg-rose-500/[0.04] border-rose-500/25',
              warning: 'bg-amber-500/[0.04] border-amber-500/25',
              positive: 'bg-emerald-500/[0.04] border-emerald-500/25'
            }[finding.severity];

            const tagStyles = {
              critical: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
              warning: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
              positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
            }[finding.severity];

            return (
              <div key={idx} className={`p-4 rounded-2xl border transition-all space-y-1.5 ${styles}`}>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold border ${tagStyles}`}>
                  {finding.tag}
                </span>
                <div className="font-bold text-sm sm:text-base text-white leading-snug">
                  {finding.title}
                </div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  {finding.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL POINT DEDUCTION & RATING BREAKDOWN (Core Educational Feature) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Why Points Were Deducted</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                Nutri-Score Math
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Exact nutritional penalty points added (+N) versus healthy components offset (-P) under the European Nutri-Score standard.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Formula: <span className="text-white font-bold">N ({scoringResult.N_points}) - P ({scoringResult.P_points}) = {scoringResult.raw_score}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column 1: Unfavourable Penalties (+N Points Added) */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
              <span className="font-mono uppercase tracking-wider text-rose-400 font-semibold text-[11px]">
                Penalty Points Deducted (+N)
              </span>
              <span className="font-mono text-rose-300 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 text-[11px]">
                +{scoringResult.N_points} Total Penalty
              </span>
            </div>

            <div className="space-y-2.5">
              {scoringResult.breakdown.filter((f) => f.direction === 'bad').map((factor, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400 text-[11px]">{factor.value}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                        factor.points > 0 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-white/5 text-zinc-400 border border-white/10'
                      }`}>
                        {factor.points > 0 ? `+${factor.points} pts` : '0 pts'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    {factor.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Favourable Offsets (-P Points Deducted from Penalty) */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
              <span className="font-mono uppercase tracking-wider text-emerald-400 font-semibold text-[11px]">
                Favourable Offsets Earned (-P)
              </span>
              <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                -{scoringResult.P_points} Total Offset
              </span>
            </div>

            <div className="space-y-2.5">
              {scoringResult.breakdown.filter((f) => f.direction === 'good').map((factor, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{factor.factor}</span>
                      {factor.isCapped && (
                        <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                          Protein Capped
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400 text-[11px]">{factor.value}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                        factor.points > 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-white/5 text-zinc-400 border border-white/10'
                      }`}>
                        {factor.points > 0 ? `-${factor.points} pts` : '0 pts'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    {factor.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Balance Summary Bar */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="font-mono text-zinc-300 text-xs sm:text-sm">
              Net Calculation: <span className="text-rose-400 font-bold">+{scoringResult.N_points} (Penalties)</span> - <span className="text-emerald-400 font-bold">{scoringResult.P_points} (Offsets)</span> = <strong className="text-white font-mono text-base ml-1">{scoringResult.raw_score}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-zinc-400">Yields Grade:</span>
            <span
              style={{ backgroundColor: gradeColor }}
              className="px-3 py-1 rounded-lg font-black text-black text-xs font-mono shadow-sm"
            >
              Grade {grade}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-zinc-300">1–10 Health Score: <strong className="text-white">{finalScore.toFixed(1)}</strong></span>
          </div>
        </div>
      </div>

      {/* Nutri-Score Spectrum Bar (Optional Toggle) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowSpectrum(!showSpectrum)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs text-zinc-400 transition-all active:scale-98"
        >
          <div className="flex items-center gap-2">
            <Info size={15} className="text-zinc-400" />
            <span>Nutri-Score Scale Reference (A through E Spectrum)</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <span>{showSpectrum ? 'Hide' : 'Show'}</span>
            {showSpectrum ? <CaretUp size={14} /> : <CaretDown size={14} />}
          </div>
        </button>

        {showSpectrum && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 mt-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Grade Spectrum</span>
              <span>{t.basedOnNutriScore}</span>
            </div>
            
            <div className="flex items-center gap-1.5 w-full pt-1">
              {GRADES.map((g) => {
                const isActive = g === grade;
                const col = NUTRI_COLORS[g];
                return (
                  <div
                    key={g}
                    style={{
                      backgroundColor: isActive ? col : 'rgba(255,255,255,0.04)',
                      color: isActive ? (g === 'C' ? '#18181b' : '#ffffff') : 'rgba(255,255,255,0.4)',
                      boxShadow: isActive ? `0 4px 16px ${col}80` : 'none'
                    }}
                    className={`flex-1 h-11 rounded-xl flex items-center justify-center font-black font-mono transition-all ${
                      isActive ? 'scale-105 z-10 text-lg' : 'text-xs'
                    }`}
                  >
                    {g}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
