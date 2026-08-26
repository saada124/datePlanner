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
const CUSTOM_DRINK_ID = APP_CONFIG.customDrinkId;

export const TrackDrink: React.FC<TrackDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onValidityChange
}) => {
  const [activeDrink, setActiveDrink] = useState<string>(selectedDrink || DRINKS[0]?.id || '');
  const [customVal, setCustomVal] = useState<string>(customDrink);

  const isValid = Boolean(activeDrink) && (activeDrink !== CUSTOM_DRINK_ID || Boolean(customVal.trim()));

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handleSelect = (id: string) => {
    sound.playChime();
    setActiveDrink(id);
    onUpdate({ drink: id, customDrink: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ drink: CUSTOM_DRINK_ID, customDrink: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="font-handwriting text-base sm:text-lg text-[#6d5a4e]">
          The Cheers — What are we sipping? ☕
        </p>
        <span className="text-[10px] font-mono text-[#8a7568]">REFRESHMENTS</span>
      </div>

      {/* Drink Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {DRINKS.map((item) => {
          const isSelected = activeDrink === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[90px] transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#fffdfa] border-[#c96f4a] text-[#2d221c] shadow-sm ring-2 ring-[#c96f4a]/30'
                  : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{item.icon}</span>
                <div className={`micro-led ${isSelected ? 'active-green' : ''}`} />
              </div>

              <div>
                <div className="text-xs font-serif font-bold text-[#2d221c] mt-1 leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-[#8a7568] line-clamp-1 font-sans mt-0.5">
                  {item.note}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Drink Option */}
      <div className="pt-2 border-t border-[#decbb2]/80">
        <button
          type="button"
          onClick={() => handleSelect(CUSTOM_DRINK_ID)}
          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            activeDrink === CUSTOM_DRINK_ID
              ? 'bg-[#fffdfa] border-[#c96f4a] ring-2 ring-[#c96f4a]/30 shadow-sm'
              : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>🥤</span>
            <span className="font-serif text-xs font-bold text-[#2d221c]">
              Custom beverage concoction...
            </span>
          </div>
          <div className={`micro-led ${activeDrink === CUSTOM_DRINK_ID ? 'active-green' : ''}`} />
        </button>

        {activeDrink === CUSTOM_DRINK_ID && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. Lavender matcha latte, special mocktail..."
              className="w-full bg-[#fffdfa] border border-[#c96f4a] rounded-xl p-2.5 text-xs font-serif text-[#2d221c] focus:outline-none focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};