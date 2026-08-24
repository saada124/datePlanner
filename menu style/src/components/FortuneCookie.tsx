import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';

export const FortuneCookie: React.FC = () => {
  const [isCracked, setIsCracked] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(0);

  const handleCrack = () => {
    if (isCracked) return;
    menuSound.playCookieSnap();
    
    // Pick a new fortune, avoiding immediate duplicate
    let randomIndex = Math.floor(Math.random() * APP_CONFIG.fortuneCookies.length);
    if (randomIndex === fortuneIndex && APP_CONFIG.fortuneCookies.length > 1) {
      randomIndex = (randomIndex + 1) % APP_CONFIG.fortuneCookies.length;
    }
    setFortuneIndex(randomIndex);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([20, 40, 20]);
    }
    setIsCracked(true);

    confetti({
      particleCount: 25,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#E7C782', '#D4AF37', '#FFE8A3', '#E8635A']
    });
  };

  const handleNextFortune = (e: React.MouseEvent) => {
    e.stopPropagation();
    menuSound.playPaperTurn();
    setIsCracked(false);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 p-5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl shadow-xs text-center select-none relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-3">
        <span className="font-mono text-[10px] font-bold text-[#E8635A] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Complimentary Chef's Fortune</span>
        </span>
        <span className="font-mono text-[10px] text-[var(--text-secondary)]">Table N° 07</span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] mb-3">
        {!isCracked
          ? "Tap the fortune cookie to crack it open and read our date fortune!"
          : "Your date fortune has been revealed ✨"}
      </p>

      {/* Interactive Cookie Graphic */}
      <div
        onClick={handleCrack}
        className="relative py-2 flex items-center justify-center cursor-pointer min-h-[90px]"
      >
        <AnimatePresence mode="wait">
          {!isCracked ? (
            <motion.div
              key="uncracked"
              whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-6xl drop-shadow-sm filter transition-transform">🥠</span>
              <span className="font-mono text-[11px] font-bold text-[#E8635A] uppercase tracking-wider bg-[var(--bg-highlight)] px-3 py-1 rounded-full border border-[#E8635A]/30">
                Tap to Crack Open ✨
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="cracked"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full"
            >
              {/* Two Broken Halves */}
              <div className="flex justify-center gap-8 text-4xl mb-2 opacity-80">
                <motion.span animate={{ x: -10, rotate: -15 }}>🥠</motion.span>
                <motion.span animate={{ x: 10, rotate: 15 }}>🥠</motion.span>
              </div>

              {/* The Curled Fortune Paper Slip */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-[var(--bg-inner-box)] border-2 border-dashed border-[var(--border-dashed)] rounded-2xl shadow-inner relative"
              >
                <p className="font-serif italic font-bold text-xs sm:text-sm text-[var(--text-primary)] mb-1 leading-relaxed">
                  “{APP_CONFIG.fortuneCookies[fortuneIndex]}”
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#E8635A] pt-2 border-t border-[var(--border-subtle)] mt-2">
                  <span>Lucky No. 07 · 24</span>
                  <span className="font-bold uppercase tracking-wider">100% Guaranteed</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={handleNextFortune}
                  className="px-3 py-1 bg-[var(--bg-card)] hover:bg-[var(--bg-highlight)] text-[var(--text-secondary)] border border-[var(--border-card)] rounded-full text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-[#E8635A]" />
                  <span>Crack Another Fortune</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
