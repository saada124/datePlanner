import React from 'react';
import { motion } from 'framer-motion';

interface ChapterProgressProps {
  currentChapter: number; // 1 to 5
  totalChapters?: number;
  chapterTitle: string;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  currentChapter,
  totalChapters = 5,
  chapterTitle
}) => {
  const percentage = Math.round((currentChapter / totalChapters) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-6 select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-storybook-roseDark font-serif text-sm font-semibold">
          <span>🌸</span>
          <span>Chapter {currentChapter} of {totalChapters}</span>
        </div>

        {/* Flower / Star Markers */}
        <div className="flex items-center gap-1.5 text-xs text-storybook-rose">
          {Array.from({ length: totalChapters }).map((_, i) => (
            <span
              key={i}
              className={`transition-all duration-300 ${
                i < currentChapter ? 'opacity-100 scale-110' : 'opacity-30'
              }`}
            >
              {i < currentChapter ? '🌸' : '🌱'}
            </span>
          ))}
        </div>
      </div>

      {/* Ribbon Progress Line */}
      <div className="h-2 bg-storybook-parchment rounded-full border border-storybook-border overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-storybook-rose via-storybook-gold to-storybook-roseDark rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <div className="text-center mt-2 font-handwriting text-base sm:text-lg text-storybook-inkLight">
        ~ {chapterTitle} ~
      </div>
    </div>
  );
};
