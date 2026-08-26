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
  const [activeTime, setActiveTime] = useState(selectedTime || APP_CONFIG.timeSlots[1]?.id || '');
  const [customTimeVal, setCustomTimeVal] = useState(customTime);

  const timeOptions = APP_CONFIG.timeSlots;
  const customTimeId = APP_CONFIG.customTimeId;

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (activeTime !== customTimeId || Boolean(customTimeVal.trim())));

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
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="font-handwriting text-base sm:text-lg text-[#6d5a4e]">
          Pick the day & setting for our track 📅
        </p>
        <span className="text-[10px] font-mono uppercase bg-[#ebdcc7] text-[#5c4738] px-2 py-0.5 rounded border border-[#decbb2]">
          {APP_CONFIG.dateRangeShortText}
        </span>
      </div>

      {/* Perforated Calendar Punch Cards Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {APP_CONFIG.dateRange.map((item) => {
          const isSelected = activeDate === item.fullDate;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => handleSelectDate(item)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-[#fffdfa] border-[#c96f4a] text-[#c96f4a] shadow-md ring-2 ring-[#c96f4a]/40 scale-105 z-10'
                  : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/60 text-[#4a3b32]'
              }`}
            >
              {/* Micro LED on top corner */}
              <div className="absolute top-1.5 right-1.5">
                <div className={`micro-led ${isSelected ? 'active-amber' : ''}`} />
              </div>

              <span className="text-[9px] uppercase font-mono font-bold tracking-wider opacity-70">
                {item.day}
              </span>
              <span className="font-serif text-base font-bold my-0.5">
                {item.date.split(' ')[1]}
              </span>
              <span className="text-[9px] font-mono opacity-80">
                {isSelected ? '● PICKED' : 'AUG'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time Selector — Vintage Tuning Dial Style */}
      <div className="border-t border-[#decbb2]/80 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-sm font-bold text-[#2d221c]">
            Select Broadcast Frequency / Time Slot
          </h3>
          <span className="text-[9px] font-mono text-[#8a7568]">FREQ · STEREO</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {timeOptions.map((opt) => {
            const isSelected = activeTime === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTime(opt.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#fffdfa] border-[#c96f4a] text-[#2d221c] font-medium shadow-sm ring-1 ring-[#c96f4a]/40'
                    : 'bg-[#f7f1e5]/70 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
                }`}
              >
                <span className="text-xl shrink-0">{opt.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold font-serif truncate">{opt.label}</div>
                  <div className="text-[10px] text-[#8a7568] truncate font-sans">{opt.desc}</div>
                </div>
                <div className={`micro-led shrink-0 ${isSelected ? 'active-green' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Custom Time Input */}
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
              placeholder="e.g. 7:30 PM, right after dusk sets in..."
              className="w-full bg-[#fffdfa] border border-[#c96f4a] rounded-xl p-2.5 text-xs font-serif text-[#2d221c] focus:outline-none focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};