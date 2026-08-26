import React from 'react';

interface MechanicalCounterProps {
  currentTrack: number;
}

export const MechanicalCounter: React.FC<MechanicalCounterProps> = ({ currentTrack }) => {
  const formattedTrack = String(currentTrack).padStart(3, '0');

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="flex items-center bg-[#181310] px-2.5 py-1 rounded-md border border-[#524338] shadow-inner">
        <span className="text-[9px] font-mono tracking-widest text-[#a8967c] mr-2 uppercase">
          TAPE POS
        </span>
        <div className="flex gap-1">
          {formattedTrack.split('').map((digit, i) => (
            <div
              key={i}
              className="w-4 h-6 bg-gradient-to-b from-[#241c17] via-[#120e0b] to-[#241c17] border border-[#4a3b30] rounded-xs flex items-center justify-center text-xs font-mono font-bold text-[#f2e6d8] shadow-sm relative overflow-hidden"
            >
              {/* Subtle drum division line */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.5px] bg-black/50 pointer-events-none" />
              <span>{digit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
