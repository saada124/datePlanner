import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Sparkles, Dices, Check, RotateCw } from 'lucide-react';
import { DateMenuSelection } from '../types';

interface ChefRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySelection: (newSelection: Partial<DateMenuSelection>) => void;
}

export const ChefRouletteModal: React.FC<ChefRouletteModalProps> = ({
  isOpen,
  onClose,
  onApplySelection
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{
    mood: string;
    activityId: string;
    activityTitle: string;
    sides: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    let count = 0;
    const maxTicks = 16;

    const tick = () => {
      count++;
      const pitchFactor = 0.85 + (count / maxTicks) * 0.4;
      menuSound.playRouletteTick(pitchFactor);

      if (count < maxTicks) {
        // Realistic exponential deceleration
        const nextDelay = 60 + Math.pow(count / maxTicks, 2) * 220;
        setTimeout(tick, nextDelay);
      } else {
        // Pick random items
        const randomMood = APP_CONFIG.starters[Math.floor(Math.random() * APP_CONFIG.starters.length)];
        const randomActivity = APP_CONFIG.mainCourses[Math.floor(Math.random() * (APP_CONFIG.mainCourses.length - 1))]; // exclude custom
        const randomSides = [
          APP_CONFIG.sides[Math.floor(Math.random() * 2)].id,
          APP_CONFIG.sides[2 + Math.floor(Math.random() * 2)].id
        ];

        setResult({
          mood: randomMood.name,
          activityId: randomActivity.id,
          activityTitle: randomActivity.title,
          sides: randomSides
        });

        setIsSpinning(false);
        menuSound.playChampagneClink();

        confetti({
          particleCount: 35,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#E8635A', '#F4A45C', '#4A7A6D', '#D4AF37']
        });
      }
    };

    setTimeout(tick, 50);
  };

  const handleApply = () => {
    if (!result) return;
    menuSound.playStampClick();
    onApplySelection(result);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B1B17]/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-md w-full my-auto bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-ticket text-left relative"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-highlight)] text-[#E8635A] rounded-full font-mono text-[10px] font-bold uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Can't Decide? Let the Chef Pick!</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[var(--text-primary)]">
              Chef's Surprise Roulette
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Spin to generate a curated mystery tasting menu for our date night!
            </p>
          </div>

          {/* Spinning Roulette Card Center */}
          <div className="p-5 bg-[var(--bg-inner-box)] border-2 border-dashed border-[var(--border-dashed)] rounded-2xl text-center mb-6 min-h-[160px] flex flex-col items-center justify-center">
            {isSpinning ? (
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.4, ease: 'linear' }}
                  className="text-4xl"
                >
                  🎡
                </motion.div>
                <span className="font-mono text-xs font-bold text-[#E8635A]">
                  Spinning the Tasting Menu...
                </span>
              </div>
            ) : result ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full text-left font-mono text-xs space-y-2"
              >
                <div className="text-center font-serif font-bold text-sm text-[#4A7A6D] mb-1">
                  ✦ FATE HAS CHOSEN OUR DATE ✦
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)]">
                  <span className="text-[#E8635A] font-bold">[I] Vibe: </span>
                  <span className="text-[var(--text-primary)] font-semibold">{result.mood}</span>
                </div>
                <div className="p-2.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)]">
                  <span className="text-[#E8635A] font-bold">[II] Main: </span>
                  <span className="text-[var(--text-primary)] font-semibold">{result.activityTitle}</span>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-[var(--text-secondary)]">
                <Dices className="w-10 h-10 text-[#E8635A] mb-1" />
                <span className="font-serif italic text-sm text-[var(--text-primary)]">
                  Ready to test our luck?
                </span>
                <span className="text-[10px] font-mono opacity-70">
                  Guaranteed 100% romantic outcome!
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {!result ? (
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleSpin}
                className="w-full py-3.5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-sm rounded-2xl shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Spin the Chef's Wheel 🎡</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full py-3.5 bg-[#4A7A6D] hover:bg-[#3D665B] text-white font-serif font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply This Tasting Menu & Continue ✦</span>
                </button>
                <button
                  type="button"
                  onClick={handleSpin}
                  className="w-full py-2.5 bg-[var(--bg-chip)] hover:bg-[var(--bg-chip-hover)] border border-[var(--border-card)] text-[var(--text-primary)] font-mono text-xs font-bold rounded-xl cursor-pointer text-center"
                >
                  Spin Again 🎲
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
