import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { DateOption, TimeSlotOption } from '../types';
import { menuSound } from '../utils/soundEffects';
import { Calendar, Clock, MessageSquareQuote } from 'lucide-react';

interface DessertCourseProps {
  selectedDayDate: string;
  selectedTimeSlotId: string;
  customTime: string;
  cravingsNotes: string;
  onSelectDate: (d: DateOption) => void;
  onSelectTimeSlot: (t: TimeSlotOption) => void;
  onChangeCustomTime: (val: string) => void;
  onChangeCravingsNotes: (val: string) => void;
}

export const DessertCourse: React.FC<DessertCourseProps> = ({
  selectedDayDate,
  selectedTimeSlotId,
  customTime,
  cravingsNotes,
  onSelectDate,
  onSelectTimeSlot,
  onChangeCustomTime,
  onChangeCravingsNotes
}) => {
  return (
    <section id="course-4" aria-labelledby="dessert-heading" className="paper-menu-card rounded-3xl p-6 sm:p-8 mb-10 text-left transition-all">
      {/* Course Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-mono text-xs font-bold flex items-center justify-center">
            IV
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E8635A]">
            DESSERT · When & Timing
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#F4A45C]" />
          <span>Select reservation</span>
        </div>
      </div>

      <h2 id="dessert-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
        When is our table ready?
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
        Choose the date and service hour that suits your schedule best.
      </p>

      {/* 1. Date Selection Pills */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#E8635A]" />
          <span>Pick Our Date</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {APP_CONFIG.dateRange.map((item) => {
            const isSelected = selectedDayDate === item.fullDate;

            return (
              <motion.button
                key={item.iso}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    navigator.vibrate?.(10);
                  }
                  menuSound.playStampClick();
                  onSelectDate(item);
                }}
                className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[64px] ${
                  isSelected
                    ? 'bg-[#E8635A] text-white border-[#E8635A] shadow-coral-glow'
                    : 'bg-[var(--bg-chip)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[#E8635A] hover:bg-[var(--bg-chip-hover)]'
                }`}
              >
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider opacity-80">
                  {item.day}
                </span>
                <span className="font-serif font-bold text-lg leading-tight">
                  {item.date}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Service Hour / Time Slot */}
      <div className="mb-6">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#E8635A]" />
          <span>Service Hour</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {APP_CONFIG.timeSlots.map((slot) => {
            const isSelected = selectedTimeSlotId === slot.id;

            return (
              <motion.button
                key={slot.id}
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    navigator.vibrate?.(10);
                  }
                  menuSound.playStampClick();
                  onSelectTimeSlot(slot);
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--bg-highlight)] border-2 border-[#E8635A] text-[var(--text-primary)] shadow-xs'
                    : 'bg-[var(--bg-chip)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#E8635A]'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{slot.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs sm:text-sm">{slot.title}</span>
                    <span className="font-mono text-[10px] font-bold text-[#E8635A]">{slot.timeRange}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                    {slot.vibe}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Hour Input */}
        {selectedTimeSlotId === 'custom_time' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2.5 p-3.5 bg-[var(--bg-highlight)] border border-[#E8635A] rounded-2xl"
          >
            <input
              type="text"
              value={customTime}
              onChange={(e) => onChangeCustomTime(e.target.value)}
              placeholder="e.g. 07:15 PM sharp or After sunset..."
              className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8635A]"
            />
          </motion.div>
        )}
      </div>

      {/* 3. Special Cravings & Notes to the Chef */}
      <div>
        <label htmlFor="cravings-textarea" className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5 text-[#E8635A]" />
          <span>Special Cravings & Note to {APP_CONFIG.boyfriendName} (Optional)</span>
        </label>
        <textarea
          id="cravings-textarea"
          rows={3}
          value={cravingsNotes}
          onChange={(e) => onChangeCravingsNotes(e.target.value)}
          placeholder="Any dessert cravings, food allergies, or sweet thoughts for the date?"
          className="w-full p-3.5 bg-[var(--bg-chip)] border border-[var(--border-card)] rounded-2xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8635A] resize-none"
        />
      </div>
    </section>
  );
};
