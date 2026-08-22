import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';

export type CharacterMood = 'idle' | 'happy' | 'excited' | 'blushing' | 'dancing';

interface PixelAvatarsProps {
  mood?: CharacterMood;
  speechText?: string;
  showSpeech?: boolean;
}

export const PixelAvatars: React.FC<PixelAvatarsProps> = ({
  mood = 'idle',
  speechText,
  showSpeech = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-2 select-none">
      {/* Speech Bubble */}
      {showSpeech && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative mb-3 bg-white text-retro-dark border-4 border-retro-dark px-3 py-1.5 font-pixel text-[10px] sm:text-xs shadow-pixel-sm max-w-[280px] sm:max-w-xs text-center"
        >
          {speechText}
          {/* Pixel triangle pointer */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-retro-dark" />
        </motion.div>
      )}

      {/* Characters Container */}
      <div className="flex items-end gap-3 sm:gap-6 relative">
        {/* Boyfriend */}
        <motion.div
          animate={
            mood === 'dancing'
              ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
              : mood === 'excited'
              ? { y: [0, -10, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: mood === 'dancing' ? 0.6 : mood === 'excited' ? 0.8 : 1.8,
            ease: 'easeInOut'
          }}
          className="flex flex-col items-center"
        >
          {/* Pixel Character 1 (Boyfriend) */}
          <div className="w-12 h-16 sm:w-14 sm:h-18 relative flex items-center justify-center">
            {/* Hair / Head */}
            <svg viewBox="0 0 16 20" className="w-full h-full drop-shadow-md">
              {/* Hair */}
              <rect x="4" y="2" width="8" height="4" fill="#3a2312" />
              <rect x="3" y="3" width="10" height="2" fill="#3a2312" />
              <rect x="2" y="4" width="3" height="3" fill="#3a2312" />
              
              {/* Face */}
              <rect x="4" y="5" width="8" height="6" fill="#fcd5b5" />
              
              {/* Eyes */}
              <rect x="5" y="7" width="2" height="2" fill="#2b1b3d" />
              <rect x="9" y="7" width="2" height="2" fill="#2b1b3d" />
              
              {/* Smile / Expression */}
              {mood === 'happy' || mood === 'dancing' || mood === 'excited' ? (
                <>
                  <rect x="6" y="9" width="4" height="1" fill="#d94368" />
                  <rect x="7" y="10" width="2" height="1" fill="#d94368" />
                </>
              ) : (
                <rect x="6" y="9" width="4" height="1" fill="#3a2312" />
              )}
              
              {/* Shirt (Blue Retro Hoodie) */}
              <rect x="3" y="11" width="10" height="6" fill="#4ea8de" />
              <rect x="5" y="11" width="6" height="3" fill="#90e0ef" />
              {/* Arms */}
              <rect x="1" y="12" width="2" height="4" fill="#4ea8de" />
              <rect x="13" y="12" width="2" height="4" fill="#4ea8de" />
              
              {/* Pants */}
              <rect x="4" y="17" width="3" height="3" fill="#2b1b3d" />
              <rect x="9" y="17" width="3" height="3" fill="#2b1b3d" />
              {/* Shoes */}
              <rect x="3" y="19" width="4" height="1" fill="#ff7597" />
              <rect x="9" y="19" width="4" height="1" fill="#ff7597" />
            </svg>
          </div>
          <span className="font-pixel text-[8px] sm:text-[9px] text-white bg-retro-dark/80 px-1.5 py-0.5 rounded mt-1 border border-white/30">
            {APP_CONFIG.boyfriendName}
          </span>
        </motion.div>

        {/* Floating Heart between them */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [-2, -8, -2] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-lg sm:text-2xl select-none"
        >
          💖
        </motion.div>

        {/* Girlfriend */}
        <motion.div
          animate={
            mood === 'dancing'
              ? { y: [0, -8, 0], rotate: [2, -2, 2] }
              : mood === 'excited'
              ? { y: [0, -10, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: mood === 'dancing' ? 0.6 : mood === 'excited' ? 0.8 : 1.8,
            delay: 0.2,
            ease: 'easeInOut'
          }}
          className="flex flex-col items-center"
        >
          {/* Pixel Character 2 (Girlfriend) */}
          <div className="w-12 h-16 sm:w-14 sm:h-18 relative flex items-center justify-center">
            <svg viewBox="0 0 16 20" className="w-full h-full drop-shadow-md">
              {/* Long Hair (Warm Brown) */}
              <rect x="3" y="2" width="10" height="4" fill="#4a2e18" />
              <rect x="2" y="3" width="12" height="3" fill="#4a2e18" />
              <rect x="1" y="5" width="3" height="9" fill="#4a2e18" />
              <rect x="12" y="5" width="3" height="9" fill="#4a2e18" />
              
              {/* Cute Hair Flower / Bow */}
              <rect x="10" y="2" width="3" height="2" fill="#ff7597" />
              <rect x="11" y="2" width="1" height="1" fill="#ffe66d" />

              {/* Face */}
              <rect x="4" y="5" width="8" height="6" fill="#fcd5b5" />

              {/* Eyes */}
              <rect x="5" y="7" width="2" height="2" fill="#2b1b3d" />
              <rect x="9" y="7" width="2" height="2" fill="#2b1b3d" />

              {/* Blush */}
              <rect x="4" y="9" width="2" height="1" fill="#ff8da1" />
              <rect x="10" y="9" width="2" height="1" fill="#ff8da1" />

              {/* Cute Smile */}
              <rect x="6" y="9" width="4" height="1" fill="#d94368" />
              <rect x="7" y="10" width="2" height="1" fill="#d94368" />

              {/* Pink Sweater */}
              <rect x="3" y="11" width="10" height="5" fill="#ff7597" />
              <rect x="6" y="12" width="4" height="3" fill="#ffb3c6" />
              
              {/* Skirt */}
              <rect x="3" y="16" width="10" height="2" fill="#c8b6ff" />

              {/* Legs & Shoes */}
              <rect x="5" y="18" width="2" height="2" fill="#fcd5b5" />
              <rect x="9" y="18" width="2" height="2" fill="#fcd5b5" />
              <rect x="4" y="19" width="3" height="1" fill="#2b1b3d" />
              <rect x="9" y="19" width="3" height="1" fill="#2b1b3d" />
            </svg>
          </div>
          <span className="font-pixel text-[8px] sm:text-[9px] text-white bg-retro-dark/80 px-1.5 py-0.5 rounded mt-1 border border-white/30">
            {APP_CONFIG.girlfriendName}
          </span>
        </motion.div>
      </div>
    </div>
  );
};
