import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EscapingButton } from './EscapingButton';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MixtapeCoverProps {
  onBegin: () => void;
}

export const MixtapeCover: React.FC<MixtapeCoverProps> = ({ onBegin }) => {
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  const getDialogueText = () => {
    if (escapeAttempts === 0) {
      return 'A mixtape, pressed and recorded just for you... 🎧';
    } else if (escapeAttempts === 1) {
      return 'Wait — where is the needle going? 🤭';
    } else if (escapeAttempts === 2) {
      return 'The reels got tangled! 📼💫';
    } else if (escapeAttempts < 5) {
      return 'This side has no room for “no” 💿';
    } else {
      return "Just press play on 'yes', my love! ❤️";
    }
  };

  const handleAccept = () => {
    sound.playChapterComplete();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#c96f4a', '#e0a458', '#b45f6f', '#f9e8dd', '#d9a441']
    });
    setTimeout(() => onBegin(), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto w-full px-4 text-center select-none"
    >
      {/* Cassette Cover */}
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="jcard-card rounded-2xl shadow-paper-lg relative overflow-hidden mb-8"
      >
        {/* Tape strips holding it down */}
        <div className="tape-strip -top-2 left-10 w-28" />
        <div className="tape-strip tape-strip-reverse -top-2 right-10 w-28" />

        {/* Cover header */}
        <div className="px-6 sm:px-10 pt-8 pb-6 text-center bg-gradient-to-b from-mixtape-cream to-mixtape-paper">
          <div className="font-typewriter text-[10px] tracking-[0.3em] text-mixtape-roseDark uppercase mb-2">
            ✦ {APP_CONFIG.websiteTitle.toUpperCase()} ✦
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl text-mixtape-coffee leading-tight">
            The Date Mixtape
          </h1>
          <p className="font-handwriting text-2xl sm:text-3xl text-mixtape-roseDark mt-3">
            {APP_CONFIG.coverInscription}
          </p>
        </div>

        {/* Tape window */}
        <div className="px-6 sm:px-10">
          <div className="bg-gradient-to-b from-[#3a3027] to-[#241e18] rounded-lg p-4 flex items-center justify-between relative shadow-inner">
            <span className="font-typewriter text-[9px] text-[#d8c9b2] tracking-[0.3em] absolute left-3 top-2">
              SIDE A
            </span>
            <div className="deck-reel w-12 h-12 sm:w-14 sm:h-14 rounded-full animate-reel-spin-slow relative">
              <div className="absolute inset-[18%] rounded-full bg-[#3a3027] border border-[#b3a17e]" />
              <div className="absolute inset-[42%] rounded-full bg-[#b3a17e]" />
            </div>
            <div className="text-center px-2">
              <div className="font-typewriter text-[10px] text-[#e8dcc6] tracking-widest">
                {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial}
              </div>
            </div>
            <div className="deck-reel w-12 h-12 sm:w-14 sm:h-14 rounded-full animate-reel-spin relative">
              <div className="absolute inset-[18%] rounded-full bg-[#3a3027] border border-[#b3a17e]" />
              <div className="absolute inset-[42%] rounded-full bg-[#b3a17e]" />
            </div>
            <span className="font-typewriter text-[9px] text-[#d8c9b2] tracking-[0.3em] absolute right-3 bottom-2">
              MIXTAPE
            </span>
          </div>
        </div>

        {/* Cover body */}
        <div className="px-6 sm:px-10 pt-5 pb-7 text-center">
          <div className="font-typewriter text-[10px] tracking-[0.25em] text-mixtape-coffeeLight uppercase mb-2">
            A DATE INVITATION FOR {APP_CONFIG.girlfriendName.toUpperCase()}
          </div>
          <p className="font-sans text-xs sm:text-sm text-mixtape-coffeeLight max-w-md mx-auto leading-relaxed">
            {APP_CONFIG.dateRangeText} · Pressed with love, ready to be played together.
          </p>
          <div className="flex items-center justify-center gap-3 my-4 text-mixtape-rose">
            <span className="h-[1px] w-12 bg-mixtape-border" />
            <span className="text-sm">♪ ♥ ♪</span>
            <span className="h-[1px] w-12 bg-mixtape-border" />
          </div>
          <div className="font-handwriting text-lg text-mixtape-coffeeLight">
            {getDialogueText()}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative min-h-[100px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => sound.playChime()}
          onClick={handleAccept}
          className="mix-btn-primary px-9 py-4 text-sm sm:text-base shadow-lg group flex items-center gap-2 cursor-pointer"
        >
          <span className="group-hover:scale-125 transition-transform">▶</span>
          <span>PLAY THE TAPE</span>
          <span className="group-hover:scale-125 transition-transform">🎧</span>
        </motion.button>

        <EscapingButton onAttempt={(c) => setEscapeAttempts(c)} />
      </div>
    </motion.div>
  );
};