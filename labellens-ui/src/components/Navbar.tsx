import { useState } from 'react';
import { 
  SpeakerHigh, 
  SpeakerSimpleSlash, 
  ArrowsOut, 
  ArrowsIn, 
  Cpu, 
  Info
} from '@phosphor-icons/react';
import { HEALTH_PROFILES } from '../lib/profiles';
import type { HealthProfileId } from '../lib/types';
import { toggleSound, isSoundEnabled } from '../lib/sound';

interface NavbarProps {
  activeProfile: HealthProfileId;
  onSelectProfile: (id: HealthProfileId) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onOpenPitchModal: () => void;
}

export function Navbar({
  activeProfile,
  onSelectProfile,
  selectedModel,
  onSelectModel,
  onOpenPitchModal
}: NavbarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleSound = () => {
    const state = toggleSound();
    setSoundOn(state);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full apple-glass border-b border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Apple Style Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] shadow-sm">
            <span className="text-base">🔬</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-white">
              Label<span className="text-[#30D158]">Lens</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
              v2.0
            </span>
          </div>
        </div>

        {/* Center: Health Profile Segmented Control (Apple Style) */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {HEALTH_PROFILES.map((p) => {
            const active = p.id === activeProfile;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                title={p.description}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                  active
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs">{p.icon}</span>
                <span>{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Controls & Options */}
        <div className="flex items-center gap-2">
          
          {/* Compact AI Model Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300">
            <Cpu size={13} className="text-zinc-400 shrink-0" />
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="qwen3-vl:8b" className="bg-[#16161E] text-white">
                qwen3-vl:8b
              </option>
              <option value="qwen3.5:2b" className="bg-[#16161E] text-white">
                qwen3.5:2b
              </option>
              <option value="qwen2.5:2b" className="bg-[#16161E] text-white">
                qwen2.5:2b
              </option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Sound feedback on' : 'Sound feedback off'}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            {soundOn ? <SpeakerHigh size={15} /> : <SpeakerSimpleSlash size={15} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            {isFullscreen ? <ArrowsIn size={15} /> : <ArrowsOut size={15} />}
          </button>

          {/* Exhibition Judge Brief Button */}
          <button
            onClick={onOpenPitchModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs font-medium transition-all active:scale-95"
          >
            <Info size={14} />
            <span className="hidden sm:inline">Overview</span>
          </button>

        </div>

      </div>
    </header>
  );
}