import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { islandSound } from '../utils/soundEffects';
import { Download, CheckCircle2, RotateCcw, Stamp, AlertCircle, ArrowUp } from 'lucide-react';
import html2canvas from 'html2canvas';

interface IslandFinalPassportProps {
  selection: DateSelection;
  onConfirm: () => void;
  onReset: () => void;
}

export const IslandFinalPassport: React.FC<IslandFinalPassportProps> = ({
  selection,
  onConfirm,
  onReset,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const stampButtonRef = useRef<HTMLButtonElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [stampPrompt, setStampPrompt] = useState(false);

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

  const handleStampPassport = () => {
    islandSound.playStamp();
    setStamped(true);
    setStampPrompt(false);
  };

  const handleAttemptConfirm = () => {
    if (!stamped) {
      islandSound.playWobble();
      setStampPrompt(true);
      // Smoothly scroll to stamp button if needed
      stampButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    islandSound.playSuccess();
    onConfirm();
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      islandSound.playPop();
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        backgroundColor: '#fefce8',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Island_Boarding_Pass.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      islandSound.playSuccess();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Top Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 rounded-full font-black text-sm mb-2 shadow-sm">
          <span>✨</span>
          <span>Dodo Airlines Official Boarding Pass</span>
          <span>✨</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-stone-800">
          Our Island Date Itinerary 🏝️
        </h2>
      </motion.div>

      {/* The Printable Boarding Pass Card */}
      <div
        ref={cardRef}
        className="w-full bg-[#fffef5] border-4 border-emerald-400 rounded-4xl p-6 md:p-7 shadow-bubble relative overflow-hidden mb-6"
      >
        {/* Background watermark stamp */}
        <div className="absolute -right-8 -bottom-8 opacity-5 text-9xl pointer-events-none select-none">
          🦤
        </div>

        {/* Interactive Stamp Overlay or Pulsing Compulsory Stamp Button */}
        {stamped ? (
          <motion.div
            initial={{ scale: 2.5, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 0.95 }}
            className="absolute top-10 right-5 z-20 pointer-events-none"
          >
            <div className="w-26 h-26 md:w-28 md:h-28 rounded-full border-4 border-dashed border-rose-500 text-rose-500 flex flex-col items-center justify-center font-black text-center p-2 shadow-md bg-rose-50/40 backdrop-blur-[1px]">
              <span className="text-2xl leading-none">💖</span>
              <span className="text-[10px] uppercase tracking-wider mt-1 font-mono font-black">OFFICIALLY APPROVED</span>
              <span className="text-[8px] font-bold tracking-tight text-rose-400">DODO AIRLINES CHARTER</span>
            </div>
          </motion.div>
        ) : (
          <div className="absolute top-5 right-5 z-20 flex flex-col items-end">
            <motion.button
              ref={stampButtonRef}
              type="button"
              animate={
                stampPrompt
                  ? { scale: [1, 1.15, 0.95, 1.1, 1], rotate: [0, -6, 6, -4, 0] }
                  : { scale: [1, 1.06, 1] }
              }
              transition={{ repeat: Infinity, duration: stampPrompt ? 1 : 2 }}
              onClick={handleStampPassport}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-md btn-nook-bounce cursor-pointer border-3 ${
                stampPrompt
                  ? 'bg-rose-500 text-white border-rose-700 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-700 border-rose-400'
              }`}
              title="Click here to stamp your official approval!"
            >
              <Stamp className="w-4 h-4" />
              <span>👉 Click to Stamp! 🌸</span>
            </motion.button>

            {/* Fun Prompt Tooltip if user tried to confirm without stamping */}
            {stampPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 px-3 py-1.5 bg-rose-600 text-white text-[11px] font-bold rounded-xl shadow-md flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
                <span>Stamp here first to validate ticket! 🦤</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Card Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-emerald-200 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              ✈️
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Dodo Airlines Charter</div>
              <div className="text-xl font-black text-stone-800">{APP_CONFIG.islandName}</div>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="grid grid-cols-2 gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Passenger 1</span>
            <div className="font-black text-stone-800 text-sm md:text-base">{APP_CONFIG.girlfriendName} 👑</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Passenger 2</span>
            <div className="font-black text-stone-800 text-sm md:text-base">{APP_CONFIG.boyfriendName} 🎩</div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">📅</span>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase">Flight Departure Date & Time</div>
              <div className="font-black text-stone-800">{selection.dayDate} · {fullTime}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-lg">📍</span>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase">Destination Island Spot</div>
              <div className="font-black text-stone-800">{fullLocation}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-lg">🎒</span>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase">Pocket Adventures</div>
              <div className="font-black text-stone-800">{formattedActivities}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-lg">☕</span>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase">The Roost Refreshment</div>
              <div className="font-black text-stone-800">{fullDrink}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-lg">💌</span>
            <div>
              <div className="text-[11px] font-bold text-stone-500 uppercase">Touchdown Greeting</div>
              <div className="font-black text-stone-800">{selection.greetings.join(', ')}</div>
            </div>
          </div>

          {selection.customNotes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 mt-2">
              <span className="font-bold">✍️ Postcard Memo: </span>"{selection.customNotes}"
            </div>
          )}
        </div>

        {/* Bottom Barcode */}
        <div className="mt-5 pt-4 border-t-2 border-dashed border-emerald-200 flex items-center justify-between">
          <div className="font-mono text-xs font-bold text-stone-400 tracking-widest">
            ||| | |||| || ||||| | ||| |||| |
          </div>
          <div className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
            stamped ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {stamped ? 'DAL-STAMP-VERIFIED ✓' : 'AWAITING-STAMP-SEAL'}
          </div>
        </div>
      </div>

      {/* Fun Compulsory Stamp Banner Alert */}
      <AnimatePresence>
        {!stamped && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleStampPassport}
            className="w-full mb-5 p-3.5 bg-gradient-to-r from-rose-100 to-amber-100 border-2 border-rose-400 rounded-3xl flex items-center justify-between cursor-pointer shadow-sm hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-bounce">🦤</span>
              <div>
                <div className="text-xs font-black text-rose-900">
                  {stampPrompt ? "⚠️ Flight Clearance Required!" : "🌸 Passport Stamp Required to Board:"}
                </div>
                <div className="text-[11px] font-medium text-stone-600">
                  Tap the <span className="font-bold text-rose-700">"Click to Stamp"</span> seal above to certify your flight!
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-black shrink-0 shadow-sm">
              Stamp Now ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleAttemptConfirm}
          className={`w-full py-4 font-black text-lg md:text-xl rounded-3xl shadow-nook border-b-4 btn-nook-bounce flex items-center justify-center gap-2 cursor-pointer transition-all ${
            stamped
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-emerald-700'
              : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-stone-900 border-amber-600'
          }`}
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>{stamped ? "Confirm & Book Flight! 🛫" : "Stamp Ticket to Book Flight! 🌸"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            islandSound.playPop();
            onReset();
          }}
          className="w-full py-2.5 text-stone-500 hover:text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Change Date Choices</span>
        </button>
      </div>
    </div>
  );
};
