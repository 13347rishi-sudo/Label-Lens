import { useState } from 'react';
import { 
  WarningCircle, 
  CheckCircle, 
  ShieldCheck, 
  Sparkle, 
  TrendDown, 
  ChartLineUp, 
  CaretDown, 
  CaretUp,
  Scales,
  Warning,
  Info
} from '@phosphor-icons/react';
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
  const [showDetailedMath, setShowDetailedMath] = useState(false);
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

  // Colour-Blind Safe Grade Icons & Descriptors
  const gradeDetails = {
    A: {
      icon: <ShieldCheck size={28} weight="fill" className="text-emerald-400" />,
      label: t.grades.A,
      shape: '★ Optimal',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    B: {
      icon: <CheckCircle size={28} weight="fill" className="text-lime-400" />,
      label: t.grades.B,
      shape: '✔ Good',
      badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/40'
    },
    C: {
      icon: <Scales size={28} weight="fill" className="text-amber-400" />,
      label: t.grades.C,
      shape: '⚖ Moderate',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    D: {
      icon: <Warning size={28} weight="fill" className="text-orange-400" />,
      label: t.grades.D,
      shape: '▲ Caution',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    },
    E: {
      icon: <WarningCircle size={28} weight="fill" className="text-red-400" />,
      label: t.grades.E,
      shape: '■ High Risk',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40'
    }
  }[grade];

  // Dynamic Top 3 Findings
  const topFindings: Array<{ icon: string; text: string; subtext: string; color: string }> = [];

  // Finding 1: Allergens or Critical Warnings
  if (profileAdjustment.hard_warnings.length > 0) {
    topFindings.push({
      icon: '⚠️',
      text: profileAdjustment.hard_warnings[0].message,
      subtext: `Health Profile Notice (${activeProfileName})`,
      color: 'border-red-500/40 bg-red-500/10 text-red-200'
    });
  }

  // Finding 2: Sugar Impact
  if (isHighSugar) {
    topFindings.push({
      icon: '🍬',
      text: language === 'en' 
        ? `High Sugar: ${product.per_100g.sugars_g}g per 100g` 
        : `उच्च चीनी: ${product.per_100g.sugars_g} ग्राम प्रति 100 ग्राम`,
      subtext: language === 'en' ? 'Exceeds recommended daily healthy threshold' : 'दैनिक अनुशंसित सीमा से अधिक',
      color: 'border-red-500/30 bg-red-500/10 text-red-200'
    });
  } else {
    topFindings.push({
      icon: '✅',
      text: language === 'en' ? 'Moderate Sugar Content' : 'संतुलित चीनी स्तर',
      subtext: language === 'en' ? `${product.per_100g.sugars_g ?? 0}g sugar per 100g` : `${product.per_100g.sugars_g ?? 0}g चीनी प्रति 100g`,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    });
  }

  // Finding 3: Saturated Fat / Palm Oil or Sodium
  if (isHighSatFat) {
    topFindings.push({
      icon: '🌴',
      text: language === 'en'
        ? `High Saturated Fat: ${product.per_100g.saturated_fat_g}g / 100g`
        : `उच्च संतृप्त वसा: ${product.per_100g.saturated_fat_g}g / 100g`,
      subtext: language === 'en' ? 'Often derived from refined palm oils' : 'अक्सर रिफाइंड पाम तेल से आता है',
      color: 'border-orange-500/30 bg-orange-500/10 text-orange-200'
    });
  } else if (isHighSodium) {
    topFindings.push({
      icon: '🧂',
      text: language === 'en'
        ? `High Sodium / Salt: ${product.per_100g.salt_g ?? 'High'}g salt`
        : `अधिक नमक/सोडियम: ${product.per_100g.salt_g ?? 'अधिक'}g नमक`,
      subtext: language === 'en' ? 'Keep intake low for cardiovascular health' : 'हृदय स्वास्थ्य के लिए कम मात्रा रखें',
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-200'
    });
  } else {
    topFindings.push({
      icon: '🥗',
      text: language === 'en' ? 'Balanced Salt & Healthy Fats' : 'संतुलित नमक एवं वसा',
      subtext: language === 'en' ? 'Within recommended daily guidelines' : 'दैनिक स्वास्थ्य मानकों के अनुरूप',
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    });
  }

  // Cap to top 3 findings for instant kiosk clarity
  const displayFindings = topFindings.slice(0, 3);

  // Vegetarian Status
  const isVegetarian = product.is_veg !== false;

  // Non-Food Guard
  if (product.is_food === false) {
    return (
      <div className="w-full rounded-3xl apple-glass p-6 sm:p-8 space-y-4 border border-amber-500/30 bg-amber-500/[0.04] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <WarningCircle size={32} weight="fill" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Non-Food Item Scanned</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.product_name}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              LabelLens evaluates <strong>edible food and beverage products</strong>. This package was recognized as <strong>{product.category || 'a non-food item'}</strong>. Nutrition facts and Nutri-Scores are not applicable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl apple-glass p-5 sm:p-8 space-y-6 relative overflow-hidden border border-white/[0.09]">
      
      {/* Background Radial Glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: gradeColor }}
      />

      {/* ⚠️ Prominent Science Exhibition Medical Disclaimer Banner */}
      <div className="w-full p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
        <Info size={18} className="shrink-0 text-amber-400 mt-0.5" />
        <p>{t.disclaimer}</p>
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
                className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center ${
                  isVegetarian ? 'border-emerald-500' : 'border-amber-600'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isVegetarian ? 'bg-emerald-500' : 'bg-amber-600'
                  }`}
                />
              </div>
              <span>{isVegetarian ? '100% Veg' : 'Non-Veg'}</span>
            </div>

            <span className="text-zinc-500">·</span>
            <span className="text-zinc-200 font-semibold text-xs sm:text-sm">{product.brand}</span>
            <span className="text-zinc-500">·</span>
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
            <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
              {gradeDetails.icon}
              <span>{t.nutriScoreTitle}</span>
            </span>

            {/* Giant Letter Badge */}
            <div
              style={{
                backgroundColor: gradeColor,
                color: grade === 'C' ? '#18181b' : '#ffffff',
                boxShadow: `0 8px 30px ${gradeColor}66`
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl font-black my-2 transform transition-transform hover:scale-105"
            >
              {grade}
            </div>

            <div className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold mt-1 tracking-wide ${gradeDetails.badgeBg}`}>
              {gradeDetails.shape}
            </div>

            <span className="text-[10px] text-zinc-400 text-center mt-2 leading-tight max-w-[170px]">
              {t.basedOnNutriScore}
            </span>
          </div>

          {/* Card B: Giant Health Index Dial (1 to 10) */}
          <div className="w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/[0.09] backdrop-blur-md shadow-xl text-center">
            <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
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
                  className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
                >
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-0.5">
                  / 10
                </span>
              </div>
            </div>

            <span className="text-xs text-zinc-300 font-semibold mt-1">
              Profile: {activeProfileName}
            </span>
          </div>

        </div>

      </div>

      {/* Top 3 Health Findings Section (Clear & Actionable for Judges) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkle size={18} className="text-amber-400 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {t.topWarningsTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displayFindings.map((finding, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${finding.color}`}
            >
              <span className="text-2xl shrink-0 mt-0.5">{finding.icon}</span>
              <div className="space-y-0.5">
                <div className="font-bold text-sm sm:text-base text-white leading-snug">
                  {finding.text}
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed">
                  {finding.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutri-Score Bar Slider Visualizer */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Nutri-Score Spectrum</span>
          <span>{t.basedOnNutriScore}</span>
        </div>
        
        <div className="flex items-center gap-1.5 w-full">
          {GRADES.map((g) => {
            const isActive = g === grade;
            const col = NUTRI_COLORS[g];
            return (
              <div
                key={g}
                style={{
                  backgroundColor: isActive ? col : 'rgba(255,255,255,0.06)',
                  color: isActive ? (g === 'C' ? '#18181b' : '#ffffff') : 'rgba(255,255,255,0.4)',
                  boxShadow: isActive ? `0 4px 16px ${col}80` : 'none'
                }}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                  isActive ? 'scale-105 z-10 text-xl' : 'text-sm'
                }`}
              >
                {g}
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Scientific Calculation Points */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetailedMath(!showDetailedMath)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-xs sm:text-sm text-zinc-300 font-medium transition-all active:scale-98 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <ChartLineUp size={18} className="text-sky-400" />
            <span>{showDetailedMath ? 'Hide Calculation Points Breakdown' : 'View Scientific Points Balance (N vs P)'}</span>
          </span>
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <span className="font-mono">Raw Score: {scoringResult.raw_score}</span>
            {showDetailedMath ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </div>
        </button>

        {showDetailedMath && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs sm:text-sm">
                <span className="text-zinc-200 font-semibold">Nutrient Balance: Unfavourable (N) vs Favourable (P)</span>
                <span className="text-xs text-zinc-400">
                  Formula: Raw Score = N ({scoringResult.N_points}) - P ({scoringResult.P_points}) = <strong className="text-white font-mono">{scoringResult.raw_score}</strong>
                </span>
              </div>

              {/* Progress balance bar */}
              <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, (scoringResult.N_points / 40) * 100)}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                />
                <div
                  style={{ width: `${Math.min(100, (scoringResult.P_points / 15) * 100)}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-amber-200 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                  <TrendDown size={16} className="shrink-0 text-amber-400" />
                  <span>Unfavourable Points (N): <strong className="text-white">{scoringResult.N_points}</strong> (Sugars, Sat Fat, Salt, Calories)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                  <Sparkle size={16} className="shrink-0 text-emerald-400" />
                  <span>Favourable Points (P): <strong className="text-white">{scoringResult.P_points}</strong> (Fibre, Protein, Fruit/Veg)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
