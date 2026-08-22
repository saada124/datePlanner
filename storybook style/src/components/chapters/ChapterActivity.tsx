import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface ChapterActivityProps {
  selectedActivities: string[];
  customActivity: string;
  onUpdate: (data: { activities: string[]; customActivity: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ACTIVITIES = APP_CONFIG.activities;

export const ChapterActivity: React.FC<ChapterActivityProps> = ({
  selectedActivities,
  customActivity,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [activities, setActivities] = useState<string[]>(selectedActivities);
  const [customVal, setCustomVal] = useState<string>(customActivity);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customActivity));

  const toggleActivity = (id: string) => {
    let next: string[];
    if (activities.includes(id)) {
      sound.playPageTurn();
      next = activities.filter(a => a !== id);
    } else {
      sound.playChime();
      next = [...activities, id];
    }
    setActivities(next);
    onUpdate({ activities: next, customActivity: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ activities, customActivity: val });
  };

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = activities.length > 0 || (showCustom && Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative">
        <div className="washi-tape washi-tape-sage -top-2 right-6 w-20" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-rose uppercase font-sans">
            CHAPTER II
          </span>
          <h2 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-1">
            What are we doing? 👀
          </h2>
          <p className="font-handwriting text-base text-storybook-inkLight mt-1">
            Choose as many activities as you'd like for our itinerary
          </p>
        </div>

        {/* Polaroid Activity Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIVITIES.map((act) => {
            const isSelected = activities.includes(act.id);
            return (
              <motion.button
                key={act.id}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleActivity(act.id)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[110px] text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-storybook-blush border-storybook-rose shadow-md scale-102 ring-2 ring-storybook-rose/30'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/40'
                }`}
              >
                <div className="text-2xl sm:text-3xl my-1">{act.icon}</div>
                <div className="font-serif text-xs font-semibold text-storybook-ink leading-snug">
                  {act.title}
                </div>
                <div className="text-[10px] text-storybook-inkLight line-clamp-1 mt-0.5 font-sans">
                  {act.desc}
                </div>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 text-xs text-storybook-rose">
                    🌸
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Activity Option */}
        <div className="mt-4 border-t border-storybook-border pt-3">
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs font-serif text-storybook-roseDark hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showCustom ? '−' : '+'}</span>
            <span>{showCustom ? 'Hide custom idea' : 'Have a special customized idea in mind?'}</span>
          </button>

          {showCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <input
                type="text"
                value={customVal}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="e.g. Stargazing at the park, cooking dessert together..."
                className="w-full bg-white border border-storybook-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-storybook-rose"
              />
            </motion.div>
          )}
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
          className={`story-btn-primary px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>Chapter III ➔</span>
        </button>
      </div>
    </motion.div>
  );
};
