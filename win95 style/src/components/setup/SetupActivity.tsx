import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface SetupActivityProps {
  selectedActivities: string[];
  customActivity: string;
  onUpdate: (data: { activities: string[]; customActivity: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SetupActivity: React.FC<SetupActivityProps> = ({
  selectedActivities,
  customActivity,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [activities, setActivities] = useState<string[]>(selectedActivities);
  const [customVal, setCustomVal] = useState<string>(customActivity);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customActivity));

  const ACTIVITIES = APP_CONFIG.activities;

  const toggleActivity = (id: string) => {
    let next: string[];
    if (activities.includes(id)) {
      sound.playPageTurn();
      next = activities.filter(a => a !== id);
    } else {
      sound.playChime();
      next = [...activities, id];
    }
    setActivities(next);
    onUpdate({ activities: next, customActivity: customVal });
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onUpdate({ activities, customActivity: val });
  };

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = activities.length > 0 || (showCustom && Boolean(customVal.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="text-xs text-win95-black mb-3">
        <div className="font-bold mb-0.5">Select programs to run 🎮</div>
        <div className="text-win95-grayDark">Choose as many as you'd like. All are virus-free.</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {ACTIVITIES.map((act) => {
          const isSelected = activities.includes(act.id);
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => toggleActivity(act.id)}
              className={`win95-btn win95-btn-sm !p-2 flex flex-col items-center gap-1 text-center cursor-pointer min-h-[74px] ${
                isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="win95-checkbox">{isSelected ? '✓' : ''}</span>
                <span className="text-base leading-none">{act.icon}</span>
              </span>
              <span className="text-[11px] leading-tight">{act.title}</span>
              <span className={`text-[9px] leading-tight ${isSelected ? 'text-win95-white/70' : 'text-win95-grayDark'}`}>
                {act.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-[11px] text-win95-navy underline cursor-pointer"
        >
          {showCustom ? '− Hide custom program' : '+ Run a custom program...'}
        </button>

        {showCustom && (
          <div className="mt-1.5">
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. stargazing.exe, dessert_cooking.bat..."
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