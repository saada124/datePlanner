import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggle = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
    if (active) {
      sound.playChime();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="jcard-card px-3 py-1.5 rounded-full text-xs font-medium text-mixtape-coffee flex items-center gap-1.5 hover:border-mixtape-rose transition-colors cursor-pointer"
      title="Toggle cassette sounds"
    >
      <span>{isMuted ? '🔇' : '🎵'}</span>
      <span className="hidden sm:inline font-handwriting text-sm">{isMuted ? 'Muted' : 'Melody'}</span>
    </button>
  );
};