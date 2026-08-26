import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EscapingButton } from './EscapingButton';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MixtapeCoverProps {
  onBegin: () => void;
}

export const MixtapeCover: React.FC<MixtapeCoverProps> = ({ onBegin }) => {
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  const getDialogueText = () => {
    if (escapeAttempts === 0) {
      return 'A custom mixtape, pressed and recorded just for you... 🎧';
    } else if (escapeAttempts === 1) {
      return 'Wait — the magnetic tape is rewinding! 🤭';
    } else if (escapeAttempts === 2) {
      return 'The reels got tangled with love! 📼💫';
    } else if (escapeAttempts < 5) {
      return 'This side only plays "YES" on repeat 💿';
    } else {
      return "Press play already, my love! ❤️";
    }
  };

  const handleAccept = () => {
    sound.playButtonClunk();
    sound.playChapterComplete();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#c96f4a', '#e0a458', '#b45f6f', '#f9e8dd', '#d4af37']
    });
    setTimeout(() => onBegin(), 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto w-full px-3 text-center select-none"
    >
      {/* Hero Skeuomorphic Cassette Box */}
      <div className="walkman-faceplate p-4 sm:p-7 rounded-3xl mb-8 relative overflow-hidden">
        {/* Corner screws */}
        <div className="screw-fastener absolute left-3 top-3" />
        <div className="screw-fastener absolute right-3 top-3" />
        <div className="screw-fastener absolute left-3 bottom-3" />
        <div className="screw-fastener absolute right-3 bottom-3" />

        {/* Top Metallic Banner */}
        <div className="flex items-center justify-between border-b border-[#44382f] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#d4af37] uppercase font-bold">
              ✦ {APP_CONFIG.websiteTitle.toUpperCase()} ✦
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#a89888] tracking-widest">
            TYPE I · NORMAL BIAS
          </span>
        </div>

        {/* Hero Cassette Display Card */}
        <div className="mixtape-card p-6 sm:p-8 rounded-2xl relative mb-4">
          {/* Tape strips */}
          <div className="tape-strip -top-2 left-8 w-24" />
          <div className="tape-strip tape-strip-reverse -top-2 right-8 w-24" />

          {/* Album Title & Dedication */}
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#2d221c] tracking-tight leading-tight">
              The Date Mixtape
            </h1>
            <p className="font-handwriting text-2xl sm:text-3xl text-[#c96f4a] mt-2 leading-relaxed">
              {APP_CONFIG.coverInscription}
            </p>
          </div>

          {/* Embedded Smoked Acrylic Tape Window */}
          <div className="tape-well p-3 rounded-xl relative overflow-hidden mb-5">
            <div className="acrylic-glare absolute inset-0 z-20 pointer-events-none" />

            <div className="flex items-center justify-between px-4 py-2">
              {/* Left Spool */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f4ebd9] border-2 border-[#b5a388] flex items-center justify-center shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-[#2b221b] animate-reel-spin flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#d85848] border border-white" />
                  </div>
                </div>
                <span className="text-[8px] font-mono text-[#8c7a6b] mt-1">FEED</span>
              </div>

              {/* Center Tape Hub Inscription */}
              <div className="text-center px-2">
                <div className="font-mono text-xs text-[#d4af37] font-bold tracking-widest bg-[#1c1613] px-3 py-1 rounded border border-[#6b5847] shadow-inner">
                  {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial}
                </div>
                <div className="text-[9px] font-mono text-[#a89888] tracking-widest mt-1">
                  SIDE A · HIGH OUTPUT
                </div>
              </div>

              {/* Right Spool */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f4ebd9] border-2 border-[#b5a388] flex items-center justify-center shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-[#2b221b] animate-reel-spin-slow flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#d85848] border border-white" />
                  </div>
                </div>
                <span className="text-[8px] font-mono text-[#8c7a6b] mt-1">TAKE-UP</span>
              </div>
            </div>
          </div>

          {/* Recipient Invitation Subtitle */}
          <div className="text-center pt-2">
            <div className="font-mono text-[10px] tracking-[0.25em] text-[#8a7568] uppercase mb-1">
              AN EXCLUSIVE DATE INVITATION FOR {APP_CONFIG.girlfriendName.toUpperCase()}
            </div>
            <p className="font-sans text-xs text-[#6d5a4e]">
              {APP_CONFIG.dateRangeText} · Recorded and ready to play together.
            </p>

            <div className="font-handwriting text-lg text-[#c96f4a] mt-4">
              {getDialogueText()}
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[85px] pt-2">
          {/* PLAY THE TAPE Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAccept}
            className="btn-transport-primary px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold shadow-xl flex items-center gap-2.5 cursor-pointer z-10"
          >
            <span>▶</span>
            <span>PRESS PLAY ON OUR DATE</span>
            <span>🎧</span>
          </motion.button>

          {/* Playful Escaping No Button */}
          <EscapingButton onAttempt={(c) => setEscapeAttempts(c)} />
        </div>
      </div>
    </motion.div>
  );
};