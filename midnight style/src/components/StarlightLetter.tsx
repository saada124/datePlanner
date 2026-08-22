import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface StarlightLetterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StarlightLetter: React.FC<StarlightLetterProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const letter = APP_CONFIG.secretMidnightLetter;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playCrystalChime();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Floating Glowing Starlight Letter Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          className="cosmic-card-pink max-w-md w-full p-6 sm:p-8 rounded-3xl relative z-10 text-left border border-midnight-neonPink/50"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sound.playCrystalChime();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-midnight-textMuted hover:text-white flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>

          {/* Letter Content */}
          <div className="text-2xl mb-3">🌌 💌 ✨</div>

          <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-3">
            {letter.salutation}
          </h3>

          <p className="font-sans text-sm text-gray-200 leading-relaxed mb-6 font-normal">
            {letter.body}
          </p>

          <div className="text-right">
            <div className="text-xs text-midnight-lavender italic">
              {letter.signOff}
            </div>
            <div className="font-display font-bold text-base text-midnight-neonPink mt-0.5">
              {letter.author}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={() => {
                sound.playCrystalChime();
                onClose();
              }}
              className="cosmic-btn-primary px-6 py-2.5 text-xs font-semibold shadow-neon-pink cursor-pointer"
            >
              Keep Close to My Heart ✨
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
