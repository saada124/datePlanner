import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface SetupDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onUpdate: (data: { drink: string; customDrink: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SetupDrink: React.FC<SetupDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [drink, setDrink] = useState<string>(selectedDrink);
  const [customVal, setCustomVal] = useState<string>(customDrink);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customDrink));

  const DRINKS = APP_CONFIG.drinks;
  const customDrinkId = APP_CONFIG.customDrinkId;

  const handleSelect = (item: typeof DRINKS[0]) => {
    sound.playChime();
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
    sound.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(drink) && (drink !== customDrinkId || Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="text-xs text-win95-black mb-3">
        <div className="font-bold mb-0.5">Select refreshment module 🥤</div>
        <div className="text-win95-grayDark">Choose the official drink of the date.</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {DRINKS.map((item) => {
          const isSelected = drink === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`win95-btn win95-btn-sm !p-2 flex flex-col items-center gap-1 text-center cursor-pointer min-h-[70px] ${
                isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
              }`}
            >
              <span className="win95-radio">{isSelected && <span className="win95-radio-dot" />}</span>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[11px] leading-tight">{item.label}</span>
              <span className={`text-[9px] leading-tight ${isSelected ? 'text-win95-white/70' : 'text-win95-grayDark'}`}>
                {item.note}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3">
        <button
          type="button"
          onClick={() => {
            setShowCustom(!showCustom);
            if (!showCustom) setDrink(customDrinkId);
          }}
          className="text-[11px] text-win95-navy underline cursor-pointer"
        >
          {showCustom ? '− Hide custom module' : '+ Compile custom module...'}
        </button>

        {showCustom && (
          <div className="mt-1.5">
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. lavender_matcha.dll, mocktail.exe..."
              className="win95-field w-full"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onPrev} className="win95-btn cursor-pointer">
          &lt; Back
        </button>
        <button type="button" disabled={!isValid} onClick={handleProceed} className="win95-btn font-bold cursor-pointer">
          Next &gt;
        </button>
      </div>
    </motion.div>
  );
};