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
      sound.playShootingStar();
      setError('Please enter an email address.');
      return;
    }
    if (!isValidEmail(trimmed)) {
      sound.playShootingStar();
      setError("That email doesn't look quite right. Try again!");
      return;
    }
    sound.playCrystalChime();
    onSave(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="cosmic-card-glow w-full max-w-sm p-6 rounded-3xl relative overflow-hidden border border-white/10"
          >
            {/* Glow accents */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-midnight-neonPink/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-midnight-neonCyan/20 rounded-full blur-3xl" />

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 relative">
              <h2 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                ⚙️ STARLIGHT SETTINGS
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="cosmic-card px-2.5 py-1 rounded-full text-xs text-midnight-text hover:border-midnight-neonPink transition-all cursor-pointer"
                title="Close settings"
              >
                ✕
              </button>
            </div>

            <p className="font-sans text-xs text-midnight-lavender mb-4 relative">
              Send the date results to which email? 🌌
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
              className="w-full bg-black/30 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-midnight-textMuted focus:outline-none focus:border-midnight-neonPink transition-all relative"
            />

            {error && (
              <p className="font-sans text-xs text-midnight-neonPink mt-2 relative">
                ⚠️ {error}
              </p>
            )}

            {initialEmail && (
              <p className="font-sans text-xs text-midnight-textMuted mt-2 relative">
                Currently set: <span className="text-midnight-starlight font-semibold">{initialEmail}</span>
              </p>
            )}

            <div className="flex gap-3 mt-6 relative">
              <button
                type="button"
                onClick={onClose}
                className="cosmic-btn-secondary flex-1 py-3 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="cosmic-btn-primary flex-1 py-3 text-xs font-bold cursor-pointer shadow-neon-pink"
              >
                Save ✨
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};