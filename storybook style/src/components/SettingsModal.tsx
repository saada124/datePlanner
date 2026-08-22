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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-storybook-ink/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="paper-card w-full max-w-sm p-6 rounded-2xl shadow-paper-lg relative overflow-hidden border border-storybook-border"
          >
            {/* Corner deco */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-storybook-blush/60 blur-2xl" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-storybook-border pb-3 mb-4 relative">
              <h2 className="font-serif-title text-lg text-storybook-ink">
                ⚙️ Settings
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="paper-card px-2.5 py-1 rounded-full text-xs text-storybook-ink hover:border-storybook-rose transition-colors cursor-pointer"
                title="Close settings"
              >
                ✕
              </button>
            </div>

            <p className="font-handwriting text-base text-storybook-roseDark mb-4 relative">
              Send our date story to which email? 🌸
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
              className="w-full bg-[#fcf8f2] border-2 border-storybook-border rounded-xl px-4 py-3 text-sm font-sans text-storybook-ink placeholder-storybook-inkLight focus:outline-none focus:border-storybook-rose transition-all relative"
            />

            {error && (
              <p className="font-handwriting text-sm text-storybook-roseDark mt-2 relative">
                ⚠️ {error}
              </p>
            )}

            {initialEmail && (
              <p className="font-sans text-xs text-storybook-inkLight mt-2 relative">
                Currently set: <span className="text-storybook-roseDark font-semibold">{initialEmail}</span>
              </p>
            )}

            <div className="flex gap-3 mt-6 relative">
              <button
                type="button"
                onClick={onClose}
                className="story-btn-secondary flex-1 py-3 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="story-btn-primary flex-1 py-3 text-sm cursor-pointer"
              >
                Save 🌸
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};