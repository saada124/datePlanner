import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MidnightFinalCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const MidnightFinalCard: React.FC<MidnightFinalCardProps> = ({
  selection,
  onConfirm,
  onEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLockIn = async () => {
    setIsSubmitting(true);
    sound.playCosmicCelebration();

    setTimeout(() => {
      onConfirm();
    }, 450);
  };

  return (
    <div className="max-w-xl mx-auto w-full px-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="cosmic-card-glow p-6 sm:p-9 rounded-3xl relative overflow-hidden mb-6"
      >
        {/* Glow corner bursts */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-midnight-neonPink/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-midnight-neonCyan/25 rounded-full blur-3xl" />

        {/* Boarding Pass Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-midnight-lavender uppercase tracking-widest mb-2 font-display">
            <span>✨</span>
            <span>CELESTIAL VIP DATE PASS</span>
            <span>✨</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            {APP_CONFIG.boyfriendName} & {APP_CONFIG.girlfriendName}’s Starlight Night 🌌
          </h2>
          <p className="font-sans text-xs text-midnight-textMuted mt-1">
            Official Cosmic Reservation • August 2026
          </p>
        </div>

        {/* Dashed Separator */}
        <div className="border-t border-dashed border-white/15 my-4" />

        {/* Itinerary Rows */}
        <div className="space-y-3.5 text-xs">
          {/* Date & Time */}
          <div className="bg-black/25 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-midnight-neonPink font-semibold uppercase tracking-wider">
                📅 DATE & TIME
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {selection.dayDate}
              </div>
              <div className="text-midnight-textMuted text-xs mt-0.5">
                {selection.customTime ? `${selection.timeSlot} (${selection.customTime})` : selection.timeSlot}
              </div>
            </div>
            <span className="text-2xl">🌙</span>
          </div>

          {/* Location */}
          <div className="bg-black/25 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-midnight-neonCyan font-semibold uppercase tracking-wider">
                📍 DESTINATION
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {selection.customLocation || selection.location || `${APP_CONFIG.boyfriendName}’s Secret Spot`}
              </div>
            </div>
            <span className="text-2xl">✨</span>
          </div>

          {/* Activities */}
          <div className="bg-black/25 p-3.5 rounded-2xl border border-white/10">
            <div className="text-[10px] text-midnight-starlight font-semibold uppercase tracking-wider mb-1">
              💫 PLANNED ADVENTURES
            </div>
            <div className="text-xs text-white font-medium">
              {selection.activities.join(', ') + (selection.customActivity ? ` + "${selection.customActivity}"` : '')}
            </div>
          </div>

          {/* Drink & Greeting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black/25 p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-midnight-lavender font-semibold uppercase tracking-wider">
                🥤 ELIXIR
              </div>
              <div className="text-xs font-semibold text-white mt-1">
                {selection.customDrink || selection.drink}
              </div>
            </div>

            <div className="bg-black/25 p-3.5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-midnight-neonPink font-semibold uppercase tracking-wider">
                🤗 GREETING
              </div>
              <div className="text-xs font-semibold text-white mt-1">
                {selection.greetings.join(', ')}
              </div>
            </div>
          </div>

          {/* Starlight Note */}
          {selection.customNotes && (
            <div className="bg-midnight-purple/15 p-3.5 rounded-2xl border border-midnight-purple/30 text-midnight-lavender italic text-xs">
              💬 "{selection.customNotes}"
            </div>
          )}
        </div>

        {/* Lock-In Final Button */}
        <div className="mt-7 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playCrystalChime();
              onEdit();
            }}
            className="cosmic-btn-secondary py-3.5 px-5 text-xs font-semibold cursor-pointer"
          >
            ← Modify Choices
          </button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            disabled={isSubmitting}
            onClick={handleLockIn}
            className="cosmic-btn-primary flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-neon-pink"
          >
            <span>{isSubmitting ? '✨ Locking In Starlight... ✨' : '🌌 Lock In Our Starlight Date! ❤️'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
