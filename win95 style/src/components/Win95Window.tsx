import React, { useRef, useState } from 'react';

interface Win95WindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  defaultPos?: { x: number; y: number };
  onClose?: () => void;
}

export const Win95Window: React.FC<Win95WindowProps> = ({
  title,
  icon = '🖥️',
  children,
  className = '',
  defaultPos,
  onClose
}) => {
  const [pos, setPos] = useState(defaultPos ?? { x: 24, y: 60 });
  const [showJoke, setShowJoke] = useState(false);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(-200, Math.min(window.innerWidth - 100, ev.clientX - dragRef.current.dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, ev.clientY - dragRef.current.dy))
      });
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div
      className={`win95-window absolute z-20 ${className}`}
      style={{ left: pos.x, top: pos.y, width: 'min(92vw, 600px)' }}
    >
      <div
        className="win95-titlebar flex items-center justify-between px-1.5 py-1 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <span className="flex items-center gap-1.5 text-xs text-win95-white">
          <span className="text-sm leading-none">{icon}</span>
          <span className="font-bold">{title}</span>
        </span>
        <button
          type="button"
          onClick={() => (onClose ? onClose() : setShowJoke(true))}
          className="win95-btn win95-btn-sm cursor-pointer"
          aria-label="Close window"
        >
          ✕
        </button>
      </div>
      <div className="p-3">{children}</div>

      {showJoke && (
        <div className="absolute inset-0 z-30 bg-win95-gray/60 flex items-center justify-center">
          <div className="win95-window w-80 p-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="text-xs">
                <div className="font-bold mb-1">Cannot close {title}</div>
                <div className="text-win95-black">
                  Date setup is in progress. Cancellation is not supported by LoveOS.
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button type="button" onClick={() => setShowJoke(false)} className="win95-btn cursor-pointer">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};