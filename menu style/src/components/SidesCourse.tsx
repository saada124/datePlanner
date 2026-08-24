import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { SideOption } from '../types';
import { menuSound } from '../utils/soundEffects';
import { PlusCircle } from 'lucide-react';

interface SidesCourseProps {
  selectedSides: string[]; // array of side ids
  onToggleSide: (side: SideOption) => void;
}

export const SidesCourse: React.FC<SidesCourseProps> = ({ selectedSides, onToggleSide }) => {
  const handleToggle = (side: SideOption) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
    menuSound.playPenTick();
    onToggleSide(side);
  };

  return (
    <section id="course-3" aria-labelledby="sides-heading" className="paper-menu-card rounded-3xl p-6 sm:p-8 mb-8 text-left transition-all">
      {/* Course Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-mono text-xs font-bold flex items-center justify-center">
            III
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E8635A]">
            SIDES · Extra Touches
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono">
          <PlusCircle className="w-3.5 h-3.5 text-[#F4A45C]" />
          <span>Pick as many as you like</span>
        </div>
      </div>

      <h2 id="sides-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
        A la Carte · Sweet Details & Upgrades
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
        Tick any complimentary side orders to enhance our date.
      </p>

      {/* Handwritten Checkboxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {APP_CONFIG.sides.map((side) => {
          const isChecked = selectedSides.includes(side.id);

          return (
            <motion.button
              key={side.id}
              type="button"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle(side)}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-[var(--bg-highlight)] border-[#E8635A] shadow-xs'
                  : 'bg-[var(--bg-chip)] border-[var(--border-subtle)] hover:border-[#E8635A] hover:bg-[var(--bg-chip-hover)]'
              }`}
            >
              {/* Handwritten Scrawly SVG Checkbox Box */}
              <div
                className={`w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                  isChecked
                    ? 'border-[#E8635A] bg-[#E8635A]/10'
                    : 'border-[var(--text-secondary)] bg-[var(--bg-card)]'
                }`}
              >
                {isChecked && (
                  <svg
                    className="w-4 h-4 text-[#E8635A] animate-draw-check"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Side Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[var(--text-primary)] leading-snug">
                  <span>{side.label}</span>
                  <span className="text-base">{side.emoji}</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  {side.desc}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
