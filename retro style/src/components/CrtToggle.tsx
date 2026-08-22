import React from 'react';
import { sound } from '../utils/soundEffects';

interface CrtToggleProps {
  crtEnabled: boolean;
  onToggle: () => void;
}

export const CrtToggle: React.FC<CrtToggleProps> = ({ crtEnabled, onToggle }) => {
  const handleClick = () => {
    sound.playSelect();
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className={`pixel-box px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 transition-colors cursor-pointer ${
        crtEnabled ? 'bg-retro-pink text-white' : 'bg-retro-cream text-retro-dark hover:bg-retro-pinkLight'
      }`}
      title="Toggle retro CRT scanlines"
    >
      <span>📺</span>
      <span className="hidden sm:inline">CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
    </button>
  );
};
