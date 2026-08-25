import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { watercolorAudio } from '../utils/watercolorAudio';

export interface Pigment {
  id: string;
  name: string;
  color: string;
  bgRgba: string;
  vibe: string;
  icon: string;
}

export const PIGMENTS: Pigment[] = [
  {
    id: 'rose',
    name: 'Blush Rose',
    color: '#e85d75',
    bgRgba: 'rgba(232, 93, 117, 0.35)',
    vibe: 'Romantic & Sweet 💕',
    icon: '🌹'
  },
  {
    id: 'cerulean',
    name: 'Cerulean Blue',
    color: '#3a86ff',
    bgRgba: 'rgba(58, 134, 255, 0.35)',
    vibe: 'Ocean Breeze & Sky 🌊',
    icon: '🌊'
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    color: '#fb8500',
    bgRgba: 'rgba(251, 133, 0, 0.35)',
    vibe: 'Golden Hour Sparkle ✨',
    icon: '🌅'
  },
  {
    id: 'emerald',
    name: 'Emerald Meadow',
    color: '#2a9d8f',
    bgRgba: 'rgba(42, 157, 143, 0.35)',
    vibe: 'Fresh Spring Garden 🌿',
    icon: '🌿'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    color: '#8338ec',
    bgRgba: 'rgba(131, 56, 236, 0.35)',
    vibe: 'Twilight Starlight 🌙',
    icon: '🔮'
  }
];

interface PaletteMixerProps {
  onPaletteChange?: (colors: string[], activeVibe: string) => void;
}

export const PaletteMixer: React.FC<PaletteMixerProps> = ({ onPaletteChange }) => {
  const [selectedPigments, setSelectedPigments] = useState<string[]>(['rose', 'amber']);
  const [activeVibeText, setActiveVibeText] = useState<string>('Sunset Glow — Warm & Romantic 🎨');
  const [isSwirling, setIsSwirling] = useState(false);

  const handlePigmentClick = (pigment: Pigment, index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    watercolorAudio.playWaterDrip(1 + index * 0.15);
    watercolorAudio.playColorChord(index);

    const rect = event.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: pigment.bgRgba
        }
      })
    );

    let nextSelection: string[];
    if (selectedPigments.includes(pigment.id)) {
      if (selectedPigments.length > 1) {
        nextSelection = selectedPigments.filter(id => id !== pigment.id);
      } else {
        nextSelection = [pigment.id];
      }
    } else {
      nextSelection = [...selectedPigments, pigment.id].slice(-3); // Keep up to 3 mixed
    }

    setSelectedPigments(nextSelection);
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 700);

    // Compute mixed vibe text and colors
    const activePigmentObjs = PIGMENTS.filter(p => nextSelection.includes(p.id));
    const mixedColors = activePigmentObjs.map(p => p.bgRgba);
    const vibeNames = activePigmentObjs.map(p => p.name).join(' + ');
    const newVibe = `${vibeNames} (${activePigmentObjs.map(p => p.icon).join(' ')})`;

    setActiveVibeText(newVibe);
    if (onPaletteChange) {
      onPaletteChange(mixedColors, newVibe);
    }
  };

  const handleRainbowMix = () => {
    watercolorAudio.playFanfare();
    setSelectedPigments(PIGMENTS.map(p => p.id));
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 900);

    const rainbowColors = PIGMENTS.map(p => p.bgRgba);
    const newVibe = 'Prism Dream — Full Watercolor Symphony 🌈✨';
    setActiveVibeText(newVibe);
    if (onPaletteChange) {
      onPaletteChange(rainbowColors, newVibe);
    }
  };

  const activePigmentObjs = PIGMENTS.filter(p => selectedPigments.includes(p.id));
  const gradientStops = activePigmentObjs.length > 1
    ? activePigmentObjs.map(p => p.color).join(', ')
    : `${activePigmentObjs[0]?.color || '#e85d75'}, #ffffff`;

  return (
    <div className="w-full max-w-lg mx-auto my-4 p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-storybook-border shadow-paper relative overflow-hidden">
      {/* Mini Washi Tape */}
      <div className="washi-tape -top-2 left-6 w-20" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg animate-bounce">🎨</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-storybook-ink">
            Date Palette Studio
          </span>
        </div>
        <button
          type="button"
          onClick={handleRainbowMix}
          className="text-xs font-handwriting text-storybook-roseDark hover:text-storybook-ink flex items-center gap-1 bg-storybook-blush px-2.5 py-1 rounded-full border border-storybook-rose/30 transition-transform active:scale-95 cursor-pointer shadow-xs"
        >
          <span>🌈 Swirl All</span>
        </button>
      </div>

      {/* Pigment Wells Grid */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 py-2">
        {PIGMENTS.map((pigment, idx) => {
          const isSelected = selectedPigments.includes(pigment.id);
          return (
            <motion.button
              key={pigment.id}
              type="button"
              onClick={(e) => handlePigmentClick(pigment, idx, e)}
              whileHover={{ scale: 1.12, y: -3 }}
              whileTap={{ scale: 0.92 }}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-storybook-ink/40 shadow-md bg-white'
                  : 'border-transparent hover:border-storybook-border bg-storybook-bg/40'
              }`}
            >
              {/* Paint Well Blob */}
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-inner relative flex items-center justify-center transition-transform"
                style={{
                  backgroundColor: pigment.color,
                  boxShadow: `0 4px 10px ${pigment.bgRgba}, inset 0 2px 4px rgba(255,255,255,0.4)`
                }}
              >
                <span className="text-xs sm:text-sm drop-shadow-sm">{pigment.icon}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-paint-ring"
                    className="absolute -inset-1 rounded-full border-2 border-storybook-ink"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-storybook-ink whitespace-nowrap">
                {pigment.name.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Central Mixing Well Preview & Ambient Tone Indicator */}
      <div className="mt-3 pt-3 border-t border-storybook-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <motion.div
            animate={isSwirling ? { rotate: 360, scale: [1, 1.2, 1] } : { rotate: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full shadow-inner flex-shrink-0 border border-white/60"
            style={{
              background: `linear-gradient(135deg, ${gradientStops})`
            }}
          />
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-storybook-inkLight tracking-wider">
              Active Ambient Vibe
            </div>
            <div className="text-xs font-handwriting text-storybook-ink truncate">
              {activeVibeText}
            </div>
          </div>
        </div>

        <span className="text-[11px] text-storybook-inkLight font-handwriting hidden sm:inline">
          Tap colors to mix mood ✨
        </span>
      </div>
    </div>
  );
};
