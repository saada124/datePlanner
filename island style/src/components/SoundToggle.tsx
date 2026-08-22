import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { islandSound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(islandSound.getIsMuted());

  const handleToggle = () => {
    const active = islandSound.toggleMute();
    setMuted(!active);
    if (active) {
      islandSound.playPop();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2.5 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-md border-2 border-emerald-300 hover:border-emerald-400 transition-all btn-nook-bounce flex items-center justify-center"
      title={muted ? "Unmute Sound" : "Mute Sound"}
    >
      {muted ? <VolumeX className="w-5 h-5 text-stone-400" /> : <Volume2 className="w-5 h-5 text-emerald-600 animate-pulse" />}
    </button>
  );
};
