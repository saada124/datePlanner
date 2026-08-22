import React from 'react';
import { motion } from 'framer-motion';

interface QuestProgressProps {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
}

export const QuestProgress: React.FC<QuestProgressProps> = ({
  currentStage,
  totalStages,
  stageTitle
}) => {
  const percentage = (currentStage / totalStages) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-6 select-none">
      {/* Header text */}
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-midnight-neonPink uppercase tracking-wider font-display flex items-center gap-1.5">
          <span>✨</span>
          <span>ORBIT {currentStage} OF {totalStages}: {stageTitle}</span>
        </span>
        <span className="text-midnight-textMuted font-mono text-[11px]">
          {Math.round(percentage)}% ALIGNED
        </span>
      </div>

      {/* Progress Bar with Starlight Glowing Head */}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-gradient-to-r from-midnight-neonPink via-midnight-purple to-midnight-neonCyan rounded-full relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/70 blur-xs rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};
