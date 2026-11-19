import { useState, useMemo } from 'react';
import { EXHIBITION_PRODUCTS, lookupProductLive } from '../lib/database';
import { scoreProduct, getGradeColor } from '../lib/scoring';
import { playBarcodeBeep, playSuccessChime } from '../lib/sound';
import type { ProductItem } from '../lib/types';
import { MagnifyingGlass, Globe, CircleNotch, CaretDown, CaretUp } from '@phosphor-icons/react';

interface JudgeDemoDeckProps {
  onSelectProduct: (product: ProductItem) => void;
  selectedProductId?: string;
}

const QUICK_PICKS = [
  { id: 'prod_maggi', name: 'Maggi' },
  { id: 'prod_lays_classic', name: 'Lay\'s' },
  { id: 'prod_amul_butter', name: 'Amul Butter' },
  { id: 'prod_coke', name: 'Coca-Cola' },
  { id: 'prod_oats', name: 'Quaker Oats' },
  { id: 'prod_nutella', name: 'Nutella' }
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Foods' },
  { id: 'grade_a', label: 'Grade A' },
  { id: 'staples', label: 'Millets & Pulses' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'cereals', label: 'Cereals' },
  { id: 'sweets', label: 'Sweets' },
  { id: 'dairy', label: 'Dairy' }
];

export function JudgeDemoDeck({ onSelectProduct, selectedProductId }: JudgeDemoDeckProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [liveSearchError, setLiveSearchError] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleClick = (product: ProductItem) => {
    playBarcodeBeep();
    setTimeout(() => {
      playSuccessChime();
      onSelectProduct(product);
    }, 80);
  };

  const handleLiveQuery = async () => {
    if (!searchQuery.trim()) return;
    setIsLiveSearching(true);
    setLiveSearchError(null);
    try {
      const prod = await lookupProductLive(searchQuery);
      if (prod) {
        playSuccessChime();
        onSelectProduct(prod);
      } else {
        setLiveSearchError(`"${searchQuery}" not found. Try exact barcode number.`);
      }
    } catch {
      setLiveSearchError('Unable to query global database right now.');
    } finally {
      setIsLiveSearching(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return EXHIBITION_PRODUCTS.filter((prod) => {
      const cat = (prod.category || '').toLowerCase();
      const isA = scoreProduct(prod.per_100g, prod.is_beverage, prod.fruit_veg_pct).grade === 'A';

      if (filter === 'grade_a' && !isA) return false;
      if (filter === 'staples' && !cat.includes('millet') && !cat.includes('pulse') && !cat.includes('staple') && !cat.includes('dal') && !cat.includes('grain')) return false;
      if (filter === 'drinks' && !prod.is_beverage) return false;
      if (filter === 'snacks' && !cat.includes('snack') && !cat.includes('chip') && !cat.includes('crisp')) return false;
      if (filter === 'cereals' && !cat.includes('cereal') && !cat.includes('oat') && !cat.includes('breakfast')) return false;
      if (filter === 'sweets' && !cat.includes('confectionery') && !cat.includes('biscuit') && !cat.includes('spread') && !cat.includes('chocolate')) return false;
      if (filter === 'dairy' && !cat.includes('dairy') && !cat.includes('milk') && !cat.includes('yogurt') && !cat.includes('beverage / dairy')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prod.product_name.toLowerCase().includes(q);
        const matchBrand = prod.brand.toLowerCase().includes(q);
        const matchBarcode = prod.barcode.includes(q);
        const matchCategory = cat.includes(q);
        if (!matchName && !matchBrand && !matchBarcode && !matchCategory) return false;
      }
      return true;
    });
  }, [filter, searchQuery]);

  return (
    <div className="w-full space-y-3">
      
      {/* Quick Picks Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-400 shrink-0 mr-0.5">Quick Picks:</span>
          {QUICK_PICKS.map((item) => {
            const prod = EXHIBITION_PRODUCTS.find((p) => p.id === item.id);
            if (!prod) return null;
            const score = scoreProduct(prod.per_100g, prod.is_beverage, prod.fruit_veg_pct);
            const isSelected = prod.id === selectedProductId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(prod)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5 border min-h-[32px] shrink-0 ${
                  isSelected
                    ? 'bg-white text-black border-white font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-300 hover:text-white border-white/[0.06]'
                }`}
              >
                <span>{item.name}</span>
                <span
                  style={{ backgroundColor: getGradeColor(score.grade) }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black text-black shrink-0"
                >
                  {score.grade}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold px-2 py-1 rounded-lg shrink-0 whitespace-nowrap"
        >
          <span>{isCatalogOpen ? 'Close Catalog' : `Browse All (${EXHIBITION_PRODUCTS.length})`}</span>
          {isCatalogOpen ? <CaretUp size={13} /> : <CaretDown size={13} />}
        </button>
      </div>

      {/* Expandable Full Catalog Drawer */}
      {isCatalogOpen && (
        <div className="space-y-3 pt-2 border-t border-white/[0.06] animate-fadeIn">
          {/* Header & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Horizontally Scrollable Category Pills on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full sm:w-auto">
              {CATEGORY_TABS.map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 shrink-0 min-h-[32px] ${
                      active
                        ? 'bg-white text-black shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Compact Search Bar */}
            <div className="relative min-w-[220px]">
              <MagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder={`Search ${EXHIBITION_PRODUCTS.length}+ benchmark foods...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-all min-h-[36px]"
              />
            </div>
          </div>

          {/* Grid of Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[240px] overflow-y-auto pr-1">
              {filteredProducts.map((prod) => {
                const isSelected = prod.id === selectedProductId;
                const score = scoreProduct(prod.per_100g, prod.is_beverage, prod.fruit_veg_pct);
                const gradeColor = getGradeColor(score.grade);

                return (
                  <button
                    key={prod.id}
                    onClick={() => handleClick(prod)}
                    className={`p-3 rounded-2xl text-left transition-all active:scale-98 flex flex-col justify-between h-[88px] border min-h-[44px] ${
                      isSelected
                        ? 'bg-white/[0.1] border-white/30 shadow-md ring-1 ring-white/20'
                        : 'bg-white/[0.025] hover:bg-white/[0.05] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span className="text-xs font-medium text-white truncate leading-tight">
                        {prod.product_name}
                      </span>
                      <span
                        style={{ backgroundColor: gradeColor }}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-black shrink-0"
                      >
                        {score.grade}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                      <span className="truncate">{prod.brand}</span>
                      <span className="text-zinc-500 font-mono text-[10px]">{prod.per_100g.energy_kcal ?? '—'} kcal</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3">
              <p className="text-xs text-zinc-400">
                No local matches for &ldquo;<span className="text-white">{searchQuery}</span>&rdquo; in benchmark items.
              </p>
              <button
                onClick={handleLiveQuery}
                disabled={isLiveSearching}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-sm min-h-[40px]"
              >
                {isLiveSearching ? (
                  <>
                    <CircleNotch size={14} className="animate-spin text-black" />
                    <span>Searching Open Food Facts Global...</span>
                  </>
                ) : (
                  <>
                    <Globe size={14} />
                    <span>Search Live Global Database (3.3M+ items)</span>
                  </>
                )}
              </button>
              {liveSearchError && (
                <p className="text-[11px] text-amber-400/90">{liveSearchError}</p>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
