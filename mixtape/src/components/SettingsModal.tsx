import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface SettingsModalProps {
  currentEmail: string;
  onSave: (email: string) => void;
  onClose: () => void;
}

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentEmail,
  onSave,
  onClose
}) => {
  const [emailInput, setEmailInput] = useState<string>(() => currentEmail || APP_CONFIG.prefillEmail || '');
  const [error, setError] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setError('Please enter an email address so the date itinerary can be sent.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    sound.playChime();
    onSave(cleanEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="walkman-faceplate max-w-md w-full p-6 sm:p-7 rounded-3xl relative border border-[#5a483a] shadow-2xl"
      >
        <div className="screw-fastener absolute left-3 top-3" />
        <div className="screw-fastener absolute right-3 top-3" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#44382f] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="font-mono text-xs sm:text-sm tracking-wider uppercase font-bold text-[#d4af37]">
              DISPATCH DESTINATION SETTINGS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playButtonClunk();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#2a221b] border border-[#5a483a] text-[#ede3d8] flex items-center justify-center text-xs font-bold cursor-pointer hover:border-[#d4af37]"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="mixtape-card p-4 rounded-xl">
            <label className="block font-serif text-xs font-bold text-[#2d221c] mb-1">
              Email to receive confirmed date itinerary:
            </label>
            <p className="text-[10px] text-[#6d5a4e] mb-2 leading-relaxed font-sans">
              When {APP_CONFIG.girlfriendName} presses record, FormSubmit will dispatch the complete plan to this address.
            </p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. yourname@gmail.com"
              className="w-full bg-[#fffdfa] border border-[#decbb2] rounded-lg p-2.5 text-xs font-mono text-[#2d221c] focus:outline-none focus:border-[#c96f4a] focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
            />
            {error && (
              <p className="text-[10px] text-red-600 font-bold mt-1.5">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playButtonClunk();
                onClose();
              }}
              className="btn-transport px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-transport-primary px-6 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer shadow-md"
            >
              SAVE SETTINGS
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};