import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/soundEffects';

interface CassetteDeckProps {
  currentTrack: number;
  totalTracks?: number;
  isPlaying: boolean;
  canProceed: boolean;
  trackTitle: string;
  onNext: () => void;
  onPrev: () => void;
  children: React.ReactNode;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({
  currentTrack,
  totalTracks = 5,
  isPlaying,
  canProceed,
  trackTitle,
  onNext,
  onPrev,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 190 }}
      className="w-full max-w-2xl mx-auto select-none"
    >
      {/* Top edge: write-protect tabs + screws */}
      <div className="relative h-8 flex items-start justify-between px-10 sm:px-16">
        <div className="flex gap-2">
          <div className="cassette-tab" />
          <div className="cassette-tab" />
        </div>
        <div className="cassette-screw mt-1.5" />
        <div className="flex gap-2">
          <div className="cassette-tab" />
          <div className="cassette-tab" />
        </div>
      </div>

      {/* Cassette shell */}
      <div className="cassette-shell rounded-t-none rounded-b-[26px] px-4 sm:px-8 pb-6 pt-2 relative">
        {/* corner screws */}
        <div className="cassette-screw absolute left-3 top-3" />
        <div className="cassette-screw absolute right-3 top-3" />

        {/* Tape window */}
        <div className="cassette-window rounded-xl px-5 py-4 flex items-center justify-between gap-3 relative overflow-hidden">
          <span className="absolute left-3 top-2 text-[9px] font-typewriter text-[#d8c9b2] tracking-[0.3em]">
            SIDE A
          </span>
          <span className="absolute right-3 top-2 text-[9px] font-typewriter text-[#d8c9b2] tracking-[0.3em]">
            {isPlaying ? '▶ PLAYING' : '■ STOP'}
          </span>

          <div className={`deck-reel w-14 h-14 sm:w-16 sm:h-16 rounded-full relative shrink-0 ${isPlaying ? 'animate-reel-spin' : ''}`}>
            <div className="absolute inset-[16%] rounded-full bg-[#3a3027] border border-[#b3a17e]" />
            <div className="absolute inset-[40%] rounded-full bg-[#b3a17e]" />
          </div>

          <div className="flex-1 flex flex-col items-center gap-1 px-1">
            <div className="tape-path-line w-full h-1 rounded-full" />
            <div className="text-center">
              <div className="font-typewriter text-lg sm:text-xl text-[#e8dcc6]">
                {String(currentTrack).padStart(2, '0')}
                <span className="text-[#a99c85]"> / {String(totalTracks).padStart(2, '0')}</span>
              </div>
              <div className="text-[9px] font-typewriter text-[#a99c85] tracking-widest mt-0.5">
                TRACK COUNTER
              </div>
            </div>
            <div className="tape-path-line w-full h-1 rounded-full" />
          </div>

          <div className={`deck-reel w-14 h-14 sm:w-16 sm:h-16 rounded-full relative shrink-0 ${isPlaying ? 'animate-reel-spin-slow' : ''}`}>
            <div className="absolute inset-[16%] rounded-full bg-[#3a3027] border border-[#b3a17e]" />
            <div className="absolute inset-[40%] rounded-full bg-[#b3a17e]" />
          </div>
        </div>

        {/* Label panel: the form lives here */}
        <div className="label-panel rounded-xl mt-4 px-4 sm:px-6 pt-5 pb-4 relative">
          {/* Track header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-mixtape-roseDark text-sm shrink-0">♪</span>
              <div className="min-w-0">
                <div className="font-typewriter text-[10px] tracking-[0.25em] text-mixtape-roseDark uppercase">
                  Track {currentTrack} of {totalTracks}
                </div>
                <h2 className="font-serif-title text-base sm:text-lg text-mixtape-coffee truncate">
                  {trackTitle}
                </h2>
              </div>
            </div>
            {/* Track dots */}
            <div className="flex gap-1.5 shrink-0">
              {Array.from({ length: totalTracks }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentTrack ? 'bg-mixtape-terracotta' : 'bg-mixtape-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* The form */}
          <div className="min-h-[260px]">{children}</div>

          {/* Transport row */}
          <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-mixtape-border/70">
            <button
              type="button"
              onClick={() => {
                sound.playPageTurn();
                onPrev();
              }}
              disabled={currentTrack <= 1}
              title="Rewind (previous track)"
              aria-label="Rewind (previous track)"
              className={`mix-btn-secondary w-11 h-11 rounded-full flex items-center justify-center text-sm cursor-pointer ${
                currentTrack <= 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              ⏮
            </button>

            <div className="text-center">
              <div className="font-handwriting text-sm text-mixtape-coffeeLight">
                {canProceed ? 'ready to roll...' : 'pick your track details ♪'}
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={canProceed ? { scale: 1.05 } : {}}
              whileTap={canProceed ? { scale: 0.95 } : {}}
              onClick={() => {
                if (!canProceed) return;
                sound.playChapterComplete();
                onNext();
              }}
              disabled={!canProceed}
              className={`mix-btn-primary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 rounded-full cursor-pointer ${
                !canProceed ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <span>▶ NEXT TRACK</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};