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
      className="win95-btn win95-btn-sm cursor-pointer"
      title="Toggle system sounds"
    >
      {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
    </button>
  );
};