import React from 'react';
import { motion } from 'framer-motion';

interface IslandProgressProps {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
}

const STAGE_ICONS = ['📅', '🎣', '🏝️', '☕', '💌'];

export const IslandProgress: React.FC<IslandProgressProps> = ({
  currentStage,
  totalStages,
  stageTitle,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-2 z-10">
      <div className="bg-[#fffef7] border-3 border-emerald-300 rounded-3xl p-3 shadow-md flex flex-col gap-2">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between text-xs md:text-sm font-bold text-stone-700 px-1">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span>🦤 Flight Step {currentStage} of {totalStages}:</span>
            <span className="text-stone-800 underline decoration-emerald-400 decoration-2 font-black">
              {stageTitle}
            </span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black">
            {Math.round((currentStage / totalStages) * 100)}% Ready
          </span>
        </div>

        {/* Progress Bar & Icon Nodes */}
        <div className="relative flex items-center justify-between mt-1 px-2">
          {/* Connecting Line */}
          <div className="absolute left-4 right-4 h-2 bg-emerald-100 rounded-full -z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Nodes */}
          {Array.from({ length: totalStages }).map((_, index) => {
            const stepNum = index + 1;
            const isDone = stepNum < currentStage;
            const isCurrent = stepNum === currentStage;

            return (
              <div
                key={index}
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  isCurrent
                    ? 'bg-amber-300 text-stone-900 ring-4 ring-amber-100 scale-110 shadow-md'
                    : isDone
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-stone-200 text-stone-400'
                }`}
              >
                {STAGE_ICONS[index] || stepNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
