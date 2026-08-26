import React, { useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects';

export const GraphicEqualizer: React.FC = () => {
  const [bass, setBass] = useState<number>(() => {
    const saved = localStorage.getItem('mixtape_eq_bass');
    return saved ? Number(saved) : 0;
  });
  const [mid, setMid] = useState<number>(() => {
    const saved = localStorage.getItem('mixtape_eq_mid');
    return saved ? Number(saved) : 0;
  });
  const [treble, setTreble] = useState<number>(() => {
    const saved = localStorage.getItem('mixtape_eq_treble');
    return saved ? Number(saved) : 0;
  });
  const [isMegaBass, setIsMegaBass] = useState<boolean>(() => sound.getIsMegaBass());

  useEffect(() => {
    sound.setEQ(bass, mid, treble);
    localStorage.setItem('mixtape_eq_bass', String(bass));
    localStorage.setItem('mixtape_eq_mid', String(mid));
    localStorage.setItem('mixtape_eq_treble', String(treble));
  }, [bass, mid, treble]);

  const handleMegaBassToggle = () => {
    const next = !isMegaBass;
    setIsMegaBass(next);
    sound.setMegaBass(next);
  };

  return (
    <div className="bg-[#1a1411] border border-[#44382f] rounded-2xl p-3 sm:p-4 select-none shadow-inner">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-[#362b23] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎚️</span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-bold">
            GRAPHIC EQUALIZER
          </span>
        </div>

        {/* Mega Bass Toggle Button */}
        <button
          type="button"
          onClick={handleMegaBassToggle}
          className={`px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isMegaBass
              ? 'bg-[#3d1a10] border-[#c96f4a] text-[#f2e6d8] shadow-[0_0_10px_rgba(201,111,74,0.4)]'
              : 'bg-[#251e18] border-[#4a3e35] text-[#8c7a6b] hover:border-[#d4af37]'
          }`}
          title="Toggle Mega Bass Low-End Saturation Boost"
        >
          <div className={`micro-led ${isMegaBass ? 'active-amber' : ''}`} />
          <span>MEGA BASS™</span>
        </button>
      </div>

      {/* 3 Vertical Faders Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Bass Slider */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-mono text-[#8a7568] mb-1">+10dB</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={bass}
            onChange={(e) => setBass(Number(e.target.value))}
            className="w-full h-1.5 bg-[#2a221b] accent-[#d4af37] rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between w-full text-[8px] font-mono text-[#8a7568] mt-1">
            <span>-10</span>
            <span className="text-[#d4af37] font-bold">{bass > 0 ? `+${bass}` : bass}</span>
          </div>
          <span className="text-[9px] font-mono text-[#f4ebd9] font-bold mt-0.5">BASS</span>
          <span className="text-[7px] font-mono text-[#6d5a4e]">150 Hz</span>
        </div>

        {/* Mid Slider */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-mono text-[#8a7568] mb-1">+10dB</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={mid}
            onChange={(e) => setMid(Number(e.target.value))}
            className="w-full h-1.5 bg-[#2a221b] accent-[#d4af37] rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between w-full text-[8px] font-mono text-[#8a7568] mt-1">
            <span>-10</span>
            <span className="text-[#d4af37] font-bold">{mid > 0 ? `+${mid}` : mid}</span>
          </div>
          <span className="text-[9px] font-mono text-[#f4ebd9] font-bold mt-0.5">MID</span>
          <span className="text-[7px] font-mono text-[#6d5a4e]">1.2 kHz</span>
        </div>

        {/* Treble Slider */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-mono text-[#8a7568] mb-1">+10dB</span>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={treble}
            onChange={(e) => setTreble(Number(e.target.value))}
            className="w-full h-1.5 bg-[#2a221b] accent-[#d4af37] rounded-lg cursor-pointer"
          />
          <div className="flex items-center justify-between w-full text-[8px] font-mono text-[#8a7568] mt-1">
            <span>-10</span>
            <span className="text-[#d4af37] font-bold">{treble > 0 ? `+${treble}` : treble}</span>
          </div>
          <span className="text-[9px] font-mono text-[#f4ebd9] font-bold mt-0.5">TREBLE</span>
          <span className="text-[7px] font-mono text-[#6d5a4e]">3.5 kHz</span>
        </div>
      </div>
    </div>
  );
};
