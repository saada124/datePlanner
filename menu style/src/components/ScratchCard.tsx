import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, CheckCircle } from 'lucide-react';

interface ScratchCardProps {
  onRevealed?: (perk: string) => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Draw luxurious gold-silver metallic foil overlay
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#D4AF37');
    grad.addColorStop(0.3, '#FFE8A3');
    grad.addColorStop(0.5, '#C59B27');
    grad.addColorStop(0.7, '#E7C782');
    grad.addColorStop(1, '#9C782B');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Decorative foil pattern / text
    ctx.fillStyle = '#593E12';
    ctx.font = 'bold 12px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL SECRET PERK ✦', rect.width / 2, rect.height / 2 - 8);
    ctx.font = '10px "Space Mono", monospace';
    ctx.fillStyle = '#7A5B20';
    ctx.fillText('Rub with coin or finger 🪙', rect.width / 2, rect.height / 2 + 12);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const calculateScratchPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    // Sample every 16th pixel for performance
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / 16;
    return Math.round((transparentCount / totalSampled) * 100);
  };

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    menuSound.playCoinScratch();

    const percent = calculateScratchPercent();
    setScratchPercent(percent);

    if (percent >= 38 && !isRevealed) {
      setIsRevealed(true);
      if (onRevealed) onRevealed(APP_CONFIG.scratchCard.perk);
      menuSound.playTearAndStamp();

      // Confetti burst
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E8635A', '#F4A45C', '#D4AF37', '#FFF8EC']
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  return (
    <div className="w-full my-6 p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl shadow-paper text-left relative overflow-hidden">
      {/* Top Foil Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-[#E8635A]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E8635A]">
            {APP_CONFIG.scratchCard.title}
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase">
          {APP_CONFIG.scratchCard.code}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4">
        {APP_CONFIG.scratchCard.subtitle}
      </p>

      {/* Scratch Box Surface */}
      <div
        ref={containerRef}
        className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-dashed border-[var(--border-dashed)] bg-[var(--bg-inner-box)] flex items-center justify-center p-4 text-center select-none"
      >
        {/* The Hidden Prize Content Underneath */}
        <div className="flex flex-col items-center justify-center p-2 z-0">
          <Sparkles className="w-6 h-6 text-[#E8635A] animate-bounce mb-1" />
          <div className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug">
            {APP_CONFIG.scratchCard.perk}
          </div>
          <div className="font-mono text-[10px] text-[#4A7A6D] font-bold mt-1 uppercase flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Complimentary Bonus Applied to Order!</span>
          </div>
        </div>

        {/* Scratchable Canvas Foil */}
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
          />
        )}
      </div>

      {scratchPercent > 0 && !isRevealed && (
        <div className="text-[11px] font-mono text-[var(--text-secondary)] text-center mt-2">
          Scratched: {scratchPercent}% · Keep scratching! 🪙
        </div>
      )}
    </div>
  );
};
