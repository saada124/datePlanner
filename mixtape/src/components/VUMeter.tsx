import React, { useEffect, useState } from 'react';
import { sound } from '../utils/soundEffects';

interface VUMeterProps {
  isPlaying?: boolean;
}

export const VUMeter: React.FC<VUMeterProps> = ({ isPlaying = true }) => {
  const [levelL, setLevelL] = useState(0.2);
  const [levelR, setLevelR] = useState(0.2);

  useEffect(() => {
    let animFrame: number;
    let phase = 0;

    const updateNeedles = () => {
      phase += 0.05;
      if (isPlaying && !sound.getIsMuted()) {
        const raw = sound.getAudioLevel();
        const jitterL = Math.sin(phase * 2.3) * 0.08 + (Math.random() - 0.5) * 0.06;
        const jitterR = Math.cos(phase * 2.7) * 0.08 + (Math.random() - 0.5) * 0.06;
        setLevelL(Math.max(0.05, Math.min(1.0, raw + jitterL)));
        setLevelR(Math.max(0.05, Math.min(1.0, raw + jitterR)));
      } else {
        // Gentle rhythmic idle bounce
        const idle = 0.12 + Math.sin(phase) * 0.04;
        setLevelL(idle);
        setLevelR(idle);
      }
      animFrame = requestAnimationFrame(updateNeedles);
    };

    updateNeedles();
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  // Convert level 0.0-1.0 to needle angle: -38deg to +34deg
  const angleL = -38 + levelL * 72;
  const angleR = -38 + levelR * 72;

  const renderSingleGauge = (label: string, angle: number, level: number) => {
    const isPeak = level > 0.82;

    return (
      <div className="flex-1 max-w-[120px] sm:max-w-[140px] flex flex-col items-center">
        <div className="vu-gauge w-full h-11 sm:h-13 px-2 pt-1 pb-0 flex flex-col justify-between select-none relative">
          {/* Backlit amber glow overlay */}
          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />

          {/* Scale Labels & Tick marks */}
          <div className="flex justify-between items-center text-[7px] font-mono tracking-tighter text-[#5c4738] z-10 pt-0.5">
            <span>-20</span>
            <span>-7</span>
            <span>0</span>
            <span className="text-red-700 font-bold">+3</span>
          </div>

          {/* Scale Arc SVG */}
          <svg viewBox="0 0 100 24" className="w-full h-4 z-10 overflow-visible">
            {/* Safe zone arc (black/brown ticks) */}
            <path
              d="M 10,20 A 45,45 0 0,1 72,6"
              fill="none"
              stroke="#5c4738"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Redline peak zone */}
            <path
              d="M 72,6 A 45,45 0 0,1 92,16"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.8"
            />
          </svg>

          {/* Pivot & Needle */}
          <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2a1e17] border-2 border-[#8c735d] flex items-center justify-center z-20">
            <div
              className="vu-needle absolute bottom-[14px] left-[15px] w-[1.5px] h-[36px] bg-[#1a120c] origin-bottom rounded-t-sm"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              {/* Red needle tip */}
              <div className="w-full h-3 bg-red-600 rounded-t-sm" />
            </div>
          </div>

          {/* Peak LED indicator */}
          <div className="absolute top-1 right-1.5 flex items-center gap-1 z-20">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-75 ${
                isPeak
                  ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                  : 'bg-[#5c4738]/40'
              }`}
            />
          </div>
        </div>

        {/* Channel Label */}
        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-mono text-[#a89888] uppercase tracking-wider">
          <span>{label}</span>
          <span className="text-[7px] text-[#7a6c5f]">VU</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 w-full px-2 py-1">
      {renderSingleGauge('CH · L', angleL, levelL)}
      {renderSingleGauge('CH · R', angleR, levelR)}
    </div>
  );
};
