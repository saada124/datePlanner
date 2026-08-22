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
      setError('Invalid email format. Please try again.');
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="win95-window w-full max-w-sm"
          >
            <div className="win95-titlebar flex items-center justify-between px-1.5 py-1 select-none">
              <span className="flex items-center gap-1.5 text-xs text-win95-white">
                <span>⚙️</span>
                <span className="font-bold">Email Settings</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="win95-btn win95-btn-sm cursor-pointer"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="text-xs text-win95-black mb-2">
                Send the date setup report to which email?
              </div>

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
                className="win95-field w-full"
              />

              {error && (
                <p className="text-[11px] text-win95-navy mt-1.5">⚠️ {error}</p>
              )}

              {initialEmail && (
                <p className="text-[11px] text-win95-grayDark mt-1.5">
                  Currently set: <span className="font-bold text-win95-black">{initialEmail}</span>
                </p>
              )}

              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={onClose} className="win95-btn cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} className="win95-btn font-bold cursor-pointer">
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};