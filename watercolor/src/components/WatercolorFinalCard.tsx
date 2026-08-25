import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { watercolorAudio } from '../utils/watercolorAudio';
import { WatercolorStickerEasel } from './WatercolorStickerEasel';

interface WatercolorFinalCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const WatercolorFinalCard: React.FC<WatercolorFinalCardProps> = ({
  selection,
  onConfirm,
  onEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsSubmitting(true);
    watercolorAudio.playFanfare();

    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('trigger-watercolor-splash', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: '#e85d75'
        }
      })
    );

    setTimeout(() => {
      onConfirm();
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      {/* Header Tag */}
      <div className="inline-flex items-center gap-2 bg-storybook-blush text-storybook-roseDark font-serif text-xs font-semibold px-4 py-1.5 rounded-full border border-storybook-rose mb-2 shadow-2xs">
        <span>🎨</span>
        <span>OUR PAINTED MASTERPIECE PROCLAMATION</span>
        <span>🎨</span>
      </div>

      {/* Interactive Sticker & Keepsake Decorator Easel */}
      <WatercolorStickerEasel selection={selection} />

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
          className="story-btn-primary px-9 py-4 text-sm sm:text-base order-1 sm:order-2 flex items-center gap-2 cursor-pointer shadow-lg font-bold"
        >
          <span>🌸</span>
          <span>{isSubmitting ? 'Sealing Masterpiece...' : 'CONFIRM OUR DATE ❤️'}</span>
          <span>🌸</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
