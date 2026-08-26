import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects';

interface DoodleCanvasProps {
  initialDoodle?: string;
  onSaveDoodle: (doodleDataUrl: string) => void;
  onClose: () => void;
}

const INK_COLORS = [
  { id: '#1a2238', label: 'Navy' },
  { id: '#c96f4a', label: 'Crimson' },
  { id: '#d88a8a', label: 'Rose' },
  { id: '#2d221c', label: 'Espresso' }
];

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({
  initialDoodle,
  onSaveDoodle,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [inkColor, setInkColor] = useState<string>('#c96f4a');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load initial doodle if present
    if (initialDoodle) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDoodle;
    }
  }, [initialDoodle]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSaveDoodle(canvas.toDataURL());
    }
  };

  const handleClear = () => {
    sound.playButtonClunk();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSaveDoodle('');
  };

  return (
    <div className="bg-[#fffdfa] border-2 border-dashed border-[#c96f4a] rounded-xl p-3 select-none relative shadow-md">
      <div className="flex items-center justify-between border-b border-[#decbb2] pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">✍️</span>
          <span className="font-mono text-[9px] uppercase font-bold text-[#c96f4a] tracking-wider">
            BALLPOINT PEN DOODLE
          </span>
        </div>

        {/* Ink Colors & Tools */}
        <div className="flex items-center gap-1.5">
          {INK_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setInkColor(c.id)}
              className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                inkColor === c.id ? 'scale-125 ring-2 ring-[#c96f4a]' : 'opacity-70'
              }`}
              style={{ backgroundColor: c.id }}
              title={c.label}
            />
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="text-[9px] font-mono text-[#8a7568] hover:text-red-600 ml-1.5 cursor-pointer"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 rounded-md bg-[#2a221b] text-[9px] font-mono font-bold text-white ml-1 cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        width={460}
        height={110}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-[100px] bg-transparent cursor-crosshair touch-none rounded-lg"
      />
      <div className="text-[8px] font-mono text-center text-[#8a7568] mt-1">
        Sign your name or draw a little heart for the mixtape sticker ♪
      </div>
    </div>
  );
};
