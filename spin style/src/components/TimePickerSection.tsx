import React from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import { TimeSlotOption } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface TimePickerSectionProps {
  selectedSlot: TimeSlotOption;
  onSelectSlot: (slot: TimeSlotOption) => void;
}

export const TimePickerSection: React.FC<TimePickerSectionProps> = ({
  selectedSlot,
  onSelectSlot,
}) => {
  const slots = APP_CONFIG.timeSlots;

  return (
    <div className="w-full max-w-2xl mx-auto carnival-card p-5 sm:p-6 space-y-4 my-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-carnival-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-carnival-teal/20 text-carnival-teal">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-carnival-cream">
              When Are We Going? 🗓️
            </h3>
            <p className="text-xs text-carnival-creamMuted">
              Pick our ideal date &amp; time slot below
            </p>
          </div>
        </div>

        {/* Selected badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carnival-teal/20 border border-carnival-teal/50 text-carnival-teal text-xs font-mono-ticket font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{selectedSlot.label} ({selectedSlot.time})</span>
        </div>
      </div>

      {/* Time Slot Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlot.id === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => {
                sounds.playPop(!isSelected);
                onSelectSlot(slot);
              }}
              className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex items-start justify-between gap-2 border-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-carnival-teal/25 to-carnival-teal/10 border-carnival-teal shadow-md scale-[1.02]'
                  : 'bg-carnival-bg/60 border-carnival-border/40 text-carnival-creamMuted hover:border-carnival-teal/50 hover:bg-carnival-bg'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{slot.emoji}</span>
                  <span className="text-sm font-display font-bold text-carnival-cream">
                    {slot.label}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-mono-ticket font-semibold text-carnival-gold">
                  <Clock className="w-3 h-3" />
                  <span>{slot.time}</span>
                </div>
                <p className="text-[11px] text-carnival-creamMuted/70 font-sans italic line-clamp-1">
                  {slot.tagline}
                </p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-carnival-teal text-carnival-bgDark flex items-center justify-center shrink-0 mt-0.5 animate-bounce-short">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
