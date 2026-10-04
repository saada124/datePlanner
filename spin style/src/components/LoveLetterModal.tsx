import React, { useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { sounds } from '../utils/sound';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSealBroken, setIsSealBroken] = useState(false);
  const letter = APP_CONFIG.loveLetter;

  if (!isOpen) return null;

  const handleBreakSeal = () => {
    sounds.playWaxSealCrack();
    setIsSealBroken(true);
    setTimeout(() => {
      sounds.playWinFanfare();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carnival-bgDark/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-carnival-gold bg-[#FFFDF7] text-carnival-bg select-none animate-ticket-drop">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-gray-700 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSealBroken ? (
          /* Sealed Vintage Envelope View */
          <div className="py-8 flex flex-col items-center text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-mono-ticket font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRIVATE &amp; CONFIDENTIAL</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-carnival-bg">
                A Secret Love Letter 💌
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Sealed specially for {APP_CONFIG.girlfriendName}&apos;s eyes only
              </p>
            </div>

            {/* Red Wax Seal Button */}
            <div className="py-4">
              <button
                type="button"
                onClick={handleBreakSeal}
                className="group relative flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-4 border-red-400 shadow-xl flex items-center justify-center text-3xl text-amber-200 filter drop-shadow-lg">
                  <Heart className="w-9 h-9 fill-amber-200 stroke-red-900" />
                </div>
                <span className="text-[11px] font-mono-ticket font-extrabold text-red-800 tracking-wider uppercase mt-3 bg-red-50 px-3 py-1 rounded-full border border-red-200 shadow-sm animate-pulse">
                  ★ TAP TO BREAK WAX SEAL ★
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Unfolded Love Letter View */
          <div className="py-2 space-y-4 animate-bounce-short text-left font-serif leading-relaxed">
            <div className="text-center pb-2 border-b border-amber-200/80">
              <span className="text-xs font-mono-ticket text-amber-800 tracking-widest uppercase block mb-0.5">
                ★ FROM {APP_CONFIG.boyfriendName.toUpperCase()} WITH LOVE ★
              </span>
              <h3 className="text-2xl font-display font-extrabold text-carnival-bg">
                {letter.title}
              </h3>
            </div>

            <p className="text-base font-display font-bold text-carnival-bg pt-2">
              {letter.salutation}
            </p>

            <p className="text-sm sm:text-base font-sans text-gray-700 whitespace-pre-line leading-relaxed">
              {letter.body}
            </p>

            <div className="pt-4 text-right">
              <p className="text-sm font-sans italic text-gray-600">
                {letter.closing}
              </p>
              <p className="text-xl sm:text-2xl font-display font-bold text-red-700 flex items-center justify-end gap-1.5 mt-0.5">
                <Heart className="w-5 h-5 fill-red-600 stroke-red-600 inline" />
                {letter.signature}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
