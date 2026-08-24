import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSave: (email: string) => void;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSave
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setError('Please enter an email address so the date order can be received.');
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    menuSound.playPenTick();
    onSave(trimmed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2B1B17]/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            className="relative bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-paper-lg z-10 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                    Order Notification Setup
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Table N° 07 · Direct Dispatch
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
              When {APP_CONFIG.girlfriendName} confirms her date order, the full ticket summary is automatically dispatched to this email address via FormSubmit.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="settings-email" className="block text-xs font-bold text-[var(--text-primary)] mb-1 font-mono uppercase tracking-wider">
                  Partner Email Address
                </label>
                <div className="relative">
                  <input
                    id="settings-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError('');
                    }}
                    placeholder="partner@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-chip)] border border-[var(--border-card)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8635A]"
                  />
                  <Mail className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-3.5" />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#E8635A]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-card)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#E8635A] hover:bg-[#D45048] text-white text-xs font-serif font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Email</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
