import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentQuest: number; // 1 to 5
  totalQuests?: number;
  questTitle: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuest,
  totalQuests = 5,
  questTitle
}) => {
  const percentage = Math.round((currentQuest / totalQuests) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-4 select-none">
      {/* Top row: Quest number & hearts */}
      <div className="flex items-center justify-between mb-1.5 font-pixel text-[10px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-retro-gold font-bold">
          <span>⚔️</span>
          <span>QUEST {currentQuest} OF {totalQuests}</span>
        </div>

        {/* 8-bit Heart Life Counter */}
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          {Array.from({ length: totalQuests }).map((_, idx) => (
            <span
              key={idx}
              className={`transition-all duration-300 ${
                idx < currentQuest ? 'text-retro-pink scale-110 drop-shadow-sm' : 'text-gray-400 opacity-40'
              }`}
            >
              {idx < currentQuest ? '♥' : '♡'}
            </span>
          ))}
        </div>
      </div>

      {/* Retro XP / Progress Bar */}
      <div className="h-4 sm:h-5 bg-retro-dark border-2 border-white p-0.5 relative shadow-pixel-sm overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-retro-pink via-retro-gold to-retro-yellow"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] sm:text-[9px] text-white font-bold tracking-wider drop-shadow">
          EXP: {percentage}%
        </div>
      </div>

      {/* Quest Subtitle */}
      <div className="text-center mt-1.5 font-pixelify text-xs sm:text-sm text-retro-cream/90 font-medium">
        {questTitle}
      </div>
    </div>
  );
};
