import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Info } from 'lucide-react';
import { bistroSound } from '../utils/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSave: (email: string) => void;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSave,
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!isValidEmail(trimmed)) {
      setError('Please enter a valid email address.');
      bistroSound.playFlutter();
      return;
    }
    setError('');
    onSave(trimmed);
    bistroSound.playSuccessChime();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
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
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className="relative bg-[#fffdfa] rounded-3xl border border-[#e7dccc] p-6 md:p-8 max-w-md w-full shadow-menu z-10 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e7dccc]">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h3 className="font-serif font-bold text-xl text-[#2b231f]">Reservation Notification</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 font-mono">
                  Bistro Recipient Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError('');
                    }}
                    placeholder="your-email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#f7f2ea] border border-[#e7dccc] rounded-xl focus:outline-none focus:border-amber-700 text-[#2b231f] font-medium text-sm"
                  />
                </div>
                {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
              </div>

              <div className="p-3.5 bg-[#fbf5eb] border border-[#ebdcc7] rounded-xl flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  When your date confirms the bistro order, the complete receipt will be sent directly to this address. ☕
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#80182a] hover:bg-[#681322] text-white font-serif font-bold rounded-xl shadow-sm flex items-center gap-2 text-sm cursor-pointer transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" /> Saved!
                    </>
                  ) : (
                    'Save Email'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
