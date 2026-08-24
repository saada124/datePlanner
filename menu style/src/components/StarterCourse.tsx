import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { StarterMoodOption } from '../types';
import { menuSound } from '../utils/soundEffects';
import { Flame } from 'lucide-react';

interface StarterCourseProps {
  selectedMood: string;
  onSelectMood: (mood: StarterMoodOption) => void;
}

export const StarterCourse: React.FC<StarterCourseProps> = ({ selectedMood, onSelectMood }) => {
  const handleSelect = (option: StarterMoodOption) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }
    menuSound.playStampClick();
    onSelectMood(option);
  };

  return (
    <section id="course-1" aria-labelledby="starter-heading" className="paper-menu-card rounded-3xl p-6 sm:p-8 mb-8 text-left transition-all">
      {/* Course Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-mono text-xs font-bold flex items-center justify-center">
            I
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E8635A]">
            STARTER · The Vibe
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono">
          <Flame className="w-3.5 h-3.5 text-[#F4A45C]" />
          <span>Pick our mood</span>
        </div>
      </div>

      <h2 id="starter-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
        What vibe are we craving tonight?
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
        Select the mood that sets the tone for our evening.
      </p>

      {/* Mood Chip Pills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {APP_CONFIG.starters.map((starter) => {
          const isSelected = selectedMood === starter.name;

          return (
            <motion.button
              key={starter.id}
              type="button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(starter)}
              className={`min-h-[56px] px-4 py-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-[#E8635A] text-white border-[#E8635A] shadow-coral-glow'
                  : 'bg-[var(--bg-chip)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[#E8635A] hover:bg-[var(--bg-chip-hover)]'
              }`}
            >
              {/* Ink-Stamp Background Splatter Indicator */}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.15 }}
                  className="absolute right-0 top-0 w-24 h-24 rounded-full bg-white pointer-events-none"
                />
              )}

              <span className="text-2xl shrink-0">{starter.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm sm:text-base leading-snug truncate">
                  {starter.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}
                </div>
                <div
                  className={`text-[11px] truncate leading-tight ${
                    isSelected ? 'text-white/90' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {starter.tagline}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
