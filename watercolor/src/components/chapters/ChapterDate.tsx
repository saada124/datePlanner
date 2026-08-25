import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { watercolorAudio } from '../../utils/watercolorAudio';

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

  const handleSelectDate = (item: typeof APP_CONFIG.dateRange[0], e: React.MouseEvent) => {
    watercolorAudio.playWaterDrip(1.1);
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color: 'rgba(232, 93, 117, 0.4)' }
      })
    );

    setActiveDate(item.fullDate);
    setActiveIso(item.iso);
    onUpdate({
      dayDate: item.fullDate,
      isoDate: item.iso,
      timeSlot: activeTime,
      customTime: customTimeVal
    });
  };

  const handleSelectTime = (timeId: string, e: React.MouseEvent) => {
    watercolorAudio.playColorChord(2);
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color: 'rgba(58, 134, 255, 0.4)' }
      })
    );

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
    watercolorAudio.playChapterComplete();
    onNext();
  };

  const isValid = Boolean(activeDate) && (Boolean(activeTime) && (activeTime !== customTimeId || Boolean(customTimeVal)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-16 select-none"
    >
      <div className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg mb-6 relative border border-storybook-border">
        <div className="washi-tape -top-2 left-6 w-24" />

        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-storybook-roseDark uppercase font-sans flex items-center justify-center gap-1.5">
            <span>🎨</span>
            <span>CHAPTER I</span>
            <span>🎨</span>
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
              <motion.button
                key={item.iso}
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleSelectDate(item, e)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'color-dip-card-active scale-105'
                    : 'bg-white border-storybook-border hover:border-storybook-rose/50 text-storybook-ink shadow-2xs'
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
              </motion.button>
            );
          })}
        </div>

        {/* Time of Day Section */}
        <div className="border-t border-storybook-border/60 pt-5">
          <h3 className="font-serif text-sm text-storybook-ink mb-3 text-center sm:text-left flex items-center gap-2">
            <span>⏰</span>
            <span>What hour feels most magical?</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = activeTime === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => handleSelectTime(opt.id, e)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'color-dip-card-active'
                      : 'bg-white border-storybook-border hover:border-storybook-sage/60 text-storybook-ink shadow-2xs'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-storybook-inkLight">{opt.desc}</div>
                  </div>
                </motion.button>
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
                placeholder="e.g. 7:00 PM for golden sunset walk"
                className="w-full bg-white border border-storybook-border rounded-xl p-3 text-xs focus:outline-none focus:border-storybook-rose shadow-inner"
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
          className={`story-btn-primary px-7 py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer ${
            !isValid ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <span>Chapter II: The Adventures ➔</span>
        </button>
      </div>
    </motion.div>
  );
};
