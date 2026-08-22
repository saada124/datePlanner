import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggle = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
    if (active) {
      sound.playCrystalChime();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="cosmic-card px-3.5 py-1.5 rounded-full text-xs font-medium text-midnight-text flex items-center gap-2 hover:border-midnight-purple transition-all cursor-pointer shadow-sm"
      title="Toggle celestial sound effects"
    >
      <span>{isMuted ? '🔇' : '✨'}</span>
      <span className="hidden sm:inline font-sans text-xs">{isMuted ? 'Muted' : 'Cosmic Audio'}</span>
    </button>
  );
};
