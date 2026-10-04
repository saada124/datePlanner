import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, RotateCw } from 'lucide-react';
import { TimeSlotOption } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface TimeSlotRouletteProps {
  selectedSlot: TimeSlotOption | null | undefined;
  onSelectSlot: (slot: TimeSlotOption) => void;
}

export const TimeSlotRoulette: React.FC<TimeSlotRouletteProps> = ({
  selectedSlot,
  onSelectSlot,
}) => {
  const slots = APP_CONFIG.timeSlots;
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSpinTime = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    sounds.playArcadePress();

    let step = 0;
    const totalSteps = 25 + Math.floor(Math.random() * 12);
    let speed = 60;

    const runStep = () => {
      step++;
      setActiveIdx((prev) => (prev + 1) % slots.length);
      sounds.playTick(1.4);

      if (step < totalSteps) {
        if (step > totalSteps - 8) {
          speed += 40; // Decelerate
        }
        setTimeout(runStep, speed);
      } else {
        // Land on winning slot
        const winnerIndex = (activeIdx + 1) % slots.length;
        setActiveIdx(winnerIndex);
        onSelectSlot(slots[winnerIndex]);
        setIsSpinning(false);
        sounds.playWinFanfare();
      }
    };

    setTimeout(runStep, speed);
  };

  const currentSlot = selectedSlot || slots[activeIdx];

  return (
    <div className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-carnival-card/80 border-2 border-carnival-teal/60 shadow-lg text-center space-y-3 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-mono-ticket text-carnival-teal uppercase tracking-widest font-bold">
          <Calendar className="w-4 h-4 text-carnival-teal" />
          <span>DATE &amp; TIME ROULETTE</span>
        </div>
        <button
          type="button"
          onClick={handleSpinTime}
          disabled={isSpinning}
          className="text-xs font-display font-bold text-carnival-gold hover:text-white flex items-center gap-1 bg-carnival-bg/80 px-2.5 py-1 rounded-full border border-carnival-gold/40 transition-all hover:scale-105"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{selectedSlot ? 'Respin Time' : 'Spin Time!'}</span>
        </button>
      </div>

      {/* Selected / Spinning Slot Card */}
      <div className="p-3.5 rounded-xl bg-carnival-bg border border-carnival-border/80 text-center space-y-1">
        <div className="text-2xl">{currentSlot.emoji}</div>
        <div className="text-lg sm:text-xl font-display font-extrabold text-carnival-cream">
          {currentSlot.label}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-carnival-teal/20 text-carnival-teal text-xs font-mono-ticket font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{currentSlot.time}</span>
        </div>
        <p className="text-[11px] text-carnival-creamMuted/80 font-sans italic pt-0.5">
          &ldquo;{currentSlot.tagline}&rdquo;
        </p>
      </div>

      {/* Quick Select Chips */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
        {slots.map((s) => {
          const isCurrent = currentSlot.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                sounds.playPop(true);
                onSelectSlot(s);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-display font-semibold transition-all ${
                isCurrent
                  ? 'bg-carnival-teal text-carnival-bgDark font-bold shadow-md scale-105'
                  : 'bg-carnival-bg/70 text-carnival-creamMuted hover:text-white border border-carnival-border/40'
              }`}
            >
              {s.emoji} {s.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
