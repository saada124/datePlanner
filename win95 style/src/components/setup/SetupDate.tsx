import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface SetupDateProps {
  selectedDate: string;
  selectedIso: string;
  selectedTime: string;
  customTime: string;
  onUpdate: (data: { dayDate: string; isoDate: string; timeSlot: string; customTime: string }) => void;
  onNext: () => void;
}

export const SetupDate: React.FC<SetupDateProps> = ({
  selectedDate,
  selectedIso,
  selectedTime,
  customTime,
  onUpdate,
  onNext
}) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const [activeIso, setActiveIso] = useState(selectedIso);
  const [activeTime, setActiveTime] = useState(selectedTime);
  const [customTimeVal, setCustomTimeVal] = useState(customTime);

  const timeOptions = APP_CONFIG.timeSlots;
  const customTimeId = APP_CONFIG.customTimeId;

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

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (activeTime !== customTimeId || Boolean(customTimeVal)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="text-xs text-win95-black mb-3">
        <div className="font-bold mb-0.5">Select the date of the scheduled event 📅</div>
        <div className="text-win95-grayDark">Pick a day {APP_CONFIG.dateRangeDescription} and a time slot.</div>
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-4">
        {APP_CONFIG.dateRange.map((item) => {
          const isSelected = activeDate === item.fullDate;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => handleSelectDate(item)}
              className={`win95-btn win95-btn-sm !p-2 flex flex-col items-center cursor-pointer ${
                isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
              }`}
            >
              <span className="text-[9px] opacity-70">{item.day}</span>
              <span className="text-sm leading-tight">{item.date.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="mb-3">
        <div className="text-xs font-bold text-win95-black mb-1.5">What time of day? ⏰</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {timeOptions.map((opt) => {
            const isSelected = activeTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTime(opt.id)}
                className={`win95-btn win95-btn-sm !p-2 flex items-center gap-2 text-left cursor-pointer ${
                  isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span>
                  <span className="block text-[11px] leading-tight">{opt.label}</span>
                  <span className={`block text-[9px] leading-tight ${isSelected ? 'text-win95-white/70' : 'text-win95-grayDark'}`}>
                    {opt.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTime === customTimeId && (
        <div className="mb-3">
          <div className="text-[11px] text-win95-black mb-1">Enter exact time:</div>
          <input
            type="text"
            value={customTimeVal}
            onChange={(e) => handleCustomTimeChange(e.target.value)}
            placeholder="e.g. 19:00"
            className="win95-field w-full"
          />
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button type="button" disabled={!isValid} onClick={handleProceed} className="win95-btn font-bold cursor-pointer">
          Next &gt;
        </button>
      </div>
    </motion.div>
  );
};