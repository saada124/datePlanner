import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { islandSound } from '../utils/soundEffects';
import { Sparkles, Heart } from 'lucide-react';

interface IslandCoverProps {
  onStart: () => void;
}

export const IslandCover: React.FC<IslandCoverProps> = ({ onStart }) => {
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Play cheerful greeting Animalese chatter on load
    const timer = setTimeout(() => {
      islandSound.playAnimaleseSpeech(6);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    islandSound.playSuccess();
    onStart();
  };

  const handleNoHover = () => {
    islandSound.playWobble();
    setNoIndex((prev) => (prev + 1) % APP_CONFIG.taunts.length);
    // Farther dynamic dodge offset with guaranteed minimum distance
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    const randomX = signX * (180 + Math.random() * 240); // 180px to 420px away
    const randomY = signY * (100 + Math.random() * 180); // 100px to 280px away
    setNoPos({ x: randomX, y: randomY });
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-8 text-center relative z-10">
      {/* Top Dodo Airlines Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 border-2 border-sky-400 text-sky-800 font-bold rounded-full text-sm shadow-sm mb-6"
      >
        <span className="text-base">🦤</span>
        <span>{APP_CONFIG.cover.badge}</span>
      </motion.div>

      {/* Main Mascot / Palm Icon Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 180 }}
        className="relative mb-4"
      >
        <div className="w-28 h-28 md:w-32 md:h-32 bg-amber-100 border-4 border-amber-300 rounded-full flex items-center justify-center shadow-nook text-6xl md:text-7xl select-none">
          🏝️
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2 text-3xl"
        >
          🍃
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute -bottom-1 -left-2 text-3xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl md:text-5xl font-black text-stone-800 tracking-tight mb-2 drop-shadow-sm"
      >
        {APP_CONFIG.cover.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-lg md:text-xl font-bold text-emerald-800 mb-6"
      >
        {APP_CONFIG.cover.subtitle}
      </motion.p>

      {/* Animal Crossing Style Dialogue Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        onClick={() => islandSound.playAnimaleseSpeech(5)}
        className="relative bg-[#fffdf0] border-4 border-emerald-400 rounded-3xl p-5 md:p-6 shadow-bubble max-w-md w-full mb-8 cursor-pointer hover:border-emerald-500 transition-colors"
        title="Tap to hear villager chatter 💬"
      >
        {/* Name tag */}
        <div className="absolute -top-4 left-6 bg-emerald-500 text-white font-black text-xs px-3.5 py-1 rounded-full border-2 border-emerald-600 shadow-sm flex items-center gap-1">
          <span>🍃</span>
          <span>Tom Nook & {APP_CONFIG.boyfriendName}</span>
        </div>

        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed italic">
          {APP_CONFIG.cover.nookDialogue}
        </p>

        {/* Tail */}
        <div className="dialogue-pointer-down" />
      </motion.div>

      {/* Call to action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative"
      >
        <button
          onClick={handleYes}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xl font-black rounded-3xl shadow-nook border-b-4 border-emerald-700 btn-nook-bounce flex items-center justify-center gap-3 cursor-pointer"
        >
          <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
          <span>{APP_CONFIG.cover.yesButton}</span>
          <Heart className="w-6 h-6 text-rose-300 fill-rose-300" />
        </button>

        {/* Evasive No button */}
        <motion.div
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          className="w-full sm:w-auto"
        >
          <button
            onMouseEnter={handleNoHover}
            onClick={handleNoHover}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-200 hover:bg-rose-100 text-stone-600 hover:text-rose-700 font-bold text-sm md:text-base rounded-3xl border-2 border-stone-300 hover:border-rose-300 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            {noIndex === 0 ? APP_CONFIG.cover.noButton : APP_CONFIG.taunts[noIndex]}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
