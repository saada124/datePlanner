import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface QuestGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onUpdate: (data: { greetings?: string[]; customNotes?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const GREETINGS = APP_CONFIG.greetings;

export const QuestGreeting: React.FC<QuestGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onUpdate,
  onNext,
  onPrev
}) => {
  const toggleGreeting = (name: string) => {
    sound.playCrystalChime();
    const exists = selectedGreetings.includes(name);
    if (exists) {
      onUpdate({ greetings: selectedGreetings.filter(g => g !== name) });
    } else {
      onUpdate({ greetings: [...selectedGreetings, name] });
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full px-3 select-none">
      <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl relative overflow-hidden mb-6">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-midnight-neonPink uppercase font-display">
            STAGE 5 • WARM GREETING & NOTE
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            How do we greet each other? 🤗✨
          </h2>
          <p className="font-sans text-xs sm:text-sm text-midnight-textMuted mt-1">
            Choose how we break orbit the second we see each other!
          </p>
        </div>

        {/* Greeting Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {GREETINGS.map((g) => {
            const isSelected = selectedGreetings.includes(g.name);
            return (
              <motion.button
                key={g.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleGreeting(g.name)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-tr from-midnight-neonPink/25 to-midnight-purple/35 border-2 border-midnight-neonPink shadow-neon-pink text-white'
                    : 'bg-white/5 border border-white/10 hover:border-white/20 text-midnight-text'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{g.icon}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-midnight-neonPink text-white'
                        : 'bg-white/10 text-midnight-textMuted'
                    }`}>
                      {isSelected ? 'SELECTED ✓' : '+ ADD'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">{g.name}</h3>
                  <p className="text-xs text-midnight-textMuted mt-1">{g.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Handshake Easter Egg */}
        <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between opacity-60">
          <div className="flex items-center gap-2.5 text-xs text-midnight-textMuted">
            <span>🤝</span>
            <span>Formal Business Handshake</span>
          </div>
          <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono">
            ACCESS DENIED 🚫
          </span>
        </div>

        {/* Starlight Note */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-xs font-semibold text-midnight-lavender uppercase tracking-wider mb-2">
            💌 LEAVE A STARLIGHT NOTE FOR {APP_CONFIG.boyfriendName.toUpperCase()} (OPTIONAL):
          </label>
          <textarea
            rows={3}
            value={customNotes}
            onChange={(e) => onUpdate({ customNotes: e.target.value })}
            placeholder="Write any sweet message, cute request, or secret note for me... 🌸"
            className="w-full bg-black/30 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-midnight-textMuted focus:outline-none focus:border-midnight-neonPink transition-all resize-none"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playCrystalChime();
            onPrev();
          }}
          className="cosmic-btn-secondary px-6 py-3 text-xs font-semibold cursor-pointer"
        >
          ← Back
        </button>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playCelestialChime();
            onNext();
          }}
          className="cosmic-btn-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-neon-pink"
        >
          <span>Review Celestial Pass</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  );
};
