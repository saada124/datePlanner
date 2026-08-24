import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { menuSound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(menuSound.getIsMuted());

  const handleToggle = () => {
    const isNowMuted = !menuSound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      menuSound.playPenTick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-highlight)] text-[var(--text-primary)] rounded-full shadow-xs border border-[var(--border-card)] transition-all flex items-center justify-center cursor-pointer"
      title={muted ? "Unmute Sound" : "Mute Sound"}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-[var(--text-secondary)]" />
      ) : (
        <Volume2 className="w-4 h-4 text-[#E8635A]" />
      )}
    </button>
  );
};
