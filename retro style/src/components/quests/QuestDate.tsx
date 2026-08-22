import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, isCustomTime } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';
import { PixelAvatars } from '../PixelAvatars';

interface QuestDateProps {
  selectedDate: string;
  selectedIso: string;
  selectedTime: string;
  customTime: string;
  onUpdate: (data: { dayDate: string; isoDate: string; timeSlot: string; customTime: string }) => void;
  onNext: () => void;
  onStatPopup: (text: string) => void;
}

export const QuestDate: React.FC<QuestDateProps> = ({
  selectedDate,
  selectedIso,
  selectedTime,
  customTime,
  onUpdate,
  onNext,
  onStatPopup
}) => {
  const [activeDate, setActiveDate] = useState(selectedDate);
  const [activeIso, setActiveIso] = useState(selectedIso);
  const [activeTime, setActiveTime] = useState(selectedTime);
  const [customTimeVal, setCustomTimeVal] = useState(customTime);

  const timeOptions = APP_CONFIG.timeSlots;

  const handleSelectDate = (item: typeof APP_CONFIG.dateRange[0]) => {
    sound.playSelect();
    setActiveDate(item.fullDate);
    setActiveIso(item.iso);
    onUpdate({
      dayDate: item.fullDate,
      isoDate: item.iso,
      timeSlot: activeTime,
      customTime: customTimeVal
    });
    onStatPopup(`DATE LOCKED: ${item.day} ${item.date} 📅`);
  };

  const handleSelectTime = (timeId: string) => {
    sound.playSelect();
    setActiveTime(timeId);
    onUpdate({
      dayDate: activeDate,
      isoDate: activeIso,
      timeSlot: timeId,
      customTime: customTimeVal
    });
    onStatPopup(`TIME EQUIPPED: ${timeId} ⏰`);
  };

  const handleCustomTimeChange = (val: string) => {
    setCustomTimeVal(val);
    onUpdate({
      dayDate: activeDate,
      isoDate: activeIso,
      timeSlot: APP_CONFIG.timeSlots.find((t) => t.isCustom)?.id ?? 'Custom ⏰',
      customTime: val
    });
  };

  const handleProceed = () => {
    sound.playLevelUp();
    onNext();
  };

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (!isCustomTime(activeTime) || Boolean(customTimeVal)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-24"
    >
      <div className="pixel-box-pink p-4 sm:p-6 mb-4 shadow-pixel-lg">
        {/* Avatars */}
        <PixelAvatars
          mood={activeDate ? 'happy' : 'idle'}
          speechText={
            activeDate
              ? `Good choice! ${activeDate.split(',')[0]} is going to be amazing! 😌❤️`
              : "Wakteh najmo nokhrjou? Akhtarelna nhar! 📅✨"
          }
          showSpeech={true}
        />

        {/* Section 1: Pixel Calendar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-xs sm:text-sm text-retro-dark text-pixel-shadow">
              📅 Quest #1: Akhtarelna nhar
            </h2>
            <span className="font-pixel text-[9px] text-retro-purple">
              {APP_CONFIG.dateRange[0].date} – {APP_CONFIG.dateRange[APP_CONFIG.dateRange.length - 1].date}
            </span>
          </div>

          {/* 7-Day Pixel Calendar Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2 mb-4">
            {APP_CONFIG.dateRange.map((item) => {
              const isSelected = activeDate === item.fullDate;
              return (
                <button
                  key={item.iso}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => handleSelectDate(item)}
                  className={`p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'pixel-box pixel-box-selected scale-105'
                      : 'pixel-box bg-[#fffdf0] text-retro-dark hover:bg-retro-pinkLight/50'
                  }`}
                >
                  <span className="font-pixel text-[8px] sm:text-[9px] font-bold">
                    {item.day}
                  </span>
                  <span className="font-pixel text-xs sm:text-sm font-bold my-0.5">
                    {item.dayNum}
                  </span>
                  <span className="text-[10px]">
                    {isSelected ? '💖' : '🌸'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Time Slot Picker */}
        <div className="mt-5 border-t-2 border-retro-purple/20 pt-4">
          <h3 className="font-pixel text-xs text-retro-dark mb-2">
            ⏰ Ahsen wakt? (nheb ntawlo le max 😚)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeOptions.map((opt) => {
              const isSelected = activeTime === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => handleSelectTime(opt.id)}
                  className={`p-2 text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'pixel-box pixel-time-selected'
                      : 'pixel-box bg-[#fffdf0] text-retro-dark hover:bg-white'
                  }`}
                >
                  <span className="text-base sm:text-lg">{opt.icon}</span>
                  <div>
                    <div className="font-pixel text-[9px] sm:text-[10px] font-bold">{opt.label}</div>
                    <div className="font-pixelify text-xs font-semibold">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Time Input */}
          {isCustomTime(activeTime) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <label className="block font-pixel text-[9px] text-retro-dark mb-1">
                Enter your preferred time:
              </label>
              <input
                type="text"
                value={customTimeVal}
                onChange={(e) => handleCustomTimeChange(e.target.value)}
                placeholder="e.g. 7:30 PM after work / sunset"
                className="w-full pixel-box bg-white p-2 text-xs font-pixelify text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-pink"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`pixel-btn ${
            isValid
              ? 'pixel-btn-primary shadow-pixel-glow animate-pulse-fast'
              : 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700'
          }`}
        >
          <span>Next Quest ⚔️</span>
        </button>
      </div>
    </motion.div>
  );
};
