import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface ChapterLocationProps {
  selectedLocation: string;
  customLocation: string;
  onUpdate: (data: { location: string; customLocation: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LOCATIONS = APP_CONFIG.locations;
const customLocationId = APP_CONFIG.customLocationId;
const customLocationButtonText = APP_CONFIG.customLocationButtonText;

export const ChapterLocation: React.FC<ChapterLocationProps> = ({
  selectedLocation,
  customLocation,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [location, setLocation] = useState<string>(selectedLocation);
  const [customVal, setCustomVal] = useState<string>(customLocation);
  const [isCustom, setIsCustom] = useState<boolean>(Boolean(customLocation) || location === customLocationId);

  const handleSelect = (locId: string) => {
    sound.playChime();
    setLocation(locId);
    setIsCustom(false);
    onUpdate({ location: locId, customLocation: '' });
  };

  const handleCustomToggle = () => {
    sound.playChime();
    const locId = customLocationId;
    setLocation(locId);
    setIsCustom(true);
    onUpdate({ location: locId, customLocation: customVal });
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative">
        <div className="washi-tape -top-2 left-6 w-20" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-rose uppercase font-sans">
            CHAPTER III
          </span>
          <h2 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-1">
            Where are you taking me? 🗺️
          </h2>
          <p className="font-handwriting text-base text-storybook-inkLight mt-1">
            Select a realm on our romantic explorer's map
          </p>
        </div>

        {/* Vintage Map Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {LOCATIONS.map((loc) => {
            const isSelected = location === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc.id)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-storybook-blush border-storybook-rose text-storybook-roseDark shadow-md scale-102 ring-2 ring-storybook-rose/30'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/40 text-storybook-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{loc.icon}</span>
                  <span className="font-serif text-xs font-semibold">{loc.label}</span>
                </div>
                <span className="text-[10px] font-handwriting text-storybook-roseDark bg-storybook-parchment px-2 py-0.5 rounded-full border border-storybook-border">
                  {loc.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Location Option */}
        <div className="mt-3 border-t border-storybook-border pt-3">
          <button
            type="button"
            onClick={handleCustomToggle}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
              isCustom
                ? 'bg-storybook-sageLight/70 border-storybook-sage text-storybook-ink'
                : 'bg-white border-storybook-border hover:border-storybook-sage/50 text-storybook-inkLight'
            }`}
          >
            <span>📍</span>
            <span className="text-xs font-serif">{customLocationButtonText}</span>
          </button>

          {isCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <input
                type="text"
                value={customVal}
                onChange={(e) => handleCustomText(e.target.value)}
                placeholder="Enter specific restaurant, café, beach, park, or secret spot..."
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
          <span>Chapter IV ➔</span>
        </button>
      </div>
    </motion.div>
  );
};
