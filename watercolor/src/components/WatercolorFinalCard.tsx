import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const easelRef = useRef<WatercolorStickerEaselHandle | null>(null);

  const discoveredIds = getDiscoveredRecipeIds();
  const isMasterAlchemist = discoveredIds.includes('grand_masterpiece') || discoveredIds.length >= 5;

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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      {/* Header Tag */}
      {isMasterAlchemist ? (
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 text-purple-950 font-serif text-xs font-bold px-4 py-1.5 rounded-full border border-purple-300 mb-2 shadow-2xs">
          <span>👑</span>
          <span>EXCLUSIVE ROYAL AMETHYST MASTERPIECE</span>
          <span>✨</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 bg-storybook-blush text-storybook-roseDark font-serif text-xs font-semibold px-4 py-1.5 rounded-full border border-storybook-rose mb-2 shadow-2xs">
          <span>🎨</span>
          <span>OUR PAINTED MASTERPIECE PROCLAMATION</span>
          <span>🎨</span>
        </div>
      )}

      {/* Interactive Sticker & Keepsake Decorator Easel */}
      <WatercolorStickerEasel
        ref={easelRef}
        selection={selection}
        customPainting={customPainting}
        onOpenStudio={onOpenStudio}
      />

      {/* Confirm & Edit Buttons */}
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
  );
};
