import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface WaxSealLetterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaxSealLetter: React.FC<WaxSealLetterProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="paper-card max-w-lg w-full p-8 rounded-2xl shadow-2xl relative border border-storybook-border text-left"
        >
          {/* Washi Tape */}
          <div className="washi-tape -top-2.5 left-1/2 -translate-x-1/2 w-28" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playPageTurn();
              onClose();
            }}
            className="absolute top-3 right-3 text-storybook-inkLight hover:text-storybook-roseDark text-sm w-7 h-7 rounded-full bg-storybook-parchment flex items-center justify-center border border-storybook-border cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="wax-seal w-8 h-8 text-xs">
              {APP_CONFIG.boyfriendInitial}
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-storybook-roseDark">
                PRIVATE LETTER
              </span>
              <h3 className="font-serif-title text-base text-storybook-ink">
                A Letter for {APP_CONFIG.girlfriendName}
              </h3>
            </div>
          </div>

          <div className="bg-[#fdfbf7] p-5 rounded-xl border border-storybook-border/80 text-storybook-ink font-handwriting text-lg sm:text-xl leading-relaxed shadow-inner">
            <p className="font-serif text-sm font-semibold text-storybook-roseDark mb-2">
              {APP_CONFIG.secretLoveLetter.salutation}
            </p>
            <p className="mb-4">
              {APP_CONFIG.secretLoveLetter.body}
            </p>
            <div className="text-right">
              <p className="text-sm font-serif text-storybook-inkLight">
                {APP_CONFIG.secretLoveLetter.signOff}
              </p>
              <p className="font-serif text-base font-bold text-storybook-roseDark">
                {APP_CONFIG.secretLoveLetter.author}
              </p>
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => {
                sound.playPageTurn();
                onClose();
              }}
              className="story-btn-primary px-6 py-2.5 text-xs font-semibold cursor-pointer"
            >
              <span>Keep Close to Heart 💌</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
