import { useState } from 'react';
import {
  SpeakerHigh,
  SpeakerSimpleSlash,
  ArrowsOut,
  ArrowsIn,
  Cpu,
  Info,
  Translate,
  Sparkle
} from '@phosphor-icons/react';
import { HEALTH_PROFILES } from '../lib/profiles';
import type { HealthProfileId } from '../lib/types';
import { toggleSound, isSoundEnabled } from '../lib/sound';
import { TRANSLATIONS, type Language } from '../lib/i18n';

interface NavbarProps {
  activeProfile: HealthProfileId;
  onSelectProfile: (id: HealthProfileId) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onOpenPitchModal: () => void;
  onOpenDemoMode: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export function Navbar({
  activeProfile,
  onSelectProfile,
  selectedModel,
  onSelectModel,
  onOpenPitchModal,
  onOpenDemoMode,
  language,
  onToggleLanguage
}: NavbarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleToggleSound = () => {
    const state = toggleSound();
    setSoundOn(state);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full apple-glass border-b border-white/[0.08] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Left: Brand Identity & Offline Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/[0.08] border border-white/[0.12] shadow-sm">
            <span className="text-lg">🔬</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
              Label<span className="text-emerald-400">Lens</span>
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Offline Ready
            </span>
          </div>
        </div>

        {/* Center: Health Profile Segmented Control */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {HEALTH_PROFILES.map((p) => {
            const active = p.id === activeProfile;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                title={p.description}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${active
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
              >
                <span className="text-xs">{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Kiosk Controls, Language Switcher & Demo Mode Button */}
        <div className="flex items-center gap-2">

          {/* AI Model Indicator for Science Exhibition Judges */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
            <Cpu size={14} className="text-zinc-400 shrink-0" />
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="bg-transparent text-zinc-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="qwen3.5:2b" className="bg-[#16161E] text-white">
                qwen3.5:2b (Edge AI)
              </option>
              <option value="qwen3-vl:8b" className="bg-[#16161E] text-white">
                qwen3-vl:8b
              </option>
            </select>
          </div>

          {/* Prominent Demo Mode Button for Science Exhibition Judges */}
          <button
            onClick={onOpenDemoMode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-amber-500/20 min-h-[40px]"
            title="Instant demo with 6 benchmark food products"
          >
            <Sparkle size={16} weight="fill" />
            <span>{t.demoModeBtn}</span>
          </button>

          {/* Language Toggle (EN / हिंदी) */}
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 hover:text-white font-bold text-xs transition-all active:scale-95 min-h-[40px]"
            title="Switch language (English / हिंदी)"
          >
            <Translate size={16} className="text-sky-400" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Sound feedback on' : 'Sound feedback off'}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            {soundOn ? <SpeakerHigh size={16} /> : <SpeakerSimpleSlash size={16} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Kiosk Fullscreen"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 hover:text-white transition-all active:scale-95"
          >
            {isFullscreen ? <ArrowsIn size={16} /> : <ArrowsOut size={16} />}
          </button>

          {/* Exhibition Judge Brief Button */}
          <button
            onClick={onOpenPitchModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-semibold transition-all active:scale-95 min-h-[40px]"
          >
            <Info size={15} />
            <span>Pitch</span>
          </button>

        </div>

      </div>
    </header>
  );
}
