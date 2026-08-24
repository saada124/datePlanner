import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateMenuSelection } from '../types';
import { menuSound } from '../utils/soundEffects';
import { Receipt, ChevronUp, ChevronDown, Heart } from 'lucide-react';

interface LiveOrderSlipProps {
  selection: DateMenuSelection;
}

export const LiveOrderSlip: React.FC<LiveOrderSlipProps> = ({ selection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    menuSound.playPaperTurn();
    setIsOpen((prev) => !prev);
  };

  const selectedSidesCount = selection.sides.length;

  return (
    <div className="fixed right-4 bottom-24 z-30 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 240 }}
            className="w-72 sm:w-80 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-4 shadow-paper-lg font-mono text-xs text-[var(--text-primary)] mb-2 text-left relative overflow-hidden"
          >
            {/* Top Perforation Texture */}
            <div className="border-b border-dashed border-[var(--border-dashed)] pb-2 mb-2 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
              <span>RECEIPT TALLY · TBL 07</span>
              <span>LIVE ORDER</span>
            </div>

            {/* Line Items */}
            <div className="space-y-1.5 pb-2.5 border-b border-dashed border-[var(--border-dashed)]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="truncate pr-2">[I] {selection.mood}</span>
                <span className="font-bold text-[#E8635A] shrink-0">100 Smiles</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="truncate pr-2">[II] {selection.activityTitle}</span>
                <span className="font-bold text-[#E8635A] shrink-0">Chef's Pick</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="truncate pr-2">[III] {selectedSidesCount}x Complimentary Sides</span>
                <span className="font-bold text-[#E8635A] shrink-0">Priceless</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="truncate pr-2">[IV] {selection.dayDate}</span>
                <span className="font-bold text-[#4A7A6D] shrink-0">Reserved</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 flex items-center justify-between font-bold text-xs text-[#4A7A6D]">
              <span>TOTAL DUE:</span>
              <span className="flex items-center gap-1">
                <span>100% LOVE</span>
                <Heart className="w-3.5 h-3.5 fill-[#4A7A6D]" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Pill Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
        className="px-3.5 py-2.5 bg-[#2B1B17] text-[#FFF8EC] hover:bg-[#3D2823] rounded-full shadow-lg border border-[#E8635A] flex items-center gap-2 text-xs font-mono font-bold cursor-pointer transition-all"
        title="View live order bill"
      >
        <Receipt className="w-4 h-4 text-[#F4A45C]" />
        <span>Bill Tally: <strong className="text-[#F4A45C]">100% Love</strong></span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5" />
        )}
      </motion.button>
    </div>
  );
};
