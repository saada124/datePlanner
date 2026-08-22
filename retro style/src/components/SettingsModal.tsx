import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sound } from '../utils/soundEffects';

interface SettingsModalProps {
  open: boolean;
  initialEmail: string;
  onSave: (email: string) => void;
  onClose: () => void;
}

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  initialEmail,
  onSave,
  onClose
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail(initialEmail);
      setError('');
    }
  }, [open, initialEmail]);

  const handleSave = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      sound.playEscape();
      setError('Please enter an email address!');
      return;
    }
    if (!isValidEmail(trimmed)) {
      sound.playEscape();
      setError("Hmm... that email doesn't look right. Try again!");
      return;
    }
    sound.playEquip();
    onSave(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="pixel-box-gold bg-retro-cream w-full max-w-sm p-5 sm:p-6 shadow-pixel-lg text-left"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-retro-dark pb-3 mb-4">
              <h2 className="font-pixel text-xs sm:text-sm text-retro-dark">
                ⚙️ SETTINGS
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="pixel-box bg-retro-dark text-retro-cream px-2 py-1 text-[10px] font-pixel hover:bg-retro-purple transition-colors cursor-pointer"
                title="Close settings"
              >
                ✕
              </button>
            </div>

            <p className="font-pixelify text-sm text-retro-dark mb-3">
              Send the date results to which email?
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
              placeholder="you@example.com"
              autoFocus
              className="w-full pixel-box bg-white border-2 border-retro-dark rounded px-3 py-2.5 text-sm font-pixelify text-retro-dark placeholder-retro-purple/50 focus:outline-none focus:border-retro-pink"
            />

            {error && (
              <p className="font-pixel text-[9px] text-retro-pinkDark mt-2">
                ⚠️ {error}
              </p>
            )}

            {initialEmail && (
              <p className="font-pixelify text-xs text-retro-purple/80 mt-2">
                Currently set: <span className="font-bold">{initialEmail}</span>
              </p>
            )}

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="pixel-btn pixel-btn-secondary flex-1 py-2.5 text-[10px] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="pixel-btn pixel-btn-primary flex-1 py-2.5 text-[10px] cursor-pointer"
              >
                SAVE ✓
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};