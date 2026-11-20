import { useState, useRef, useEffect } from 'react';
import {
  GearSix,
  SpeakerHigh,
  SpeakerSimpleSlash,
  ArrowsOut,
  ArrowsIn,
  Info
} from '@phosphor-icons/react';
import { HEALTH_PROFILES } from '../lib/profiles';
import type { HealthProfileId } from '../lib/types';
import { toggleSound, isSoundEnabled } from '../lib/sound';
import type { Language } from '../lib/i18n';

interface NavbarProps {
  activeProfile: HealthProfileId;
  onSelectProfile: (id: HealthProfileId) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  onOpenPitchModal: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export function Navbar({
  activeProfile,
  onSelectProfile,
  selectedModel,
  onSelectModel,
  onOpenPitchModal,
  language,
  onToggleLanguage
}: NavbarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#E2DDD4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Quiet Offline Indicator */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-[#161616] hover:opacity-85 transition-opacity">
            LabelLens
          </a>
          <span className="text-[#969188]">/</span>
          <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#038141]" />
            <span>Offline</span>
          </div>
        </div>

        {/* Right: Essential Direct Controls + Quiet Settings Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Health Profile Switch: Standard / Diabetic */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#EFECE4] border border-[#E2DDD4]">
            {HEALTH_PROFILES.map((p) => {
              const active = p.id === activeProfile;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProfile(p.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#161616] text-[#F6F3EC] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#161616]'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Language Toggle: EN / हिंदी */}
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2DDD4] bg-white hover:bg-[#EFECE4] text-xs font-mono font-medium text-[#161616] transition-all"
            title="Toggle Language"
          >
            {language === 'en' ? 'हिंदी' : 'EN'}
          </button>

          {/* Settings Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-8 h-8 rounded-lg border border-[#E2DDD4] bg-white hover:bg-[#EFECE4] flex items-center justify-center text-[#161616] transition-all"
              title="Kiosk Settings"
            >
              <GearSix size={16} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white border border-[#E2DDD4] rounded-xl shadow-lg space-y-3 z-50 text-xs">
                
                {/* AI Model Selection */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase text-[#6E6A63]">Vision Engine</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => onSelectModel(e.target.value)}
                    className="w-full p-1.5 rounded-md border border-[#E2DDD4] bg-[#F6F3EC] text-[#161616] font-mono text-xs focus:outline-none"
                  >
                    <option value="qwen3.5:2b">qwen3.5:2b (Edge AI)</option>
                    <option value="qwen3-vl:8b">qwen3-vl:8b (Multimodal)</option>
                  </select>
                </div>

                <div className="border-t border-[#E2DDD4] pt-2 space-y-1">
                  {/* Sound Toggle */}
                  <button
                    onClick={handleToggleSound}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-[#F6F3EC] text-[#161616]"
                  >
                    <span>Sound Audio Feedback</span>
                    {soundOn ? <SpeakerHigh size={15} /> : <SpeakerSimpleSlash size={15} />}
                  </button>

                  {/* Kiosk Fullscreen */}
                  <button
                    onClick={handleToggleFullscreen}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-[#F6F3EC] text-[#161616]"
                  >
                    <span>Fullscreen Kiosk Mode</span>
                    {isFullscreen ? <ArrowsIn size={15} /> : <ArrowsOut size={15} />}
                  </button>

                  {/* Exhibition Pitch / Info */}
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onOpenPitchModal();
                    }}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-[#F6F3EC] text-[#161616]"
                  >
                    <span>About Exhibition Project</span>
                    <Info size={15} />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
