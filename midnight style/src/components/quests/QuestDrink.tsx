import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';

interface QuestDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onUpdate: (data: { drink?: string; customDrink?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DRINKS = APP_CONFIG.drinks;

export const QuestDrink: React.FC<QuestDrinkProps> = ({
  selectedDrink,
  customDrink,
  onUpdate,
  onNext,
  onPrev
}) => {
  const handleSelect = (name: string) => {
    sound.playCrystalChime();
    onUpdate({ drink: name });
  };

  return (
    <div className="max-w-xl mx-auto w-full px-3 select-none">
      <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl relative overflow-hidden mb-6">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-midnight-neonPink uppercase font-display">
            STAGE 4 • CELESTIAL ELIXIR
          </span>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            Choose your starlight drink 🥤✨
          </h2>
          <p className="font-sans text-xs sm:text-sm text-midnight-textMuted mt-1">
            Every great celestial quest deserves the perfect refreshment
          </p>
        </div>

        {/* Drink Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {DRINKS.map((d) => {
            const isSelected = selectedDrink === d.name;
            return (
              <motion.button
                key={d.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(d.name)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-tr from-midnight-neonPink/25 to-midnight-purple/35 border-2 border-midnight-neonPink shadow-neon-pink text-white'
                    : 'bg-white/5 border border-white/10 hover:border-white/20 text-midnight-text'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{d.icon}</span>
                    {isSelected && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-midnight-neonPink text-white">
                        ORDERED ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">{d.name}</h3>
                  <p className="text-xs text-midnight-textMuted mt-1">{d.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Drink input */}
        <div className="relative">
          <input
            type="text"
            value={customDrink}
            onChange={(e) => onUpdate({ customDrink: e.target.value })}
            placeholder="✨ Craving a specific drink or customized order? Type here..."
            className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-midnight-textMuted focus:outline-none focus:border-midnight-neonPink transition-all"
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
          <span>Next: Greeting & Note</span>
          <span>→</span>
        </motion.button>
      </div>
    </div>
  );
};
