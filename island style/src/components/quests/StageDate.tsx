import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, DateOption, TimeSlotOption } from '../../config/appConfig';
import { islandSound } from '../../utils/soundEffects';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface StageDateProps {
  selectedDay: string;
  selectedTimeSlot: string;
  customTime: string;
  onSelectDate: (day: DateOption) => void;
  onSelectTimeSlot: (slot: TimeSlotOption) => void;
  onChangeCustomTime: (time: string) => void;
  onNext: () => void;
}

export const StageDate: React.FC<StageDateProps> = ({
  selectedDay,
  selectedTimeSlot,
  customTime,
  onSelectDate,
  onSelectTimeSlot,
  onChangeCustomTime,
  onNext,
}) => {
  const isCustomTimeSelected = selectedTimeSlot.toLowerCase().includes('custom');
  const canProceed = Boolean(selectedDay && selectedTimeSlot && (!isCustomTimeSelected || customTime.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Dialogue Box Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#fffdf0] border-4 border-emerald-400 rounded-3xl p-5 shadow-bubble w-full mb-6"
      >
        <div className="absolute -top-4 left-6 bg-emerald-500 text-white font-black text-xs px-3.5 py-1 rounded-full border-2 border-emerald-600 shadow-sm flex items-center gap-1">
          <span>🦤</span>
          <span>Orville @ Dodo Flight Desk</span>
        </div>
        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed">
          "Welcome to Dodo Airlines! When would you and {APP_CONFIG.boyfriendName} like to take off for your private getaway?" 🛫
        </p>
      </motion.div>

      {/* 1. Date Selector Cards */}
      <div className="w-full mb-6">
        <h3 className="flex items-center gap-2 text-stone-800 font-black text-base md:text-lg mb-3">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span>1. Choose Our Flight Date</span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {APP_CONFIG.dateRange.map((d) => {
            const isSelected = selectedDay === d.fullDate;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => {
                  islandSound.playPop();
                  onSelectDate(d);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-200 border-amber-500 text-stone-900 shadow-nook scale-105 ring-4 ring-amber-100'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-stone-700 hover:border-emerald-400 shadow-sm'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{d.day}</span>
                <span className="text-xl font-black text-emerald-900 my-0.5">{d.dayNum}</span>
                <span className="text-[11px] font-medium text-stone-500">{d.date.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Boarding Time Selector */}
      <div className="w-full mb-6">
        <h3 className="flex items-center gap-2 text-stone-800 font-black text-base md:text-lg mb-3">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>2. Select Boarding Time</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {APP_CONFIG.timeSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.name;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  islandSound.playPop();
                  onSelectTimeSlot(slot);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-3 ring-amber-200'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-stone-700 hover:border-emerald-400 shadow-sm'
                }`}
              >
                <span className="text-2xl p-2 bg-emerald-100/70 rounded-xl">{slot.icon}</span>
                <div>
                  <div className="font-black text-sm md:text-base text-stone-800">{slot.name}</div>
                  <div className="text-xs text-stone-500 font-medium">{slot.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom time input if needed */}
        {isCustomTimeSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
          >
            <input
              type="text"
              value={customTime}
              onChange={(e) => onChangeCustomTime(e.target.value)}
              placeholder="e.g. 05:45 PM for sunset flight"
              className="w-full px-4 py-3 bg-white border-2 border-amber-400 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 shadow-sm"
            />
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={!canProceed}
        onClick={() => {
          islandSound.playSuccess();
          onNext();
        }}
        className={`w-full py-4 rounded-3xl font-black text-lg md:text-xl shadow-nook flex items-center justify-center gap-2 border-b-4 transition-all ${
          canProceed
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 btn-nook-bounce cursor-pointer'
            : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-60'
        }`}
      >
        <span>Confirm Flight Schedule</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
