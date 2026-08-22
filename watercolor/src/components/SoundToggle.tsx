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
      className="paper-card px-3 py-1.5 rounded-full text-xs font-medium text-storybook-ink flex items-center gap-1.5 hover:border-storybook-rose transition-colors cursor-pointer"
      title="Toggle soft acoustic chimes"
    >
      <span>{isMuted ? '🔇' : '🎵'}</span>
      <span className="hidden sm:inline font-handwriting text-sm">{isMuted ? 'Muted' : 'Melody'}</span>
    </button>
  );
};
