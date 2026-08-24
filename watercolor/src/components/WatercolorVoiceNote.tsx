import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

export const WatercolorVoiceNote: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [usingFallbackSynth, setUsingFallbackSynth] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!APP_CONFIG.voiceNote.src) return null;

  const toggle = () => {
    sound.unlock();
    const audio = audioRef.current;

    if (isPlaying) {
      if (audio && !usingFallbackSynth) {
        audio.pause();
      } else {
        sound.stopAcousticMelody();
      }
      setIsPlaying(false);
      setUsingFallbackSynth(false);
      return;
    }

    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true);
        setUsingFallbackSynth(false);
      }).catch(() => {
        // Graceful fallback to melodic acoustic synth
        setUsingFallbackSynth(true);
        setIsPlaying(true);
        sound.playAcousticMelody();
      });
    } else {
      setUsingFallbackSynth(true);
      setIsPlaying(true);
      sound.playAcousticMelody();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="paper-card rounded-3xl p-4 sm:p-5 mb-6 flex items-center gap-4 max-w-md mx-auto text-left relative overflow-hidden"
    >
      <audio
        ref={audioRef}
        src={APP_CONFIG.voiceNote.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setUsingFallbackSynth(false);
        }}
        onError={() => {
          // Prepared for fallback
        }}
      />

      {/* Spinning watercolor record */}
      <div className="relative shrink-0">
        <div
          className={`w-16 h-16 rounded-full bg-[conic-gradient(from_0deg,#e8a0b4,#c9b8e8,#9fc3b8,#e7c782,#e8a0b4)] shadow-lg flex items-center justify-center transition-transform ${
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
        <div className="flex items-center gap-2">
          <h4 className="font-serif-title text-sm font-bold text-storybook-ink truncate">
            {APP_CONFIG.voiceNote.title}
          </h4>
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-storybook-roseDark animate-pulse rounded-full" />
              <span className="w-0.5 h-2 bg-storybook-rose animate-pulse delay-100 rounded-full" />
              <span className="w-0.5 h-3.5 bg-storybook-gold animate-pulse delay-200 rounded-full" />
              <span className="w-0.5 h-1.5 bg-storybook-sage animate-pulse delay-300 rounded-full" />
            </div>
          )}
        </div>
        <p className="font-handwriting text-base text-storybook-inkLight leading-snug">
          {isPlaying
            ? usingFallbackSynth
              ? 'Playing ambient love melody... 🌸'
              : 'Playing recorded message... 🎙️'
            : APP_CONFIG.voiceNote.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause message' : 'Play message'}
        className="story-btn-primary w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg cursor-pointer"
      >
        <span>{isPlaying ? '⏸' : '▶'}</span>
      </button>
    </motion.div>
  );
};