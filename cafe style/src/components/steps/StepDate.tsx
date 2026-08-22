import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, DateOption, TimeSlotOption } from '../../config/appConfig';
import { bistroSound } from '../../utils/soundEffects';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface StepDateProps {
  selectedDay: string;
  selectedTimeSlot: string;
  customTime: string;
  onSelectDate: (day: DateOption) => void;
  onSelectTimeSlot: (slot: TimeSlotOption) => void;
  onChangeCustomTime: (time: string) => void;
  onNext: () => void;
}

export const StepDate: React.FC<StepDateProps> = ({
  selectedDay,
  selectedTimeSlot,
  customTime,
  onSelectDate,
  onSelectTimeSlot,
  onChangeCustomTime,
  onNext,
}) => {
  const isCustom = selectedTimeSlot.toLowerCase().includes('custom');
  const canProceed = Boolean(selectedDay && selectedTimeSlot && (!isCustom || customTime.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Menu Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fffdfa] border border-[#e7dccc] rounded-3xl p-6 shadow-menu w-full mb-6 text-left relative"
      >
        <div className="flex items-center justify-between border-b border-[#e7dccc] pb-3 mb-3 font-mono text-xs text-[#7a6e65]">
          <span>COURSE I · SERVICE & RÉSERVATION</span>
          <span className="font-bold text-[#80182a] font-serif">Table N° 2</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2b231f] mb-1">
          When shall we dine, {APP_CONFIG.girlfriendName}? 🥐
        </h2>
        <p className="text-stone-600 text-sm font-serif italic">
          "Select the preferred evening for our reserved table and service time."
        </p>
      </motion.div>

      {/* 1. Date Selector Grid */}
      <div className="w-full mb-6 text-left">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-700" />
          <span>1. Select Reservation Date</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {APP_CONFIG.dateRange.map((d) => {
            const isSelected = selectedDay === d.fullDate;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => {
                  bistroSound.playKeyClick();
                  onSelectDate(d);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fbebed] border-[#80182a] text-[#80182a] shadow-sm scale-105 ring-2 ring-[#80182a]/20'
                    : 'bg-[#fffdfa] hover:bg-[#f7f2ea] border-[#e7dccc] text-stone-700'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-500">{d.day}</span>
                <span className="text-xl font-serif font-bold text-[#2b231f] my-0.5">{d.dayNum}</span>
                <span className="text-[11px] font-serif italic text-stone-500">{d.date.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Service Time Slots */}
      <div className="w-full mb-6 text-left">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>2. Select Service Window</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {APP_CONFIG.timeSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.name;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  bistroSound.playKeyClick();
                  onSelectTimeSlot(slot);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fbebed] border-[#80182a] shadow-sm ring-2 ring-[#80182a]/20'
                    : 'bg-[#fffdfa] hover:bg-[#f7f2ea] border-[#e7dccc] text-stone-700'
                }`}
              >
                <span className="text-2xl p-2 bg-[#f5ecdf] rounded-xl shrink-0">{slot.icon}</span>
                <div>
                  <div className="font-serif font-bold text-sm md:text-base text-[#2b231f]">{slot.name}</div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">{slot.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom time input */}
        {isCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <input
              type="text"
              value={customTime}
              onChange={(e) => onChangeCustomTime(e.target.value)}
              placeholder="e.g. 07:15 PM Candlelit Table"
              className="w-full px-4 py-3 bg-[#fffdfa] border border-[#d9c7b2] rounded-2xl text-[#2b231f] font-serif font-medium focus:outline-none focus:ring-2 focus:ring-[#80182a]/30 shadow-xs"
            />
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={!canProceed}
        onClick={() => {
          bistroSound.playClink();
          onNext();
        }}
        className={`w-full py-4 rounded-2xl font-serif font-bold text-lg md:text-xl shadow-gold-btn flex items-center justify-center gap-2 transition-all ${
          canProceed
            ? 'bg-[#80182a] hover:bg-[#681322] text-white cursor-pointer hover:scale-[1.01]'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-60'
        }`}
      >
        <span>Reserve Course I</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
