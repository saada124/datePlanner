import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { menuSound } from '../utils/soundEffects';

interface RibbonProgressProps {
  activeCourse: number; // 1 to 4
  onJumpToCourse: (courseNum: number) => void;
}

export const RibbonProgress: React.FC<RibbonProgressProps> = ({ activeCourse, onJumpToCourse }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courses = [
    { num: 1, roman: "I", label: "Starter" },
    { num: 2, roman: "II", label: "Main" },
    { num: 3, roman: "III", label: "Sides" },
    { num: 4, roman: "IV", label: "Dessert" },
  ];

  return (
    <aside aria-label="Menu section navigation" className="hidden lg:flex fixed left-6 xl:left-12 top-24 z-30 flex-col items-center select-none">
      {/* Ribbon Top Anchor Brass Rivet */}
      <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#E7C782] to-[#B38A38] border border-[#70584E] shadow-sm flex items-center justify-center mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#70584E]/40" />
      </div>

      {/* Hanging Satin Ribbon */}
      <div className="w-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-t-sm shadow-xs relative flex flex-col items-center justify-between py-6 h-80">
        {/* Dynamic Coral Ribbon Fill */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#E8635A] to-[#D45048] rounded-t-sm"
          style={{ height: `${scrollProgress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />

        {/* Notched Fishtail Ribbon End */}
        <div className="absolute -bottom-2.5 left-0 w-0 h-0 border-l-[8px] border-r-[8px] border-l-[#D8B29A] border-r-[#D8B29A] border-b-[8px] border-b-transparent" />

        {/* Course Checkpoint Pins */}
        <nav aria-label="Course checkpoints" className="relative z-10 flex flex-col justify-between h-full py-2">
          {courses.map((c) => {
            const isCompletedOrActive = activeCourse >= c.num;
            return (
              <button
                key={c.num}
                type="button"
                onClick={() => {
                  menuSound.playPaperTurn();
                  onJumpToCourse(c.num);
                }}
                title={`Jump to Course ${c.roman}: ${c.label}`}
                aria-label={`Jump to Course ${c.roman}: ${c.label}`}
                className="group relative flex items-center justify-center cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full font-mono text-[10px] font-bold flex items-center justify-center transition-all shadow-xs ${
                    isCompletedOrActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-card)] scale-110 ring-2 ring-[#E8635A]'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] hover:border-[#E8635A]'
                  }`}
                >
                  {c.roman}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute left-8 px-2.5 py-1 bg-[var(--text-primary)] text-[var(--bg-card)] text-[11px] font-mono rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  Course {c.roman} · {c.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
