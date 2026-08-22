import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface TrackDateProps {
  selectedDate: string;
  selectedIso: string;
  selectedTime: string;
  customTime: string;
  onUpdate: (data: { dayDate: string; isoDate: string; timeSlot: string; customTime: string }) => void;
  onValidityChange: (valid: boolean) => void;
}

export const TrackDate: React.FC<TrackDateProps> = ({
  selectedDate,
  selectedIso,
  selectedTime,
  customTime,
  onUpdate,
  onValidityChange
}) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const [activeIso, setActiveIso] = useState(selectedIso);
  const [activeTime, setActiveTime] = useState(selectedTime);
  const [customTimeVal, setCustomTimeVal] = useState(customTime);

  const timeOptions = APP_CONFIG.timeSlots;
  const customTimeId = APP_CONFIG.customTimeId;

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (activeTime !== customTimeId || Boolean(customTimeVal)));

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const handleSelectDate = (item: typeof APP_CONFIG.dateRange[0]) => {
    sound.playChime();
    setActiveDate(item.fullDate);
    setActiveIso(item.iso);
    onUpdate({ dayDate: item.fullDate, isoDate: item.iso, timeSlot: activeTime, customTime: customTimeVal });
  };

  const handleSelectTime = (timeId: string) => {
    sound.playChime();
    setActiveTime(timeId);
    onUpdate({ dayDate: activeDate, isoDate: activeIso, timeSlot: timeId, customTime: customTimeVal });
  };

  const handleCustomTimeChange = (val: string) => {
    setCustomTimeVal(val);
    onUpdate({ dayDate: activeDate, isoDate: activeIso, timeSlot: customTimeId, customTime: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-handwriting text-base sm:text-lg text-mixtape-coffeeLight mb-3">
        Pick the day {APP_CONFIG.dateRangeDescription} & the time of day 📅
      </p>

      {/* Day grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
        {APP_CONFIG.dateRange.map((item) => {
          const isSelected = activeDate === item.fullDate;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => handleSelectDate(item)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-mixtape-blush border-mixtape-rose text-mixtape-roseDark shadow-md ring-2 ring-mixtape-rose/30'
                  : 'bg-white border-mixtape-border hover:border-mixtape-rose/50 text-mixtape-coffee'
              }`}
            >
              <span className="text-[10px] uppercase font-sans font-semibold opacity-60">
                {item.day}
              </span>
              <span className="font-serif text-sm font-bold my-0.5">
                {item.date.split(' ')[1]}
              </span>
              <span className="text-xs">
                {isSelected ? '🎧' : '♪'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time of day */}
      <div className="border-t border-mixtape-border/70 pt-4">
        <h3 className="font-serif text-sm text-mixtape-coffee mb-3 text-center sm:text-left">
          Which set feels most romantic?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {timeOptions.map((opt) => {
            const isSelected = activeTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTime(opt.id)}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-mixtape-blush border-mixtape-terracotta text-mixtape-coffee font-medium shadow-sm'
                    : 'bg-white border-mixtape-border hover:border-mixtape-terracotta/50 text-mixtape-coffee'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-mixtape-coffeeLight">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {activeTime === customTimeId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <input
              type="text"
              value={customTimeVal}
              onChange={(e) => handleCustomTimeChange(e.target.value)}
              placeholder="e.g. 7:00 PM, under the last light of sunset"
              className="w-full bg-white border border-mixtape-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-mixtape-terracotta"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};