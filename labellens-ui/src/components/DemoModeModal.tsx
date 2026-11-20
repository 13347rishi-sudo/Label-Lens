import { X, Sparkle, ArrowRight } from '@phosphor-icons/react';
import { EXHIBITION_PRODUCTS } from '../lib/database';
import { playBarcodeBeep, playSuccessChime } from '../lib/sound';
import type { ProductItem } from '../lib/types';
import { TRANSLATIONS, type Language } from '../lib/i18n';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
  language?: Language;
}

const DEMO_ITEMS = [
  { id: 'prod_coke', tag: 'Soda Shock', note: '10.6g sugar/100ml, Caramel E150d' },
  { id: 'prod_raw_coconut', tag: 'Clean Swap', note: '100% natural, isotonic hydration' },
  { id: 'prod_maggi', tag: 'Ultra-Processed', note: 'Palm olein, high sodium, flavour enhancers' },
  { id: 'prod_foxtail_noodles', tag: 'Millet Innovation', note: 'Zero palm oil, sun-dried native grains' },
  { id: 'prod_cadbury_dairy_milk', tag: 'Sugar Heavy', note: '57% free sugar, vegetable fats' },
  { id: 'prod_dark_chocolate', tag: 'Antioxidant Rich', note: '15g fibre, low sugar, pure cocoa' }
];

export function DemoModeModal({
  isOpen,
  onClose,
  onSelectProduct,
  language = 'en'
}: DemoModeModalProps) {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language];

  const handlePick = (productId: string) => {
    const prod = EXHIBITION_PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      playBarcodeBeep();
      setTimeout(() => {
        playSuccessChime();
        onSelectProduct(prod);
        onClose();
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl apple-glass p-6 sm:p-8 rounded-3xl border border-white/[0.12] space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkle size={14} weight="fill" />
              <span>{t.demoModeBtn}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'en' ? 'Quick Test Showpieces' : 'डेमो खाद्य पदार्थ परीक्षण'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              {language === 'en' 
                ? 'Tap any item to test the scanner and health rating instantly (no camera needed).' 
                : 'स्कैनर का तत्काल परीक्षण करने के लिए किसी भी वस्तु पर टैप करें।'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white flex items-center justify-center transition-all"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* 6 High-Contrast Showpiece Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {DEMO_ITEMS.map((item) => {
            const prod = EXHIBITION_PRODUCTS.find((p) => p.id === item.id);
            if (!prod) return null;
            const isGood = item.id.includes('coconut') || item.id.includes('millet') || item.id.includes('dark');
            const gradeColor = isGood ? '#038141' : '#e63e11';

            return (
              <button
                key={item.id}
                onClick={() => handlePick(item.id)}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-left transition-all active:scale-95 flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {prod.product_name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {item.note}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0">
                  <div
                    style={{ backgroundColor: gradeColor }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md"
                  >
                    {isGood ? 'A' : 'E'}
                  </div>
                  <ArrowRight size={14} className="text-zinc-500 mt-2 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
          <span>{t.trustStrip}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
          >
            {language === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>

      </div>
    </div>
  );
}
