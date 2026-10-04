import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Coins } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ScratchCardProps {
  bonusPerk: string;
  onRevealed?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  bonusPerk,
  onRevealed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const lastSoundTimeRef = useRef<number>(0);

  // Initialize Canvas with Gold Carnival Foil
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth || 320;
    const height = 90;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Draw Gold Metallic Gradient Foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#F5D061');
    grad.addColorStop(0.3, '#FFEAA7');
    grad.addColorStop(0.5, '#E5B134');
    grad.addColorStop(0.7, '#FFEAA7');
    grad.addColorStop(1, '#D99B16');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add playful carnival pattern & text
    ctx.fillStyle = 'rgba(46, 26, 71, 0.75)';
    ctx.font = 'bold 13px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ SCRATCH WITH COIN TO REVEAL BONUS ★', width / 2, height / 2 - 8);

    ctx.font = '11px "Fredoka", sans-serif';
    ctx.fillStyle = 'rgba(46, 26, 71, 0.6)';
    ctx.fillText('🪙 Scratch here for a special surprise treat 🪙', width / 2, height / 2 + 14);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentPixels = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 8th pixel for speed
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) {
          transparentPixels += 8;
        }
      }

      const percent = (transparentPixels / totalPixels) * 100;
      if (percent > 38 && !isRevealed) {
        setIsRevealed(true);
        sounds.playWinFanfare();
        if (onRevealed) onRevealed();
      }
    } catch {
      // Ignore security/cors edge case
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Play soft sound throttled
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 70) {
      sounds.playScratch();
      lastSoundTimeRef.current = now;
    }

    checkScratchPercentage();
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    if (e.touches.length > 0) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    if (e.touches.length > 0) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  return (
    <div className="w-full my-3">
      <div className="flex items-center justify-between gap-1 mb-1.5 px-1">
        <span className="text-[11px] font-mono-ticket font-bold text-gray-500 uppercase flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-carnival-gold" />
          CARNIVAL SCRATCH-OFF BONUS:
        </span>
        {isRevealed && (
          <span className="text-[11px] font-mono-ticket font-bold text-carnival-pink uppercase flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3" /> UNLOCKED!
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[90px] rounded-xl overflow-hidden border-2 border-dashed border-carnival-gold/60 shadow-inner select-none cursor-pointer bg-gradient-to-r from-amber-50 to-pink-50 flex items-center justify-center p-3 text-center"
      >
        {/* Hidden Bonus Perk Underneath */}
        <div className="w-full text-center space-y-1">
          <div className="text-xl animate-bounce-short">✨</div>
          <p className="text-xs sm:text-sm font-display font-bold text-carnival-bg leading-tight">
            {bonusPerk}
          </p>
        </div>

        {/* Golden Foil Scratch Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none"
          />
        )}
      </div>

      {/* Manual Quick Reveal Button */}
      {!isRevealed && (
        <button
          type="button"
          onClick={() => {
            setIsRevealed(true);
            sounds.playWinFanfare();
            if (onRevealed) onRevealed();
          }}
          className="text-[10px] font-mono-ticket text-gray-400 hover:text-carnival-pink mt-1 underline transition-colors block text-center w-full"
        >
          Can&apos;t scratch? Tap here to reveal bonus 🪄
        </button>
      )}
    </div>
  );
};
