import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';
import { PixelAvatars } from '../PixelAvatars';

interface QuestActivityProps {
  selectedActivities: string[];
  customActivity: string;
  onUpdate: (data: { activities: string[]; customActivity: string }) => void;
  onNext: () => void;
  onPrev: () => void;
  onStatPopup: (text: string) => void;
}

const ACTIVITIES = APP_CONFIG.activities;

export const QuestActivity: React.FC<QuestActivityProps> = ({
  selectedActivities,
  customActivity,
  onUpdate,
  onNext,
  onPrev,
  onStatPopup
}) => {
  const [activities, setActivities] = useState<string[]>(selectedActivities);
  const [customVal, setCustomVal] = useState<string>(customActivity);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(Boolean(customActivity));

  const toggleActivity = (id: string) => {
    let next: string[];
    if (activities.includes(id)) {
      sound.playSelect();
      next = activities.filter(a => a !== id);
    } else {
      sound.playEquip();
      next = [...activities, id];
      onStatPopup(`EQUIPPED: ${id} ⚔️`);
    }
    setActivities(next);
    onUpdate({ activities: next, customActivity: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ activities, customActivity: val });
  };

  const handleProceed = () => {
    sound.playLevelUp();
    onNext();
  };

  const isValid = activities.length > 0 || (showCustomInput && Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-24"
    >
      <div className="pixel-box-pink p-4 sm:p-6 mb-4 shadow-pixel-lg">
        <PixelAvatars
          mood={activities.length > 0 ? 'dancing' : 'idle'}
          speechText={
            activities.length > 0
              ? `${activities.length} activity selected! You can choose multiple! 🍿🎮🍝`
              : "What are we doing? Pick as many as you want! 👀"
          }
          showSpeech={true}
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-pixel text-xs sm:text-sm text-retro-dark text-pixel-shadow">
              🎯 Quest #2: What Are We Doing?
            </h2>
            {/* <span className="font-pixel text-[9px] text-retro-pinkDark bg-white px-2 py-0.5 border border-retro-dark rounded font-bold">
              kad ma theb
            </span> */}
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ACTIVITIES.map((act) => {
              const isEquipped = activities.includes(act.id);
              return (
                <motion.button
                  key={act.id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => toggleActivity(act.id)}
                  className={`p-2.5 flex flex-col items-center justify-between min-h-[110px] text-center transition-all cursor-pointer relative overflow-hidden ${
                    isEquipped
                      ? 'pixel-box pixel-box-selected scale-105'
                      : 'pixel-box bg-white text-retro-dark hover:bg-retro-pinkLight/40'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl my-1">{act.icon}</div>
                  <div className="font-pixel text-[9px] sm:text-[10px] font-bold leading-tight">
                    {act.title}
                  </div>
                  <div className="font-pixelify text-[10px] font-semibold line-clamp-1 mt-0.5">
                    {act.desc}
                  </div>

                  {/* Equipped Badge */}
                  {isEquipped && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-retro-gold text-retro-dark font-pixel text-[7px] px-1 py-0.5 rounded border border-retro-dark font-bold shadow-sm"
                    >
                      EQUIPPED ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Custom Option Toggle */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="font-pixel text-[9px] text-retro-purple hover:text-retro-pinkDark underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showCustomInput ? '➖' : '➕'}</span>
              <span>{showCustomInput ? 'Hide custom idea' : 'Have another idea in mind? ("Something else...")'}</span>
            </button>

            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <input
                  type="text"
                  value={customVal}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="e.g. Stargazing, cooking together, museum trip..."
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
