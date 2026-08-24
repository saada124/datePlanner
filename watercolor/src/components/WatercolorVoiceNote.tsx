import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export const WatercolorVoiceNote: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [usingFallbackSynth, setUsingFallbackSynth] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!APP_CONFIG.voiceNote.src) return null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setUsingFallbackSynth(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
      return;
    }

    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true);
        setUsingFallbackSynth(false);
      }).catch((err) => {
        console.warn('Audio play error, falling back to acoustic melody:', err);
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || usingFallbackSynth) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newPercent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="paper-card rounded-3xl p-4 sm:p-5 mb-6 max-w-md mx-auto text-left relative overflow-hidden border border-storybook-gold/40 shadow-paper-lg select-none"
    >
      <audio
        ref={audioRef}
        src={APP_CONFIG.voiceNote.src}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          setUsingFallbackSynth(false);
        }}
        onError={() => {
          console.warn('Voice note audio source error.');
        }}
      />

      <div className="flex items-center gap-4">
        {/* Spinning watercolor record */}
        <div className="relative shrink-0 cursor-pointer" onClick={toggle}>
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[conic-gradient(from_0deg,#e8a0b4,#c9b8e8,#9fc3b8,#e7c782,#e8a0b4)] shadow-md flex items-center justify-center transition-transform ${
              isPlaying ? 'animate-disc-spin' : ''
            }`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fdfcff] shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-storybook-roseDark" />
            </div>
          </div>
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full border-2 border-storybook-rose/50 animate-pulse-gentle pointer-events-none" />
          )}
        </div>

        {/* Title, equalizer & subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-serif-title text-sm sm:text-base font-bold text-storybook-ink truncate">
              {APP_CONFIG.voiceNote.title}
            </h4>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 shrink-0">
                <span className="w-0.5 h-3 bg-storybook-roseDark animate-pulse rounded-full" />
                <span className="w-0.5 h-2 bg-storybook-rose animate-pulse delay-100 rounded-full" />
                <span className="w-0.5 h-3.5 bg-storybook-gold animate-pulse delay-200 rounded-full" />
                <span className="w-0.5 h-1.5 bg-storybook-sage animate-pulse delay-300 rounded-full" />
              </div>
            )}
          </div>
          <p className="font-handwriting text-sm sm:text-base text-storybook-inkLight leading-tight truncate">
            {isPlaying
              ? usingFallbackSynth
                ? 'Playing ambient love melody... 🌸'
                : 'Listening to voice message... 🎙️'
              : APP_CONFIG.voiceNote.subtitle}
          </p>

          {/* Time tracker */}
          <div className="flex items-center justify-between text-[10px] font-mono text-storybook-inkLight mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute voice note' : 'Mute voice note'}
                className="hover:text-storybook-rose cursor-pointer transition-colors p-0.5"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
              <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
            </div>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? 'Pause message' : 'Play message'}
          className="story-btn-primary w-11 h-11 sm:w-12 sm:h-12 rounded-full shrink-0 flex items-center justify-center text-white shadow-coral-glow cursor-pointer transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Scrubbable Progress Bar */}
      <div
        onClick={handleSeek}
        className="w-full h-2 bg-storybook-cream border border-storybook-gold/30 rounded-full mt-3.5 cursor-pointer relative overflow-hidden group"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-storybook-rose via-storybook-gold to-storybook-sage rounded-full"
          style={{ width: `${progressPercent}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};