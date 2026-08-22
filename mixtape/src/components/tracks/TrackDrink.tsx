import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface TrackDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onUpdate: (data: { drink: string; customDrink: string }) => void;
  onValidityChange: (valid: boolean) => void;
}

const DRINKS = APP_CONFIG.drinks;

export const TrackDrink: React.FC<TrackDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onValidityChange
}) => {
  const [drink, setDrink] = useState<string>(selectedDrink);
  const [customVal, setCustomVal] = useState<string>(customDrink);

  const isValid = Boolean(drink) || Boolean(customVal.trim());

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handleSelect = (id: string) => {
    sound.playChime();
    setDrink(id);
    onUpdate({ drink: id, customDrink: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ drink: '', customDrink: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-handwriting text-base sm:text-lg text-mixtape-coffeeLight mb-3">
        Every good session needs a warm drink ☕
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {DRINKS.map((d) => {
          const isSelected = drink === d.id;
          return (
            <motion.button
              key={d.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(d.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center min-h-[84px] text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-mixtape-blush border-mixtape-amber shadow-md ring-2 ring-mixtape-amber/30'
                  : 'bg-white border-mixtape-border hover:border-mixtape-amber/40'
              }`}
            >
              <div className="text-2xl mb-1.5">{d.icon}</div>
              <div className="font-serif text-xs font-semibold text-mixtape-coffee leading-snug">
                {d.label}
              </div>
              <div className="text-[10px] text-mixtape-coffeeLight mt-0.5 font-sans">
                {d.note}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-mixtape-border/70 pt-3">
        <input
          type="text"
          value={customVal}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="Or name your favorite drink... 🥤"
          className="w-full bg-white border border-mixtape-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-mixtape-terracotta"
        />
      </div>
    </motion.div>
  );
};