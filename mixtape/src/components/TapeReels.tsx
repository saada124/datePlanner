import React, { useState, useRef } from 'react';
import { sound, ShellEditionId } from '../utils/soundEffects';

interface TapeReelsProps {
  currentTrack: number;
  totalTracks?: number;
  isPlaying?: boolean;
  shellEdition?: ShellEditionId;
  onManualRewind?: (stepBack: boolean) => void;
}

export const TapeReels: React.FC<TapeReelsProps> = ({
  currentTrack,
  totalTracks = 5,
  isPlaying = true,
  shellEdition = 'titanium',
  onManualRewind
}) => {
  const [isPencilHovered, setIsPencilHovered] = useState(false);
  const [isDraggingPencil, setIsDraggingPencil] = useState(false);
  const [manualRotationL, setManualRotationL] = useState(0);
  const [manualRotationR, setManualRotationR] = useState(0);
  const lastAngleRef = useRef<number | null>(null);

  // Dynamic tape volume calculation across 5 tracks
  const progress = Math.max(0, Math.min(1, (currentTrack - 1) / (totalTracks - 1)));
  const leftTapePercent = Math.round(85 - progress * 70);
  const rightTapePercent = Math.round(15 + progress * 70);

  // Hub color & material styling based on collector shell
  const getHubStyles = () => {
    switch (shellEdition) {
      case 'rose':
        return {
          coreBg: 'bg-[#4a222c]',
          borderColor: 'border-[#d88a8a]',
          teethColor: 'bg-[#fcdde2]',
          pinColor: 'bg-[#e85d75]',
          tapeGrad: 'radial-gradient(circle at 45% 40%, #5e2836 0%, #3d1420 60%, #240810 100%)'
        };
      case 'gold':
        return {
          coreBg: 'bg-[#2b2410]',
          borderColor: 'border-[#d4af37]',
          teethColor: 'bg-[#fff5d0]',
          pinColor: 'bg-[#d4af37]',
          tapeGrad: 'radial-gradient(circle at 45% 40%, #5a421d 0%, #3d2c12 60%, #241a09 100%)'
        };
      case 'chalk':
        return {
          coreBg: 'bg-[#1f1d1b]',
          borderColor: 'border-[#8a8276]',
          teethColor: 'bg-[#fffdfa]',
          pinColor: 'bg-[#dc2626]',
          tapeGrad: 'radial-gradient(circle at 45% 40%, #4a2c1d 0%, #321c11 60%, #1e1008 100%)'
        };
      default: // titanium
        return {
          coreBg: 'bg-[#2b221b]',
          borderColor: 'border-[#a8967c]',
          teethColor: 'bg-[#f4ebd9]',
          pinColor: 'bg-[#d85848]',
          tapeGrad: 'radial-gradient(circle at 45% 40%, #5a3522 0%, #3d2012 60%, #261309 100%)'
        };
    }
  };

  const hubStyle = getHubStyles();

  // Circular drag rewind calculation on desktop
  const handleMouseDown = (e: React.MouseEvent, isRight: boolean) => {
    e.preventDefault();
    setIsDraggingPencil(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    lastAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      if (lastAngleRef.current !== null) {
        let delta = currentAngle - lastAngleRef.current;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        const degDelta = (delta * 180) / Math.PI;
        sound.playTapeScratch(Math.abs(delta) * 8);

        if (isRight) {
          setManualRotationR(prev => prev + degDelta);
        } else {
          setManualRotationL(prev => prev + degDelta);
        }

        // If spun counter-clockwise significantly, notify rewind step
        if (degDelta < -35 && onManualRewind) {
          onManualRewind(true);
        }
      }
      lastAngleRef.current = currentAngle;
    };

    const handleMouseUp = () => {
      setIsDraggingPencil(false);
      lastAngleRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 1-Tap Rewind for Mobile
  const handleMobilePencilTap = () => {
    sound.playTapeScratch(2.0);
    sound.playMotorWhir();
    setManualRotationL(prev => prev - 360);
    if (onManualRewind) {
      onManualRewind(true);
    }
  };

  const renderSpool = (tapePercent: number, isRight: boolean) => {
    const tapeRadiusPx = 30 + (tapePercent / 100) * 32;
    const manualRot = isRight ? manualRotationR : manualRotationL;

    return (
      <div
        onMouseEnter={() => setIsPencilHovered(true)}
        onMouseLeave={() => setIsPencilHovered(false)}
        onMouseDown={(e) => handleMouseDown(e, isRight)}
        className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 shrink-0 cursor-grab active:cursor-grabbing group"
        title="Swirl with pencil to rewind tape!"
      >
        {/* Dynamic Magnetic Oxide Tape Layer */}
        <div
          className="absolute rounded-full transition-all duration-700 ease-out border border-black/50"
          style={{
            width: `${tapeRadiusPx * 2}px`,
            height: `${tapeRadiusPx * 2}px`,
            background: hubStyle.tapeGrad,
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.7), 0 2px 8px rgba(0, 0, 0, 0.6)'
          }}
        />

        {/* Cassette Hub Ring */}
        <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f4ebd9] border-2 border-[#b5a388] shadow-inner flex items-center justify-center z-10">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full relative flex items-center justify-center ${hubStyle.coreBg} border ${hubStyle.borderColor} ${
              isPlaying && !isDraggingPencil ? (isRight ? 'animate-reel-spin' : 'animate-reel-spin-slow') : ''
            }`}
            style={{
              transform: isDraggingPencil ? `rotate(${manualRot}deg)` : undefined
            }}
          >
            {/* 6 Drive Teeth */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div
                key={deg}
                className={`absolute w-1.5 h-3.5 ${hubStyle.teethColor} rounded-xs shadow-xs`}
                style={{
                  transform: `rotate(${deg}deg) translateY(-8px)`
                }}
              />
            ))}

            {/* Hub Center Pin Dot */}
            <div className={`w-2.5 h-2.5 rounded-full ${hubStyle.pinColor} border border-[#f4ebd9] z-20`} />
          </div>
        </div>

        {/* Vintage Yellow Pencil Cursor Tool on Hover */}
        {isPencilHovered && (
          <div className="absolute -top-3 -right-2 z-30 pointer-events-none transform rotate-45 transition-transform group-hover:scale-110 drop-shadow-md">
            <span className="text-xl">✏️</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-28 sm:h-32 px-3 sm:px-4 flex items-center justify-between overflow-hidden">
      {/* Tape Path Bridge Line */}
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-[#4a2c1d] via-[#3a2014] to-[#4a2c1d] opacity-80 rounded-full z-0" />

      {/* Left Feed Spool */}
      <div className="z-10 flex flex-col items-center">
        {renderSpool(leftTapePercent, false)}
        <span className="text-[8px] font-mono text-[#8c7a6b] uppercase tracking-widest mt-0.5">
          FEED · {leftTapePercent}%
        </span>
      </div>

      {/* Center Magnetic Head & Inscription */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-2 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#d4af37] font-semibold bg-[#2a221b] px-2 py-0.5 rounded border border-[#6b5847]">
            SIDE A
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#a89888]">
            STEREO
          </span>
        </div>

        {/* Read Head Graphic */}
        <div className="w-14 sm:w-16 h-4 bg-gradient-to-b from-[#6b5847] to-[#3a2e24] rounded-t-sm border border-[#8a7561] flex items-center justify-center shadow-md">
          <div className="w-6 h-1.5 bg-[#18130f] rounded-xs border border-[#a8967c]/40" />
        </div>
        <div className="w-20 sm:w-24 h-1.5 bg-[#241c16] rounded-b-md border-x border-b border-[#5a483a]" />

        {/* 80s Pencil Trick Hint / Mobile Action Button */}
        <div className="flex items-center gap-1 mt-1">
          <button
            type="button"
            onClick={handleMobilePencilTap}
            className="sm:hidden px-2 py-0.5 rounded-full bg-[#362b22] border border-[#6b5847] text-[8px] font-mono text-[#d4af37] flex items-center gap-1 shadow-sm"
          >
            <span>✏️ TAP TO REWIND</span>
          </button>
          <span className="hidden sm:inline text-[8px] font-mono text-[#8c7a6b] tracking-wider">
            ✏️ SWIRL SPOOL TO REWIND
          </span>
        </div>
      </div>

      {/* Right Take-Up Spool */}
      <div className="z-10 flex flex-col items-center">
        {renderSpool(rightTapePercent, true)}
        <span className="text-[8px] font-mono text-[#8c7a6b] uppercase tracking-widest mt-0.5">
          TAKE-UP · {rightTapePercent}%
        </span>
      </div>
    </div>
  );
};
