import React, { useEffect, useRef, useState, useCallback } from 'react';
import { watercolorAudio } from '../utils/watercolorAudio';
import { APP_CONFIG } from '../config/appConfig';

interface WatercolorScratchCardProps {
  onFullyRevealed?: () => void;
}

export const WatercolorScratchCard: React.FC<WatercolorScratchCardProps> = ({ onFullyRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealPercent, setRevealPercent] = useState(0);
  const isDrawingRef = useRef(false);
  const lastSoundTimeRef = useRef(0);

  // Initialize the scratch canvas wash overlay
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw a rich textured watercolor wash covering the letter
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8d7da'); // Soft rose
    gradient.addColorStop(0.35, '#dbe7f6'); // Sky mist
    gradient.addColorStop(0.7, '#e8dff5'); // Lavender
    gradient.addColorStop(1, '#fce1d4'); // Peach gold

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle artistic brush pattern lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    for (let i = 0; i < canvas.height; i += 28) {
      ctx.beginPath();
      ctx.moveTo(0, i + Math.sin(i) * 10);
      ctx.bezierCurveTo(
        canvas.width * 0.3, i - 15,
        canvas.width * 0.7, i + 15,
        canvas.width, i
      );
      ctx.stroke();
    }

    // Callout text on the wash
    ctx.fillStyle = '#6d7a93';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎨 Brush with water to reveal my secret letter...', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = 'italic 12px "Caveat", cursive';
    ctx.fillText('~ drag finger or cursor to paint ~', canvas.width / 2, canvas.height / 2 + 15);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    // Soft water brush circle with feathered edges
    const radius = 32;
    const radialGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    radialGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    radialGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radialGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Trigger brush sound throttled
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 120) {
      watercolorAudio.playBrushStroke(0.8);
      lastSoundTimeRef.current = now;
    }

    // Calculate reveal percentage periodically
    if (Math.random() < 0.15) {
      calculateReveal();
    }
  };

  const calculateReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample pixels across grid
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      const totalPixels = data.length / 4;
      const step = 32; // Sample every 32nd pixel for performance

      for (let i = 3; i < data.length; i += step * 4) {
        if (data[i] < 128) {
          transparentCount++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / (totalPixels / step)) * 100));
      setRevealPercent(percent);

      if (percent >= 55 && !isRevealed) {
        handleRevealAll();
      }
    } catch {
      // Ignore canvas security errors if any
    }
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
    setRevealPercent(100);
    watercolorAudio.playFanfare();

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (onFullyRevealed) {
      onFullyRevealed();
    }
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 select-none">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">🖌️</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-storybook-ink">
            Water Brush Easel
          </span>
          <span className="text-xs font-handwriting text-storybook-roseDark">
            ({revealPercent}% painted)
          </span>
        </div>

        {!isRevealed && (
          <button
            type="button"
            onClick={handleRevealAll}
            className="text-xs font-handwriting text-storybook-ink hover:text-storybook-roseDark flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full border border-storybook-border shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>✨ Reveal Entire Letter</span>
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg relative overflow-hidden min-h-[280px] sm:min-h-[320px] border border-storybook-border flex flex-col justify-between"
      >
        {/* Washi Tape Corner Accents */}
        <div className="washi-tape -top-2 left-6 w-24" />
        <div className="washi-tape washi-tape-sage -top-2 right-6 w-24" />

        {/* Underlying Secret Love Letter Content */}
        <div className="relative z-0">
          <div className="flex items-center justify-between border-b border-storybook-border/60 pb-3 mb-4">
            <div className="font-serif text-lg sm:text-xl font-bold text-storybook-ink">
              {APP_CONFIG.secretLoveLetter.salutation}
            </div>
            <div className="wax-seal w-8 h-8 text-xs">
              {APP_CONFIG.boyfriendInitial}&{APP_CONFIG.girlfriendInitial}
            </div>
          </div>

          <p className="font-handwriting text-lg sm:text-xl text-storybook-ink leading-relaxed mb-6 whitespace-pre-line">
            {APP_CONFIG.secretLoveLetter.body}
          </p>

          <div className="flex justify-end items-center gap-2 font-handwriting text-base sm:text-lg text-storybook-roseDark pt-2 border-t border-storybook-border/40">
            <span>{APP_CONFIG.secretLoveLetter.signOff}</span>
            <span className="font-bold text-storybook-ink">{APP_CONFIG.secretLoveLetter.author}</span>
          </div>
        </div>

        {/* Interactive Scratch-Off Watercolor Canvas Wash */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute inset-0 z-10 w-full h-full cursor-crosshair transition-opacity duration-700 ${
            isRevealed ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
};
