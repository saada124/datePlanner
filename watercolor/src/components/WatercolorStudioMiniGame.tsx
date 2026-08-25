import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { watercolorAudio } from '../utils/watercolorAudio';
import { APP_CONFIG } from '../config/appConfig';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  isGlitter?: boolean;
  isEraser?: boolean;
}

interface StampedItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
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
  { id: 'fine', label: 'Fine Detail', icon: '✏️', size: 4 },
  { id: 'medium', label: 'Round Brush', icon: '🖌️', size: 10 },
  { id: 'wash', label: 'Wet Wash', icon: '🌊', size: 26 },
  { id: 'glitter', label: 'Magic Sparkle', icon: '✨', size: 16, isGlitter: true },
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
}

export const WatercolorStudioMiniGame: React.FC<WatercolorStudioMiniGameProps> = ({
  isOpen,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeColor, setActiveColor] = useState(PIGMENTS[0].color);
  const [activeBrush, setActiveBrush] = useState(BRUSHES[1]);
  const [selectedStencil, setSelectedStencil] = useState('blank');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [stamps, setStamps] = useState<StampedItem[]>([]);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);

  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const lastSoundRef = useRef(0);

  // Redraw the canvas whenever strokes or stamps change
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Background textured paper wash
    ctx.fillStyle = '#fefdfb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper deckle border
    ctx.strokeStyle = 'rgba(201, 111, 138, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // 2. Draw Stencil Outlines if selected
    if (selectedStencil === 'picnic') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);

      // Sun
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.25, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Hill & Blanket
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.bezierCurveTo(canvas.width * 0.4, canvas.height * 0.65, canvas.width * 0.7, canvas.height * 0.75, canvas.width, canvas.height * 0.68);
      ctx.stroke();

      // Picnic Basket
      ctx.strokeRect(canvas.width * 0.4, canvas.height * 0.68, 70, 45);
      ctx.restore();
    } else if (selectedStencil === 'cafe') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);

      // Table & Cup
      ctx.strokeRect(canvas.width * 0.2, canvas.height * 0.7, canvas.width * 0.6, 20);
      ctx.strokeRect(canvas.width * 0.45, canvas.height * 0.52, 50, 50);
      ctx.beginPath();
      ctx.arc(canvas.width * 0.54, canvas.height * 0.62, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (selectedStencil === 'letter') {
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 122, 147, 0.35)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);

      // Envelope
      ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.3, canvas.width * 0.5, canvas.height * 0.4);
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.25, canvas.height * 0.3);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.5);
      ctx.lineTo(canvas.width * 0.75, canvas.height * 0.3);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Draw All Brush Strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.save();
      if (stroke.isEraser) {
        ctx.strokeStyle = '#fefdfb';
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (stroke.isGlitter) {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.75;
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = 10;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = stroke.size > 20 ? 0.4 : 0.8;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }

      ctx.stroke();
      ctx.restore();
    });

    // 4. Draw All Stamped Items
    stamps.forEach((s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.rotation * Math.PI) / 180);
      ctx.font = `${s.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.emoji, 0, 0);
      ctx.restore();
    });
  }, [strokes, stamps, selectedStencil]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = Math.max(340, Math.floor(rect.width));
        canvas.height = Math.max(320, Math.floor(rect.height));
        redrawCanvas();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer drawing handlers
  const getCanvasCoords = (clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCanvasCoords(e.clientX, e.clientY);

    // If stamp is active, stamp item and exit
    if (activeStamp) {
      watercolorAudio.playSplatterPop();
      const newStamp: StampedItem = {
        id: `stmp-${Date.now()}-${Math.random()}`,
        emoji: activeStamp,
        x: point.x,
        y: point.y,
        size: 32 + Math.random() * 8,
        rotation: (Math.random() - 0.5) * 24
      };
      setStamps((prev) => [...prev, newStamp]);
      return;
    }

    isDrawingRef.current = true;
    currentStrokeRef.current = {
      points: [point],
      color: activeColor,
      size: activeBrush.size,
      isGlitter: activeBrush.isGlitter,
      isEraser: activeBrush.isEraser
    };

    watercolorAudio.playBrushStroke(0.6);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const point = getCanvasCoords(e.clientX, e.clientY);

    currentStrokeRef.current.points.push(point);

    const now = Date.now();
    if (now - lastSoundRef.current > 140) {
      watercolorAudio.playBrushStroke(0.5);
      lastSoundRef.current = now;
    }

    setStrokes((prev) => {
      if (prev.length === 0) return [currentStrokeRef.current!];
      return [...prev.slice(0, -1), { ...currentStrokeRef.current! }];
    });
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      setStrokes((prev) => [...prev]);
    }
    currentStrokeRef.current = null;
  };

  const handleUndo = () => {
    watercolorAudio.playWaterDrip(0.9);
    if (stamps.length > 0) {
      setStamps((prev) => prev.slice(0, -1));
    } else if (strokes.length > 0) {
      setStrokes((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    watercolorAudio.playWaterDrip(1.3);
    setStrokes([]);
    setStamps([]);
    setRatingMessage(null);
  };

  const handleRateArtwork = () => {
    watercolorAudio.playFanfare();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#ffffff']
    });

    const reviews = [
      `🎨 100/10: A certified romantic masterpiece! The Louvre called for ${APP_CONFIG.girlfriendName} & ${APP_CONFIG.boyfriendName}! 👑`,
      `🌸 1000/10: Pure watercolor poetry. Destiny painted this perfectly! ✨`,
      `💖 Infinite/10: The most adorable date canvas ever created! 🌷`,
      `🍷 10/10: Monet and Van Gogh have been real quiet since you painted this. 🎨😌`
    ];

    setRatingMessage(reviews[Math.floor(Math.random() * reviews.length)]);
  };

  const handleExportPainting = () => {
    watercolorAudio.playFanfare();
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas) return;

    const framedCanvas = document.createElement('canvas');
    const width = 1200;
    const height = 900;
    framedCanvas.width = width;
    framedCanvas.height = height;
    const ctx = framedCanvas.getContext('2d');
    if (!ctx) return;

    // Elegant wooden/gold easel frame background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#fdfcff');
    bgGrad.addColorStop(1, '#fdeef2');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Frame Borders
    ctx.strokeStyle = '#c96f8a';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Title
    ctx.fillStyle = '#3b4a63';
    ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎨 Our Painted Masterpiece 🌸', width / 2, 95);

    // Draw inner canvas artwork
    ctx.drawImage(sourceCanvas, 75, 120, width - 150, height - 230);

    // Signature footer
    ctx.fillStyle = '#c96f8a';
    ctx.font = 'italic 26px "Caveat", cursive';
    ctx.fillText(`Painted by ${APP_CONFIG.girlfriendName} & ${APP_CONFIG.boyfriendName} with boundless love ❤️`, width / 2, height - 55);

    // Download trigger
    try {
      const link = document.createElement('a');
      link.download = `Watercolor_Masterpiece_${APP_CONFIG.girlfriendName}_${Date.now()}.png`;
      link.href = framedCanvas.toDataURL('image/png');
      link.click();
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-storybook-ink/60 backdrop-blur-sm select-none"
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
                className="text-xs font-semibold bg-storybook-blush text-storybook-roseDark hover:bg-storybook-rose hover:text-white px-3 py-1.5 rounded-full border border-storybook-rose/40 transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🏆</span>
                <span>Rate Artwork</span>
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
                      onClick={() => {
                        watercolorAudio.playWaterDrip(1.1);
                        setSelectedStencil(st.id);
                      }}
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
                onPointerCancel={handlePointerUp}
                className="w-full h-full cursor-crosshair touch-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-storybook-border/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={strokes.length === 0 && stamps.length === 0}
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

            <button
              type="button"
              onClick={handleExportPainting}
              className="story-btn-primary px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>🖼️</span>
              <span>Frame & Download Painting 💌</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
