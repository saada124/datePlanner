import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MixtapeLetterProps {
  onClose: () => void;
}

export const MixtapeLetter: React.FC<MixtapeLetterProps> = ({ onClose }) => {
  const letter = APP_CONFIG.secretLoveLetter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="mixtape-card max-w-lg w-full p-6 sm:p-9 rounded-2xl relative shadow-2xl border-2 border-[#decbb2]"
      >
        {/* Tape strips holding letter */}
        <div className="tape-strip -top-3 left-10 w-28" />
        <div className="tape-strip tape-strip-reverse -top-3 right-10 w-28" />

        {/* Wax Seal / Stamp Header */}
        <div className="flex items-center justify-between border-b border-[#decbb2] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c96f4a] text-white flex items-center justify-center font-display text-sm shadow-md">
              ♥
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c96f4a] uppercase font-bold">
              SECRET LINER NOTE
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playButtonClunk();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#f4ebd9] hover:bg-[#decbb2] flex items-center justify-center text-[#2d221c] font-bold text-xs cursor-pointer border border-[#decbb2]"
          >
            ✕
          </button>
        </div>

        {/* Letter Body */}
        <div className="space-y-3 font-serif text-left text-sm sm:text-base leading-relaxed text-[#2d221c]">
          <div className="font-handwriting text-2xl text-[#c96f4a]">
            {letter.salutation}
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#4a3b32] leading-relaxed">
            {letter.body}
          </p>

          <div className="pt-2 text-right">
            <div className="font-handwriting text-xl text-[#6d5a4e]">
              {letter.signOff}
            </div>
            <div className="font-handwriting text-2xl font-bold text-[#c96f4a] mt-0.5">
              {letter.author}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-3 border-t border-[#decbb2] text-center">
          <button
            type="button"
            onClick={() => {
              sound.playButtonClunk();
              onClose();
            }}
            className="btn-transport px-6 py-2.5 rounded-xl font-serif text-xs font-bold cursor-pointer"
          >
            FOLD & STORE LINER NOTE
          </button>
        </div>
      </motion.div>
    </div>
  );
};