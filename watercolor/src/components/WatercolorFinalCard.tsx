import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { watercolorAudio } from '../utils/watercolorAudio';
import { WatercolorStickerEasel, WatercolorStickerEaselHandle } from './WatercolorStickerEasel';
import { getDiscoveredRecipeIds } from '../config/alchemistRecipes';

interface WatercolorFinalCardProps {
  selection: DateSelection;
  customPainting?: string | null;
  onConfirm: (cardSnapshotDataUrl?: string) => void;
  onEdit: () => void;
  onOpenStudio?: () => void;
}

export const WatercolorFinalCard: React.FC<WatercolorFinalCardProps> = ({
  selection,
  customPainting,
  onConfirm,
  onEdit,
  onOpenStudio
}) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const easelRef = useRef<WatercolorStickerEaselHandle | null>(null);

  const discoveredIds = getDiscoveredRecipeIds();
  const isMasterAlchemist = discoveredIds.includes('grand_masterpiece') || discoveredIds.length >= 5;

  const handleOpenEnvelope = () => {
    watercolorAudio.playSplatterPop();
    watercolorAudio.playFanfare();

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 },
      colors: isMasterAlchemist
        ? ['#a855f7', '#fbbf24', '#c084fc', '#ec4899', '#ffffff']
        : ['#e85d75', '#fb8500', '#3a86ff', '#2a9d8f', '#ffffff']
    });

    setIsEnvelopeOpen(true);
  };

  const handleConfirmDate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsSubmitting(true);
    watercolorAudio.playFanfare();

    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: isMasterAlchemist ? '#a855f7' : '#e85d75'
        }
      })
    );

    // Capture the exact card DOM snapshot with barcode
    let snapshotDataUrl: string | null = null;
    try {
      if (easelRef.current) {
        snapshotDataUrl = await easelRef.current.captureCard();
      }
    } catch (err) {
      console.error('Card capture before confirmation error:', err);
    }

    setTimeout(() => {
      onConfirm(snapshotDataUrl || undefined);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-3 pb-16 text-center select-none">
      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          /* ============================================================
             1. 3D WAX-SEAL PARCHMENT ENVELOPE (UNOPENED CEREMONY)
             ============================================================ */
          <motion.div
            key="sealed-envelope"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            className="my-8 max-w-xl mx-auto"
          >
            {/* Header Prompt */}
            <div className="inline-flex items-center gap-2 bg-storybook-blush text-storybook-roseDark font-serif text-xs font-semibold px-4 py-1.5 rounded-full border border-storybook-rose mb-4 shadow-2xs">
              <span>💌</span>
              <span>A ROYAL WATERCOLOR LETTER HAS ARRIVED</span>
              <span>💌</span>
            </div>

            {/* The Envelope Box */}
            <div
              className={`paper-card p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden border-2 cursor-pointer group transition-all duration-300 ${
                isMasterAlchemist
                  ? 'bg-gradient-to-br from-[#faf7ff] via-[#f4edfe] to-[#ebe0fb] border-purple-300 hover:shadow-[0_20px_50px_rgba(168,85,247,0.3)]'
                  : 'bg-gradient-to-br from-[#fffbf7] via-[#fdf2f4] to-[#f4e8ee] border-storybook-rose/50 hover:shadow-[0_20px_50px_rgba(232,93,117,0.25)]'
              }`}
              onClick={handleOpenEnvelope}
            >
              {/* Postage Stamp & Cancellation Mark */}
              <div className="absolute top-4 right-4 flex flex-col items-center">
                <div
                  className={`w-14 h-16 sm:w-16 sm:h-20 rounded-lg p-1.5 shadow-md flex flex-col items-center justify-between border-2 border-dashed ${
                    isMasterAlchemist
                      ? 'bg-purple-100 border-purple-400 text-purple-900'
                      : 'bg-rose-50 border-rose-400 text-rose-800'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{isMasterAlchemist ? '👑' : '🌸'}</span>
                  <div className="text-[7px] sm:text-[8px] font-mono uppercase font-bold tracking-tighter text-center leading-tight">
                    AIR MAIL<br />TUNIS
                  </div>
                </div>
                <div className="text-[8px] font-mono text-storybook-inkLight/70 -rotate-12 mt-1">
                  POSTAGE PAID
                </div>
              </div>

              {/* Air Mail Border Strip */}
              <div className="w-full h-2 mb-6 rounded-full bg-gradient-to-r from-storybook-rose via-storybook-blue to-storybook-amber opacity-60" />

              {/* Envelope Recipient Details */}
              <div className="text-left my-4 max-w-md pl-2 sm:pl-4">
                <div className="text-[11px] font-mono uppercase tracking-widest text-storybook-inkLight">
                  🕊️ Special Delivery For:
                </div>
                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-storybook-ink mt-0.5 mb-1">
                  {isMasterAlchemist ? `Queen ${APP_CONFIG.girlfriendName}` : `Dearest ${APP_CONFIG.girlfriendName}`} 🌸
                </h2>
                <p className="font-handwriting text-base sm:text-lg text-storybook-roseDark">
                  From: {APP_CONFIG.boyfriendName} with all his love ❤️
                </p>
                <div className="text-[10px] font-mono text-storybook-inkLight/80 mt-1">
                  Destination: {selection.customLocation || selection.location || 'Our Secret Romantic Spot'}
                </div>
              </div>

              {/* 3D Wax Seal in Center */}
              <div className="my-8 flex flex-col items-center justify-center relative">
                {/* Glowing Ripple Pulse */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute w-28 h-28 rounded-full ${
                    isMasterAlchemist ? 'bg-purple-400' : 'bg-storybook-rose'
                  }`}
                />

                {/* Embossed Wax Seal */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.92 }}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-2xl relative z-10 flex flex-col items-center justify-center text-center p-2 border-2 ${
                    isMasterAlchemist
                      ? 'bg-gradient-to-tr from-purple-900 via-fuchsia-700 to-amber-500 border-amber-300 text-white'
                      : 'bg-gradient-to-tr from-rose-900 via-rose-600 to-amber-400 border-rose-200 text-white'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl drop-shadow-md">
                    {isMasterAlchemist ? '👑' : '💌'}
                  </span>
                  <div className="font-serif text-xs sm:text-sm font-bold tracking-widest leading-none mt-0.5">
                    {isMasterAlchemist ? 'ROYAL' : `${APP_CONFIG.boyfriendInitial}&${APP_CONFIG.girlfriendInitial}`}
                  </div>
                  <div className="text-[7px] font-mono opacity-80 uppercase tracking-tighter mt-0.5">
                    SEALED
                  </div>
                </motion.div>

                {/* Shimmering Tag */}
                <div className="mt-4 text-xs font-bold text-storybook-roseDark font-handwriting text-base flex items-center gap-1.5 animate-pulse">
                  <span>✨</span>
                  <span>Tap the wax seal to unseal our invitation</span>
                  <span>✨</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-storybook-inkLight text-center uppercase tracking-widest opacity-60">
                Official Royal Envelope • Certified by {APP_CONFIG.boyfriendName}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============================================================
             2. UNFOLDED CEREMONY (THE FULL DECORATED CARD REVEAL)
             ============================================================ */
          <motion.div
            key="unfolded-card"
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
          >
            {/* Top Bar with Reseal Button */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-2 px-1">
              {isMasterAlchemist ? (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 text-purple-950 font-serif text-xs font-bold px-4 py-1.5 rounded-full border border-purple-300 shadow-2xs">
                  <span>👑</span>
                  <span>EXCLUSIVE ROYAL AMETHYST MASTERPIECE</span>
                  <span>✨</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-storybook-blush text-storybook-roseDark font-serif text-xs font-semibold px-4 py-1.5 rounded-full border border-storybook-rose shadow-2xs">
                  <span>🎨</span>
                  <span>OUR PAINTED MASTERPIECE PROCLAMATION</span>
                  <span>🎨</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  watercolorAudio.playWaterDrip(1.1);
                  setIsEnvelopeOpen(false);
                }}
                className="text-xs font-handwriting text-storybook-inkLight hover:text-storybook-roseDark flex items-center gap-1 cursor-pointer hover:underline px-2 py-1"
                title="Fold back into envelope"
              >
                <span>✉️</span>
                <span>Reseal Envelope</span>
              </button>
            </div>

            {/* Interactive Sticker & Keepsake Decorator Easel */}
            <WatercolorStickerEasel
              ref={easelRef}
              selection={selection}
              customPainting={customPainting}
              onOpenStudio={onOpenStudio}
            />

            {/* Confirm & Edit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  watercolorAudio.playBrushStroke(0.8);
                  onEdit();
                }}
                className="story-btn-secondary px-6 py-3 text-xs sm:text-sm order-2 sm:order-1 cursor-pointer flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>Edit Selections</span>
              </button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                disabled={isSubmitting}
                onClick={handleConfirmDate}
                className={`story-btn-primary px-9 py-4 text-sm sm:text-base order-1 sm:order-2 flex items-center gap-2 cursor-pointer shadow-lg font-bold text-white ${
                  isMasterAlchemist
                    ? 'bg-gradient-to-r from-purple-700 via-fuchsia-600 to-amber-500 hover:from-purple-800 hover:to-amber-600'
                    : ''
                }`}
              >
                <span>{isMasterAlchemist ? '👑' : '🌸'}</span>
                <span>
                  {isSubmitting
                    ? isMasterAlchemist
                      ? 'Sealing Royal Keepsake...'
                      : 'Sealing Masterpiece...'
                    : isMasterAlchemist
                    ? 'CONFIRM ROYAL DATE 👑'
                    : 'CONFIRM OUR DATE ❤️'}
                </span>
                <span>{isMasterAlchemist ? '👑' : '🌸'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
