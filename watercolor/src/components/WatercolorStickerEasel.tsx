import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { watercolorAudio } from '../utils/watercolorAudio';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { getDiscoveredRecipeIds, ALCHEMIST_RECIPES } from '../config/alchemistRecipes';

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
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'paint', emoji: '🎨', label: 'Palette' },
  { id: 'blossom', emoji: '🌸', label: 'Blossom' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'love-letter', emoji: '💌', label: 'Letter' },
  { id: 'sparkles', emoji: '✨', label: 'Sparkles' },
  { id: 'tulip', emoji: '🌷', label: 'Tulip' },
  { id: 'coffee', emoji: '☕', label: 'Café' },
  { id: 'ribbon', emoji: '🎀', label: 'Ribbon' },
  { id: 'heart-seal', emoji: '💖', label: 'Love' },
];

export interface WatercolorStickerEaselHandle {
  captureCard: () => Promise<string | null>;
}

interface WatercolorStickerEaselProps {
  selection: DateSelection;
  customPainting?: string | null;
  onOpenStudio?: () => void;
}

export const WatercolorStickerEasel = forwardRef<
  WatercolorStickerEaselHandle,
  WatercolorStickerEaselProps
>(({ selection, customPainting, onOpenStudio }, ref) => {
  const [stickers, setStickers] = useState<PlacedSticker[]>([
    { id: 'stk-init-1', emoji: '🌸', label: 'Blossom', x: 88, y: 16, rotation: 12, scale: 1.2 },
    { id: 'stk-init-2', emoji: '✨', label: 'Sparkles', x: 14, y: 84, rotation: -8, scale: 1.1 }
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const discoveredIds = getDiscoveredRecipeIds();
  const unlockedRecipes = ALCHEMIST_RECIPES.filter((r) => discoveredIds.includes(r.id));
  const isMasterAlchemist = discoveredIds.includes('grand_masterpiece') || discoveredIds.length >= 5;

  const handleAddSticker = (item: typeof STICKER_CATALOG[0]) => {
    watercolorAudio.playSplatterPop();
    const newSticker: PlacedSticker = {
      id: `stk-${Date.now()}-${Math.random()}`,
      emoji: item.emoji,
      label: item.label,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 30,
      rotation: (Math.random() - 0.5) * 30,
      scale: 1 + Math.random() * 0.3
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleRemoveSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    watercolorAudio.playBrushStroke(0.6);
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const handleClearAll = () => {
    watercolorAudio.playWaterDrip();
    setStickers([]);
    setSelectedStickerId(null);
  };

  // High-precision pointer drag: 1:1 drop accuracy with zero jump
  const handleStickerPointerDown = (e: React.PointerEvent<HTMLDivElement>, sticker: PlacedSticker) => {
    e.stopPropagation();
    e.preventDefault();

    if (!boardRef.current) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialStickerX = sticker.x;
    const initialStickerY = sticker.y;
    let hasMoved = false;

    setDraggingStickerId(sticker.id);
    setSelectedStickerId(sticker.id);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!boardRef.current) return;
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (Math.hypot(dx, dy) > 3) {
        hasMoved = true;
      }

      const rect = boardRef.current.getBoundingClientRect();
      const deltaXPercent = (dx / rect.width) * 100;
      const deltaYPercent = (dy / rect.height) * 100;

      const nextX = Math.min(95, Math.max(5, initialStickerX + deltaXPercent));
      const nextY = Math.min(95, Math.max(5, initialStickerY + deltaYPercent));

      setStickers((prev) =>
        prev.map((item) => (item.id === sticker.id ? { ...item, x: nextX, y: nextY } : item))
      );
    };

    const onPointerUp = () => {
      setDraggingStickerId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (hasMoved) {
        watercolorAudio.playBrushStroke(0.4);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // High-resolution capture function that enables the Barcode strip only in the exported image
  const captureCardSnapshot = async (): Promise<string | null> => {
    if (!boardRef.current) return null;
    setIsExporting(true);
    setSelectedStickerId(null);

    // Pause briefly to let React flush state and render the Barcode in the DOM
    await new Promise((resolve) => setTimeout(resolve, 120));

    try {
      const dataUrl = await toPng(boardRef.current, {
        quality: 1.0,
        pixelRatio: 2.5, // 2.5x Ultra-Crisp Retina quality
        cacheBust: true,
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('export-exclude')) {
            return false;
          }
          return true;
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('Failed to capture card snapshot:', err);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    captureCard: captureCardSnapshot
  }));

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {/* Header with Sticker Bar */}
      <div className="paper-card p-4 rounded-2xl shadow-paper mb-4 border border-storybook-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{isMasterAlchemist ? '👑' : '🎨'}</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-storybook-ink">
              {isMasterAlchemist ? 'Royal Keepsake Decorator' : 'Sticker & Keepsake Decorator'}
            </span>
          </div>
          {stickers.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-handwriting text-storybook-inkLight hover:text-red-500 cursor-pointer"
            >
              Clear Stickers
            </button>
          )}
        </div>

        <p className="text-[11px] font-handwriting text-storybook-inkLight mb-3">
          Tap stickers to add them, and <strong>drag them anywhere</strong> across our date card! ✨
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

      {/* Decorated Card Canvas Container (Exact Card Export Target) */}
      <div
        ref={boardRef}
        className={`paper-card p-6 sm:p-8 rounded-3xl shadow-paper-lg relative overflow-hidden select-none transition-all ${
          isMasterAlchemist
            ? 'bg-gradient-to-br from-[#faf7ff] via-[#f5edff] to-[#ebe0fb] border-2 border-purple-300/80 shadow-[0_15px_40px_-5px_rgba(168,85,247,0.22)]'
            : 'border border-storybook-border bg-white/95'
        }`}
      >
        {/* Washi Tapes */}
        {isMasterAlchemist ? (
          <>
            <div className="washi-tape -top-2 left-8 w-24 bg-purple-200/80 border-purple-300 shadow-2xs" />
            <div className="washi-tape -top-2 right-8 w-24 bg-amber-200/80 border-amber-300 shadow-2xs" />
          </>
        ) : (
          <>
            <div className="washi-tape -top-2 left-8 w-24" />
            <div className="washi-tape washi-tape-sage -top-2 right-8 w-24" />
          </>
        )}

        {/* TOP-LEFT CORNER PAINTING SLOT */}
        <div className="absolute top-4 left-4 z-20">
          {customPainting ? (
            /* Included Painting Mini Polaroid Frame */
            <motion.div
              initial={{ scale: 0.8, rotate: -4 }}
              animate={{ scale: 1, rotate: -2 }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              className="bg-white p-1.5 pb-2 rounded-xl shadow-paper border border-storybook-border/80 relative cursor-pointer group"
              onClick={onOpenStudio}
              title="Click to repaint or view full artwork"
            >
              {/* Washi tape on polaroid */}
              <div className="washi-tape -top-1.5 left-2 w-10 opacity-90" />
              <img
                src={customPainting}
                alt="Our Painting"
                className="w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-lg border border-storybook-border/60"
              />
              <div className="text-[9px] font-handwriting text-storybook-roseDark text-center mt-1 flex items-center justify-center gap-0.5">
                <span>Our Art</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity export-exclude">✏️</span>
              </div>
            </motion.div>
          ) : (
            /* Optional Painting Placeholder Button (When not yet created) */
            onOpenStudio && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  watercolorAudio.playWaterDrip(1.1);
                  onOpenStudio();
                }}
                className={`border-2 border-dashed p-2 rounded-xl text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-2xs transition-all w-16 h-14 sm:w-20 sm:h-16 export-exclude ${
                  isMasterAlchemist
                    ? 'bg-purple-50/80 hover:bg-purple-100/90 border-purple-300 hover:border-purple-500'
                    : 'bg-storybook-bg/80 hover:bg-storybook-blush border-storybook-rose/40 hover:border-storybook-rose'
                }`}
                title="Paint an artwork to include on this keepsake card (optional)"
              >
                <span className="text-base sm:text-lg animate-bounce">🎨</span>
                <span
                  className={`text-[8px] sm:text-[9px] font-bold leading-tight ${
                    isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                  }`}
                >
                  + Add Art
                </span>
                <span className="text-[7px] font-handwriting text-storybook-inkLight hidden sm:block">
                  (Optional)
                </span>
              </motion.button>
            )
          )}
        </div>

        {/* Card Content Summary */}
        <div className="text-center mb-5 mt-2">
          <div
            className={`wax-seal mx-auto mb-2 w-11 h-11 text-base shadow-seal flex items-center justify-center font-bold ${
              isMasterAlchemist
                ? 'bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-amber-500 text-white ring-2 ring-purple-300'
                : ''
            }`}
          >
            {isMasterAlchemist ? '👑' : `${APP_CONFIG.boyfriendInitial}&${APP_CONFIG.girlfriendInitial}`}
          </div>
          <h3
            className={`font-serif text-xl sm:text-2xl font-bold ${
              isMasterAlchemist ? 'text-purple-950' : 'text-storybook-ink'
            }`}
          >
            {isMasterAlchemist ? 'The Royal Alchemist Keepsake' : 'The Official Date Keepsake'}
          </h3>
          <p
            className={`font-handwriting text-base ${
              isMasterAlchemist ? 'text-purple-700 font-bold' : 'text-storybook-roseDark'
            }`}
          >
            {isMasterAlchemist
              ? `~ Exclusive Royal Edition for Queen ${APP_CONFIG.girlfriendName} ~`
              : `~ Painted with love for ${APP_CONFIG.girlfriendName} ~`}
          </p>

          {isMasterAlchemist && (
            <div className="inline-flex items-center gap-1.5 mt-2 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 border border-purple-300 px-3.5 py-1 rounded-full text-xs font-bold text-purple-900 shadow-2xs">
              <span>👑</span>
              <span>Certified Master Alchemist of Love</span>
              <span>✨</span>
            </div>
          )}
        </div>

        {/* Grid of Choices */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 rounded-2xl border ${
            isMasterAlchemist
              ? 'bg-white/85 backdrop-blur-sm border-purple-200/80 shadow-xs'
              : 'bg-white/70 backdrop-blur-xs border-storybook-border/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📅</span>
            <div>
              <div
                className={`text-[10px] font-bold uppercase ${
                  isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                }`}
              >
                The Day
              </div>
              <div className="text-xs font-semibold text-storybook-ink">{selection.dayDate || 'Not selected'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">⏰</span>
            <div>
              <div
                className={`text-[10px] font-bold uppercase ${
                  isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                }`}
              >
                The Hour
              </div>
              <div className="text-xs font-semibold text-storybook-ink">
                {selection.customTime || selection.timeSlot || 'Afternoon'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗺️</span>
            <div>
              <div
                className={`text-[10px] font-bold uppercase ${
                  isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                }`}
              >
                The Destination
              </div>
              <div className="text-xs font-semibold text-storybook-ink">
                {selection.customLocation || selection.location || 'Secret spot'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl">🥤</span>
            <div>
              <div
                className={`text-[10px] font-bold uppercase ${
                  isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                }`}
              >
                The Elixir
              </div>
              <div className="text-xs font-semibold text-storybook-ink">
                {selection.customDrink || selection.drink || 'Lavender Lemonade'}
              </div>
            </div>
          </div>

          <div
            className={`sm:col-span-2 flex items-start gap-2.5 pt-2 border-t ${
              isMasterAlchemist ? 'border-purple-200/50' : 'border-storybook-border/40'
            }`}
          >
            <span className="text-xl">🎨</span>
            <div>
              <div
                className={`text-[10px] font-bold uppercase ${
                  isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
                }`}
              >
                Adventures
              </div>
              <div className="text-xs font-semibold text-storybook-ink">
                {selection.activities.length > 0 ? selection.activities.join(' • ') : 'Surprise adventure'}
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Alchemist Perks Badge Section */}
        {unlockedRecipes.length > 0 && (
          <div
            className={`mb-4 p-3 rounded-2xl text-left border ${
              isMasterAlchemist
                ? 'bg-purple-50/70 border-purple-200'
                : 'bg-storybook-blush/60 border-storybook-rose/30'
            }`}
          >
            <div
              className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${
                isMasterAlchemist ? 'text-purple-800' : 'text-storybook-roseDark'
              }`}
            >
              <span>🧪</span>
              <span>Active Alchemist Perks ({unlockedRecipes.length} Unlocked):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {unlockedRecipes.map((r) => (
                <span
                  key={r.id}
                  className={`inline-flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md text-[11px] font-medium text-storybook-ink border shadow-2xs ${
                    r.isLegendary
                      ? 'border-amber-400 bg-amber-50/90 font-bold text-amber-900'
                      : isMasterAlchemist
                      ? 'border-purple-200'
                      : 'border-storybook-rose/20'
                  }`}
                  title={r.perkDesc}
                >
                  <span>{r.icon}</span>
                  <span>{r.perkTitle}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXCLUSIVE BOTTOM-RIGHT STAMP: "LEGENDARY QUEEN 👑" (Only if Master Alchemist is discovered) */}
        {isMasterAlchemist && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -8 }}
            transition={{ type: 'spring', damping: 15, delay: 0.3 }}
            className="absolute bottom-3.5 right-3.5 z-20 pointer-events-none select-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Golden/Purple Wax Seal Ring */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-800 via-fuchsia-700 to-amber-400 p-[3px] shadow-[0_8px_22px_rgba(147,51,234,0.35)] flex items-center justify-center">
                {/* Inner Wax Texture */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center text-center p-1 border-2 border-amber-300/80 shadow-inner">
                  <span className="text-sm sm:text-base animate-bounce drop-shadow">👑</span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-amber-300 font-sans leading-tight mt-0.5">
                    LEGENDARY
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white font-sans leading-tight">
                    QUEEN
                  </span>
                  <div className="text-[6px] sm:text-[7px] text-amber-200/90 font-handwriting mt-0.5">
                    ★ Certified ★
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Freely Draggable Stamped Stickers Layer with Direct 1:1 Precision */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {stickers.map((s) => {
              const isDragging = draggingStickerId === s.id;
              const isSelected = selectedStickerId === s.id;

              return (
                <div
                  key={s.id}
                  onPointerDown={(e) => handleStickerPointerDown(e, s)}
                  style={{
                    position: 'absolute',
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale * (isDragging ? 1.2 : 1)})`,
                    touchAction: 'none'
                  }}
                  className="pointer-events-auto cursor-grab active:cursor-grabbing select-none group transition-transform duration-75"
                >
                  <div className="relative">
                    <span
                      className={`text-3xl sm:text-4xl drop-shadow-md select-none block transition-all ${
                        isDragging ? 'scale-115 drop-shadow-lg' : 'hover:scale-115'
                      }`}
                    >
                      {s.emoji}
                    </span>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveSticker(s.id, e)}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center shadow-xs cursor-pointer export-exclude"
                        title="Remove sticker"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* EXPORTED VERSION ONLY: OFFICIAL BARCODE STRIP */}
        {isExporting && (
          <div className="mt-5 pt-3 border-t-2 border-dashed border-storybook-border/80 flex flex-col items-center justify-center gap-1 select-none bg-white/70 backdrop-blur-xs p-2.5 rounded-xl">
            {/* High-Resolution SVG Barcode */}
            <svg className="h-9 w-64 max-w-full text-storybook-ink" viewBox="0 0 280 40" fill="currentColor">
              <rect x="0" y="0" width="3" height="40" />
              <rect x="5" y="0" width="2" height="40" />
              <rect x="9" y="0" width="5" height="40" />
              <rect x="17" y="0" width="2" height="40" />
              <rect x="22" y="0" width="4" height="40" />
              <rect x="29" y="0" width="2" height="40" />
              <rect x="34" y="0" width="6" height="40" />
              <rect x="43" y="0" width="1" height="40" />
              <rect x="46" y="0" width="4" height="40" />
              <rect x="53" y="0" width="2" height="40" />
              <rect x="58" y="0" width="5" height="40" />
              <rect x="66" y="0" width="3" height="40" />
              <rect x="72" y="0" width="2" height="40" />
              <rect x="77" y="0" width="6" height="40" />
              <rect x="86" y="0" width="2" height="40" />
              <rect x="91" y="0" width="4" height="40" />
              <rect x="98" y="0" width="1" height="40" />
              <rect x="101" y="0" width="5" height="40" />
              <rect x="109" y="0" width="2" height="40" />
              <rect x="114" y="0" width="4" height="40" />
              <rect x="121" y="0" width="3" height="40" />
              <rect x="127" y="0" width="5" height="40" />
              <rect x="135" y="0" width="2" height="40" />
              <rect x="140" y="0" width="4" height="40" />
              <rect x="147" y="0" width="2" height="40" />
              <rect x="152" y="0" width="6" height="40" />
              <rect x="161" y="0" width="1" height="40" />
              <rect x="164" y="0" width="5" height="40" />
              <rect x="172" y="0" width="3" height="40" />
              <rect x="178" y="0" width="2" height="40" />
              <rect x="183" y="0" width="5" height="40" />
              <rect x="191" y="0" width="2" height="40" />
              <rect x="196" y="0" width="4" height="40" />
              <rect x="203" y="0" width="1" height="40" />
              <rect x="207" y="0" width="6" height="40" />
              <rect x="216" y="0" width="2" height="40" />
              <rect x="221" y="0" width="4" height="40" />
              <rect x="228" y="0" width="3" height="40" />
              <rect x="234" y="0" width="5" height="40" />
              <rect x="242" y="0" width="2" height="40" />
              <rect x="247" y="0" width="4" height="40" />
              <rect x="254" y="0" width="2" height="40" />
              <rect x="259" y="0" width="6" height="40" />
              <rect x="268" y="0" width="2" height="40" />
              <rect x="273" y="0" width="4" height="40" />
            </svg>
            <div className="font-mono text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-storybook-ink">
              {isMasterAlchemist
                ? `👑 ROYAL-VIP-PASS • ${APP_CONFIG.girlfriendName.toUpperCase()} & ${APP_CONFIG.boyfriendName.toUpperCase()} • №2026-081723`
                : `OFFICIAL-DATE-TICKET • ${APP_CONFIG.girlfriendName.toUpperCase()} & ${APP_CONFIG.boyfriendName.toUpperCase()} • №2026-081723`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
