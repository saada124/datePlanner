import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { islandSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Download, Home, Sparkles, CheckCircle2, Mail, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface IslandCelebrationProps {
  selection: DateSelection;
  onRestart: () => void;
}

export const IslandCelebration: React.FC<IslandCelebrationProps> = ({ selection, onRestart }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    islandSound.playSuccess();
    // Burst colorful AC style confetti
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#5dc090', '#f9d849', '#5bb8e5', '#ff7b72', '#a855f7'];

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

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      setDownloading(true);
      islandSound.playPop();
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2.5,
        backgroundColor: '#fefce8',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Official_Boarding_Pass.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      islandSound.playSuccess();
      setDownloaded(true);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-6 text-center z-10 w-full">
      {/* Flight Takeoff Animation */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-28 h-28 md:w-32 md:h-32 bg-amber-100 border-4 border-amber-300 rounded-full flex items-center justify-center text-6xl shadow-bubble mb-5 relative"
      >
        <span>🛫</span>
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 text-2xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute -bottom-2 -left-2 text-2xl"
        >
          💖
        </motion.div>
      </motion.div>

      {/* Main Celebration Dialogue */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-[#fffdf0] border-4 border-emerald-400 rounded-4xl p-6 md:p-7 shadow-bubble w-full mb-6 text-center"
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-black text-xs px-4 py-1 rounded-full border-2 border-emerald-600 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
          <span>🦤</span>
          <span>Dodo Airlines Flight Cleared!</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-stone-800 mb-2 tracking-tight">
          Woohoo! It's a Date! 🎉🏝️
        </h1>

        <p className="text-stone-700 text-sm md:text-base font-medium leading-relaxed mb-4">
          The charter plane is officially fueled and ready! {APP_CONFIG.boyfriendName} has received the itinerary in his inbox. Don't forget to save your official boarding pass keepsake below! 📸💖
        </p>

        <div className="dialogue-pointer-down" />
      </motion.div>

      {/* The Printable Boarding Pass Card Preview in Celebration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        ref={ticketRef}
        className="w-full bg-[#fffef5] border-4 border-emerald-400 rounded-4xl p-5 md:p-6 shadow-bubble relative overflow-hidden text-left mb-6"
      >
        {/* Stamp Overlay */}
        <div className="absolute top-6 right-5 z-10">
          <div className="w-22 h-22 md:w-24 md:h-24 rounded-full border-4 border-dashed border-rose-500 text-rose-500 flex flex-col items-center justify-center font-black text-center p-1.5 shadow-sm bg-rose-50/70 -rotate-12">
            <span className="text-xl leading-none">💖</span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5 font-mono font-black">OFFICIALLY APPROVED</span>
            <span className="text-[7px] font-bold tracking-tight text-rose-400">DODO AIRLINES</span>
          </div>
        </div>

        {/* Card Header */}
        <div className="flex items-center gap-3 border-b-2 border-dashed border-emerald-200 pb-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-center text-xl shadow-sm">
            ✈️
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Official Boarding Pass</div>
            <div className="text-lg font-black text-stone-800">{APP_CONFIG.islandName}</div>
          </div>
        </div>

        {/* Passengers */}
        <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 mb-3 text-xs">
          <div>
            <span className="text-[9px] font-bold uppercase text-emerald-800">Passenger 1</span>
            <div className="font-black text-stone-800 text-sm">{APP_CONFIG.girlfriendName} 👑</div>
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase text-emerald-800">Passenger 2</span>
            <div className="font-black text-stone-800 text-sm">{APP_CONFIG.boyfriendName} 🎩</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">📅 Date & Time: </span>
            <span className="font-black text-stone-800">{selection.dayDate} · {fullTime}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">📍 Location: </span>
            <span className="font-black text-stone-800">{fullLocation}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">🎒 Activities: </span>
            <span className="font-bold text-stone-800">{formattedActivities}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-500 uppercase">☕ Refreshment: </span>
            <span className="font-bold text-stone-800">{selection.drink}</span>
          </div>
        </div>

        {/* Bottom Barcode */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-emerald-200 flex items-center justify-between">
          <div className="font-mono text-[10px] font-bold text-stone-400 tracking-widest">
            ||| | |||| || ||||| | ||| |||| |
          </div>
          <div className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            DAL-CONFIRMED-DATE
          </div>
        </div>
      </motion.div>

      {/* Interactive Button to Open Popup Modal */}
      <div className="w-full mb-6">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={() => {
            islandSound.playAnimaleseSpeech(6);
            setShowLetter(true);
          }}
          className="w-full py-4 bg-[#fffdf0] hover:bg-[#fff9e6] border-3 border-dashed border-amber-400 text-stone-800 font-black rounded-3xl shadow-sm btn-nook-bounce flex items-center justify-center gap-2.5 cursor-pointer text-sm md:text-base"
        >
          <Mail className="w-5 h-5 text-rose-500 animate-bounce" />
          <span>Open Secret Letter from {APP_CONFIG.boyfriendName} 💌</span>
        </motion.button>
      </div>

      {/* Secret Love Letter Popup Modal */}
      <AnimatePresence>
        {showLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                islandSound.playPop();
                setShowLetter(false);
              }}
              className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 25 }}
              className="relative bg-[#fffdf0] border-4 border-amber-400 rounded-4xl p-6 md:p-8 max-w-lg w-full shadow-bubble z-10 text-left overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-amber-200 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 bg-rose-100 border-2 border-rose-300 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    💌
                  </div>
                  <div>
                    <h3 className="font-black text-stone-800 text-lg md:text-xl">
                      {APP_CONFIG.loveLetter.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {APP_CONFIG.loveLetter.badge}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    islandSound.playPop();
                    setShowLetter(false);
                  }}
                  className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Letter Content */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl mb-6">
                <p className="text-stone-700 text-sm md:text-base whitespace-pre-line leading-relaxed font-medium">
                  {APP_CONFIG.loveLetter.content}
                </p>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    islandSound.playPop();
                    setShowLetter(false);
                  }}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-stone-900 font-black rounded-2xl shadow-nook-btn btn-nook-bounce cursor-pointer text-sm"
                >
                  Close Letter 💖
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Keepsake Button (High Priority Call to Action) */}
      <div className="flex flex-col gap-3 w-full mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          type="button"
          disabled={downloading}
          onClick={handleDownload}
          className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-black text-base md:text-lg rounded-3xl shadow-nook border-b-4 border-sky-700 btn-nook-bounce flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <span>Boarding Pass Saved to Device! 📸</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>{downloading ? "Printing Boarding Pass..." : "Download Boarding Pass Keepsake (.PNG) 📸"}</span>
              <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
            </>
          )}
        </motion.button>

        {/* Return Button */}
        <button
          type="button"
          onClick={() => {
            islandSound.playPop();
            onRestart();
          }}
          className="w-full py-3 bg-white hover:bg-stone-100 text-stone-600 font-bold rounded-3xl border-2 border-stone-300 shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span>Plan Another Flight / Return to Gate</span>
        </button>
      </div>
    </div>
  );
};
