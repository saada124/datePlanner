import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';

export const WatercolorVoiceNote: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!APP_CONFIG.voiceNote.src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setHasError(true));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="paper-card rounded-3xl p-4 sm:p-5 mb-6 flex items-center gap-4 max-w-md mx-auto text-left"
    >
      <audio
        ref={audioRef}
        src={APP_CONFIG.voiceNote.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Spinning watercolor record */}
      <div className="relative shrink-0">
        <div
          className={`w-16 h-16 rounded-full bg-[conic-gradient(from_0deg,#e8a0b4,#c9b8e8,#9fc3b8,#e7c782,#e8a0b4)] shadow-lg flex items-center justify-center ${
            isPlaying ? 'animate-disc-spin' : ''
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-[#fdfcff] shadow-inner flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-storybook-roseDark" />
          </div>
        </div>
        {isPlaying && (
          <span className="absolute -inset-1.5 rounded-full border-2 border-storybook-rose/40 animate-pulse-gentle" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-serif-title text-sm font-bold text-storybook-ink">
          {APP_CONFIG.voiceNote.title}
        </h4>
        <p className="font-handwriting text-base text-storybook-inkLight leading-snug">
          {APP_CONFIG.voiceNote.subtitle}
        </p>
        {hasError && (
          <p className="text-[10px] font-sans text-storybook-roseDark mt-1">
            Voice note not found — add an mp3 at public/audio/voice-note.mp3
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
        className="story-btn-primary w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg cursor-pointer"
      >
        <span>{isPlaying ? '⏸' : '▶'}</span>
      </button>
    </motion.div>
  );
};