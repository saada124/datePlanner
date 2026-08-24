import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';

interface ChefLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChefLetterModal: React.FC<ChefLetterModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              menuSound.playPenTick();
              onClose();
            }}
            className="absolute inset-0 bg-[#2B1B17]/45 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-paper-lg z-10 text-left"
          >
            {/* Header with Wax Seal Effect */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8635A] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                  💌
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                    {APP_CONFIG.chefLetter.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E8635A]">
                    {APP_CONFIG.chefLetter.badge}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  menuSound.playPenTick();
                  onClose();
                }}
                className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Body */}
            <div className="p-5 bg-[var(--bg-inner-box)] border border-[var(--border-card)] rounded-2xl mb-6 shadow-inner">
              <p className="font-serif italic text-[var(--text-primary)] text-sm sm:text-base whitespace-pre-line leading-relaxed">
                {APP_CONFIG.chefLetter.content}
              </p>
            </div>

            {/* Close / Acknowledge Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  menuSound.playPenTick();
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Close Note 💖</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
