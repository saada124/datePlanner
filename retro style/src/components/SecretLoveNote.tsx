import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface SecretLoveNoteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretLoveNote: React.FC<SecretLoveNoteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 3 }}
          className="pixel-box-pink max-w-md w-full p-6 text-center shadow-pixel-lg relative"
        >
          {/* Polaroid Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffeaa7]/80 w-24 h-6 rotate-2 border border-black/20 shadow-xs" />

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="absolute top-2 right-2 text-xs font-pixel bg-retro-dark text-white w-6 h-6 flex items-center justify-center border border-white hover:bg-retro-pink cursor-pointer"
          >
            ✕
          </button>

          <div className="text-3xl my-2 animate-bounce-slow">💌</div>

          <h3 className="font-pixel text-xs sm:text-sm text-retro-dark mb-3 text-pixel-shadow">
            {APP_CONFIG.secretLoveNote.title}
          </h3>

          <div className="bg-white p-4 rounded border-2 border-retro-dark font-pixelify text-sm sm:text-base text-retro-purple/90 leading-relaxed shadow-inner">
            <p className="mb-3">
              "{APP_CONFIG.secretLoveNote.message}"
            </p>
            <div className="text-right font-pixel text-xs text-retro-pinkDark font-bold">
              {APP_CONFIG.secretLoveNote.signOff}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                sound.playSelect();
                onClose();
              }}
              className="pixel-btn pixel-btn-primary text-xs"
            >
              <span>Keep Secret 🤫❤️</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
