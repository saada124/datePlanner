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
      sound.playFlutter();
      setError('Please enter an email address.');
      return;
    }
    if (!isValidEmail(trimmed)) {
      sound.playFlutter();
      setError("That email doesn't look quite right. Try again!");
      return;
    }
    sound.playChime();
    onSave(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mixtape-coffee/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="jcard-card w-full max-w-sm p-6 rounded-2xl shadow-paper-lg relative overflow-hidden"
          >
            {/* Corner deco */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-mixtape-blush/60 blur-2xl" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-mixtape-border pb-3 mb-4 relative">
              <h2 className="font-serif-title text-lg text-mixtape-coffee">
                ⚙️ Settings
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="jcard-card px-2.5 py-1 rounded-full text-xs text-mixtape-coffee hover:border-mixtape-rose transition-colors cursor-pointer"
                title="Close settings"
              >
                ✕
              </button>
            </div>

            <p className="font-handwriting text-base text-mixtape-roseDark mb-4 relative">
              Send our mixtape to which email? 🎧
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
              className="w-full bg-mixtape-cream border-2 border-mixtape-border rounded-xl px-4 py-3 text-sm font-sans text-mixtape-coffee placeholder-mixtape-coffeeLight focus:outline-none focus:border-mixtape-rose transition-all relative"
            />

            {error && (
              <p className="font-handwriting text-sm text-mixtape-roseDark mt-2 relative">
                ⚠️ {error}
              </p>
            )}

            {initialEmail && (
              <p className="font-sans text-xs text-mixtape-coffeeLight mt-2 relative">
                Currently set: <span className="text-mixtape-roseDark font-semibold">{initialEmail}</span>
              </p>
            )}

            <div className="flex gap-3 mt-6 relative">
              <button
                type="button"
                onClick={onClose}
                className="mix-btn-secondary flex-1 py-3 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="mix-btn-primary flex-1 py-3 text-sm cursor-pointer"
              >
                Save 🎵
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};