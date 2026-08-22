import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';
import { bistroSound } from '../../utils/soundEffects';
import { CheckCircle2, RotateCcw, Stamp, ArrowUp } from 'lucide-react';

interface BistroReceiptProps {
  selection: DateSelection;
  onConfirm: () => void;
  onReset: () => void;
}

export const BistroReceipt: React.FC<BistroReceiptProps> = ({
  selection,
  onConfirm,
  onReset,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const stampButtonRef = useRef<HTMLButtonElement>(null);
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

  const handleStamp = () => {
    bistroSound.playClink();
    setStamped(true);
    setStampPrompt(false);
  };

  const handleAttemptConfirm = () => {
    if (!stamped) {
      bistroSound.playFlutter();
      setStampPrompt(true);
      stampButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    bistroSound.playSuccessChime();
    onConfirm();
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Top Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f5ecdf] border border-[#d9c7b2] text-[#6b4226] rounded-full font-serif font-bold text-xs mb-2">
          <span>☕</span>
          <span>Additions & Notes de Table</span>
          <span>☕</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2b231f]">
          Your Café Date Order 🧾
        </h2>
      </motion.div>

      {/* The Printable Thermal Receipt Card */}
      <div
        ref={receiptRef}
        className="w-full bg-[#fffff8] border border-[#e5d8c8] rounded-3xl p-6 md:p-8 shadow-receipt text-left relative overflow-hidden font-mono text-xs md:text-sm text-[#2b231f] mb-6"
      >
        {/* Stamp Overlay */}
        {stamped ? (
          <motion.div
            initial={{ scale: 2.5, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -14, opacity: 0.95 }}
            className="absolute top-10 right-5 z-20 pointer-events-none"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-dashed border-[#80182a] text-[#80182a] flex flex-col items-center justify-center font-serif font-bold text-center p-2 shadow-sm bg-[#fbebed]/50">
              <span className="text-xl">☕</span>
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold mt-0.5">PAID IN FULL</span>
              <span className="text-[8px] font-sans font-bold text-[#80182a]/70">100% UNCONDITIONAL LOVE</span>
            </div>
          </motion.div>
        ) : (
          <div className="absolute top-5 right-5 z-20 flex flex-col items-end">
            <motion.button
              ref={stampButtonRef}
              type="button"
              animate={
                stampPrompt
                  ? { scale: [1, 1.15, 0.95, 1.1, 1] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={{ repeat: Infinity, duration: stampPrompt ? 0.8 : 2 }}
              onClick={handleStamp}
              className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-1.5 shadow-sm btn-nook-bounce cursor-pointer border ${
                stampPrompt
                  ? 'bg-[#80182a] text-white border-[#5c101e] ring-4 ring-rose-200'
                  : 'bg-[#fbebed] hover:bg-[#f3d7db] text-[#80182a] border-[#80182a]/30'
              }`}
              title="Click to stamp receipt paid!"
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>👉 Stamp Receipt (Paid in Love) ✨</span>
            </motion.button>

            {stampPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 px-2.5 py-1 bg-[#80182a] text-white text-[10px] font-mono font-bold rounded-lg shadow-sm flex items-center gap-1"
              >
                <ArrowUp className="w-3 h-3 animate-bounce" />
                <span>Stamp receipt first to confirm table! ☕</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-[#e5d8c8] pb-4 mb-4">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-[#2b231f]">{APP_CONFIG.bistroName}</h3>
          <p className="text-[11px] text-stone-500 font-mono mt-0.5">PARISIAN BISTRO · TABLE N° 2</p>
          <div className="text-[10px] text-stone-400 font-mono mt-1">
            GUESTS: {APP_CONFIG.girlfriendName} & {APP_CONFIG.boyfriendName}
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3 pb-4 border-b-2 border-dashed border-[#e5d8c8]">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-stone-900">1x RESERVATION DATE</div>
              <div className="text-[11px] text-stone-600 font-sans">{selection.dayDate} ({fullTime})</div>
            </div>
            <div className="font-bold text-[#80182a]">PRÉVUE</div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-stone-900">1x TABLE & AMBIANCE</div>
              <div className="text-[11px] text-stone-600 font-sans">{fullLocation}</div>
            </div>
            <div className="font-bold text-[#80182a]">RESERVÉE</div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-stone-900">MAIN COURSES / ADVENTURES</div>
              <div className="text-[11px] text-stone-600 font-sans">{formattedActivities}</div>
            </div>
            <div className="font-bold text-[#80182a]">COMMANDÉ</div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-stone-900">1x BOISSON / REFRESHMENT</div>
              <div className="text-[11px] text-stone-600 font-sans">{fullDrink}</div>
            </div>
            <div className="font-bold text-[#80182a]">OFFERT</div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-stone-900">1x ACCUEIL / GREETING</div>
              <div className="text-[11px] text-stone-600 font-sans">{selection.greetings.join(', ')}</div>
            </div>
            <div className="font-bold text-[#80182a]">DOUX</div>
          </div>

          {selection.customNotes && (
            <div className="p-3 bg-[#f7f2ea] rounded-xl text-[11px] font-serif italic text-stone-700">
              <span className="font-mono font-bold uppercase not-italic">Table Note: </span>"{selection.customNotes}"
            </div>
          )}
        </div>

        {/* Total calculation */}
        <div className="pt-4 space-y-1 text-right font-mono">
          <div className="flex justify-between text-stone-500">
            <span>SUBTOTAL:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>TAX (LOVE):</span>
            <span>100.00%</span>
          </div>
          <div className="flex justify-between font-bold text-base md:text-lg text-[#80182a] pt-2 border-t border-stone-200">
            <span>TOTAL DUE:</span>
            <span>ONE SMILE & HUG</span>
          </div>
        </div>

        {/* Bottom Barcode */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#e5d8c8] text-center">
          <div className="font-mono text-[11px] tracking-widest text-stone-400">
            ||| | |||| || ||||| | ||| |||| |
          </div>
          <div className="text-[9px] font-mono font-bold text-stone-400 mt-1 uppercase">
            {stamped ? 'BISTRO-RECEIPT-STAMPED-PAID ✓' : 'AWAITING-STAMP-OF-APPROVAL'}
          </div>
        </div>
      </div>

      {/* Compulsory Stamp Alert */}
      <AnimatePresence>
        {!stamped && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleStamp}
            className="w-full mb-5 p-3.5 bg-gradient-to-r from-[#fbebed] to-[#faeec7] border border-[#80182a]/30 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-left">
              <span className="text-xl">☕</span>
              <div>
                <div className="text-xs font-serif font-bold text-[#80182a]">
                  {stampPrompt ? "⚠️ Receipt Stamp Required!" : "Receipt Stamp Required:"}
                </div>
                <div className="text-[11px] font-sans text-stone-600">
                  Tap <span className="font-bold text-[#80182a]">"Stamp Receipt"</span> above to validate the bill!
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#80182a] text-white rounded-full text-xs font-serif font-bold shrink-0">
              Stamp Now ☕
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleAttemptConfirm}
          className={`w-full py-4 font-serif font-bold text-lg md:text-xl rounded-2xl shadow-gold-btn flex items-center justify-center gap-2 cursor-pointer transition-all ${
            stamped
              ? 'bg-[#80182a] hover:bg-[#681322] text-white hover:scale-[1.01]'
              : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{stamped ? "Confirm Bistro Table For Two! 🥂" : "Stamp Receipt to Confirm Table! ☕"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            bistroSound.playKeyClick();
            onReset();
          }}
          className="w-full py-2.5 text-stone-500 hover:text-stone-800 font-sans text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Modify Menu Selections</span>
        </button>
      </div>
    </div>
  );
};
