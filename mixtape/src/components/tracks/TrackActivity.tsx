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
      sound.playButtonClunk();
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
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="font-handwriting text-base sm:text-lg text-[#6d5a4e]">
          Curate the setlist — pick as many activities as you like 🎸
        </p>
        <span className="text-[10px] font-mono uppercase bg-[#ebdcc7] text-[#5c4738] px-2 py-0.5 rounded border border-[#decbb2]">
          {activities.length} TRACK{activities.length === 1 ? '' : 'S'} QUEUED
        </span>
      </div>

      {/* Cassette Singles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ACTIVITIES.map((act) => {
          const isSelected = activities.includes(act.id);
          return (
            <motion.button
              key={act.id}
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleActivity(act.id)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[105px] text-center transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#fffdfa] border-[#c96f4a] shadow-md ring-2 ring-[#c96f4a]/30'
                  : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
              }`}
            >
              {/* Micro-LED in Top Corner */}
              <div className="absolute top-2 right-2">
                <div className={`micro-led ${isSelected ? 'active-green' : ''}`} />
              </div>

              <div className="text-2xl my-1">{act.icon}</div>
              <div className="font-serif text-xs font-bold text-[#2d221c] leading-snug">
                {act.title}
              </div>
              <div className="text-[10px] text-[#8a7568] line-clamp-1 mt-0.5 font-sans">
                {act.desc}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Activity Entry */}
      <div className="pt-2 border-t border-[#decbb2]/80">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs font-serif font-semibold text-[#c96f4a] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span>{showCustom ? '−' : '+'}</span>
          <span>{showCustom ? 'Hide custom track' : 'Add a custom unreleased track...'}</span>
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
              placeholder="e.g. Acoustic jam session, late night drive, rooftop dessert..."
              className="w-full bg-[#fffdfa] border border-[#c96f4a] rounded-xl p-2.5 text-xs font-serif text-[#2d221c] focus:outline-none focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};