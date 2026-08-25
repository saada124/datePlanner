import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { watercolorAudio } from '../utils/watercolorAudio';
import { APP_CONFIG } from '../config/appConfig';

interface Point {
  x: number;
  y: number;
}

const PIGMENTS = [
  { id: 'rose', name: 'Blush Rose', color: '#e85d75' },
  { id: 'cerulean', name: 'Cerulean Sky', color: '#3a86ff' },
  { id: 'amber', name: 'Sunset Amber', color: '#fb8500' },
  { id: 'emerald', name: 'Emerald Meadow', color: '#2a9d8f' },
  { id: 'lavender', name: 'Lavender Dream', color: '#8338ec' },
  { id: 'cherry', name: 'Cherry Blossom', color: '#f4978e' },
  { id: 'wine', name: 'Ruby Wine', color: '#9d0208' },
  { id: 'mint', name: 'Mint Sage', color: '#80b9ad' },
  { id: 'navy', name: 'Midnight Navy', color: '#1d3557' },
  { id: 'honey', name: 'Golden Honey', color: '#ffb703' },
];

const BRUSHES = [
  { id: 'fine', label: 'Fine Detail', icon: '✏️', size: 3 },
  { id: 'medium', label: 'Round Brush', icon: '🖌️', size: 8 },
  { id: 'wash', label: 'Wet Wash', icon: '🌊', size: 22, isWash: true },
  { id: 'glitter', label: 'Magic Sparkle', icon: '✨', size: 14, isGlitter: true },
  { id: 'eraser', label: 'Water Sponge', icon: '🧽', size: 24, isEraser: true },
];

const STAMPS = ['❤️', '🌸', '🦋', '💋', '☕', '🧺', '✨', '🌷', '🍰', '🎨'];

const STENCILS = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    icon: '📄',
    desc: 'Pure freestyle painting'
  },
  {
    id: 'picnic',
    name: 'Lakeside Picnic',
    icon: '🧺',
    desc: 'Blanket, wine & sunset'
  },
  {
    id: 'cafe',
    name: 'Cozy Café Date',
    icon: '☕',
    desc: 'Pastries & warm coffee'
  },
  {
    id: 'letter',
    name: 'Floral Love Letter',
    icon: '💌',
    desc: 'Botanical wax seal letter'
  }
];

interface WatercolorStudioMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onIncludeInCard?: (dataUrl: string) => void;
}

