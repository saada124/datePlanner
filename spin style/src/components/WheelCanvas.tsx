import React, { useEffect, useRef } from 'react';
import { OptionItem } from '../types';
import { APP_CONFIG, getOptionEmoji } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface WheelCanvasProps {
  options: OptionItem[];
  rotationAngle: number; // in radians
  isSpinning: boolean;
  onSliceCross?: () => void;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  options,
  rotationAngle,
  isSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastSliceIndexRef = useRef<number>(-1);
  const needleFlickRef = useRef<number>(0);

  const numSlices = Math.max(options.length, 1);
  const sliceAngle = (2 * Math.PI) / numSlices;
  const colors = APP_CONFIG.segmentColors;

  // Track slice crossing for tick sounds and pointer wiggle
  useEffect(() => {
    if (numSlices === 0) return;
    const normalizedAngle = (3 * Math.PI / 2 - (rotationAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentSlice = Math.floor(normalizedAngle / sliceAngle) % numSlices;

    if (lastSliceIndexRef.current !== -1 && lastSliceIndexRef.current !== currentSlice) {
      sounds.playTick();
      needleFlickRef.current = 1; // trigger pointer animation
    }
    lastSliceIndexRef.current = currentSlice;
  }, [rotationAngle, numSlices, sliceAngle]);

  // Main Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.clientWidth, canvas.clientHeight) || 400;
    
    // Set actual canvas resolution for crisp display
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.44;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw Outer Marquee Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#1F0E34';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFD15C';
    ctx.stroke();

    // Outer Glow Ring
    ctx.shadowColor = 'rgba(255, 209, 92, 0.4)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // 2. Draw Wheel Slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const colorScheme = colors[i % colors.length];
      const option = options[i];

      // Draw slice wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colorScheme.hex;
      ctx.fill();

      // Divider line
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#2E1A47';
      ctx.stroke();

      // Draw Text & Emoji along slice radial axis
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colorScheme.text;

      // Emoji
      const emoji = getOptionEmoji(option);
      ctx.font = `${Math.max(16, Math.min(26, 260 / numSlices + 8))}px sans-serif`;
      ctx.fillText(emoji, radius - 16, 0);

      // Label text
      const maxTextLength = numSlices > 10 ? 12 : 16;
      let label = option.label;
      if (label.length > maxTextLength) {
        label = label.slice(0, maxTextLength - 1) + '…';
      }

      ctx.font = `bold ${Math.max(12, Math.min(17, 180 / numSlices + 6))}px "Fredoka", "Baloo 2", sans-serif`;
      ctx.fillText(label, radius - 48, 0);

      ctx.restore();
    }

    ctx.restore();

    // 3. Draw Perimeter Carnival Marquee Bulbs
    const numBulbs = Math.max(16, numSlices * 2);
    for (let b = 0; b < numBulbs; b++) {
      const bulbAngle = (b * (2 * Math.PI)) / numBulbs;
      const bx = centerX + (radius + 9) * Math.cos(bulbAngle);
      const by = centerY + (radius + 9) * Math.sin(bulbAngle);
      const isLit = (b % 2 === 0) !== (Math.floor(Date.now() / 400) % 2 === 0);

      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, 2 * Math.PI);
      ctx.fillStyle = isLit ? '#FFE794' : '#FF7A3D';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }

    // 4. Draw Center Carnival Hub
    ctx.save();
    // Outer Gold Rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD15C';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#B38100';
    ctx.stroke();

    // Inner Purple Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#2E1A47';
    ctx.fill();

    // Center Star / Symbol
    ctx.fillStyle = '#FFF8EC';
    ctx.font = 'bold 18px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎪', centerX, centerY);
    ctx.restore();

  }, [options, rotationAngle, numSlices, sliceAngle, colors]);

  // Pointer Needle Deflection Decay
  useEffect(() => {
    if (needleFlickRef.current > 0) {
      const timeout = setTimeout(() => {
        needleFlickRef.current = 0;
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [rotationAngle]);

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
      {/* Dynamic Wheel Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full drop-shadow-2xl cursor-pointer"
        style={{ touchAction: 'none' }}
      />

      {/* Fixed Top Pointer at 12 o'clock */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-transform duration-75 origin-top"
        style={{
          transform: `translateX(-50%) rotate(${isSpinning && needleFlickRef.current ? '-12deg' : '0deg'})`,
        }}
      >
        <svg width="44" height="48" viewBox="0 0 44 48" fill="none" className="drop-shadow-lg">
          {/* Outer Pointer Shadow / Border */}
          <path
            d="M22 46L8 10C6.5 6.5 9 2 13 2H31C35 2 37.5 6.5 36 10L22 46Z"
            fill="#D99B16"
          />
          {/* Inner Golden Arrow */}
          <path
            d="M22 42L10 10C9 7 11 4 14.5 4H29.5C33 4 35 7 34 10L22 42Z"
            fill="#FFD15C"
          />
          {/* Red Indicator Jewel */}
          <circle cx="22" cy="14" r="5" fill="#FF4D8D" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
};
