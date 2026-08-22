import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';
import { PixelAvatars } from '../PixelAvatars';

interface QuestDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onUpdate: (data: { drink: string; customDrink: string }) => void;
  onNext: () => void;
  onPrev: () => void;
  onStatPopup: (text: string) => void;
}

const DRINKS = APP_CONFIG.drinks;

export const QuestDrink: React.FC<QuestDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onNext,
  onPrev,
  onStatPopup
}) => {
  const [drink, setDrink] = useState<string>(selectedDrink);
  const [customVal, setCustomVal] = useState<string>(customDrink);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customDrink));

  const handleSelect = (item: typeof DRINKS[0]) => {
    sound.playSelect();
    setDrink(item.id);
    setShowCustom(false);
    onUpdate({ drink: item.id, customDrink: '' });
    onStatPopup(item.stat);
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    setDrink(APP_CONFIG.customDrinkId);
    onUpdate({ drink: APP_CONFIG.customDrinkId, customDrink: val });
  };

  const handleProceed = () => {
    sound.playLevelUp();
    onNext();
  };

  const isValid = Boolean(drink) && (drink !== APP_CONFIG.customDrinkId || Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-24"
    >
      <div className="pixel-box-pink p-4 sm:p-6 mb-4 shadow-pixel-lg">
        <PixelAvatars
          mood={drink ? 'dancing' : 'idle'}
          speechText={
            drink
              ? "Excellent choice! +10 Happiness restored! 🥤✨"
              : "Quest #4: Pick our potion/drink! (Single choice) 🥤"
          }
          showSpeech={true}
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-xs sm:text-sm text-retro-dark text-pixel-shadow">
              🥤 Quest #4: Choose Our Drink
            </h2>
            <span className="font-pixel text-[9px] text-retro-purple bg-retro-cream px-2 py-0.5 border border-retro-dark rounded">
              POTION SHOP
            </span>
          </div>

          {/* Single Select Potion Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DRINKS.map((item) => {
              const isSelected = drink === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => handleSelect(item)}
                  className={`p-2.5 flex flex-col items-center justify-between min-h-[90px] text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'pixel-box pixel-box-selected scale-105'
                      : 'pixel-box bg-white text-retro-dark hover:bg-retro-pinkLight/40'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl my-0.5">{item.icon}</span>
                  <span className="font-pixelify text-xs font-bold leading-tight line-clamp-1">
                    {item.label}
                  </span>
                  <span className="font-pixel text-[7px] text-retro-gold mt-1 bg-retro-dark px-1 py-0.5 rounded">
                    {item.stat.split(' ')[0]} {item.stat.split(' ')[1]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Drink Option */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setShowCustom(!showCustom);
                if (!showCustom) setDrink(APP_CONFIG.customDrinkId);
              }}
              className="font-pixel text-[9px] text-retro-purple hover:text-retro-pinkDark underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showCustom ? '➖' : '➕'}</span>
              <span>{showCustom ? 'Hide custom drink' : 'Want something else? (Custom Drink)'}</span>
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
                  placeholder="e.g. Matcha latte, mocktail, hot chocolate..."
                  className="w-full pixel-box bg-white p-2 text-xs font-pixelify text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-pink"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="pixel-btn pixel-btn-secondary text-[10px]"
        >
          <span>⬅️ Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`pixel-btn ${
            isValid
              ? 'pixel-btn-primary shadow-pixel-glow'
              : 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700'
          }`}
        >
          <span>Final Quest ⚔️</span>
        </button>
      </div>
    </motion.div>
  );
};
