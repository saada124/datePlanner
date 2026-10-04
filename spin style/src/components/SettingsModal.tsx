import React, { useState } from 'react';
import { X, Mail, Heart, Check, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEmail: string;
  onSaveEmail: (email: string) => void;
  savedGirlfriendName: string;
  onSaveGirlfriendName: (name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  savedEmail,
  onSaveEmail,
  savedGirlfriendName,
  onSaveGirlfriendName,
}) => {
  const [emailInput, setEmailInput] = useState(savedEmail || APP_CONFIG.prefillEmail);
  const [nameInput, setNameInput] = useState(savedGirlfriendName || APP_CONFIG.girlfriendName);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEmail(emailInput.trim());
    onSaveGirlfriendName(nameInput.trim());
    sounds.playWinFanfare();
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carnival-bgDark/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md carnival-card p-6 border-2 border-carnival-border shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-carnival-bg hover:bg-carnival-cardLight text-carnival-creamMuted hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-carnival-pink/20 text-carnival-pink">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-carnival-cream">
              Date Settings
            </h2>
            <p className="text-xs text-carnival-creamMuted">
              Configure your email and personalization
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Email Setting */}
          <div>
            <label className="block text-sm font-display font-semibold text-carnival-gold mb-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              Your Email Address (FormSubmit)
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-carnival-bg border-2 border-carnival-border text-carnival-cream placeholder:text-carnival-creamMuted/40 focus:outline-none focus:border-carnival-pink transition-all font-sans text-sm"
              required
            />
            <p className="text-xs text-carnival-creamMuted/80 mt-1 leading-relaxed">
              When she locks in her final spin, FormSubmit will dispatch the winning date ticket here.
              <span className="text-carnival-yellow block mt-0.5 font-medium">
                ★ First time: Check your inbox for a 1-click activation link!
              </span>
            </p>
          </div>

          {/* Girlfriend's Name Setting */}
          <div>
            <label className="block text-sm font-display font-semibold text-carnival-pink mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              Her Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full px-4 py-3 rounded-xl bg-carnival-bg border-2 border-carnival-border text-carnival-cream placeholder:text-carnival-creamMuted/40 focus:outline-none focus:border-carnival-pink transition-all font-sans text-sm"
            />
          </div>

          {/* Save Button */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 btn-arcade btn-arcade-lime py-3 text-base"
            >
              {showSavedToast ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" /> Saved!
                </span>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
