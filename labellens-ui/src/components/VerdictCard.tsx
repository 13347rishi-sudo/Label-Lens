import { WarningCircle, CheckCircle, ShieldCheck, Sparkle, TrendDown, TrendUp } from '@phosphor-icons/react';
import type { NutriGrade, ProfileAdjustment, ProductItem, ScoringResult } from '../lib/types';
import { getGradeColor } from '../lib/scoring';

interface VerdictCardProps {
  product: ProductItem;
  scoringResult: ScoringResult;
  profileAdjustment: ProfileAdjustment;
  activeProfileName: string;
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
  activeProfileName
}: VerdictCardProps) {
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

  const hasHfssAlert = isHighSugar || isHighSatFat || isHighSodium;

  // Circular Activity Ring Geometry
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const progressRatio = Math.min(Math.max(finalScore / 10, 0), 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Human-friendly Health Rating Labels
  let scoreQuality = { label: 'Healthy Choice', pillBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' };
  if (finalScore < 2.5) {
    scoreQuality = { label: 'High in Sugar, Fat or Salt', pillBg: 'bg-red-500/15 border-red-500/30 text-red-300' };
  } else if (finalScore < 4.5) {
    scoreQuality = { label: 'Have Occasionally', pillBg: 'bg-orange-500/15 border-orange-500/30 text-orange-300' };
  } else if (finalScore < 6.5) {
    scoreQuality = { label: 'Moderate Choice', pillBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300' };
  } else if (finalScore < 8.0) {
    scoreQuality = { label: 'Good Choice', pillBg: 'bg-lime-500/15 border-lime-500/30 text-lime-300' };
  }

  // Vegetarian Status
  const isVegetarian = product.is_veg !== false;

  return (
    <div className="w-full rounded-3xl apple-glass p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: gradeColor }}
      />

      {/* Health Profile Warnings (e.g. Nut Allergy) */}
      {profileAdjustment.hard_warnings.length > 0 && (
        <div className="space-y-2">
          {profileAdjustment.hard_warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                w.severity === 'CRITICAL'
                  ? 'bg-red-500/15 border-red-500/40 text-red-100 shadow-lg shadow-red-500/10'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-100'
              }`}
            >
              <WarningCircle size={22} weight="fill" className="shrink-0 mt-0.5 text-red-400" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/30 font-mono">
                    {w.severity === 'CRITICAL' ? 'Avoid This Product' : 'Health Notice'}
                  </span>
                  <span className="text-xs text-red-300">Profile: {activeProfileName}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">{w.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Score & Product Details */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-white/[0.08]">
        
        {/* Left: Product Name & Category */}
        <div className="space-y-2.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            
            {/* FSSAI Veg / Non-Veg Mark */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${
                isVegetarian
                  ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-700/50 text-amber-300'
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
              <span>{isVegetarian ? '100% Veg' : 'Non-Veg'}</span>
            </div>

            <span className="text-zinc-500">·</span>
            <span className="text-zinc-300 font-medium">{product.category}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400">{product.brand}</span>

            {/* Source Tag */}
            {product.source_engine && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.06]">
                {product.source_engine === 'gs1_india' && 'GS1 India'}
                {product.source_engine === 'openfoodfacts' && 'Open Food Facts'}
                {product.source_engine === 'ollama_vision' && 'AI Label Scan'}
                {product.source_engine === 'local' && 'Verified Benchmark'}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {product.product_name}
          </h2>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-400 pt-0.5">
            <span>
              Serving: <strong className="text-zinc-200">{product.serving_size}</strong>
            </span>
            <span>·</span>
            <span className="font-mono text-[11px] text-zinc-500">
              Barcode: <span className="text-zinc-300">{product.barcode}</span>
            </span>
            {product.is_beverage && (
              <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 text-[10px] font-medium border border-blue-500/20">
                Drink
              </span>
            )}
          </div>
        </div>

        {/* Right: Health Score Dial & Nutri-Score Bar (Mobile-first responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
          
          {/* Card 1: Health Index Dial */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={circleRadius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={circleRadius}
                  stroke={gradeColor}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: `drop-shadow(0 0 6px ${gradeColor}80)`,
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                  style={{ color: gradeColor }}
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
                >
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-0.5">
                  / 10
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end sm:items-center text-right sm:text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
                Health Index
              </span>
              <div
                className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide ${scoreQuality.pillBg}`}
              >
                {scoreQuality.label}
              </div>
            </div>
          </div>

          {/* Card 2: Official Nutri-Score Bar */}
          <div className="flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md min-w-[210px]">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1">
                <ShieldCheck size={13} weight="fill" className="text-emerald-400" />
                Nutri-Score
              </span>
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08]">
                Grade {grade}
              </span>
            </div>

            <div className="flex items-center justify-between w-full p-1 rounded-xl bg-black/40 border border-white/[0.06] shadow-inner gap-1">
              {GRADES.map((g) => {
                const isActive = g === grade;
                const col = NUTRI_COLORS[g];
                return (
                  <div
                    key={g}
                    style={{
                      backgroundColor: isActive ? col : 'transparent',
                      color: isActive ? (g === 'C' ? '#18181b' : '#ffffff') : 'rgba(255,255,255,0.35)',
                      boxShadow: isActive ? `0 4px 14px ${col}66` : 'none'
                    }}
                    className={`flex-1 flex items-center justify-center transition-all duration-300 font-extrabold select-none ${
                      isActive
                        ? 'h-10 sm:h-12 text-sm sm:text-base rounded-lg scale-105 z-10 font-black'
                        : 'h-8 sm:h-10 text-xs rounded-md hover:text-white/60'
                    }`}
                  >
                    {g}
                  </div>
                );
              })}
            </div>

            <span className="text-[10px] text-zinc-400 text-center">
              Official European Standard (A to E)
            </span>
          </div>

        </div>

      </div>

      {/* Warnings & Nutritional Alerts */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
          <Sparkle size={14} className="text-amber-400 shrink-0" />
          <span>Health Alerts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isHighSugar && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-200">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
              High Sugar ({product.per_100g.sugars_g}g / 100g)
            </span>
          )}

          {isHighSatFat && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-orange-500/15 border border-orange-500/30 text-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              High Saturated Fat ({product.per_100g.saturated_fat_g}g / 100g)
            </span>
          )}

          {isHighSodium && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              High Salt ({product.per_100g.salt_g ?? 'High'}g / 100g)
            </span>
          )}

          {!hasHfssAlert && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
              <CheckCircle size={14} weight="fill" className="text-emerald-400 shrink-0" />
              Within healthy limits for sugar, salt, and fat
            </span>
          )}

          {/* Profile Adjustment Note */}
          {profileAdjustment.penalty_applied > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-200">
              ⚡ Profile adjustment ({activeProfileName}): -{profileAdjustment.penalty_applied.toFixed(1)} pts
            </span>
          )}
        </div>
      </div>

      {/* Points Breakdown: Bad Nutrients vs Good Nutrients */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
          <span className="text-zinc-300 font-semibold">Points Balance: Unhealthy vs Healthy Nutrients</span>
          <span className="text-xs text-zinc-400">
            Final Raw Score: <strong className="text-white font-mono">{scoringResult.raw_score}</strong>
          </span>
        </div>

        {/* Visual Balance Bar */}
        <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
          <div
            style={{ width: `${Math.min(100, (scoringResult.N_points / 40) * 100)}%` }}
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-700"
            title={`Points to limit: ${scoringResult.N_points}`}
          />
          <div
            style={{ width: `${Math.min(100, (scoringResult.P_points / 15) * 100)}%` }}
            className="h-full bg-emerald-500 transition-all duration-700"
            title={`Healthy points: ${scoringResult.P_points}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-0.5">
          <div className="flex items-center gap-1.5 text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <TrendDown size={14} className="shrink-0 text-amber-400" />
            <span>Points to limit: <strong className="text-white">{scoringResult.N_points}</strong> <span className="text-zinc-400 text-[11px]">(Sugar, Sat Fat, Salt, Cal)</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <TrendUp size={14} className="shrink-0 text-emerald-400" />
            <span>Healthy points: <strong className="text-white">{scoringResult.P_points}</strong> <span className="text-zinc-400 text-[11px]">(Fiber, Protein, Fruit/Veg)</span></span>
          </div>
        </div>
      </div>

      {/* Nutrition Factor Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        
        {/* Healthy Factors */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle size={16} weight="fill" />
            <span>Healthy Nutrients</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {scoringResult.breakdown
              .filter((b) => b.direction === 'good')
              .map((item, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0 gap-0.5">
                  <span className="text-zinc-400 text-xs">{item.factor}</span>
                  <span className="font-medium text-xs text-emerald-300">+{item.points} pts <span className="text-zinc-500 text-[11px]">({item.explanation})</span></span>
                </li>
              ))}
            {scoringResult.breakdown.filter((b) => b.direction === 'good').length === 0 && (
              <li className="text-zinc-500 py-1">Low in fiber, protein, and fruit.</li>
            )}
          </ul>
        </div>

        {/* Nutrients to Watch */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <WarningCircle size={16} weight="fill" />
            <span>Nutrients to Limit</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {scoringResult.breakdown
              .filter((b) => b.direction === 'bad')
              .map((item, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0 gap-0.5">
                  <span className="text-zinc-400 text-xs">{item.factor}</span>
                  <span className="font-medium text-xs text-amber-300">+{item.points} pts <span className="text-zinc-500 text-[11px]">({item.explanation})</span></span>
                </li>
              ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
