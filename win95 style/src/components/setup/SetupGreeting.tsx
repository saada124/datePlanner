import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface SetupGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onUpdate: (data: { greetings: string[]; customNotes: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SetupGreeting: React.FC<SetupGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onUpdate,
  onNext,
  onPrev
}) => {
  const [greetings, setGreetings] = useState<string[]>(selectedGreetings);
  const [notes, setNotes] = useState<string>(customNotes);

  const GREETINGS = APP_CONFIG.greetings;

  const toggleGreeting = (id: string) => {
    let next: string[];
    if (greetings.includes(id)) {
      sound.playPageTurn();
      next = greetings.filter(g => g !== id);
    } else {
      sound.playChime();
      next = [...greetings, id];
    }
    setGreetings(next);
    onUpdate({ greetings: next, customNotes: notes });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onUpdate({ greetings, customNotes: val });
  };

  const handleProceed = () => {
    sound.playChapterComplete();
    onNext();
  };

  const isValid = greetings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="text-xs text-win95-black mb-3">
        <div className="font-bold mb-0.5">Configure greeting protocols ❤️</div>
        <div className="text-win95-grayDark">How should the date.exe greet you upon launch?</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {GREETINGS.map((item) => {
          const isSelected = greetings.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleGreeting(item.id)}
              className={`win95-btn win95-btn-sm !p-2 flex flex-col items-center gap-1 text-center cursor-pointer min-h-[74px] ${
                isSelected ? 'bg-win95-navy text-win95-white font-bold' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="win95-checkbox">{isSelected ? '✓' : ''}</span>
                <span className="text-base leading-none">{item.icon}</span>
              </span>
              <span className="text-[11px] leading-tight">{item.label}</span>
              <span className={`text-[9px] leading-tight ${isSelected ? 'text-win95-white/70' : 'text-win95-grayDark'}`}>
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3">
        <div className="text-[11px] text-win95-black mb-1">
          💌 Leave a handwritten note for {APP_CONFIG.boyfriendName} (optional):
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="e.g. Don't forget the jacket, my love ❤️"
          className="win95-field w-full resize-none"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onPrev} className="win95-btn cursor-pointer">
          &lt; Back
        </button>
        <button type="button" disabled={!isValid} onClick={handleProceed} className="win95-btn font-bold cursor-pointer">
          Finish &gt;
        </button>
      </div>
    </motion.div>
  );
};