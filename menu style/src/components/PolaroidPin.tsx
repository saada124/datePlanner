import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import { Heart, Sparkles } from 'lucide-react';

export const PolaroidPin: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const availablePhotos = APP_CONFIG.polaroid.photos?.filter(p => !!p.url) || [];
  const currentImageUrl = availablePhotos.length > 0
    ? availablePhotos[photoIndex % availablePhotos.length].url
    : APP_CONFIG.polaroid.imageUrl;

  const currentCaption = availablePhotos.length > 0
    ? availablePhotos[photoIndex % availablePhotos.length].caption
    : APP_CONFIG.polaroid.caption;

  const handleFlip = () => {
    menuSound.playPaperTurn();
    setIsFlipped((prev) => !prev);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    menuSound.playPaperTurn();
    setPhotoIndex((prev) => (prev + 1) % availablePhotos.length);
  };

  return (
    <div className="w-full flex justify-center select-none perspective-1000">
      <motion.div
        initial={{ rotate: -2 }}
        whileHover={{ scale: 1.04, rotate: isFlipped ? 2 : 0 }}
        onClick={handleFlip}
        className="w-full max-w-[280px] bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-2xl p-4 shadow-paper-lg cursor-pointer relative"
      >
        {/* Silver Paperclip */}
        <div className="absolute -top-3.5 left-6 w-5 h-9 border-2 border-[#A8A8A8] rounded-full shadow-xs pointer-events-none z-10" />

        {/* Polaroid Card Front vs Back */}
        {!isFlipped ? (
          <div className="flex flex-col items-center">
            {/* Photo Window */}
            <div className="w-full h-44 rounded-xl border border-[var(--border-card)] overflow-hidden mb-3 relative flex items-center justify-center bg-gradient-to-tr from-[#F4A45C]/30 via-[#FFE8A3]/40 to-[#E8635A]/20">
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={currentCaption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-4xl mb-1">📸</span>
                  <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    {APP_CONFIG.girlfriendName} & {APP_CONFIG.boyfriendName}
                  </span>
                  <span className="font-mono text-[10px] text-[#E8635A] font-bold mt-1">
                    {APP_CONFIG.polaroid.dateBadge}
                  </span>
                </div>
              )}

              {/* Browse Photo Arrows (If multiple photos provided) */}
              {availablePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#2B1B17]/70 hover:bg-[#2B1B17] text-white text-[10px] font-mono rounded-md backdrop-blur-xs cursor-pointer"
                >
                  Next Photo ❯
                </button>
              )}
            </div>

            {/* Handwritten Pen Caption */}
            <div className="w-full text-center">
              <span className="font-serif italic text-xs text-[var(--text-primary)]">
                "{currentCaption}"
              </span>
              <div className="font-mono text-[9px] text-[var(--text-secondary)] mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#E8635A]" />
                <span>Tap to flip note ↻</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[220px] flex flex-col justify-between p-2 text-left">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-2 font-mono text-[10px] text-[var(--text-secondary)]">
              <span>SECRET NOTE ON BACK</span>
              <Heart className="w-3.5 h-3.5 fill-[#E8635A] text-[#E8635A]" />
            </div>

            <p className="font-serif italic text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
              {APP_CONFIG.polaroid.noteOnBack}
            </p>

            <div className="font-mono text-[9px] text-[var(--text-secondary)] text-center pt-2 border-t border-dashed border-[var(--border-dashed)]">
              Tap to flip photo ↻
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
