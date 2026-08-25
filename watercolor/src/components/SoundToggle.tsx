import React, { useState } from 'react';
import { watercolorAudio } from '../utils/watercolorAudio';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(watercolorAudio.getIsMuted());

  const handleToggle = () => {
    const active = watercolorAudio.toggleMute();
    setIsMuted(!active);
    if (active) {
      watercolorAudio.playWaterDrip(1.2);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="paper-card px-3 py-1.5 rounded-full text-xs font-medium text-storybook-ink flex items-center gap-1.5 hover:border-storybook-rose transition-colors cursor-pointer"
      title="Toggle watercolor sound effects & melody"
    >
      <span>{isMuted ? '🔇' : '🎵'}</span>
      <span className="hidden sm:inline font-handwriting text-sm">{isMuted ? 'Muted' : 'Melody'}</span>
    </button>
  );
};
