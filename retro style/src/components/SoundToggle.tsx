import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const handleToggle = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
    if (active) {
      sound.playSelect();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="pixel-box bg-retro-cream px-3 py-1.5 text-xs font-pixel flex items-center gap-2 hover:bg-retro-pinkLight transition-colors cursor-pointer"
      title="Toggle retro chiptune sound effects"
    >
      <span>{isMuted ? '🔇' : '🔊'}</span>
      <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'SOUND'}</span>
    </button>
  );
};
