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
const CUSTOM_LOC_ID = APP_CONFIG.customLocationId;

export const TrackLocation: React.FC<TrackLocationProps> = ({
  selectedLocation,
  customLocation,
  onUpdate,
  onValidityChange
}) => {
  const [activeLoc, setActiveLoc] = useState<string>(selectedLocation || LOCATIONS[0]?.id || '');
  const [customVal, setCustomVal] = useState<string>(customLocation);

  const isValid = Boolean(activeLoc) && (activeLoc !== CUSTOM_LOC_ID || Boolean(customVal.trim()));

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handleSelect = (id: string) => {
    sound.playChime();
    setActiveLoc(id);
    onUpdate({ location: id, customLocation: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ location: CUSTOM_LOC_ID, customLocation: val });
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
          The Scene — Where should our tape spin? 🗺️
        </p>
        <span className="text-[10px] font-mono text-[#8a7568]">SIDE A · VENUE</span>
      </div>

      {/* Venue Passes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {LOCATIONS.map((loc) => {
          const isSelected = activeLoc === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelect(loc.id)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#fffdfa] border-[#c96f4a] text-[#2d221c] font-medium shadow-sm ring-2 ring-[#c96f4a]/30'
                  : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{loc.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-serif font-bold text-[#2d221c] truncate">
                    {loc.label}
                  </div>
                  <div className="text-[10px] font-mono text-[#8a7568] uppercase tracking-wider mt-0.5">
                    {loc.tag} VIBES
                  </div>
                </div>
              </div>

              <div className={`micro-led shrink-0 ${isSelected ? 'active-amber' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Custom Location Option */}
      <div className="pt-2 border-t border-[#decbb2]/80">
        <button
          type="button"
          onClick={() => handleSelect(CUSTOM_LOC_ID)}
          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
            activeLoc === CUSTOM_LOC_ID
              ? 'bg-[#fffdfa] border-[#c96f4a] ring-2 ring-[#c96f4a]/30 shadow-sm'
              : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>✨</span>
            <span className="font-serif text-xs font-bold text-[#2d221c]">
              {APP_CONFIG.customLocationButtonText}
            </span>
          </div>
          <div className={`micro-led ${activeLoc === CUSTOM_LOC_ID ? 'active-amber' : ''}`} />
        </button>

        {activeLoc === CUSTOM_LOC_ID && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. That quiet bench overlooking the city, my secret cafe..."
              className="w-full bg-[#fffdfa] border border-[#c96f4a] rounded-xl p-2.5 text-xs font-serif text-[#2d221c] focus:outline-none focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};