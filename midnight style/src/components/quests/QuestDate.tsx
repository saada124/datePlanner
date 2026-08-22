import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, formatTimeSlot } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface QuestDateProps {
  selectedDate: string;
  selectedIso: string;
  selectedTime: string;
  customTime: string;
  onUpdate: (data: { dayDate?: string; isoDate?: string; timeSlot?: string; customTime?: string }) => void;
  onNext: () => void;
}

const TIME_SLOTS = APP_CONFIG.timeSlots;

export const QuestDate: React.FC<QuestDateProps> = ({
  selectedIso,
  selectedTime,
  customTime,
  onUpdate,
  onNext
}) => {
  const handleDateSelect = (item: typeof APP_CONFIG.dateRange[0]) => {
    sound.playCrystalChime();
    onUpdate({ dayDate: item.fullDate, isoDate: item.iso });
  };

  const handleTimeSelect = (slot: (typeof TIME_SLOTS)[0]) => {
    sound.playCrystalChime();
    onUpdate({ timeSlot: formatTimeSlot(slot) });
  };

  return (
    <div className="max-w-xl mx-auto w-full px-3 select-none">
      <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl relative overflow-hidden mb-6">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-midnight-neonPink uppercase font-display">
            STAGE 1 • CHOOSE THE DAY
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            When shall we meet under the stars? 🌌
          </h2>
          <p className="font-sans text-xs sm:text-sm text-midnight-textMuted mt-1">
            Pick our special day ({APP_CONFIG.dateRange[0].date} – {APP_CONFIG.dateRange[APP_CONFIG.dateRange.length - 1].date}, {APP_CONFIG.dateRange[0].iso.slice(0, 4)})
          </p>
        </div>

        {/* Constellation Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {APP_CONFIG.dateRange.map((item) => {
            const isSelected = selectedIso === item.iso;
            return (
              <motion.button
                key={item.iso}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleDateSelect(item)}
                className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-tr from-midnight-neonPink/30 to-midnight-purple/40 border-2 border-midnight-neonPink shadow-neon-pink text-white font-bold'
                    : 'bg-white/5 border border-white/10 hover:border-midnight-purple/50 text-midnight-text'
                }`}
              >
                <div className="text-[11px] font-display uppercase tracking-wider text-midnight-lavender">
                  {item.day}
                </div>
                <div className="text-base sm:text-lg font-bold font-display mt-0.5">
                  {item.date}
                </div>
                {isSelected && (
                  <div className="text-[10px] text-midnight-starlight mt-1 flex items-center justify-center gap-1 font-semibold">
                    <span>✦</span>
                    <span>ALIGNED</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Time of Meeting Selection */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="text-xs font-semibold text-midnight-lavender uppercase tracking-wider mb-3 text-center">
            CHOOSE THE HOUR ✨
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
            {TIME_SLOTS.map((slot) => {
              const fullText = formatTimeSlot(slot);
              const isSelected = selectedTime === fullText;
              return (
                <motion.button
                  key={slot.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTimeSelect(slot)}
                  className={`p-3 rounded-xl flex items-center sm:flex-col justify-center gap-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-midnight-purple/30 border-2 border-midnight-purple shadow-neon-purple text-white font-semibold'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 text-midnight-text'
                  }`}
                >
                  <span className="text-xl">{slot.icon}</span>
                  <div>
                    <div className="text-xs font-display">{slot.label}</div>
                    <div className="text-[11px] text-midnight-textMuted">{slot.time}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Custom Time Input */}
          <div className="relative mt-3">
            <input
              type="text"
              value={customTime}
              onChange={(e) => onUpdate({ customTime: e.target.value })}
              placeholder="Or type another time (e.g. 7:15 PM)..."
              className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-midnight-textMuted focus:outline-none focus:border-midnight-neonPink transition-all"
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playCelestialChime();
            onNext();
          }}
          className="cosmic-btn-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-neon-pink"
        >
          <span>Next: Pick Activities</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  );
};
