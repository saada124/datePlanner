import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface TrackLocationProps {
  selectedLocation: string;
  customLocation: string;
  onUpdate: (data: { location: string; customLocation: string }) => void;
  onValidityChange: (valid: boolean) => void;
}

const LOCATIONS = APP_CONFIG.locations;

export const TrackLocation: React.FC<TrackLocationProps> = ({
  selectedLocation,
  customLocation,
  onUpdate,
  onValidityChange
}) => {
  const [location, setLocation] = useState<string>(selectedLocation);
  const [customVal, setCustomVal] = useState<string>(customLocation);

  const isValid = Boolean(location) || Boolean(customVal.trim());

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handleSelect = (id: string) => {
    sound.playChime();
    setLocation(id);
    onUpdate({ location: id, customLocation: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ location: '', customLocation: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-handwriting text-base sm:text-lg text-mixtape-coffeeLight mb-3">
        Set the scene for our little session 🗺️
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {LOCATIONS.map((loc) => {
          const isSelected = location === loc.id;
          return (
            <motion.button
              key={loc.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(loc.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center min-h-[88px] text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-mixtape-blush border-mixtape-terracotta shadow-md ring-2 ring-mixtape-terracotta/30'
                  : 'bg-white border-mixtape-border hover:border-mixtape-terracotta/40'
              }`}
            >
              <div className="text-2xl mb-1.5">{loc.icon}</div>
              <div className="font-serif text-xs font-semibold text-mixtape-coffee leading-snug">
                {loc.label}
              </div>
              <div className="text-[10px] text-mixtape-coffeeLight mt-0.5 font-sans">
                {loc.tag}
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
          placeholder="Or type your own special place... ✍️"
          className="w-full bg-white border border-mixtape-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-mixtape-terracotta"
        />
      </div>
    </motion.div>
  );
};