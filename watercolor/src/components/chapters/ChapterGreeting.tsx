import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { watercolorAudio } from '../../utils/watercolorAudio';

interface ChapterGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onUpdate: (data: { greetings: string[]; customNotes: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const GREETINGS = APP_CONFIG.greetings;

export const ChapterGreeting: React.FC<ChapterGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [greetings, setGreetings] = useState<string[]>(selectedGreetings);
  const [notes, setNotes] = useState<string>(customNotes);

  const toggleGreeting = (id: string, e: React.MouseEvent) => {
    let next: string[];
    const rect = e.currentTarget.getBoundingClientRect();

    if (greetings.includes(id)) {
      watercolorAudio.playBrushStroke(0.7);
      next = greetings.filter(g => g !== id);
    } else {
      watercolorAudio.playColorChord(4);
      window.dispatchEvent(
        new CustomEvent('trigger-watercolor-splash', {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            color: 'rgba(232, 93, 117, 0.45)'
          }
        })
      );
      next = [...greetings, id];
    }
    setGreetings(next);
    onUpdate({ greetings: next, customNotes: notes });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onUpdate({ greetings, customNotes: val });
  };

  const handleProceed = () => {
    watercolorAudio.playChapterComplete();
    onNext();
  };

  const isValid = greetings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16 select-none"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative border border-storybook-border">
        <div className="washi-tape -top-2 left-6 w-24" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-roseDark uppercase font-sans flex items-center justify-center gap-1.5">
            <span>🎨</span>
            <span>CHAPTER V • THE CLIMAX</span>
            <span>🎨</span>
          </span>
          <h2 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-1">
            How are you greeting me? ❤️
          </h2>
          <p className="font-handwriting text-base text-storybook-inkLight mt-1">
            When we first lay eyes on each other on date day...
          </p>
        </div>

        {/* Greetings Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {GREETINGS.map((item) => {
            const isSelected = greetings.includes(item.id);
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => toggleGreeting(item.id, e)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[105px] text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'color-dip-card-active scale-102 ring-2 ring-storybook-rose/30'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/40 shadow-2xs'
                }`}
              >
                <span className="text-3xl my-1">{item.icon}</span>
                <span className="font-serif text-xs font-semibold text-storybook-ink leading-snug">
                  {item.label}
                </span>
                <span className="text-[10px] text-storybook-inkLight font-sans mt-0.5">
                  {item.desc}
                </span>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-storybook-roseDark animate-pulse">
                    🌸
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Handwritten Note Stationery */}
        <div className="border-t border-storybook-border/60 pt-4">
          <label className="block font-serif text-xs font-semibold text-storybook-ink mb-1.5 flex items-center gap-1.5">
            <span>💌</span>
            <span>Leave a handwritten note for {APP_CONFIG.boyfriendName} (optional):</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder={`e.g. Can't wait for our date ${APP_CONFIG.boyfriendName}! Wear that nice perfume I love ❤️`}
            className="w-full bg-[#fdfbf7] border border-storybook-border rounded-xl p-3 text-sm font-handwriting text-storybook-ink leading-relaxed focus:outline-none focus:border-storybook-rose resize-none shadow-inner"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            watercolorAudio.playBrushStroke(0.8);
            onPrev();
          }}
          className="story-btn-secondary px-5 py-2.5 text-xs cursor-pointer flex items-center gap-1"
        >
          <span>← Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`story-btn-primary px-7 py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>View Date Invitation Card 🌸➔</span>
        </button>
      </div>
    </motion.div>
  );
};
