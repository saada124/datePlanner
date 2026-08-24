import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { MainCourseOption } from '../types';
import { menuSound } from '../utils/soundEffects';
import { Compass, Sparkles } from 'lucide-react';

interface MainCourseProps {
  selectedActivityId: string;
  customActivity: string;
  onSelectActivity: (activity: MainCourseOption) => void;
  onChangeCustomActivity: (val: string) => void;
}

export const MainCourse: React.FC<MainCourseProps> = ({
  selectedActivityId,
  customActivity,
  onSelectActivity,
  onChangeCustomActivity
}) => {
  const handleSelect = (activity: MainCourseOption) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }
    menuSound.playStampClick();
    onSelectActivity(activity);
  };

  return (
    <section id="course-2" aria-labelledby="main-heading" className="paper-menu-card rounded-3xl p-6 sm:p-8 mb-8 text-left transition-all">
      {/* Course Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-mono text-xs font-bold flex items-center justify-center">
            II
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E8635A]">
            MAIN COURSE · The Activity
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] font-mono">
          <Compass className="w-3.5 h-3.5 text-[#F4A45C]" />
          <span>Our main adventure</span>
        </div>
      </div>

      <h2 id="main-heading" className="font-serif font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
        What adventure shall we order?
      </h2>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
        Each course is freshly prepared with 100% devotion. Choose our main event.
      </p>

      {/* Main Course Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {APP_CONFIG.mainCourses.map((course) => {
          const isSelected = selectedActivityId === course.id;

          return (
            <motion.div
              key={course.id}
              whileHover={{ y: -2 }}
              onClick={() => handleSelect(course)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-[var(--bg-highlight)] border-2 border-[#E8635A] shadow-coral-glow'
                  : 'bg-[var(--bg-chip)] border-[var(--border-subtle)] hover:border-[#E8635A] hover:bg-[var(--bg-chip-hover)]'
              }`}
            >
              {/* Top Row: Title, Badge, and Dotted Price Tag */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl shrink-0">{course.emoji}</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  {course.badge && (
                    <span className="px-2 py-0.5 bg-[var(--bg-card)] text-[#E8635A] font-mono text-[10px] font-bold rounded-md uppercase tracking-wider shrink-0 border border-[var(--border-subtle)]">
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Description with Menu Styling */}
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4 pl-9">
                  {course.description}
                </p>
              </div>

              {/* Bottom Dotted Leader Line & Price Tag */}
              <div className="pt-2 border-t border-dashed border-[var(--border-dashed)] flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                <span className="text-[10px] uppercase tracking-wider">{course.subtitle}</span>
                <span className="font-bold text-[#E8635A]">{course.priceTag}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Mystery Activity Input (If selected) */}
      {selectedActivityId === 'custom_adventure' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-4 bg-[var(--bg-highlight)] border border-[#E8635A] rounded-2xl"
        >
          <label htmlFor="custom-activity-input" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#E8635A] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special Chef Request · Specify Your Dream Activity</span>
          </label>
          <input
            id="custom-activity-input"
            type="text"
            value={customActivity}
            onChange={(e) => onChangeCustomActivity(e.target.value)}
            placeholder="e.g. Stargazing picnic with hot cider & jazz on the hill..."
            className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8635A]"
          />
        </motion.div>
      )}
    </section>
  );
};
