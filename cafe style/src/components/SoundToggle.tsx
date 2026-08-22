import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { bistroSound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(bistroSound.getIsMuted());

  const handleToggle = () => {
    const active = bistroSound.toggleMute();
    setMuted(!active);
    if (active) {
      bistroSound.playClink();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2.5 bg-[#fffdfa] hover:bg-[#f7f2ea] text-[#442b1d] rounded-full shadow-sm border border-[#e7dccc] transition-all flex items-center justify-center cursor-pointer"
      title={muted ? "Unmute Bistro Audio" : "Mute Audio"}
    >
      {muted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />}
    </button>
  );
};
