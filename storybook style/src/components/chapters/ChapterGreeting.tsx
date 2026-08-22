import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

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

  const toggleGreeting = (id: string) => {
    let next: string[];
    if (greetings.includes(id)) {
      sound.playPageTurn();
      next = greetings.filter(g => g !== id);
    } else {
      sound.playChime();
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
    sound.playChapterComplete();
    onNext();
  };

  const isValid = greetings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative">
        <div className="washi-tape -top-2 left-6 w-20" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-rose uppercase font-sans">
            CHAPTER V • THE CLIMAX
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
              <button
                key={item.id}
                type="button"
                onClick={() => toggleGreeting(item.id)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[95px] text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-storybook-blush border-storybook-rose shadow-md scale-102 ring-2 ring-storybook-rose/30'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/40'
                }`}
              >
                <span className="text-2xl sm:text-3xl my-1">{item.icon}</span>
                <span className="font-serif text-xs font-semibold text-storybook-ink leading-snug">
                  {item.label}
                </span>
                <span className="text-[10px] text-storybook-inkLight font-sans mt-0.5">
                  {item.desc}
                </span>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-storybook-rose">
                    🌸
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Handwritten Note Stationery */}
        <div className="border-t border-storybook-border pt-4">
          <label className="block font-serif text-xs font-semibold text-storybook-ink mb-1.5">
            💌 Leave a handwritten note for {APP_CONFIG.boyfriendName} (optional):
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="e.g. Can't wait for our date! Wear that nice jacket I love ❤️"
            className="w-full bg-[#fdfbf7] border border-storybook-border rounded-xl p-3 text-sm font-handwriting text-storybook-ink leading-relaxed focus:outline-none focus:border-storybook-rose resize-none shadow-inner"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="story-btn-secondary px-5 py-2.5 text-xs cursor-pointer"
        >
          <span>← Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`story-btn-primary px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>View Date Invitation Card 🌸➔</span>
        </button>
      </div>
    </motion.div>
  );
};
