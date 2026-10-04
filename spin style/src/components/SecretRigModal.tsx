import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { OptionItem } from '../types';
import { sounds } from '../utils/sound';

interface SecretRigModalProps {
  isOpen: boolean;
  onClose: () => void;
  vibeOptions: OptionItem[];
  activityOptions: OptionItem[];
  dressCodeOptions: OptionItem[];
  riggedConfig?: {
    vibeId?: string | null;
    activityId?: string | null;
    dressCodeId?: string | null;
  };
  onSetRiggedConfig: (config: { vibeId?: string | null; activityId?: string | null; dressCodeId?: string | null }) => void;
}

export const SecretRigModal: React.FC<SecretRigModalProps> = ({
  isOpen,
  onClose,
  vibeOptions,
  activityOptions,
  dressCodeOptions,
  riggedConfig,
  onSetRiggedConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'vibe' | 'activity' | 'dressCode'>('activity');

  if (!isOpen) return null;

  const currentOptions = 
    activeTab === 'vibe' ? vibeOptions :
    activeTab === 'activity' ? activityOptions : dressCodeOptions;

  const currentRiggedId = 
    activeTab === 'vibe' ? riggedConfig?.vibeId :
    activeTab === 'activity' ? riggedConfig?.activityId : riggedConfig?.dressCodeId;

  const handleSelectOption = (id: string | null) => {
    sounds.playWinFanfare();
    onSetRiggedConfig({
      ...riggedConfig,
      [activeTab === 'vibe' ? 'vibeId' : activeTab === 'activity' ? 'activityId' : 'dressCodeId']: id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md carnival-card p-6 border-2 border-carnival-pink shadow-2xl space-y-4">
        {/* Close */}
        <button
          onClick={() => {
            sounds.playPop(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-carnival-bg hover:bg-carnival-cardLight text-carnival-creamMuted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-carnival-pink/20 text-carnival-pink">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-carnival-cream flex items-center gap-1.5">
              Secret Rigging Booth 🤫
            </h3>
            <p className="text-xs text-carnival-creamMuted">
              Pre-select the exact winning item for each reel
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-carnival-bg/90 p-1 border border-carnival-border/50">
          <button
            type="button"
            onClick={() => setActiveTab('vibe')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
              activeTab === 'vibe'
                ? 'bg-carnival-pink text-white shadow'
                : 'text-carnival-creamMuted hover:text-white'
            }`}
          >
            ✨ The Vibe
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
              activeTab === 'activity'
                ? 'bg-carnival-teal text-carnival-bgDark shadow'
                : 'text-carnival-creamMuted hover:text-white'
            }`}
          >
            🎡 Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dressCode')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${
              activeTab === 'dressCode'
                ? 'bg-carnival-yellow text-carnival-bgDark shadow'
                : 'text-carnival-creamMuted hover:text-white'
            }`}
          >
            👗 Dress Code
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {/* Random Option */}
          <button
            type="button"
            onClick={() => handleSelectOption(null)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-display font-semibold transition-all ${
              !currentRiggedId
                ? 'bg-carnival-pink/20 border-carnival-pink text-carnival-cream'
                : 'bg-carnival-bg/60 border-carnival-border/50 text-carnival-creamMuted hover:bg-carnival-bg'
            }`}
          >
            <span>🎲 100% Fair Random Reel</span>
            {!currentRiggedId && <Check className="w-4 h-4 text-carnival-pink" />}
          </button>

          {currentOptions.map((opt) => {
            const isSelected = currentRiggedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-display font-semibold transition-all ${
                  isSelected
                    ? 'bg-carnival-lime/20 border-carnival-lime text-carnival-lime font-bold'
                    : 'bg-carnival-bg/60 border-carnival-border/50 text-carnival-creamMuted hover:bg-carnival-bg'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-carnival-lime" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playArcadePress();
              onClose();
            }}
            className="w-full btn-arcade btn-arcade-lime py-2.5 text-sm"
          >
            Lock Secret &amp; Close 🤫
          </button>
        </div>
      </div>
    </div>
  );
};
