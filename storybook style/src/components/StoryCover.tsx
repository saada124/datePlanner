import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EscapingButton } from './EscapingButton';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface StoryCoverProps {
  onBegin: () => void;
}

export const StoryCover: React.FC<StoryCoverProps> = ({ onBegin }) => {
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  const getDialogueText = () => {
    if (escapeAttempts === 0) {
      return "A little story waiting to be written together... 📖✨";
    } else if (escapeAttempts === 1) {
      return "Wait, where are you trying to click? 🤭";
    } else if (escapeAttempts === 2) {
      return "That button has a mind of its own! 🍃";
    } else if (escapeAttempts < 5) {
      return "You know saying no isn't in the script! 😌💖";
    } else {
      return "Just click 'Obviously' already, my love! 🌸✨";
    }
  };

  const handleAccept = () => {
    sound.playChapterComplete();

    // Soft pastel confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e2959f', '#dfb15b', '#f9e6e8', '#ffffff', '#9fb8a0']
    });

    setTimeout(() => {
      onBegin();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto w-full px-4 text-center select-none"
    >
      {/* Storybook Cover Card with Spring Entrance */}
      <motion.div 
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="paper-card p-6 sm:p-10 rounded-2xl shadow-paper-lg relative overflow-hidden mb-8 border border-storybook-border"
      >
        {/* Washi tape accents */}
        <div className="washi-tape -top-2 left-8 w-24" />
        <div className="washi-tape washi-tape-sage -top-2 right-8 w-24" />

        {/* Vintage Wax Seal Header */}
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 6 }}
            whileTap={{ scale: 0.95 }}
            className="wax-seal cursor-pointer shadow-seal"
          >
            {APP_CONFIG.boyfriendInitial} & {APP_CONFIG.girlfriendInitial}
          </motion.div>
        </div>

        {/* Subtitle / Volume */}
        <div className="font-handwriting text-xl sm:text-2xl text-storybook-roseDark mb-1">
          {getDialogueText()}
        </div>

        <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-storybook-inkLight uppercase font-sans mb-3">
          A DATE INVITATION FOR {APP_CONFIG.girlfriendName.toUpperCase()}
        </div>

        {/* Main Proposal Heading */}
        <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl text-storybook-ink leading-snug sm:leading-tight mb-3">
          {APP_CONFIG.girlfriendName}, will you go on a date with me next week? 🌸
        </h1>

        <p className="font-sans text-xs sm:text-sm text-storybook-inkLight max-w-md mx-auto leading-relaxed">
          {APP_CONFIG.dateRangeText} • An invitation to plan our perfect afternoon & evening together.
        </p>

        {/* Delicate Hand-Drawn Floral Divider */}
        <div className="flex items-center justify-center gap-3 my-5 text-storybook-rose/60">
          <span className="h-[1px] w-12 bg-storybook-border" />
          <span className="text-sm">❦ 🌸 ❦</span>
          <span className="h-[1px] w-12 bg-storybook-border" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative min-h-[100px]">
        {/* Obviously Button */}
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => sound.playChime()}
          onClick={handleAccept}
          className="story-btn-primary px-9 py-4 text-sm sm:text-base shadow-lg group relative z-10 flex items-center gap-2 cursor-pointer"
        >
          <span className="group-hover:scale-125 transition-transform">🌸</span>
          <span>Obviously ❤️</span>
          <span className="group-hover:scale-125 transition-transform">🌸</span>
        </motion.button>

        {/* The Evasive Button */}
        <EscapingButton onAttempt={(c) => setEscapeAttempts(c)} />
      </div>
    </motion.div>
  );
};
