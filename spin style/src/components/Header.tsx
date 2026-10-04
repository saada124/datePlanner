import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, RotateCcw, Palette } from 'lucide-react';
import { ThemeId } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface HeaderProps {
  currentPage: 'menu' | 'wheel';
  onGoBack?: () => void;
  onOpenSettings: () => void;
  onOpenSecretRig?: () => void;
  activeTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  tokensCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onGoBack,
  onOpenSettings,
  onOpenSecretRig,
  activeTheme,
  onChangeTheme,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [secretClicks, setSecretClicks] = useState(0);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playPop(true);
    }
  };

  const handleSecretClick = () => {
    const next = secretClicks + 1;
    if (next >= 3) {
      setSecretClicks(0);
      sounds.playWinFanfare();
      if (onOpenSecretRig) onOpenSecretRig();
    } else {
      setSecretClicks(next);
      setTimeout(() => setSecretClicks(0), 1800);
    }
  };

  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between relative z-20">
      {/* Back to menu button if on wheel page */}
      <div className="flex items-center gap-2">
        {currentPage === 'wheel' && onGoBack && (
          <button
            onClick={() => {
              sounds.playArcadePress();
              onGoBack();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-carnival-card/80 hover:bg-carnival-card border border-carnival-border text-carnival-cream text-sm font-display font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Back to Date Menu"
          >
            <RotateCcw className="w-4 h-4 text-carnival-teal" />
            <span className="hidden sm:inline">Change Options</span>
          </button>
        )}
      </div>

      {/* Center Carnival Lights Garland (Triple-click for secret rig menu) */}
      <div
        onClick={handleSecretClick}
        className="flex items-center gap-3 cursor-pointer select-none py-1 px-3 rounded-full hover:bg-white/5 transition-colors"
        title="★ Spin Your Date Carnival Edition ★"
      >
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0s' }}></span>
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0.3s' }}></span>
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0.6s' }}></span>
        <span className="text-xs font-mono-ticket text-carnival-gold tracking-widest uppercase opacity-80">
          ★ CARNIVAL ARCADE EDITION ★
        </span>
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0.9s' }}></span>
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0.3s' }}></span>
        <span className="marquee-bulb animate-marquee-light" style={{ animationDelay: '0s' }}></span>
      </div>

      {/* Theme Switcher, Sound & Settings Buttons */}
      <div className="flex items-center gap-2 relative">
        
        {/* Feature 6: Theme Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sounds.playPop(true);
              setIsThemeMenuOpen((prev) => !prev);
            }}
            className="p-2.5 rounded-full bg-carnival-card/80 hover:bg-carnival-card border border-carnival-border text-carnival-cream hover:text-carnival-teal transition-all hover:scale-110 active:scale-90 shadow-md"
            title="Change Carnival Theme"
            aria-label="Theme switcher"
          >
            <Palette className="w-5 h-5" />
          </button>

          {/* Theme Dropdown Menu */}
          {isThemeMenuOpen && (
            <div className="absolute right-0 top-12 w-48 carnival-card p-2 border-2 border-carnival-border shadow-2xl rounded-2xl z-50 space-y-1 animate-fade-in">
              <div className="px-2 py-1 text-[10px] font-mono-ticket text-carnival-gold uppercase font-bold tracking-wider">
                CHOOSE THEME:
              </div>
              {APP_CONFIG.themes.map((t) => {
                const isActive = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onChangeTheme(t.id);
                      setIsThemeMenuOpen(false);
                      sounds.playPop(true);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                      isActive
                        ? 'bg-carnival-teal/20 text-carnival-teal border border-carnival-teal/50'
                        : 'text-carnival-creamMuted hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{t.emoji} {t.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-carnival-teal animate-pulse" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-full bg-carnival-card/80 hover:bg-carnival-card border border-carnival-border text-carnival-cream hover:text-carnival-gold transition-all hover:scale-110 active:scale-90 shadow-md"
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
          aria-label="Toggle sound"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-carnival-creamMuted/70" />
          ) : (
            <Volume2 className="w-5 h-5 text-carnival-yellow" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sounds.playPop(true);
            onOpenSettings();
          }}
          className="p-2.5 rounded-full bg-carnival-card/80 hover:bg-carnival-card border border-carnival-border text-carnival-cream hover:text-carnival-pink transition-all hover:scale-110 active:scale-90 shadow-md"
          title="Date Planner Settings"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
