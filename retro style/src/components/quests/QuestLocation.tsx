import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';
import { PixelAvatars } from '../PixelAvatars';

interface QuestLocationProps {
  selectedLocation: string;
  customLocation: string;
  onUpdate: (data: { location: string; customLocation: string }) => void;
  onNext: () => void;
  onPrev: () => void;
  onStatPopup: (text: string) => void;
}

const LOCATIONS = APP_CONFIG.locations;

export const QuestLocation: React.FC<QuestLocationProps> = ({
  selectedLocation,
  customLocation,
  onUpdate,
  onNext,
  onPrev,
  onStatPopup
}) => {
  const [location, setLocation] = useState<string>(selectedLocation);
  const [customVal, setCustomVal] = useState<string>(customLocation);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(Boolean(customLocation) || location === APP_CONFIG.customLocationId);

  const handleSelect = (locId: string) => {
    sound.playSelect();
    setLocation(locId);
    setIsCustomMode(false);
    onUpdate({ location: locId, customLocation: '' });
    onStatPopup(`MAP DESTINATION: ${locId} 🗺️`);
  };

  const handleCustomSelect = () => {
    sound.playSelect();
    const locId = APP_CONFIG.customLocationId;
    setLocation(locId);
    setIsCustomMode(true);
    onUpdate({ location: locId, customLocation: customVal });
  };

  const handleCustomText = (val: string) => {
    setCustomVal(val);
    onUpdate({ location: APP_CONFIG.customLocationId, customLocation: val });
  };

  const handleProceed = () => {
    sound.playLevelUp();
    onNext();
  };

  const isValid = Boolean(location) && (!isCustomMode || Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-24"
    >
      <div className="pixel-box-pink p-4 sm:p-6 mb-4 shadow-pixel-lg">
        <PixelAvatars
          mood={location ? 'happy' : 'idle'}
          speechText={
            location
              ? `Plotting coordinates for ${location}! 🗺️✨`
              : "Where are you taking me? Choose our quest location! 🗺️"
          }
          showSpeech={true}
        />

        <div className="mt-4">
          <div className="mb-2.5">
            <h2 className="font-pixel text-[11px] sm:text-xs text-retro-dark text-pixel-shadow whitespace-nowrap">
              🗺️ Quest #3: Select Destination
            </h2>
          </div>

          {/* Retro Map Background Panel */}
          <div className="bg-[#e9d8a6] border-2 border-[#9b2226] p-3 rounded shadow-inner mb-3">
            <div className="flex items-center justify-between border-b border-[#9b2226]/30 pb-1 mb-2 font-pixel text-[8px] text-[#9b2226]">
              <span>📍 WORLD OF DATE QUEST</span>
              <span>🧭 DESTINATION: GRAND TUNIS KHW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOCATIONS.map((loc) => {
                const isSelected = location === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => handleSelect(loc.id)}
                    className={`p-2.5 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'pixel-box pixel-time-selected'
                        : 'pixel-box bg-[#fffdf0] text-retro-dark hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{loc.icon}</span>
                      <span className="font-pixel text-[7px] px-1.5 py-0.5 border border-current rounded font-bold">
                        {loc.tag}
                      </span>
                    </div>
                    <div>
                      <div className="font-pixelify text-xs sm:text-sm font-bold leading-tight">
                        {loc.label}
                      </div>
                      <div className="font-pixel text-[7px] opacity-75 mt-0.5">
                        {loc.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Location Option */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleCustomSelect}
              className={`w-full p-2.5 text-left flex items-center gap-2 cursor-pointer transition-all ${
                isCustomMode
                  ? 'pixel-box pixel-box-selected'
                  : 'pixel-box bg-retro-cream text-retro-dark hover:bg-white'
              }`}
            >
              <span>📍</span>
              <span className="font-pixel text-[9px] font-bold">
                {APP_CONFIG.customLocationLabel}
              </span>
            </button>

            {isCustomMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <input
                  type="text"
                  value={customVal}
                  onChange={(e) => handleCustomText(e.target.value)}
                  placeholder="Enter restaurant, park, beach, café name or area..."
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
          <span>Next Quest ⚔️</span>
        </button>
      </div>
    </motion.div>
  );
};
