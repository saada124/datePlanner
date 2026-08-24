import React from 'react';
import { motion } from 'framer-motion';
import { menuSound } from '../utils/soundEffects';

interface CandleToggleProps {
  isCandlelit: boolean;
  onToggle: () => void;
}

export const CandleToggle: React.FC<CandleToggleProps> = ({ isCandlelit, onToggle }) => {
  const handleToggle = () => {
    if (!isCandlelit) {
      menuSound.playMatchStrike();
    } else {
      menuSound.playCandleBlow();
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
        isCandlelit
          ? 'bg-[#2B1B17] border-[#F4A45C] text-[#FDF2E7] ring-1 ring-[#F4A45C]/50'
          : 'bg-[#FFFCF5] border-[#D8B29A]/60 text-[#70584E] hover:bg-[#FDF2E7]'
      }`}
      title={isCandlelit ? "Turn on daylight" : "Dim for candlelit evening atmosphere"}
      aria-label={isCandlelit ? "Turn on daylight" : "Dim for candlelit evening atmosphere"}
    >
      {/* Animated Flickering Flame */}
      <div className="relative w-3.5 h-5 flex items-end justify-center">
        {/* Candle stick */}
        <div className="w-2 h-2.5 bg-[#E8D9C5] rounded-xs border border-[#C2B29D]" />
        {/* Wick */}
        <div className="absolute bottom-2.5 w-0.5 h-1 bg-[#2B1B17]" />
        {/* Flame */}
        <motion.div
          animate={
            isCandlelit
              ? {
                  scale: [1, 1.25, 0.95, 1.15, 1],
                  rotate: [-3, 4, -2, 3, -3],
                  opacity: [0.95, 1, 0.85, 1]
                }
              : { scale: 1, opacity: 0.5 }
          }
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className={`absolute bottom-3.5 w-2 h-3 rounded-full ${
            isCandlelit
              ? 'bg-gradient-to-t from-[#E8635A] via-[#F4A45C] to-[#FFE8A3] shadow-[0_0_8px_#F4A45C]'
              : 'bg-[#C47A53]/50'
          }`}
        />
      </div>

      <span className="font-mono text-xs font-semibold">
        {isCandlelit ? "Candlelit Night 🕯️" : "Light Candle 🕯️"}
      </span>
    </button>
  );
};
