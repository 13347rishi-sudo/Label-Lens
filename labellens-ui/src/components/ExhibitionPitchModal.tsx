import { X } from '@phosphor-icons/react';

interface ExhibitionPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExhibitionPitchModal({ isOpen, onClose }: ExhibitionPitchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E2DDD4] p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-5 shadow-lg text-[#161616]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg border border-[#E2DDD4] hover:bg-[#F6F3EC] text-[#6E6A63] hover:text-[#161616] transition-all"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase text-[#6E6A63]">Science Fair Project</span>
          <h2 className="text-xl font-bold text-[#161616] tracking-tight">
            About LabelLens
          </h2>
        </div>

        {/* The Problem */}
        <div className="p-4 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
          <div className="font-bold text-xs uppercase tracking-wider text-[#161616]">
            The Problem
          </div>
          <p className="text-xs text-[#6E6A63] leading-relaxed">
            Many packaged snacks look healthy on the front, but hide large amounts of sugar and palm oil under names like maltodextrin, invert syrup, or INS numbers. Companies also use tiny serving sizes to make calories look low. LabelLens scans any packaging to show what is actually inside, helping you make healthier choices.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
            <div className="font-bold text-[#161616]">
              On-Device Vision
            </div>
            <p className="text-[#6E6A63] text-[11px] leading-relaxed">
              Reads barcodes in milliseconds and uses local vision to parse nutrition facts on this machine without internet.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] space-y-1">
            <div className="font-bold text-[#161616]">
              Nutri-Score Rating
            </div>
            <p className="text-[#6E6A63] text-[11px] leading-relaxed">
              Uses the international A to E nutrition scale, balancing positive fiber and protein against sugar, salt, and saturated fat.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#161616] hover:bg-black text-[#F6F3EC] font-semibold text-xs shadow-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
