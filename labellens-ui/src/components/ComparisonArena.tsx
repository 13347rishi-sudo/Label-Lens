import { useState } from 'react';
import { EXHIBITION_PRODUCTS } from '../lib/database';
import { scoreProduct, getGradeColor } from '../lib/scoring';
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
  const winnerProd = winner === 'A' ? prodA : prodB;
  const loserProd = winner === 'A' ? prodB : prodA;
  const winnerScore = winner === 'A' ? scoreA : scoreB;
  const loserScore = winner === 'A' ? scoreB : scoreA;

  const renderProductColumn = (p: ProductItem, s: typeof scoreA, isWin: boolean, slot: 'A' | 'B') => {
    const col = getGradeColor(s.grade);

    return (
      <div className={`p-6 rounded-2xl bg-white border border-[#E2DDD4] flex flex-col justify-between ${
        isWin ? 'shadow-sm' : ''
      }`}>
        <div>
          {/* Header & Product Selector */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6E6A63]">
              Product {slot}
            </span>
            {isWin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold text-[#038141] bg-[#038141]/10">
                Healthier
              </span>
            )}
          </div>

          <select
            value={p.id}
            onChange={(e) => slot === 'A' ? setProdAId(e.target.value) : setProdBId(e.target.value)}
            className="w-full bg-[#F6F3EC] text-[#161616] text-xs font-medium p-2.5 rounded-lg border border-[#E2DDD4] mb-5 focus:outline-none focus:border-[#161616]"
          >
            {EXHIBITION_PRODUCTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.product_name} ({item.brand})
              </option>
            ))}
          </select>

          {/* Grade Badge & Numbers */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] mb-5">
            <div
              style={{ backgroundColor: col, color: '#FFFFFF' }}
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black font-mono shadow-xs"
            >
              {s.grade}
            </div>
            <div>
              <div className="text-2xl font-black text-[#161616] font-mono tracking-tight">
                {s.score_1_to_10.toFixed(1)} <span className="text-xs text-[#6E6A63] font-normal">/ 10</span>
              </div>
              <div className="text-xs text-[#6E6A63]">
                Nutri-Score points: {s.raw_score}
              </div>
            </div>
          </div>

          {/* Key Nutritional Metrics Table */}
          <div className="divide-y divide-[#E2DDD4] text-xs">
            <div className="flex justify-between py-2">
              <span className="text-[#6E6A63]">Sugars per 100g</span>
              <span className="font-mono font-medium text-[#161616]">{p.per_100g.sugars_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#6E6A63]">Saturated Fat</span>
              <span className="font-mono font-medium text-[#161616]">{p.per_100g.saturated_fat_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#6E6A63]">Salt / Sodium</span>
              <span className="font-mono font-medium text-[#161616]">{p.per_100g.salt_g ?? '—'} g</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#6E6A63]">Fiber</span>
              <span className="font-mono font-medium text-[#038141]">{p.per_100g.fibre_g ?? '0'} g</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#6E6A63]">Protein</span>
              <span className="font-mono font-medium text-[#161616]">{p.per_100g.protein_g ?? '—'} g</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#E2DDD4] text-[11px] text-[#6E6A63] font-mono">
          Serving: {p.serving_size}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-[#161616]">
          Compare Two Foods
        </h2>
        <p className="text-xs text-[#6E6A63]">
          Compare any two packaged foods side by side to see which one is healthier.
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderProductColumn(prodA, scoreA, winner === 'A', 'A')}
        {renderProductColumn(prodB, scoreB, winner === 'B', 'B')}
      </div>

      {/* Winner Summary in a Single Row */}
      <div className="p-4 rounded-xl bg-white border border-[#E2DDD4] flex items-center justify-between text-xs sm:text-sm">
        <div className="text-[#161616]">
          <strong className="font-bold">{winnerProd.product_name}</strong> (Grade {winnerScore.grade}) is healthier than <strong className="font-medium text-[#6E6A63]">{loserProd.product_name}</strong> (Grade {loserScore.grade}) by <span className="font-mono font-bold text-[#038141]">+{scoreDiff}</span> points.
        </div>
        <span className="text-xs font-mono text-[#6E6A63] hidden sm:inline">
          European Nutri-Score method
        </span>
      </div>

    </div>
  );
}
