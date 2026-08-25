import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { watercolorAudio } from '../utils/watercolorAudio';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export interface PlacedSticker {
  id: string;
  emoji: string;
  label: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  rotation: number;
  scale: number;
}

const STICKER_CATALOG = [
  { id: 'paint', emoji: '🎨', label: 'Palette' },
  { id: 'blossom', emoji: '🌸', label: 'Blossom' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'love-letter', emoji: '💌', label: 'Letter' },
  { id: 'sparkles', emoji: '✨', label: 'Sparkles' },
  { id: 'tulip', emoji: '🌷', label: 'Tulip' },
  { id: 'coffee', emoji: '☕', label: 'Café' },
  { id: 'ribbon', emoji: '🎀', label: 'Ribbon' },
  { id: 'strawberry', emoji: '🍓', label: 'Berry' },
  { id: 'heart-seal', emoji: '💖', label: 'Love' },
];

interface WatercolorStickerEaselProps {
  selection: DateSelection;
}

export const WatercolorStickerEasel: React.FC<WatercolorStickerEaselProps> = ({ selection }) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([
    { id: 'stk-init-1', emoji: '🌸', label: 'Blossom', x: 86, y: 14, rotation: 12, scale: 1.2 },
    { id: 'stk-init-2', emoji: '✨', label: 'Sparkles', x: 12, y: 82, rotation: -8, scale: 1.1 }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleAddSticker = (item: typeof STICKER_CATALOG[0]) => {
    watercolorAudio.playSplatterPop();
    const newSticker: PlacedSticker = {
      id: `stk-${Date.now()}-${Math.random()}`,
      emoji: item.emoji,
      label: item.label,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      rotation: (Math.random() - 0.5) * 30,
      scale: 1 + Math.random() * 0.3
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleRemoveSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    watercolorAudio.playBrushStroke(0.6);
    setStickers(prev => prev.filter(s => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const handleClearAll = () => {
    watercolorAudio.playWaterDrip();
    setStickers([]);
    setSelectedStickerId(null);
  };

  const handleExportPostcard = () => {
    setIsExporting(true);
    watercolorAudio.playFanfare();

    // Canvas drawing for crisp PNG postcard export
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // Background watercolor gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#fbfcfe');
    bgGrad.addColorStop(0.5, '#fef0f4');
    bgGrad.addColorStop(1, '#eef6fc');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative painted border
    ctx.strokeStyle = '#c96f8a';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#9fc3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header Title
    ctx.fillStyle = '#3b4a63';
    ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎨 Our Painted Date Invitation 🌸', width / 2, 110);

    ctx.fillStyle = '#c96f8a';
    ctx.font = 'italic 26px "Caveat", cursive';
    ctx.fillText(`A Watercolor Masterpiece for ${APP_CONFIG.girlfriendName} & ${APP_CONFIG.boyfriendName}`, width / 2, 155);

    // Date Details Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(100, 200, width - 200, 460);
    ctx.strokeStyle = '#dfe6ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 200, width - 200, 460);

    // Text Lines
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b4a63';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';

    const items = [
      { icon: '📅', label: 'Date', val: selection.dayDate || 'To be decided' },
      { icon: '⏰', label: 'Time', val: selection.customTime || selection.timeSlot || 'Afternoon' },
      { icon: '🗺️', label: 'Location', val: selection.customLocation || selection.location || 'Secret spot' },
      { icon: '🥤', label: 'Elixir', val: selection.customDrink || selection.drink || 'Lavender Lemonade' },
      { icon: '🎨', label: 'Adventures', val: selection.activities.join(', ') || 'Exploring together' },
      { icon: '❤️', label: 'Greeting', val: selection.greetings.join(', ') || 'Soft kiss & warm hug' },
    ];

    items.forEach((item, i) => {
      const col = i < 3 ? 150 : 650;
      const row = 270 + (i % 3) * 110;

      ctx.fillStyle = '#c96f8a';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${item.icon} ${item.label.toUpperCase()}`, col, row);

      ctx.fillStyle = '#3b4a63';
      ctx.font = '22px "Plus Jakarta Sans", sans-serif';
      const textVal = item.val.length > 32 ? item.val.substring(0, 30) + '...' : item.val;
      ctx.fillText(textVal, col, row + 35);
    });

    // Draw Placed Stickers onto Canvas
    stickers.forEach(s => {
      ctx.save();
      const posX = (s.x / 100) * width;
      const posY = (s.y / 100) * height;
      ctx.translate(posX, posY);
      ctx.rotate((s.rotation * Math.PI) / 180);
      ctx.font = `${Math.round(48 * s.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.emoji, 0, 0);
      ctx.restore();
    });

    // Signature footer
    ctx.textAlign = 'center';
    ctx.font = 'italic 24px "Caveat", cursive';
    ctx.fillStyle = '#6d7a93';
    ctx.fillText(`Hand-painted with boundless love for ${APP_CONFIG.girlfriendName} ❤️`, width / 2, 730);

    // Download trigger
    try {
      const link = document.createElement('a');
      link.download = `Watercolor-Date-Invitation-${APP_CONFIG.girlfriendName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Fallback
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {/* Header with Sticker Bar */}
      <div className="paper-card p-4 rounded-2xl shadow-paper mb-4 border border-storybook-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🎨</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-storybook-ink">
              Sticker & Keepsake Decorator
            </span>
          </div>
          <div className="flex items-center gap-2">
            {stickers.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-handwriting text-storybook-inkLight hover:text-red-500 cursor-pointer"
              >
                Clear Stickers
              </button>
            )}
            <button
              type="button"
              onClick={handleExportPostcard}
              disabled={isExporting}
              className="text-xs font-semibold bg-storybook-rose text-white px-3.5 py-1.5 rounded-full shadow-sm hover:shadow-md hover:bg-storybook-roseDark transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>💌</span>
              <span>{isExporting ? 'Painting...' : 'Export Keepsake PNG'}</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] font-handwriting text-storybook-inkLight mb-3">
          Tap any watercolor sticker to stamp & decorate our final invitation card!
        </p>

        {/* Sticker Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STICKER_CATALOG.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleAddSticker(item)}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 p-2 rounded-xl bg-storybook-bg/70 hover:bg-white border border-transparent hover:border-storybook-rose/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title={`Stamp ${item.label}`}
            >
              <span className="text-xl sm:text-2xl">{item.emoji}</span>
              <span className="text-[9px] font-medium text-storybook-inkLight">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decorated Card Canvas Container */}
      <div
        ref={boardRef}
        className="paper-card p-6 sm:p-8 rounded-2xl shadow-paper-lg relative overflow-hidden border border-storybook-border select-none"
      >
        {/* Washi Tapes */}
        <div className="washi-tape -top-2 left-8 w-24" />
        <div className="washi-tape washi-tape-sage -top-2 right-8 w-24" />

        {/* Card Content Summary */}
        <div className="text-center mb-5">
          <div className="wax-seal mx-auto mb-2 w-10 h-10 text-sm shadow-seal">
            {APP_CONFIG.boyfriendInitial}&{APP_CONFIG.girlfriendInitial}
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-storybook-ink font-bold">
            The Official Date Keepsake
          </h3>
          <p className="font-handwriting text-base text-storybook-roseDark">
            ~ Painted with love for {APP_CONFIG.girlfriendName} ~
          </p>
        </div>

        {/* Grid of Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-storybook-border/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📅</span>
            <div>
              <div className="text-[10px] font-bold text-storybook-roseDark uppercase">The Day</div>
              <div className="text-xs font-semibold text-storybook-ink">{selection.dayDate || 'Not selected'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">⏰</span>
            <div>
              <div className="text-[10px] font-bold text-storybook-roseDark uppercase">The Hour</div>
              <div className="text-xs font-semibold text-storybook-ink">{selection.customTime || selection.timeSlot || 'Afternoon'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗺️</span>
            <div>
              <div className="text-[10px] font-bold text-storybook-roseDark uppercase">The Destination</div>
              <div className="text-xs font-semibold text-storybook-ink">{selection.customLocation || selection.location || 'Secret spot'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">🥤</span>
            <div>
              <div className="text-[10px] font-bold text-storybook-roseDark uppercase">The Elixir</div>
              <div className="text-xs font-semibold text-storybook-ink">{selection.customDrink || selection.drink || 'Lavender Lemonade'}</div>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-storybook-border/40">
            <span className="text-xl">🎨</span>
            <div>
              <div className="text-[10px] font-bold text-storybook-roseDark uppercase">Adventures</div>
              <div className="text-xs font-semibold text-storybook-ink">
                {selection.activities.length > 0 ? selection.activities.join(' • ') : 'Surprise adventure'}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stamped Stickers Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {stickers.map((s) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: s.scale, rotate: s.rotation }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-auto cursor-pointer group"
                onClick={() => setSelectedStickerId(s.id)}
              >
                <div className="relative">
                  <span className="text-3xl sm:text-4xl drop-shadow-md select-none block hover:scale-125 transition-transform">
                    {s.emoji}
                  </span>
                  {selectedStickerId === s.id && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSticker(s.id, e)}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center shadow-xs cursor-pointer"
                      title="Remove sticker"
                    >
                      ×
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
