import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getIsMuted());

  const handleToggle = () => {
    sound.unlock();
    const active = sound.toggleMute();
    setIsMuted(!active);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a221b] border border-[#5a483a] text-xs font-mono text-[#d4af37] hover:border-[#d4af37] transition-all cursor-pointer shadow-sm"
      title={isMuted ? 'Unmute Lo-Fi Audio' : 'Mute Lo-Fi Audio'}
      aria-label="Toggle Sound"
    >
      <span>{isMuted ? '🔇' : '🔊'}</span>
      <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-bold">
        {isMuted ? 'AUDIO OFF' : 'LO-FI ON'}
      </span>
      <div className={`w-1.5 h-1.5 rounded-full ${isMuted ? 'bg-red-500' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'}`} />
    </button>
  );
};