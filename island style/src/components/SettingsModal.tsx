import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Info } from 'lucide-react';
import { islandSound } from '../utils/soundEffects';

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
      islandSound.playWobble();
      return;
    }
    setError('');
    onSave(trimmed);
    islandSound.playSuccess();
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
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className="relative bg-[#fffef5] rounded-3xl border-4 border-emerald-400 p-6 md:p-8 max-w-md w-full shadow-bubble z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-bold text-stone-800">Flight Mailbox Settings</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">
                  Recipient Notification Email:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError('');
                    }}
                    placeholder="your-email@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:border-emerald-500 text-stone-800 font-medium"
                  />
                </div>
                {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  When your date confirms the plan, Dodo Airlines will dispatch the complete itinerary directly to this inbox! 📬
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-nook-btn btn-nook-bounce flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <CheckCircle className="w-5 h-5" /> Saved!
                    </>
                  ) : (
                    'Save Settings'
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
