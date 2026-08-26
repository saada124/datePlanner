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
      sound.playButtonClunk();
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
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="font-handwriting text-base sm:text-lg text-[#6d5a4e]">
          The Sweet Spot — How should we greet each other? 💫
        </p>
        <span className="text-[10px] font-mono text-[#8a7568]">BONUS TRACK</span>
      </div>

      {/* Greeting Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {GREETINGS.map((g) => {
          const isSelected = greetings.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleGreeting(g.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer relative min-h-[75px] ${
                isSelected
                  ? 'bg-[#fffdfa] border-[#c96f4a] shadow-sm ring-2 ring-[#c96f4a]/30'
                  : 'bg-[#f7f1e5]/80 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
              }`}
            >
              <div className="text-xl mb-0.5">{g.icon}</div>
              <div className="font-serif text-xs font-bold text-[#2d221c] leading-tight">
                {g.label}
              </div>
              <div className={`micro-led absolute top-1.5 right-1.5 ${isSelected ? 'active-green' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Handwritten Liner Note Section */}
      <div className="pt-3 border-t border-[#decbb2]/80">
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-serif text-xs font-bold text-[#2d221c] flex items-center gap-1.5">
            <span>✍️</span>
            <span>Side A Liner Note / Secret Message (Optional)</span>
          </label>
          <span className="text-[9px] font-mono text-[#8a7568]">HANDWRITTEN INK</span>
        </div>

        <div className="relative">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={2}
            placeholder="Write a sweet whisper, special song request, or note for the tape insert..."
            className="w-full bg-[#fffdfa] border border-[#decbb2] rounded-xl p-3 font-handwriting text-lg text-[#2d221c] focus:outline-none focus:border-[#c96f4a] focus:ring-2 focus:ring-[#c96f4a]/30 resize-none shadow-inner leading-relaxed"
          />
        </div>
      </div>
    </motion.div>
  );
};