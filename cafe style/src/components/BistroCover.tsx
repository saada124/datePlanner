import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { bistroSound } from '../utils/soundEffects';
import { Sparkles, Heart, UtensilsCrossed } from 'lucide-react';

interface BistroCoverProps {
  onStart: () => void;
}

export const BistroCover: React.FC<BistroCoverProps> = ({ onStart }) => {
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const handleYes = () => {
    bistroSound.playSuccessChime();
    onStart();
  };

  const handleNoHover = () => {
    bistroSound.playFlutter();
    setNoIndex((prev) => (prev + 1) % APP_CONFIG.taunts.length);
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    setNoPos({
      x: signX * (160 + Math.random() * 220),
      y: signY * (90 + Math.random() * 160),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-8 text-center relative z-10">
      {/* Top Bistro Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f5ecdf] border border-[#d9c7b2] text-[#6b4226] font-serif font-bold rounded-full text-xs md:text-sm shadow-sm mb-6"
      >
        <span className="text-sm">🥐</span>
        <span className="tracking-wide uppercase">{APP_CONFIG.cover.badge}</span>
      </motion.div>

      {/* Main Coffee Emblem */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="relative mb-5"
      >
        <div className="w-28 h-28 md:w-32 md:h-32 bg-[#fffdfa] border-2 border-[#d9c7b2] rounded-full flex items-center justify-center shadow-menu text-5xl md:text-6xl">
          ☕
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute -top-1 -right-1 text-2xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Main Title in Serif */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl md:text-5xl font-serif font-bold text-[#2b231f] tracking-tight mb-2 leading-tight"
      >
        {APP_CONFIG.cover.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-base md:text-lg font-serif italic text-[#80182a] mb-6 font-medium"
      >
        {APP_CONFIG.cover.subtitle}
      </motion.p>

      {/* Bistro Menu Introduction Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        className="relative bg-[#fffdfa] border border-[#e7dccc] rounded-3xl p-6 md:p-7 shadow-menu max-w-md w-full mb-8 text-left"
      >
        <div className="flex items-center justify-between border-b border-[#e7dccc] pb-3 mb-3 text-xs font-mono text-[#7a6e65]">
          <span>MAISON FONDÉE EN 2026</span>
          <span className="text-[#80182a] font-bold font-serif">{APP_CONFIG.tableNumber}</span>
        </div>
        <p className="font-serif italic text-stone-700 text-base md:text-lg leading-relaxed">
          {APP_CONFIG.cover.bistroDialogue}
        </p>
      </motion.div>

      {/* Call to action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative"
      >
        <button
          onClick={handleYes}
          className="w-full sm:w-auto px-8 py-4 bg-[#80182a] hover:bg-[#681322] text-white font-serif text-lg md:text-xl font-bold rounded-2xl shadow-gold-btn flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <UtensilsCrossed className="w-5 h-5 text-amber-300" />
          <span>{APP_CONFIG.cover.yesButton}</span>
          <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
        </button>

        {/* Evasive No button */}
        <motion.div
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          className="w-full sm:w-auto"
        >
          <button
            onMouseEnter={handleNoHover}
            onClick={handleNoHover}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#f5ecdf] hover:bg-[#ebdcc7] text-[#6b4226] font-medium text-sm md:text-base rounded-2xl border border-[#d9c7b2] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            {noIndex === 0 ? APP_CONFIG.cover.noButton : APP_CONFIG.taunts[noIndex]}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
