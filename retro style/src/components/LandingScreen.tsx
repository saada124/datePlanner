import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { APP_CONFIG } from '../config/appConfig';
import { PixelAvatars, CharacterMood } from './PixelAvatars';
import { EscapingButton } from './EscapingButton';
import { sound } from '../utils/soundEffects';

interface LandingScreenProps {
  onAccept: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onAccept }) => {
  const [escapeAttempts, setEscapeAttempts] = useState(0);
  const [characterMood, setCharacterMood] = useState<CharacterMood>('idle');

  const handleEscapeAttempt = (count: number) => {
    setEscapeAttempts(count);
    if (count > 5) {
      setCharacterMood('dancing');
    } else if (count > 2) {
      setCharacterMood('excited');
    }
  };

  const getDialogueText = () => {
    if (escapeAttempts === 0) {
      return "Andi soueel urgeeeeeeent... ❤️";
    } else if (escapeAttempts === 1) {
      return "ija ija andi lik surprise!!!";
    } else if (escapeAttempts === 2) {
      return "Ghelbetek el button ? 😂";
    } else if (escapeAttempts < 5) {
      return "Fibelek b rouhek bch tkoli le ? 😌💖";
    } else {
      return "Enzel ala 'EYYYYYY' jarya! Fibeli bik theb tokhrej maaya 🥰";
    }
  };

  const handleAcceptClick = () => {
    sound.playLevelUp();
    setCharacterMood('dancing');

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff7597', '#ffd166', '#c8b6ff', '#ffffff']
    });

    setTimeout(() => {
      onAccept();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 text-center select-none"
    >
      {/* RPG Dialog Box with Spring Entrance */}
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        className="pixel-box-pink w-full p-5 sm:p-8 rounded-lg mb-6 shadow-pixel-lg relative overflow-hidden"
      >
        {/* Animated glowing border effect */}
        <div className="absolute top-2 left-2 text-xs animate-pulse">🌸</div>
        <div className="absolute top-2 right-2 text-xs animate-pulse">✨</div>
        <div className="absolute bottom-2 left-2 text-xs animate-pulse">⭐</div>
        <div className="absolute bottom-2 right-2 text-xs animate-pulse">🌸</div>

        {/* Pixel Characters Scene */}
        <PixelAvatars
          mood={characterMood}
          speechText={getDialogueText()}
          showSpeech={true}
        />

        {/* Main Proposal Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="font-pixel text-[10px] sm:text-xs text-retro-purple uppercase tracking-wider mb-2 font-bold">
            ❤️ LOVE QUEST INVITATION ❤️
          </div>
          <h1 className="font-pixel text-base sm:text-xl md:text-2xl text-retro-dark leading-relaxed sm:leading-loose text-pixel-shadow">
            {APP_CONFIG.girlfriendName}, will you go on a date with me next week? ❤️
          </h1>
          <p className="font-pixelify text-sm sm:text-base text-retro-purple/80 mt-2">
            ({APP_CONFIG.dateRange[0].date}–{APP_CONFIG.dateRange[APP_CONFIG.dateRange.length - 1].date} • Dsl jemaa hedhi rani f9ir ama nheb nokhrjou )
          </p>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full relative min-h-[120px]">
        {/* Obviously Button */}
        <motion.button
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.94 }}
          onMouseEnter={() => sound.playHover()}
          onClick={handleAcceptClick}
          className="pixel-btn pixel-btn-primary text-xs sm:text-sm px-7 py-4 shadow-pixel-glow group relative z-10 cursor-pointer animate-pulse-gentle"
        >
          <span className="flex items-center gap-2">
            <span>EYYYYYY</span>
            <span className="group-hover:scale-125 transition-transform">😍</span>
          </span>
        </motion.button>

        {/* The Hilarious Escaping Button */}
        <EscapingButton onAttempt={handleEscapeAttempt} />
      </div>
    </motion.div>
  );
};
