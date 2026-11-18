import { useState } from 'react';
import { EXHIBITION_PRODUCTS } from '../lib/database';
import { scoreProduct, getGradeColor } from '../lib/scoring';
import { Trophy, ArrowRight } from '@phosphor-icons/react';
import type { ProductItem } from '../lib/types';

export function ComparisonArena() {
  const [prodAId, setProdAId] = useState<string>('prod_oats');
  const [prodBId, setProdBId] = useState<string>('prod_coke');

  const prodA = EXHIBITION_PRODUCTS.find((p) => p.id === prodAId) || EXHIBITION_PRODUCTS[2];
  const prodB = EXHIBITION_PRODUCTS.find((p) => p.id === prodBId) || EXHIBITION_PRODUCTS[0];

  const scoreA = scoreProduct(prodA.per_100g, prodA.is_beverage, prodA.fruit_veg_pct);
  const scoreB = scoreProduct(prodB.per_100g, prodB.is_beverage, prodB.fruit_veg_pct);

  const winner = scoreA.score_1_to_10 >= scoreB.score_1_to_10 ? 'A' : 'B';
  const scoreDiff = Math.abs(scoreA.score_1_to_10 - scoreB.score_1_to_10).toFixed(1);

  const renderProductColumn = (p: ProductItem, s: typeof scoreA, isWin: boolean, slot: 'A' | 'B') => {
    const col = getGradeColor(s.grade);

    return (
      <div className={`p-6 rounded-3xl apple-glass flex flex-col justify-between transition-all ${
        isWin 
          ? 'ring-1 ring-emerald-500/30' 
          : 'opacity-90'
      }`}>
        <div>
          {/* Header & Product Selector */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">
              Product {slot}
            </span>
            {isWin && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Trophy size={13} weight="fill" />
                Healthier Choice
              </span>
            )}
          </div>

          <select
            value={p.id}
            onChange={(e) => slot === 'A' ? setProdAId(e.target.value) : setProdBId(e.target.value)}
            className="w-full bg-white/[0.05] text-white text-xs font-medium p-2.5 rounded-xl border border-white/[0.1] mb-5 focus:outline-none focus:border-white/30"
          >
            {EXHIBITION_PRODUCTS.map((item) => (
              <option key={item.id} value={item.id} className="bg-[#16161E] text-white">
                {item.product_name} ({item.brand})
              </option>
            ))}
          </select>

          {/* Grade Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
            <div
              style={{ backgroundColor: col, color: '#000000' }}
              className="w-12 h-14 rounded-xl flex items-center justify-center text-3xl font-black shadow-md"
            >
              {s.grade}
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {s.score_1_to_10.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">/ 10</span>
              </div>
              <div className="text-xs text-zinc-400">
                Raw points: {s.raw_score}
              </div>
            </div>
          </div>

          {/* Key Nutritional Metrics */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
              <span className="text-zinc-400">Sugars (per 100g)</span>
              <span className="font-medium text-white">{p.per_100g.sugars_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
              <span className="text-zinc-400">Saturated Fat</span>
              <span className="font-medium text-white">{p.per_100g.saturated_fat_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
              <span className="text-zinc-400">Salt</span>
              <span className="font-medium text-white">{p.per_100g.salt_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
              <span className="text-zinc-400">Fiber</span>
              <span className="font-medium text-emerald-400">{p.per_100g.fibre_g ?? '0'} g</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-zinc-400">Protein</span>
              <span className="font-medium text-white">{p.per_100g.protein_g ?? '—'} g</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400">
          Serving size: {p.serving_size}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Side-by-Side Comparison Duel
        </h2>
        <p className="text-xs text-zinc-400">
          Evaluates two products according to European Nutri-Score standards to determine the nutritionally superior formulation.
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderProductColumn(prodA, scoreA, winner === 'A', 'A')}
        {renderProductColumn(prodB, scoreB, winner === 'B', 'B')}
      </div>

      {/* Verdict Conclusion Card */}
      <div className="p-5 rounded-3xl apple-glass flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="text-xs text-zinc-400">Duel Conclusion</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            <span className="text-emerald-400 font-bold">{winner === 'A' ? prodA.product_name : prodB.product_name}</span> is healthier by <span className="font-mono text-emerald-300">+{scoreDiff}</span> points.
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Official European algorithm</span>
          <ArrowRight size={14} />
        </div>
      </div>

    </div>
  );
}