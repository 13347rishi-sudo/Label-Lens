import { X, Atom, Brain, Cpu, ShieldCheck } from '@phosphor-icons/react';

interface ExhibitionPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExhibitionPitchModal({ isOpen, onClose }: ExhibitionPitchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl apple-glass p-6 md:p-8 relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white">
            <Atom size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Science Exhibition Project Overview
            </h2>
            <p className="text-xs text-zinc-400">
              Offline Edge-AI Nutritional Intelligence & Transparency
            </p>
          </div>
        </div>

        {/* Section 1: The Problem & Solution */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Brain size={16} className="text-emerald-400" />
            <span>The Research Problem</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Ultra-processed foods often obscure high glycemic loads and industrial fats behind 50+ sugar aliases (maltodextrin, invert syrup) and deceptive "per serving" metrics. LabelLens enables consumers to hold any package up to a camera and obtain an immediate, unvarnished nutritional verdict on local edge hardware with zero cloud dependencies.
          </p>
        </div>

        {/* Section 2: Technical Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Cpu size={15} className="text-blue-400" />
              <span>Edge Vision Multimodal</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Runs locally via Ollama with Qwen3-VL 8B or MiniCPM-V 4.5. Never transmits personal dietary data to the cloud.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Official European Algorithm</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Deterministic Python calculation of Nutri-Score (A through E) with distinct thresholds for solids and beverages.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs shadow-sm hover:bg-zinc-200 transition-all active:scale-98"
          >
            Dismiss Overview
          </button>
        </div>

      </div>
    </div>
  );
}