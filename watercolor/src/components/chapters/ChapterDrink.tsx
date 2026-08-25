import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { watercolorAudio } from '../../utils/watercolorAudio';

interface ChapterDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onUpdate: (data: { drink: string; customDrink: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DRINKS = APP_CONFIG.drinks;
const customDrinkId = APP_CONFIG.customDrinkId;

export const ChapterDrink: React.FC<ChapterDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [drink, setDrink] = useState<string>(selectedDrink);
  const [customVal, setCustomVal] = useState<string>(customDrink);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customDrink));

  const handleSelect = (item: typeof DRINKS[0], e: React.MouseEvent) => {
    watercolorAudio.playWaterDrip(1.25);
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: 'rgba(232, 93, 117, 0.4)'
        }
      })
    );

    setDrink(item.id);
    setShowCustom(false);
    onUpdate({ drink: item.id, customDrink: '' });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    setDrink(customDrinkId);
    onUpdate({ drink: customDrinkId, customDrink: val });
  };

  const handleProceed = () => {
    watercolorAudio.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(drink) && (drink !== customDrinkId || Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16 select-none"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative border border-storybook-border">
        <div className="washi-tape washi-tape-sage -top-2 right-6 w-24" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-roseDark uppercase font-sans flex items-center justify-center gap-1.5">
            <span>🎨</span>
            <span>CHAPTER IV</span>
            <span>🎨</span>
          </span>
          <h2 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-1">
            What elixir shall we sip? 🥤
          </h2>
          <p className="font-handwriting text-base text-storybook-inkLight mt-1">
            Choose our refreshment for our painted afternoon
          </p>
        </div>

        {/* Botanical Drink Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DRINKS.map((item) => {
            const isSelected = drink === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleSelect(item, e)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[105px] text-center transition-all cursor-pointer ${
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
                  {item.note}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Drink Option */}
        <div className="mt-4 border-t border-storybook-border/60 pt-3">
          <button
            type="button"
            onClick={() => {
              setShowCustom(!showCustom);
              if (!showCustom) setDrink(customDrinkId);
            }}
            className="text-xs font-serif text-storybook-roseDark hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <span>{showCustom ? '−' : '+'}</span>
            <span>{showCustom ? 'Hide custom drink' : 'Prefer a special customized beverage in mind?'}</span>
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
                placeholder="e.g. Lavender Matcha, Sparkling Berry Mocktail, Iced Chai..."
                className="w-full bg-white border border-storybook-border rounded-xl p-3 text-xs focus:outline-none focus:border-storybook-rose shadow-inner"
              />
            </motion.div>
          )}
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
          className={`story-btn-primary px-7 py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>Chapter V: The Warm Greeting ➔</span>
        </button>
      </div>
    </motion.div>
  );
};
