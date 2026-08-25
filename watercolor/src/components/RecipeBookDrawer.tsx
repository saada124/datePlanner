import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ALCHEMIST_RECIPES, AlchemistRecipe } from '../config/alchemistRecipes';
import { watercolorAudio } from '../utils/watercolorAudio';

interface RecipeBookDrawerProps {
  isOpen: boolean;
  discoveredIds: string[];
  onClose: () => void;
}

export const RecipeBookDrawer: React.FC<RecipeBookDrawerProps> = ({
  isOpen,
  discoveredIds,
  onClose
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const totalCount = ALCHEMIST_RECIPES.length;
  const discoveredCount = discoveredIds.length;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100);
  const isAllDiscovered = discoveredCount >= totalCount;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-storybook-ink/65 backdrop-blur-sm select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="paper-card w-full max-w-2xl max-h-[88vh] p-5 sm:p-7 rounded-3xl shadow-paper-lg relative flex flex-col border border-storybook-border overflow-hidden bg-white/95 my-auto"
        >
          {/* Top Washi Decorator */}
          <div className="washi-tape -top-2 left-8 w-24" />
          <div className="washi-tape washi-tape-sage -top-2 right-8 w-24" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-storybook-border/70 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">📖</span>
              <div>
                <h2 className="font-serif-title text-lg sm:text-xl font-bold text-storybook-ink">
                  The Love Vibe Alchemist Book
                </h2>
                <p className="text-xs font-handwriting text-storybook-roseDark">
                  Discover secret color recipes, cheeky love notes & date perks ✨
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                watercolorAudio.playWaterDrip(1.1);
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-storybook-bg text-storybook-ink flex items-center justify-center text-sm font-bold hover:bg-storybook-border cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar & Summary */}
          <div className="bg-storybook-bg/80 border border-storybook-border rounded-2xl p-3 mb-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-storybook-ink flex items-center gap-1">
                <span>🧪</span>
                <span>Discovery Progress:</span>
              </span>
              <span className="text-storybook-roseDark font-bold">
                {discoveredCount} of {totalCount} Recipes ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-storybook-border/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-storybook-rose via-storybook-gold to-storybook-sage"
              />
            </div>

            {isAllDiscovered && (
              <div className="mt-2 text-center text-xs font-bold text-storybook-roseDark bg-storybook-blush py-1 px-2 rounded-xl border border-storybook-rose/30">
                👑 All recipes mastered! Grand Master Alchemist perk active for your date! 🌸
              </div>
            )}
          </div>

          {/* Recipe List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
            {ALCHEMIST_RECIPES.map((recipe: AlchemistRecipe) => {
              const isUnlocked = discoveredIds.includes(recipe.id);

              return (
                <div
                  key={recipe.id}
                  className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                    isUnlocked
                      ? 'bg-white border-storybook-rose/40 shadow-xs'
                      : 'bg-storybook-bg/40 border-dashed border-storybook-border/80 opacity-80'
                  }`}
                >
                  {/* Recipe Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{isUnlocked ? recipe.icon : '🔒'}</span>
                      <div>
                        <h3 className="font-serif-title text-sm sm:text-base font-bold text-storybook-ink">
                          {isUnlocked ? recipe.name : 'Unknown Secret Recipe'}
                        </h3>
                        {recipe.isLegendary && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                            ★ Legendary Grand Recipe
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUnlocked
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-storybook-bg text-storybook-inkLight border border-storybook-border'
                      }`}
                    >
                      {isUnlocked ? '✓ Discovered' : '🔒 Locked'}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div className="space-y-2 text-left">
                      {/* Secret Love Note */}
                      <div className="bg-storybook-bg/60 border border-storybook-border/60 rounded-xl p-2.5">
                        <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-0.5">
                          💌 Talel's Note:
                        </div>
                        <p className="font-handwriting text-sm sm:text-base text-storybook-ink">
                          "{recipe.secretNote}"
                        </p>
                      </div>

                      {/* Perk */}
                      <div className="bg-gradient-to-r from-storybook-blush/60 to-storybook-honey/30 border border-storybook-rose/30 rounded-xl p-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-storybook-roseDark font-semibold">
                          <span>🎁</span>
                          <span>{recipe.perkTitle}</span>
                        </div>
                        <span className="text-[11px] text-storybook-inkLight hidden sm:inline">
                          {recipe.perkDesc}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Locked Riddle & Clue */
                    <div className="bg-white/60 border border-dashed border-storybook-border rounded-xl p-2.5 text-left">
                      <div className="text-[10px] font-bold text-storybook-roseDark uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <span>💡</span>
                        <span>Alchemist Riddle & Hint:</span>
                      </div>
                      <p className="font-handwriting text-sm text-storybook-inkLight italic">
                        "{recipe.clue}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-storybook-border/70 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="story-btn-secondary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Close Book 📖
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
