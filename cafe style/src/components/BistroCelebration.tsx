import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { bistroSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Download, Home, Sparkles, CheckCircle2, Mail, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BistroCelebrationProps {
  selection: DateSelection;
  onRestart: () => void;
}

export const BistroCelebration: React.FC<BistroCelebrationProps> = ({ selection, onRestart }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    bistroSound.playSuccessChime();
    // Warm gold, burgundy & cream confetti
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#c59b27', '#80182a', '#f5ecdf', '#d4af37', '#fbebed'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const formattedActivities = selection.activities.join(', ') +
    (selection.customActivity ? ` (+ "${selection.customActivity}")` : '');

  const fullLocation = selection.customLocation
    ? `${selection.location} (${selection.customLocation})`
    : selection.location;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const fullDrink = selection.customDrink
    ? `${selection.drink} (${selection.customDrink})`
    : selection.drink;

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    try {
      setDownloading(true);
      bistroSound.playClink();
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        backgroundColor: '#fcfaf6',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Bistro_Receipt.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      bistroSound.playSuccessChime();
      setDownloaded(true);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-6 text-center z-10 w-full">
      {/* Toasting Emblem */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-24 h-24 md:w-28 md:h-28 bg-[#fffdfa] border-2 border-[#d9c7b2] rounded-full flex items-center justify-center text-5xl shadow-menu mb-4 relative"
      >
        <span>🥂</span>
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -top-1 -right-1 text-2xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Main Celebration Dialogue */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-[#fffdfa] border border-[#e7dccc] rounded-3xl p-6 md:p-7 shadow-menu w-full mb-6 text-center"
      >
        <div className="inline-block px-3 py-1 bg-[#fbebed] text-[#80182a] font-serif font-bold text-xs rounded-full mb-2">
          Table N° 2 Officially Confirmed ✨
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2b231f] mb-2 tracking-tight">
          Santé! It's a Date! 🥐🍷
        </h1>

        <p className="text-stone-700 text-sm md:text-base font-serif italic leading-relaxed mb-4">
          The chef has prepared our reservation! {APP_CONFIG.boyfriendName} has received the receipt in his inbox. Save your receipt keepsake below or read the chef's personal note! 💌
        </p>
      </motion.div>

      {/* The Printable Thermal Receipt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        ref={receiptRef}
        className="w-full bg-[#fffff8] border border-[#e5d8c8] rounded-3xl p-5 md:p-6 shadow-receipt text-left relative overflow-hidden font-mono text-xs text-[#2b231f] mb-6"
      >
        {/* Paid Stamp */}
        <div className="absolute top-5 right-4 z-10">
          <div className="w-20 h-20 md:w-22 md:h-22 rounded-full border-4 border-dashed border-[#80182a] text-[#80182a] flex flex-col items-center justify-center font-serif font-bold text-center p-1 bg-[#fbebed]/60 -rotate-12">
            <span className="text-lg">☕</span>
            <span className="text-[8px] font-mono uppercase font-bold tracking-wider mt-0.5">PAID IN FULL</span>
            <span className="text-[7px] font-sans font-bold text-[#80182a]/70">100% LOVE</span>
          </div>
        </div>

        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-[#e5d8c8] pb-3 mb-3">
          <h3 className="font-serif text-lg font-bold text-[#2b231f]">{APP_CONFIG.bistroName}</h3>
          <p className="text-[10px] text-stone-500 font-mono">PARISIAN BISTRO · TABLE N° 2</p>
          <div className="text-[9px] text-stone-400 font-mono mt-0.5">
            GUESTS: {APP_CONFIG.girlfriendName} & {APP_CONFIG.boyfriendName}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 pb-3 border-b-2 border-dashed border-[#e5d8c8] text-xs">
          <div>
            <span className="font-bold text-stone-900">📅 DATE & TIME: </span>
            <span className="font-sans text-stone-700">{selection.dayDate} · {fullTime}</span>
          </div>
          <div>
            <span className="font-bold text-stone-900">📍 TABLE / AMBIANCE: </span>
            <span className="font-sans text-stone-700">{fullLocation}</span>
          </div>
          <div>
            <span className="font-bold text-stone-900">🥐 MAIN COURSES: </span>
            <span className="font-sans text-stone-700">{formattedActivities}</span>
          </div>
          <div>
            <span className="font-bold text-stone-900">☕ REFRESHMENT: </span>
            <span className="font-sans text-stone-700">{fullDrink}</span>
          </div>
        </div>

        {/* Total calculation */}
        <div className="pt-3 flex justify-between font-bold font-mono text-xs text-[#80182a]">
          <span>TOTAL DUE:</span>
          <span>PAID IN ADVANCE (100% LOVE)</span>
        </div>
      </motion.div>

      {/* Button to Open Secret Chef Letter Modal */}
      <div className="w-full mb-4">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={() => {
            bistroSound.playClink();
            setShowLetter(true);
          }}
          className="w-full py-3.5 bg-[#fffdfa] hover:bg-[#f7f2ea] border-2 border-dashed border-[#c59b27] text-[#2b231f] font-serif font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
        >
          <Mail className="w-4 h-4 text-[#80182a] animate-bounce" />
          <span>Open Chef's Note from {APP_CONFIG.boyfriendName} 💌</span>
        </motion.button>
      </div>

      {/* Secret Letter Popup Modal */}
      <AnimatePresence>
        {showLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                bistroSound.playKeyClick();
                setShowLetter(false);
              }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              className="relative bg-[#fffdfa] border-2 border-[#d9c7b2] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-menu z-10 text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#e7dccc] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💌</span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2b231f]">
                      {APP_CONFIG.loveLetter.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#80182a]">
                      {APP_CONFIG.loveLetter.badge}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    bistroSound.playKeyClick();
                    setShowLetter(false);
                  }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Letter Content */}
              <div className="p-4 bg-[#fbf5eb] border border-[#ebdcc7] rounded-2xl mb-5">
                <p className="font-serif italic text-stone-800 text-sm md:text-base whitespace-pre-line leading-relaxed">
                  {APP_CONFIG.loveLetter.content}
                </p>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    bistroSound.playKeyClick();
                    setShowLetter(false);
                  }}
                  className="px-5 py-2.5 bg-[#80182a] hover:bg-[#681322] text-white font-serif font-bold rounded-xl text-sm shadow-xs cursor-pointer"
                >
                  Fermer la Lettre 💖
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Keepsake Button */}
      <div className="flex flex-col gap-3 w-full mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="w-full py-4 bg-[#80182a] hover:bg-[#681322] text-white font-serif font-bold text-base md:text-lg rounded-2xl shadow-gold-btn flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>Bistro Receipt Saved! ☕</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>{downloading ? "Printing Receipt..." : "Download Café Receipt Keepsake (.PNG) 🧾"}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </>
          )}
        </motion.button>

        {/* Return Button */}
        <button
          type="button"
          onClick={() => {
            bistroSound.playKeyClick();
            onRestart();
          }}
          className="w-full py-2.5 text-stone-500 hover:text-stone-800 font-sans text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Bistro Entrance</span>
        </button>
      </div>
    </div>
  );
};
