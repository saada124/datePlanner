import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface TrackActivityProps {
  selectedActivities: string[];
  customActivity: string;
  onUpdate: (data: { activities: string[]; customActivity: string }) => void;
  onValidityChange: (valid: boolean) => void;
}

const ACTIVITIES = APP_CONFIG.activities;

export const TrackActivity: React.FC<TrackActivityProps> = ({
  selectedActivities,
  customActivity,
  onUpdate,
  onValidityChange
}) => {
  const [activities, setActivities] = useState<string[]>(selectedActivities);
  const [customVal, setCustomVal] = useState<string>(customActivity);
  const [showCustom, setShowCustom] = useState<boolean>(Boolean(customActivity));

  const isValid = activities.length > 0 || (showCustom && Boolean(customVal.trim()));

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-handwriting text-base sm:text-lg text-mixtape-coffeeLight mb-3">
        Curate our playlist of activities — pick as many as you like 🎸
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ACTIVITIES.map((act) => {
          const isSelected = activities.includes(act.id);
          return (
            <motion.button
              key={act.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleActivity(act.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-between min-h-[100px] text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-mixtape-blush border-mixtape-rose shadow-md ring-2 ring-mixtape-rose/30'
                  : 'bg-white border-mixtape-border hover:border-mixtape-rose/40'
              }`}
            >
              <div className="text-2xl my-1">{act.icon}</div>
              <div className="font-serif text-xs font-semibold text-mixtape-coffee leading-snug">
                {act.title}
              </div>
              <div className="text-[10px] text-mixtape-coffeeLight line-clamp-1 mt-0.5 font-sans">
                {act.desc}
              </div>
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 text-xs text-mixtape-rose">♥</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-mixtape-border/70 pt-3">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs font-serif text-mixtape-roseDark hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span>{showCustom ? '−' : '+'}</span>
          <span>{showCustom ? 'Hide custom idea' : 'Have a special idea in mind?'}</span>
        </button>

        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <input
              type="text"
              value={customVal}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. Stargazing, cooking dessert together, a secret spot..."
              className="w-full bg-white border border-mixtape-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-mixtape-terracotta"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};