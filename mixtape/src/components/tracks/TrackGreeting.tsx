import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface TrackGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onUpdate: (data: { greetings: string[]; customNotes: string }) => void;
  onValidityChange: (valid: boolean) => void;
}

const GREETINGS = APP_CONFIG.greetings;

export const TrackGreeting: React.FC<TrackGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onUpdate,
  onValidityChange
}) => {
  const [greetings, setGreetings] = useState<string[]>(selectedGreetings);
  const [notes, setNotes] = useState<string>(customNotes);

  const isValid = greetings.length > 0;

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-handwriting text-base sm:text-lg text-mixtape-coffeeLight mb-3">
        Pick the moment that says hello 💫
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GREETINGS.map((g) => {
          const isSelected = greetings.includes(g.id);
          return (
            <motion.button
              key={g.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleGreeting(g.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center min-h-[88px] text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-mixtape-blush border-mixtape-rose shadow-md ring-2 ring-mixtape-rose/30'
                  : 'bg-white border-mixtape-border hover:border-mixtape-rose/40'
              }`}
            >
              <div className="text-2xl mb-1.5">{g.icon}</div>
              <div className="font-serif text-xs font-semibold text-mixtape-coffee leading-snug">
                {g.label}
              </div>
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 text-xs text-mixtape-rose">♥</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-mixtape-border/70 pt-3">
        <label className="block text-xs font-serif text-mixtape-coffeeLight mb-2">
          A little note to drop on the J-card (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={2}
          placeholder="e.g. Don't be late, my heart starts early..."
          className="w-full bg-white border border-mixtape-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-mixtape-terracotta resize-none"
        />
      </div>
    </motion.div>
  );
};