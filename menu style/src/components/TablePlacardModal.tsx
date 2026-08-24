import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateMenuSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import html2canvas from 'html2canvas';
import { X, Download, CheckCircle2, Sparkles } from 'lucide-react';

interface TablePlacardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selection: DateMenuSelection;
}

export const TablePlacardModal: React.FC<TablePlacardModalProps> = ({
  isOpen,
  onClose,
  selection
}) => {
  const placardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!placardRef.current) return;
    try {
      setDownloading(true);
      menuSound.playStampClick();

      const canvas = await html2canvas(placardRef.current, {
        scale: 3,
        backgroundColor: '#FFF8EC',
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_Table_Reserved_Placard.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      menuSound.playTearAndStamp();
      setDownloaded(true);
    } catch (err) {
      console.error('Placard export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B1B17]/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-lg w-full my-auto flex flex-col items-center bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-ticket text-left relative"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center w-full mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-highlight)] text-[#E8635A] rounded-full font-mono text-[10px] font-bold uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Printable Table Tent Placard</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[var(--text-primary)]">
              Table Reservation Card
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Print this folded placard and place it on your real date table!
            </p>
          </div>

          {/* 🪧 The Printable Foldable Table Tent Card Surface */}
          <div
            ref={placardRef}
            className="w-full bg-[var(--bg-inner-box)] border-2 border-[var(--border-card)] rounded-2xl p-6 text-center shadow-paper relative overflow-hidden font-serif mb-6"
          >
            {/* Top Tent Flap (Fold Line) */}
            <div className="border-b-2 border-dashed border-[var(--border-dashed)] pb-3 mb-4 text-[9px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.25em]">
              - - - ✂ FOLD HERE FOR TABLE STAND ✂ - - -
            </div>

            {/* Brass Star Badge */}
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-b from-[#E7C782] to-[#B38A38] border border-[#70584E] flex items-center justify-center text-xl shadow-xs mb-2">
              ✨
            </div>

            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8635A] mb-1">
              TABLE N° 07 · OFFICIALLY RESERVED
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">
              {APP_CONFIG.girlfriendName} & {APP_CONFIG.boyfriendName}
            </h2>

            <div className="font-serif italic text-xs sm:text-sm text-[var(--text-secondary)] mb-3">
              “Reserved for an unforgettable evening”
            </div>

            {/* Schedule & Vibe Summary */}
            <div className="bg-[#FFFCF5] border border-[#D8B29A]/70 rounded-xl p-3 text-xs font-mono text-[#2B1B17] space-y-1 inline-block text-left w-full max-w-sm">
              <div>
                <span className="text-[#E8635A] font-bold">DATE: </span>
                <span>{selection.dayDate}</span>
              </div>
              <div>
                <span className="text-[#E8635A] font-bold">SERVICE: </span>
                <span>{selection.customTime || selection.timeSlot}</span>
              </div>
              <div>
                <span className="text-[#E8635A] font-bold">MAIN: </span>
                <span>{selection.activityTitle}</span>
              </div>
            </div>

            {/* Bottom Fold Guide */}
            <div className="border-t-2 border-dashed border-[#D8B29A] pt-3 mt-4 text-[9px] font-mono text-[#70584E] uppercase tracking-[0.25em]">
              ✦ MAISON DES DÉLICES · 100% LOVE ✦
            </div>
          </div>

          {/* Download Placard Button */}
          <div className="w-full flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="w-full py-3.5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-sm rounded-2xl shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#F4A45C]" />
                  <span>Placard Saved to Downloads! 🪧</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Generating Placard...' : 'Download Printable Table Placard (.PNG) 🪧'}</span>
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={onClose}
              className="py-2 text-[#70584E] hover:text-[#2B1B17] font-mono text-xs cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