export const WatercolorStudioMiniGame: React.FC<WatercolorStudioMiniGameProps> = ({
  isOpen,
  onClose,
  onIncludeInCard
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeColor, setActiveColor] = useState(PIGMENTS[0].color);
  const [activeBrush, setActiveBrush] = useState(BRUSHES[1]);
  const [selectedStencil, setSelectedStencil] = useState('blank');
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [hasRated, setHasRated] = useState(false);
  const [reactionIndex, setReactionIndex] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const lastSoundRef = useRef(0);

  // Draw Stencil Outlines
  const drawStencilBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, stencil: string) => {
    ctx.fillStyle = '#fefdfb';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper deckle border
    ctx.strokeStyle = 'rgba(201, 111, 138, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    if (stencil === 'picnic') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);

      // Sun
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.25, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Hill & Blanket
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      ctx.bezierCurveTo(width * 0.4, height * 0.65, width * 0.7, height * 0.75, width, height * 0.68);
      ctx.stroke();

      // Picnic Basket
      ctx.strokeRect(width * 0.4, height * 0.68, 70, 45);
      ctx.restore();
    } else if (stencil === 'cafe') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);

      // Table & Cup
      ctx.strokeRect(width * 0.2, height * 0.7, width * 0.6, 20);
      ctx.strokeRect(width * 0.45, height * 0.52, 50, 50);
      ctx.beginPath();
      ctx.arc(width * 0.54, height * 0.62, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (stencil === 'letter') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);

      // Envelope
      ctx.strokeRect(width * 0.25, height * 0.3, width * 0.5, height * 0.4);
      ctx.beginPath();
      ctx.moveTo(width * 0.25, height * 0.3);
      ctx.lineTo(width * 0.5, height * 0.5);
      ctx.lineTo(width * 0.75, height * 0.3);
      ctx.stroke();
      ctx.restore();
    }
  }, []);

  // Save current canvas state to history stack
  const pushHistoryState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(imgData);
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
      }
      setHistoryCount(historyRef.current.length);
    } catch {
      // Fallback
    }
  }, []);

  // Initialize and size the canvas safely
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(340, Math.floor(rect.width || 600));
    const height = Math.max(320, Math.floor(rect.height || 450));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawStencilBackground(ctx, width, height, selectedStencil);
      historyRef.current = [];
      pushHistoryState();
    }
  }, [drawStencilBackground, pushHistoryState, selectedStencil]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      initCanvas();
    }, 60);
    return () => clearTimeout(timer);
  }, [isOpen, initCanvas]);

  const handleStencilChange = (stencilId: string) => {
    watercolorAudio.playWaterDrip(1.1);
    setSelectedStencil(stencilId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawStencilBackground(ctx, canvas.width, canvas.height, stencilId);
      historyRef.current = [];
      pushHistoryState();
    }
  };

  const getCanvasCoords = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // High-performance direct canvas drawing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getCanvasCoords(e.clientX, e.clientY);

    // If stamp mode is active, stamp emoji directly
    if (activeStamp) {
      watercolorAudio.playSplatterPop();
      ctx.save();
      ctx.translate(point.x, point.y);
      const angle = (Math.random() - 0.5) * 20;
      ctx.rotate((angle * Math.PI) / 180);
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, 0, 0);
      ctx.restore();
      pushHistoryState();
      return;
    }

    isDrawingRef.current = true;
    lastPointRef.current = point;

    ctx.save();
    if (activeBrush.isEraser) {
      ctx.strokeStyle = '#fefdfb';
      ctx.fillStyle = '#fefdfb';
      ctx.lineWidth = activeBrush.size;
    } else if (activeBrush.isGlitter) {
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 8;
    } else if (activeBrush.isWash) {
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.fillStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.globalAlpha = 0.85;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(point.x, point.y, activeBrush.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    watercolorAudio.playBrushStroke(0.6);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCanvasCoords(e.clientX, e.clientY);

    ctx.save();
    if (activeBrush.isEraser) {
      ctx.strokeStyle = '#fefdfb';
      ctx.lineWidth = activeBrush.size;
    } else if (activeBrush.isGlitter) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 8;
    } else if (activeBrush.isWash) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeBrush.size;
      ctx.globalAlpha = 0.85;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    ctx.restore();

    lastPointRef.current = currentPoint;

    // Sound throttle
    const now = Date.now();
    if (now - lastSoundRef.current > 160) {
      watercolorAudio.playBrushStroke(0.45);
      lastSoundRef.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      pushHistoryState();
    }
  };

  const handleUndo = () => {
    watercolorAudio.playWaterDrip(0.9);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prevState = historyRef.current[historyRef.current.length - 1];
      if (prevState) {
        ctx.putImageData(prevState, 0, 0);
      }
      setHistoryCount(historyRef.current.length);
    } else if (historyRef.current.length === 1) {
      drawStencilBackground(ctx, canvas.width, canvas.height, selectedStencil);
      historyRef.current = [];
      pushHistoryState();
    }
  };

  const handleClear = () => {
    watercolorAudio.playWaterDrip(1.3);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawStencilBackground(ctx, canvas.width, canvas.height, selectedStencil);
      historyRef.current = [];
      pushHistoryState();
      setRatingMessage(null);
      setHasRated(false);
    }
  };

  // Dynamic Rating Critique Cycle
  const handleRateArtwork = () => {
    watercolorAudio.playFanfare();
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#ffb703']
    });

    const reactions = APP_CONFIG.paintingReactions || [
      `🎨 100/10: A certified romantic masterpiece! The Louvre called for ${APP_CONFIG.girlfriendName} & ${APP_CONFIG.boyfriendName}! 👑`,
      `🌸 1000/10: Pure watercolor poetry. Destiny painted this perfectly! ✨`,
      `💖 Infinite/10: The most adorable date canvas ever created! 🌷`,
      `🍷 10/10: Monet and Van Gogh have been real quiet since you painted this. 🎨😌`
    ];

    const chosen = reactions[reactionIndex % reactions.length];
    setReactionIndex((prev) => prev + 1);
    setRatingMessage(chosen);
    setHasRated(true);
  };

  // Include Custom Painting in Date Card Keepsake
  const handleIncludeInCard = () => {
    watercolorAudio.playFanfare();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    if (onIncludeInCard) {
      onIncludeInCard(dataUrl);
    }
    onClose();
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-storybook-ink/60 backdrop-blur-sm select-none"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="paper-card w-full max-w-4xl h-[92vh] max-h-[750px] p-4 sm:p-6 rounded-3xl shadow-paper-lg relative flex flex-col justify-between border border-storybook-border overflow-hidden bg-white/95"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-storybook-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎨</span>
              <div>
                <h2 className="font-serif-title text-base sm:text-lg font-bold text-storybook-ink">
                  The Watercolor Studio Mini-Game
                </h2>
                <p className="text-[11px] font-handwriting text-storybook-roseDark">
                  Paint our date canvas together with brushes & stamps ✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRateArtwork}
                className="text-xs font-semibold bg-storybook-blush text-storybook-roseDark hover:bg-storybook-rose hover:text-white px-3.5 py-1.5 rounded-full border border-storybook-rose/40 transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>🏆</span>
                <span>Rate the Painting</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-storybook-bg hover:bg-storybook-border text-storybook-ink flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                title="Close studio"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Rating Notification Banner */}
          <AnimatePresence>
            {ratingMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-storybook-blush border border-storybook-rose/50 rounded-xl p-2.5 my-2 text-center text-xs sm:text-sm font-handwriting text-storybook-roseDark shadow-xs"
              >
                {ratingMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Painting Work Area */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3 my-2 min-h-0">
            {/* Left Toolbar (Brushes, Pigments, Stencils, Stamps) */}
            <div className="w-full sm:w-56 flex-shrink-0 flex flex-col justify-between gap-2 overflow-y-auto pr-1">
              {/* Stencil Picker */}
              <div>
                <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-1">
                  1. Choose Canvas Stencil
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                  {STENCILS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleStencilChange(st.id)}
                      className={`px-2 py-1.5 rounded-xl border text-left text-xs flex items-center gap-2 cursor-pointer transition-all ${
                        selectedStencil === st.id
                          ? 'bg-storybook-blush border-storybook-rose text-storybook-roseDark font-semibold shadow-2xs'
                          : 'bg-storybook-bg/40 border-transparent hover:border-storybook-border text-storybook-ink'
                      }`}
                    >
                      <span className="text-base">{st.icon}</span>
                      <span className="text-[11px] truncate">{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brush Type Selector */}
              <div>
                <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-1">
                  2. Watercolor Brushes
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-1">
                  {BRUSHES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        watercolorAudio.playWaterDrip(1.2);
                        setActiveBrush(b);
                        setActiveStamp(null);
                      }}
                      className={`p-1.5 rounded-xl border text-center text-xs flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        activeBrush.id === b.id && !activeStamp
                          ? 'bg-storybook-sageLight border-storybook-sage text-storybook-ink font-semibold shadow-2xs'
                          : 'bg-storybook-bg/40 border-transparent hover:border-storybook-border text-storybook-inkLight'
                      }`}
                    >
                      <span>{b.icon}</span>
                      <span className="text-[10px]">{b.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pigment Color Grid */}
              <div>
                <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-1">
                  3. Color Palette
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {PIGMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        watercolorAudio.playWaterDrip(1.1);
                        setActiveColor(p.color);
                        if (activeBrush.isEraser) {
                          setActiveBrush(BRUSHES[1]);
                        }
                        setActiveStamp(null);
                      }}
                      style={{ backgroundColor: p.color }}
                      className={`w-7 h-7 rounded-full shadow-inner relative transition-transform cursor-pointer ${
                        activeColor === p.color && !activeBrush.isEraser && !activeStamp
                          ? 'scale-120 ring-2 ring-storybook-ink ring-offset-1'
                          : 'hover:scale-110'
                      }`}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>

              {/* Romantic Stamps */}
              <div>
                <div className="text-[10px] font-bold text-storybook-inkLight uppercase tracking-wider mb-1">
                  4. Stamp Rollers
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {STAMPS.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        watercolorAudio.playSplatterPop();
                        setActiveStamp(emoji);
                      }}
                      className={`p-1 rounded-lg text-lg text-center cursor-pointer transition-all ${
                        activeStamp === emoji
                          ? 'bg-storybook-blush border border-storybook-rose scale-115 shadow-2xs'
                          : 'hover:bg-storybook-bg/60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Canvas Easel Area */}
            <div
              ref={containerRef}
              className="flex-1 rounded-2xl border-2 border-storybook-border/80 shadow-inner relative overflow-hidden bg-[#fefdfb] flex items-center justify-center"
            >
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full cursor-crosshair touch-none select-none"
              />
            </div>
          </div>

          {/* Footer Actions: Rate & Include in Card */}
          <div className="flex items-center justify-between pt-3 border-t border-storybook-border/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyCount <= 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-storybook-bg hover:bg-storybook-border text-storybook-ink disabled:opacity-40 cursor-pointer transition-all"
              >
                ↩ Undo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-storybook-bg hover:bg-red-50 text-red-500 cursor-pointer transition-all"
              >
                🧹 Wash Canvas
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Rate The Painting Button (Replaces static Download) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRateArtwork}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-storybook-blush text-storybook-roseDark border border-storybook-rose/40 hover:bg-storybook-rose hover:text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <span>🏆</span>
                <span>Rate the Painting ✨</span>
              </motion.button>

              {/* Include in Card Button (Appears after rating or creating artwork) */}
              {(hasRated || historyCount > 1) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleIncludeInCard}
                  className="story-btn-primary px-5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-md animate-pulse-gentle"
                >
                  <span>💌</span>
                  <span>Include in Card ✨</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
