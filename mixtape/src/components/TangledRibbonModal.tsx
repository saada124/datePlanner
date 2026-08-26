import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEffects';

interface TangledRibbonModalProps {
  isOpen: boolean;
  onResolved: () => void;
}

export const TangledRibbonModal: React.FC<TangledRibbonModalProps> = ({
  isOpen,
  onResolved
}) => {
  const handleRescue = () => {
    sound.playTapeScratch(2.5);
    sound.playButtonClunk();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c96f4a', '#e0a458', '#d4af37', '#fffdfa']
    });
    setTimeout(() => {
      onResolved();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="walkman-faceplate max-w-sm w-full p-6 rounded-3xl relative border border-[#5a483a] shadow-2xl text-center"
          >
            {/* Screws */}
            <div className="screw-fastener absolute left-3 top-3" />
            <div className="screw-fastener absolute right-3 top-3" />

            {/* Tangled Tape Graphic */}
            <div className="my-3 flex items-center justify-center">
              <svg viewBox="0 0 160 80" className="w-40 h-20 overflow-visible">
                {/* Tangled Brown Ribbon Loops */}
                <path
                  d="M 20,40 Q 40,10 60,40 T 100,50 T 140,40 Q 120,75 80,65 Q 40,60 20,40 Z"
                  fill="none"
                  stroke="#4a2c1d"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
                <path
                  d="M 35,35 Q 70,80 110,35 Q 130,20 145,45"
                  fill="none"
                  stroke="#6b422a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Floating Cassette Emojis */}
                <text x="70" y="48" fontSize="26">📼</text>
              </svg>
            </div>

            <div className="font-mono text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-bold mb-1">
              ✦ TAPE TANGLED! ✦
            </div>
            <h3 className="font-serif text-lg font-bold text-[#f4ebd9] mb-2">
              The reels got eaten with love! 🤭
            </h3>
            <p className="font-sans text-xs text-[#a89888] leading-relaxed mb-5">
              The magnetic ribbon spilled out of the cassette well while rewinding. Use the 80s yellow pencil to wind it safely back in!
            </p>

            {/* Action Pencil Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRescue}
              className="btn-transport-primary w-full py-3 rounded-xl font-serif text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>✏️</span>
              <span>WIND TAPE BACK IN WITH PENCIL</span>
              <span>✨</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
