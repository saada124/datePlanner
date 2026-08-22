import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { APP_CONFIG } from '../config/appConfig';
import { EscapingButton } from './EscapingButton';
import { sound } from '../utils/soundEffects';

interface MidnightCoverProps {
  onBegin: () => void;
}

export const MidnightCover: React.FC<MidnightCoverProps> = ({ onBegin }) => {
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  const getDialogueText = () => {
    if (escapeAttempts === 0) {
      return "Under a sky of ten thousand stars... 🌌✨";
    } else if (escapeAttempts === 1) {
      return "Wait, where are you clicking? 🤭";
    } else if (escapeAttempts === 2) {
      return "That button has an escape velocity! 🚀";
    } else if (escapeAttempts < 5) {
      return "You know saying no isn't in the constellations! 😌💖";
    } else {
      return "Just click 'Obviously' already, my star! ✨❤️";
    }
  };

  const handleAccept = () => {
    sound.playCelestialChime();

    // Cosmic starlight confetti shower
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff7597', '#ffd166', '#c084fc', '#ffffff', '#38bdf8']
    });

    setTimeout(() => {
      onBegin();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="max-w-xl mx-auto w-full px-4 text-center select-none"
    >
      {/* Frosted Cosmic Bento Card */}
      <motion.div
        initial={{ scale: 0.92, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="cosmic-card-glow p-7 sm:p-10 rounded-3xl relative overflow-hidden mb-8"
      >
        {/* Glow orb backdrop */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-midnight-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-midnight-neonPink/20 rounded-full blur-3xl pointer-events-none" />

        {/* Orbit Badge Header */}
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-midnight-neonPink to-midnight-purple flex items-center justify-center text-2xl shadow-neon-pink cursor-pointer"
          >
            🪐
          </motion.div>
        </div>

        {/* Subtitle / Volume */}
        <div className="font-sans text-sm sm:text-base font-semibold text-midnight-neonPink text-glow-pink mb-1">
          {getDialogueText()}
        </div>

        <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-midnight-textMuted uppercase font-display mb-3">
          A CELESTIAL DATE INVITATION FOR {APP_CONFIG.girlfriendName.toUpperCase()}
        </div>

        {/* Main Proposal Heading */}
        <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-snug sm:leading-tight mb-3">
          {APP_CONFIG.girlfriendName}, will you go on a date with me next week? ✨
        </h1>

        <p className="font-sans text-xs sm:text-sm text-midnight-textMuted max-w-md mx-auto leading-relaxed">
          {APP_CONFIG.dateRange[0].date} – {APP_CONFIG.dateRange[APP_CONFIG.dateRange.length - 1].date} • An invitation to choose our constellations, destination, and memories together.
        </p>

        {/* Delicate Starlight Divider */}
        <div className="flex items-center justify-center gap-3 my-5 text-midnight-lavender/60">
          <span className="h-[1px] w-12 bg-white/10" />
          <span className="text-sm">✦ 🌌 ✦</span>
          <span className="h-[1px] w-12 bg-white/10" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative min-h-[100px]">
        {/* Obviously Button */}
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => sound.playCrystalChime()}
          onClick={handleAccept}
          className="cosmic-btn-primary px-9 py-4 text-sm sm:text-base shadow-neon-pink group relative z-10 flex items-center gap-2 cursor-pointer"
        >
          <span className="group-hover:scale-125 transition-transform">✨</span>
          <span>Obviously ❤️</span>
          <span className="group-hover:scale-125 transition-transform">✨</span>
        </motion.button>

        {/* The Evasive Comet Button */}
        <EscapingButton onAttempt={(c) => setEscapeAttempts(c)} />
      </div>
    </motion.div>
  );
};
