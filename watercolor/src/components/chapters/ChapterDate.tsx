import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface ChapterDateProps {
  selectedDate: string;
  selectedIso: string;
  selectedTime: string;
  customTime: string;
  onUpdate: (data: { dayDate: string; isoDate: string; timeSlot: string; customTime: string }) => void;
  onNext: () => void;
}

export const ChapterDate: React.FC<ChapterDateProps> = ({
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
    onUpdate({
      dayDate: item.fullDate,
      isoDate: item.iso,
      timeSlot: activeTime,
      customTime: customTimeVal
    });
  };

  const handleSelectTime = (timeId: string) => {
    sound.playChime();
    setActiveTime(timeId);
    onUpdate({
      dayDate: activeDate,
      isoDate: activeIso,
      timeSlot: timeId,
      customTime: customTimeVal
    });
  };

  const handleCustomTimeChange = (val: string) => {
    setCustomTimeVal(val);
    onUpdate({
      dayDate: activeDate,
      isoDate: activeIso,
      timeSlot: customTimeId,
      customTime: val
    });
  };

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (activeTime !== customTimeId || Boolean(customTimeVal)));

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
            CHAPTER I
          </span>
          <h2 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-1">
            When are you free? 📅
          </h2>
          <p className="font-handwriting text-base text-storybook-inkLight mt-1">
            Choose any day {APP_CONFIG.dateRangeDescription}
          </p>
        </div>

        {/* 7-Day Illustrated Calendar Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          {APP_CONFIG.dateRange.map((item) => {
            const isSelected = activeDate === item.fullDate;
            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => handleSelectDate(item)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-storybook-blush border-storybook-rose text-storybook-roseDark shadow-md scale-105 ring-2 ring-storybook-rose/30'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/50 text-storybook-ink'
                }`}
              >
                <span className="text-[10px] uppercase font-sans font-semibold opacity-60">
                  {item.day}
                </span>
                <span className="font-serif text-base font-bold my-0.5">
                  {item.date.split(' ')[1]}
                </span>
                <span className="text-xs">
                  {isSelected ? '🌸' : '🌿'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time of Day Section */}
        <div className="border-t border-storybook-border pt-5">
          <h3 className="font-serif text-sm text-storybook-ink mb-3 text-center sm:text-left">
            What time of day feels most romantic?
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = activeTime === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectTime(opt.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-storybook-sageLight/70 border-storybook-sage text-storybook-ink font-medium shadow-sm'
                      : 'bg-white border-storybook-border hover:border-storybook-sage/50 text-storybook-ink'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-storybook-inkLight">{opt.desc}</div>
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
                placeholder="e.g. 7:00 PM for sunset walk"
                className="w-full bg-white border border-storybook-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-storybook-rose"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Next Chapter Button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`story-btn-primary px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>Chapter II ➔</span>
        </button>
      </div>
    </motion.div>
  );
};
