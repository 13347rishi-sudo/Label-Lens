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
              About LabelLens
            </h2>
            <p className="text-xs text-zinc-400">
              Science Exhibition Project — Food Transparency Scanner
            </p>
          </div>
        </div>

        {/* Section 1: The Problem */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Brain size={16} className="text-emerald-400" />
            <span>The Problem We Are Solving</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Many packaged snacks look healthy on the front, but hide large amounts of sugar and palm oil under names like maltodextrin, invert syrup, or INS numbers. Companies also use tiny serving sizes to make calories look low. LabelLens scans any barcode or package to show what is actually inside, helping you make healthier choices.
          </p>
        </div>

        {/* Section 2: How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Cpu size={15} className="text-blue-400" />
              <span>On-Device AI Vision</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Reads barcodes in milliseconds and uses local AI to extract nutrition tables from package photos without uploading anything to external servers.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Nutri-Score Rating</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Uses the international A to E nutrition scale, balancing healthy nutrients (fiber, protein) against nutrients to limit (sugar, salt, saturated fat).
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs shadow-sm hover:bg-zinc-200 transition-all active:scale-98"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
