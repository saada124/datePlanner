import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bgMusic, AudioTrack } from '../utils/audioPlayer';
import { menuSound } from '../utils/soundEffects';
import { APP_CONFIG } from '../config/appConfig';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sparkles, Music, ChevronDown, ChevronUp } from 'lucide-react';

export const VinylJukebox: React.FC = () => {
  const [playerState, setPlayerState] = useState(bgMusic.getState());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (APP_CONFIG.audio?.tracks) {
      bgMusic.setCustomTracks(APP_CONFIG.audio.tracks);
    }
    if (APP_CONFIG.audio?.defaultVolume !== undefined) {
      bgMusic.setVolume(APP_CONFIG.audio.defaultVolume);
    }

    const unsubscribe = bgMusic.subscribe((state) => {
      setPlayerState({ ...state, tracks: bgMusic.getState().tracks, currentTrackIndex: bgMusic.getState().currentTrackIndex });
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    menuSound.playStampClick();
    bgMusic.toggle();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    menuSound.playPaperTurn();
    bgMusic.nextTrack();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    menuSound.playPaperTurn();
    bgMusic.prevTrack();
  };

  const handleSelectTrack = (index: number) => {
    menuSound.playStampClick();
    bgMusic.selectTrack(index);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    bgMusic.setVolume(val);
  };

  return (
    <aside
      aria-label="Vintage Table Jukebox"
      className="absolute top-4 right-4 sm:top-6 sm:right-6 xl:right-10 z-30 select-none max-w-[calc(100vw-2rem)]"
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* 💿 Generous Floating Record Pill */
          <motion.button
            key="minimized"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            type="button"
            onClick={() => {
              menuSound.playPaperTurn();
              setIsMinimized(false);
            }}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border-2 shadow-paper flex items-center gap-2.5 cursor-pointer bg-[var(--bg-card)] transition-all ${
              playerState.isPlaying
                ? 'border-[#E8635A] ring-2 ring-[#E8635A]/30'
                : 'border-[var(--border-card)] hover:border-[#E8635A]'
            }`}
            title="Expand Vintage Table Jukebox"
          >
            {/* Spinning Gold-Rimmed Vinyl Record */}
            <motion.div
              animate={playerState.isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={playerState.isPlaying ? { repeat: Infinity, duration: 2.5, ease: 'linear' } : {}}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#180F0D] border-2 border-[#D4AF37] flex items-center justify-center relative shadow-xs shrink-0"
            >
              {/* Record Grooves */}
              <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#E8635A] flex items-center justify-center shadow-inner">
                  <div className="w-1 h-1 rounded-full bg-[#FFE8A3]" />
                </div>
              </div>
            </motion.div>

            {/* Title & Genre */}
            <div className="flex flex-col text-left pr-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[#E8635A] uppercase tracking-wider leading-none">
                  Jukebox
                </span>
                {playerState.isPlaying && (
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-[10px] text-[#F4A45C]"
                  >
                    ♫
                  </motion.span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-serif font-bold text-[var(--text-primary)] truncate max-w-[140px] sm:max-w-[170px]">
                {playerState.currentTrack.title}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] shrink-0 ml-0.5" />
          </motion.button>
        ) : (
          /* 📻 The Compact Vintage Table Jukebox Card in Top Right */
          <motion.div
            key="full-card"
            initial={{ scale: 0.94, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: -6 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="w-60 sm:w-64 md:w-68 bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-2xl p-3.5 sm:p-4 shadow-paper text-left relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-[#E8635A]">
                <Music className="w-3 h-3" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                  Vintage Table Jukebox
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-[var(--text-secondary)]">N° 07</span>
                <button
                  type="button"
                  onClick={() => {
                    menuSound.playPaperTurn();
                    setIsMinimized(true);
                  }}
                  className="p-0.5 rounded-full hover:bg-[var(--bg-highlight)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                  title="Minimize Jukebox"
                  aria-label="Minimize Jukebox"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Turntable Platter Visualizer */}
            <div className="p-2.5 bg-[var(--bg-inner-box)] border border-[var(--border-card)] rounded-xl flex items-center gap-2.5 mb-2.5 relative overflow-hidden">
              {/* Vinyl Disc */}
              <motion.div
                animate={playerState.isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={playerState.isPlaying ? { repeat: Infinity, duration: 3, ease: 'linear' } : {}}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#18100E] border border-[#D4AF37] flex items-center justify-center relative shrink-0 shadow-sm"
              >
                {/* Grooves */}
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#E8635A] flex items-center justify-center shadow-inner">
                    <div className="w-1 h-1 rounded-full bg-[#FFE8A3]" />
                  </div>
                </div>
              </motion.div>

              {/* Track Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[8px] font-mono font-bold text-[#E8635A] uppercase">
                  <Sparkles className="w-2 h-2" />
                  <span>{playerState.currentTrack.genre}</span>
                </div>
                <div className="font-serif font-bold text-xs text-[var(--text-primary)] truncate leading-tight mt-0.5">
                  {playerState.currentTrack.title}
                </div>
                <div className="text-[9px] text-[var(--text-secondary)] truncate">
                  {playerState.currentTrack.artist}
                </div>
              </div>
            </div>

            {/* Turntable Playback Controls */}
            <div className="flex items-center justify-center gap-2.5 mb-2.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-chip)] hover:bg-[var(--bg-chip-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center cursor-pointer transition-colors"
                title="Previous Track"
                aria-label="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E8635A] hover:bg-[#D45048] text-white shadow-coral-glow flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                title={playerState.isPlaying ? "Pause Music" : "Play Music"}
                aria-label={playerState.isPlaying ? "Pause Music" : "Play Music"}
              >
                {playerState.isPlaying ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-chip)] hover:bg-[var(--bg-chip-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center cursor-pointer transition-colors"
                title="Next Track"
                aria-label="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Track Selector List */}
            <div className="space-y-1 mb-2.5 max-h-28 overflow-y-auto pr-1">
              {playerState.tracks.map((t: AudioTrack, idx: number) => {
                const isCurrent = playerState.currentTrackIndex === idx;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full p-1.5 rounded-lg text-left font-mono text-[10px] flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[var(--bg-highlight)] text-[#E8635A] font-bold border border-[#E8635A]/50'
                        : 'bg-[var(--bg-chip)] text-[var(--text-secondary)] hover:bg-[var(--bg-chip-hover)]'
                    }`}
                  >
                    <span className="truncate pr-1.5">{t.title}</span>
                    <span className="text-[8px] opacity-75 shrink-0">{t.genre}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider */}
            <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[var(--text-secondary)] font-mono text-[9px]">
              {playerState.volume === 0 ? (
                <VolumeX className="w-3 h-3 text-[#E8635A] shrink-0" />
              ) : (
                <Volume2 className="w-3 h-3 text-[#F4A45C] shrink-0" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={playerState.volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#E8635A] cursor-pointer h-1 bg-[var(--border-subtle)] rounded-lg appearance-none"
              />
              <span className="w-6 text-right">{Math.round(playerState.volume * 100)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
