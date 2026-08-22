import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface SetupLocationProps {
  selectedLocation: string;
  customLocation: string;
  onUpdate: (data: { location: string; customLocation: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SetupLocation: React.FC<SetupLocationProps> = ({
  selectedLocation,
  customLocation,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [location, setLocation] = useState<string>(selectedLocation);
  const [customVal, setCustomVal] = useState<string>(customLocation);
  const [isCustom, setIsCustom] = useState<boolean>(Boolean(customLocation) || location === APP_CONFIG.customLocationId);

  const LOCATIONS = APP_CONFIG.locations;
  const customLocationId = APP_CONFIG.customLocationId;

  const handleSelect = (locId: string) => {
    sound.playChime();
    setLocation(locId);
    setIsCustom(false);
    onUpdate({ location: locId, customLocation: '' });
  };

  const handleCustomToggle = () => {
    sound.playChime();
    setLocation(customLocationId);
    setIsCustom(true);
    onUpdate({ location: customLocationId, customLocation: customVal });
  };

  const handleCustomText = (val: string) => {
    setCustomVal(val);
    onUpdate({ location: customLocationId, customLocation: val });
  };

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(location) && (!isCustom || Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="text-xs text-win95-black mb-3">
        <div className="font-bold mb-0.5">Select destination path 🗺️</div>
        <div className="text-win95-grayDark">Where should the date be installed?</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
        {LOCATIONS.map((loc) => {
          const isSelected = location === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelect(loc.id)}
              className={`win95-btn win95-btn-sm !p-2 flex items-center gap-2 text-left cursor-pointer ${
                isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
              }`}
            >
              <span className="win95-radio">{isSelected && <span className="win95-radio-dot" />}</span>
              <span className="text-base">{loc.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-tight truncate">{loc.label}</span>
                <span className={`block text-[9px] leading-tight ${isSelected ? 'text-win95-white/70' : 'text-win95-grayDark'}`}>
                  {loc.tag}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3">
        <button
          type="button"
          onClick={handleCustomToggle}
          className={`win95-btn win95-btn-sm !p-2 flex items-center gap-2 cursor-pointer w-full ${
            isCustom ? 'bg-win95-navy text-win95-white font-bold' : ''
          }`}
        >
          <span className="win95-radio">{isCustom && <span className="win95-radio-dot" />}</span>
          <span className="text-[11px]">{APP_CONFIG.customLocationButtonText}</span>
        </button>

        {isCustom && (
          <div className="mt-1.5">
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomText(e.target.value)}
              placeholder={`C:\\Users\\${APP_CONFIG.girlfriendName}\\Desktop\\Secret_Spot\\`}
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