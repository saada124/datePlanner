import React from 'react';
import { motion } from 'framer-motion';

interface BistroProgressProps {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
}

const COURSE_LABELS = ['Service Date', 'Main Course', 'Lieu & Table', 'Boissons', 'Accueil'];

export const BistroProgress: React.FC<BistroProgressProps> = ({
  currentStage,
  totalStages,
  stageTitle,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-2 z-10">
      <div className="bg-[#fffdfa] border border-[#e7dccc] rounded-2xl p-4 shadow-sm flex flex-col gap-2">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-600">
          <span className="font-bold text-[#80182a]">
            COURSE {currentStage} DE {totalStages}: <span className="underline font-serif text-sm text-[#2b231f]">{stageTitle}</span>
          </span>
          <span className="px-2 py-0.5 bg-[#f5ecdf] rounded text-[11px] font-bold text-[#6b4226]">
            MENU EN COURS
          </span>
        </div>

        {/* Course Dots Line */}
        <div className="relative flex items-center justify-between mt-2 px-1">
          <div className="absolute left-3 right-3 h-0.5 bg-[#ebdcc7] -z-0">
            <motion.div
              className="h-full bg-[#80182a]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage - 1) / (totalStages - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {Array.from({ length: totalStages }).map((_, index) => {
            const stepNum = index + 1;
            const isDone = stepNum < currentStage;
            const isCurrent = stepNum === currentStage;

            return (
              <div
                key={index}
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#80182a] text-white ring-4 ring-[#fbebed] shadow-sm scale-110'
                    : isDone
                    ? 'bg-[#c59b27] text-white shadow-xs'
                    : 'bg-[#f7f2ea] text-stone-400 border border-[#e7dccc]'
                }`}
                title={COURSE_LABELS[index]}
              >
                {isDone ? '✓' : stepNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
