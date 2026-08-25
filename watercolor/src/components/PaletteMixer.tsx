import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { watercolorAudio } from '../utils/watercolorAudio';
import {
  findMatchingRecipe,
  getDiscoveredRecipeIds,
  saveDiscoveredRecipeId,
  AlchemistRecipe,
  ALCHEMIST_RECIPES
} from '../config/alchemistRecipes';
import { RecipeUnlockModal } from './RecipeUnlockModal';
import { RecipeBookDrawer } from './RecipeBookDrawer';

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
    vibe: 'Twilight Desires 🌙',
    icon: '🔮'
  }
];

interface PaletteMixerProps {
  onPaletteChange?: (colors: string[], activeVibe: string) => void;
}

export const PaletteMixer: React.FC<PaletteMixerProps> = ({ onPaletteChange }) => {
  const [selectedPigments, setSelectedPigments] = useState<string[]>(['rose', 'amber']);
  const [activeMatchedRecipe, setActiveMatchedRecipe] = useState<AlchemistRecipe | null>(null);
  const [customVibeText, setCustomVibeText] = useState<string>('Sunset Temptation 🌅');
  const [isSwirling, setIsSwirling] = useState(false);

  // Alchemist state
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [newlyUnlockedRecipe, setNewlyUnlockedRecipe] = useState<AlchemistRecipe | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);

  useEffect(() => {
    const ids = getDiscoveredRecipeIds();
    setDiscoveredIds(ids);
    const initialMatched = findMatchingRecipe(['rose', 'amber']);
    setActiveMatchedRecipe(initialMatched);
  }, []);

  const checkRecipe = (nextSelection: string[]) => {
    const matched = findMatchingRecipe(nextSelection);
    setActiveMatchedRecipe(matched);

    if (matched) {
      setCustomVibeText(matched.name);
      if (!discoveredIds.includes(matched.id)) {
        const updated = saveDiscoveredRecipeId(matched.id);
        setDiscoveredIds(updated);
        setNewlyUnlockedRecipe(matched);
      }
    } else {
      const activePigmentObjs = PIGMENTS.filter((p) => nextSelection.includes(p.id));
      const vibeNames = activePigmentObjs.map((p) => p.name.split(' ')[0]).join(' + ');
      setCustomVibeText(`${vibeNames} (Custom Blend)`);
    }
  };

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
        nextSelection = selectedPigments.filter((id) => id !== pigment.id);
      } else {
        nextSelection = [pigment.id];
      }
    } else {
      if (selectedPigments.length >= 2) {
        nextSelection = [selectedPigments[selectedPigments.length - 1], pigment.id];
      } else {
        nextSelection = [...selectedPigments, pigment.id];
      }
    }

    setSelectedPigments(nextSelection);
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 700);

    const activePigmentObjs = PIGMENTS.filter((p) => nextSelection.includes(p.id));
    const mixedColors = activePigmentObjs.map((p) => p.bgRgba);

    checkRecipe(nextSelection);

    if (onPaletteChange) {
      onPaletteChange(mixedColors, customVibeText);
    }
  };

  const handleRainbowMix = () => {
    watercolorAudio.playFanfare();
    const allIds = PIGMENTS.map((p) => p.id);
    setSelectedPigments(allIds);
    setIsSwirling(true);
    setTimeout(() => setIsSwirling(false), 900);

    const rainbowColors = PIGMENTS.map((p) => p.bgRgba);
    checkRecipe(allIds);

    if (onPaletteChange) {
      onPaletteChange(rainbowColors, 'Master Alchemist of Love 👑');
    }
  };

  const activePigmentObjs = PIGMENTS.filter((p) => selectedPigments.includes(p.id));
  const gradientStops =
    activePigmentObjs.length > 1
      ? activePigmentObjs.map((p) => p.color).join(', ')
      : `${activePigmentObjs[0]?.color || '#e85d75'}, #ffffff`;

  const totalRecipes = ALCHEMIST_RECIPES.length;
  const discoveredCount = discoveredIds.length;

  return (
    <div className="w-full max-w-lg mx-auto my-3 p-3.5 sm:p-4.5 rounded-2xl bg-white/85 backdrop-blur-md border border-storybook-border shadow-paper relative overflow-hidden">
      {/* Mini Washi Tape */}
      <div className="washi-tape -top-2 left-6 w-20" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-lg animate-bounce flex-shrink-0">🧪</span>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-storybook-ink truncate">
              Love Vibe Alchemist
            </div>
            <div className="text-[10px] font-handwriting text-storybook-roseDark truncate hidden sm:block">
              Blend pigments for secret date recipes ✨
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Recipe Book Trigger Button (Clean single-line pill) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              watercolorAudio.playWaterDrip(1.1);
              setIsBookOpen(true);
            }}
            className="text-xs font-bold text-storybook-roseDark bg-storybook-blush hover:bg-storybook-rose hover:text-white px-2.5 py-1 rounded-full border border-storybook-rose/40 transition-all flex items-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <span>📖</span>
            <span>{discoveredCount}/{totalRecipes}</span>
          </motion.button>

          {/* Swirl All Rainbow Button */}
          <button
            type="button"
            onClick={handleRainbowMix}
            className="text-xs font-handwriting text-storybook-inkLight hover:text-storybook-ink bg-storybook-bg px-2 py-1 rounded-full border border-storybook-border transition-transform active:scale-95 cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-0.5"
            title="Swirl all colors together"
          >
            <span>🌈</span>
            <span>All</span>
          </button>
        </div>
      </div>

      {/* Pigment Wells Grid */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 py-1.5">
        {PIGMENTS.map((pigment, idx) => {
          const isSelected = selectedPigments.includes(pigment.id);
          return (
            <motion.button
              key={pigment.id}
              type="button"
              onClick={(e) => handlePigmentClick(pigment, idx, e)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className={`flex-1 flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-storybook-ink/40 shadow-sm bg-white ring-1 ring-storybook-rose/50'
                  : 'border-transparent hover:border-storybook-border bg-storybook-bg/40'
              }`}
            >
              {/* Paint Well Blob */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-inner relative flex items-center justify-center transition-transform"
                style={{
                  backgroundColor: pigment.color,
                  boxShadow: `0 3px 8px ${pigment.bgRgba}, inset 0 2px 4px rgba(255,255,255,0.4)`
                }}
              >
                <span className="text-xs sm:text-sm drop-shadow-xs">{pigment.icon}</span>
                {isSelected && (
                  <motion.div
                    layoutId="active-paint-ring"
                    className="absolute -inset-1 rounded-full border-2 border-storybook-ink"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
              <span className="text-[9px] font-bold text-storybook-ink whitespace-nowrap">
                {pigment.name.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Central Mixing Well & Prominent Recipe Riddles Bar */}
      <div className="mt-2.5 pt-2.5 border-t border-storybook-border/60">
        <div className="flex items-center justify-between gap-2.5">
          {/* Left: Mixing Well Swirl & Outcome */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 bg-storybook-bg/50 p-2 rounded-xl border border-storybook-border/60">
            <motion.div
              animate={isSwirling ? { rotate: 360, scale: [1, 1.25, 1] } : { rotate: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="w-7 h-7 rounded-full shadow-inner flex-shrink-0 border border-white/90"
              style={{
                background: `linear-gradient(135deg, ${gradientStops})`
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[9px] uppercase font-bold text-storybook-inkLight tracking-wider flex items-center gap-1">
                <span>Alchemy Outcome</span>
              </div>
              <div className="text-xs font-serif-title font-bold truncate">
                {activeMatchedRecipe ? (
                  <span className="text-storybook-roseDark">
                    ✨ {activeMatchedRecipe.name}
                  </span>
                ) : (
                  <span className="text-storybook-ink">{customVibeText}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Highly Visible Glowing Mixes Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              watercolorAudio.playWaterDrip(1.1);
              setIsBookOpen(true);
            }}
            className="flex-shrink-0 px-3 py-2 rounded-xl bg-gradient-to-r from-storybook-blush to-storybook-honey/40 border border-storybook-rose/40 hover:border-storybook-rose shadow-xs flex items-center gap-1.5 cursor-pointer text-storybook-roseDark font-bold text-xs transition-all ring-1 ring-storybook-rose/20"
            title="Open recipe book and view all mixes & clues"
          >
            <span className="text-sm">✨</span>
            <span className="font-handwriting text-sm whitespace-nowrap font-bold">View Mixes</span>
          </motion.button>
        </div>

        {/* Small Perk Hint if Recipe is Matched */}
        {activeMatchedRecipe && (
          <div className="mt-1.5 text-[10px] text-storybook-inkLight bg-storybook-bg/60 px-2 py-0.5 rounded-md text-left flex items-center justify-between">
            <span className="truncate">
              🎁 Perk: <strong>{activeMatchedRecipe.perkTitle}</strong>
            </span>
            <span className="text-storybook-roseDark font-bold text-[9px] uppercase ml-1 flex-shrink-0">
              Active
            </span>
          </div>
        )}
      </div>

      {/* Unlock Celebration Modal */}
      <RecipeUnlockModal
        recipe={newlyUnlockedRecipe}
        onClose={() => setNewlyUnlockedRecipe(null)}
        onOpenBook={() => {
          setNewlyUnlockedRecipe(null);
          setIsBookOpen(true);
        }}
      />

      {/* Recipe Book Drawer */}
      <RecipeBookDrawer
        isOpen={isBookOpen}
        discoveredIds={discoveredIds}
        onClose={() => setIsBookOpen(false)}
      />
    </div>
  );
};
