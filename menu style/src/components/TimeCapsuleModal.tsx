import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Lock, CheckCircle2, Sparkles, Send } from 'lucide-react';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
}

export const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  dateStr
}) => {
  const [prediction, setPrediction] = useState('');
  const [isSealed, setIsSealed] = useState(false);

  if (!isOpen) return null;

  const handleSeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prediction.trim()) return;

    menuSound.playTearAndStamp();
    setIsSealed(true);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E8635A', '#4A7A6D', '#D4AF37']
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B1B17]/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-md w-full my-auto bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-ticket text-left relative"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-highlight)] text-[#E8635A] rounded-full font-mono text-[10px] font-bold uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Secret Date Night Time Capsule</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[var(--text-primary)]">
              Sealed Date Prediction 🔒
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Write a secret thought or prediction to open together during our date!
            </p>
          </div>

          {!isSealed ? (
            <form onSubmit={handleSeal} className="space-y-4">
              <div className="p-4 bg-[var(--bg-inner-box)] border border-[var(--border-card)] rounded-2xl">
                <label
                  htmlFor="capsule-text"
                  className="block font-mono text-xs font-bold uppercase text-[var(--text-primary)] mb-2 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#E8635A]" />
                  <span>Your Prediction for Date Night:</span>
                </label>
                <textarea
                  id="capsule-text"
                  rows={4}
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  placeholder="e.g. I predict you will order chocolate dessert first and tell at least 3 cheesy jokes... ❤️"
                  className="w-full p-3 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8635A] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!prediction.trim()}
                className="w-full py-3.5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-sm rounded-2xl shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Wax-Seal Time Capsule 💌</span>
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-[var(--bg-inner-box)] border-2 border-dashed border-[#4A7A6D] rounded-2xl text-center space-y-3"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-[#4A7A6D] text-white flex items-center justify-center text-xl shadow-xs">
                🔒
              </div>
              <h4 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                Time Capsule Officially Sealed!
              </h4>
              <p className="font-serif italic text-xs text-[var(--text-secondary)]">
                “{prediction}”
              </p>
              <div className="font-mono text-[10px] font-bold text-[#4A7A6D] uppercase flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Locked until {dateStr} at Table N° 07</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 px-6 py-2.5 bg-[#4A7A6D] text-white font-serif text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
