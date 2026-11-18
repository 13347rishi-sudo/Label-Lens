import { WarningCircle, CheckCircle } from '@phosphor-icons/react';
import type { NutriGrade, ProfileAdjustment, ProductItem, ScoringResult } from '../lib/types';
import { getGradeColor } from '../lib/scoring';

interface VerdictCardProps {
  product: ProductItem;
  scoringResult: ScoringResult;
  profileAdjustment: ProfileAdjustment;
  activeProfileName: string;
}

const GRADES: NutriGrade[] = ['A', 'B', 'C', 'D', 'E'];

export function VerdictCard({
  product,
  scoringResult,
  profileAdjustment,
  activeProfileName
}: VerdictCardProps) {
  const grade = scoringResult.grade;
  const finalScore = profileAdjustment.adjusted_score;
  const gradeColor = getGradeColor(grade);

  return (
    <div className="w-full rounded-3xl apple-glass p-6 md:p-8 space-y-6">
      
      {/* Emergency Profile Warnings (e.g. Nut Allergy DO NOT BUY) */}
      {profileAdjustment.hard_warnings.length > 0 && (
        <div className="space-y-2">
          {profileAdjustment.hard_warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                w.severity === 'CRITICAL'
                  ? 'bg-red-500/15 border-red-500/40 text-red-100'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-100'
              }`}
            >
              <WarningCircle size={22} weight="fill" className="shrink-0 mt-0.5 text-red-400" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/30 font-mono">
                    {w.severity === 'CRITICAL' ? 'DO NOT BUY' : 'Profile Notice'}
                  </span>
                  <span className="text-xs text-red-300">Profile: {activeProfileName}</span>
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  {w.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Apple Health Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        
        {/* Product Meta */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>{product.category}</span>
            <span>·</span>
            <span>{product.brand}</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-zinc-500">{product.barcode}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {product.product_name}
          </h2>
          <p className="text-xs text-zinc-400">
            Standard serving: <span className="text-zinc-200 font-medium">{product.serving_size}</span>
          </p>
        </div>

        {/* Nutri-Score & 1-10 Health Index Cluster */}
        <div className="flex items-center gap-5">
          
          {/* European Nutri-Score 5-Capsule Mark */}
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
              Nutri-Score
            </span>
            <div className="flex items-center gap-1">
              {GRADES.map((g) => {
                const isActive = g === grade;
                const col = getGradeColor(g);
                return (
                  <div
                    key={g}
                    style={{
                      backgroundColor: isActive ? col : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#000000' : 'rgba(255,255,255,0.3)',
                    }}
                    className={`flex items-center justify-center font-bold transition-all rounded-lg ${
                      isActive
                        ? 'w-8 h-10 text-base shadow-md scale-105 font-black'
                        : 'w-6 h-8 text-xs'
                    }`}
                  >
                    {g}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1-10 Health Rating Gauge */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] min-w-[90px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
              Health Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                style={{ color: gradeColor }}
                className="text-3xl font-extrabold tracking-tight"
              >
                {finalScore.toFixed(1)}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/ 10</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
              raw: {scoringResult.raw_score}
            </span>
          </div>

        </div>

      </div>

      {/* Analysis Insights Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Positive Nutritional Attributes */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle size={16} weight="fill" />
            <span>Favorable Factors</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {scoringResult.breakdown
              .filter((b) => b.direction === 'good')
              .map((item, idx) => (
                <li key={idx} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                  <span className="text-zinc-400">{item.factor}</span>
                  <span className="font-medium text-emerald-300">{item.points} pts ({item.explanation})</span>
                </li>
              ))}
            {scoringResult.breakdown.filter((b) => b.direction === 'good').length === 0 && (
              <li className="text-zinc-500 py-1">Minimal dietary fiber, protein, or fruit content.</li>
            )}
          </ul>
        </div>

        {/* Nutritional Penalties */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <WarningCircle size={16} weight="fill" />
            <span>Limiting Nutrients</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {scoringResult.breakdown
              .filter((b) => b.direction === 'bad')
              .map((item, idx) => (
                <li key={idx} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                  <span className="text-zinc-400">{item.factor}</span>
                  <span className="font-medium text-amber-300">{item.points} pts ({item.explanation})</span>
                </li>
              ))}
          </ul>
        </div>

      </div>

    </div>
  );
}