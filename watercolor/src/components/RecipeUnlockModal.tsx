import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AlchemistRecipe } from '../config/alchemistRecipes';
import { watercolorAudio } from '../utils/watercolorAudio';

interface RecipeUnlockModalProps {
  recipe: AlchemistRecipe | null;
  onClose: () => void;
  onOpenBook: () => void;
}

export const RecipeUnlockModal: React.FC<RecipeUnlockModalProps> = ({
  recipe,
  onClose,
  onOpenBook
}) => {
  useEffect(() => {
    if (recipe) {
      watercolorAudio.playFanfare();
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#ffb703']
      });
    }
  }, [recipe]);

  if (!recipe || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-storybook-ink/65 backdrop-blur-sm select-none overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, y: 20, rotate: -1 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.88, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="paper-card w-full max-w-md max-h-[92vh] p-5 sm:p-7 rounded-3xl shadow-paper-lg relative flex flex-col justify-between border-2 border-storybook-rose bg-white text-center overflow-y-auto my-auto"
        >
          {/* Top Washi Tape */}
          <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 w-28" />

          {/* Glowing Recipe Header Icon & Title */}
          <div className="mt-1 mb-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-4xl sm:text-5xl inline-block"
            >
              {recipe.icon}
            </motion.div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-storybook-roseDark font-sans mt-1">
              ✨ NEW ALCHEMIST RECIPE UNLOCKED! ✨
            </div>

            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-storybook-ink mt-0.5">
              {recipe.name}
            </h2>
          </div>

          {/* Secret Note Paper Card */}
          <div className="bg-storybook-bg/80 border border-storybook-border rounded-2xl p-3.5 sm:p-4 my-2 text-left relative shadow-inner">
            <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>💌</span>
              <span>Talel's Secret Note</span>
            </div>
            <p className="font-handwriting text-base sm:text-lg text-storybook-ink leading-relaxed">
              "{recipe.secretNote}"
            </p>
          </div>

          {/* Unlocked Date Perk */}
          <div className="bg-gradient-to-r from-storybook-blush to-storybook-honey/40 border border-storybook-rose/30 rounded-2xl p-3 my-2 text-left">
            <div className="text-[10px] font-bold text-storybook-roseDark uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <span>🎁</span>
              <span>Unlocked Date Perk: {recipe.perkTitle}</span>
            </div>
            <p className="text-xs font-sans text-storybook-inkLight">
              {recipe.perkDesc}
            </p>
          </div>

          {/* Action Buttons (Always visible and unclipped) */}
          <div className="flex gap-2.5 mt-4 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="story-btn-secondary flex-1 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Awesome ✨
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBook();
              }}
              className="story-btn-primary flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>📖</span>
              <span>Open Recipe Book</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
