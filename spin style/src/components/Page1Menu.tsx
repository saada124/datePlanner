import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { CategoryCard } from './CategoryCard';
import { LiveCounter } from './LiveCounter';
import { OptionItem, CategoryType } from '../types';
import { sounds } from '../utils/sound';

interface Page1MenuProps {
  selectedOptions: OptionItem[];
  onToggleOption: (option: OptionItem) => void;
  onAddCustomOption: (category: CategoryType, label: string) => void;
  onSubmitAndSpin: () => void;
}

export const Page1Menu: React.FC<Page1MenuProps> = ({
  selectedOptions,
  onToggleOption,
  onAddCustomOption,
  onSubmitAndSpin,
}) => {
  const isReady = selectedOptions.length >= APP_CONFIG.minSelectionsRequired;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) return;
    sounds.playWinFanfare();
    onSubmitAndSpin();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-16 space-y-6">
      {/* Title & Subtitle Banner */}
      <div className="text-center pt-2 pb-4 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-carnival-pink/20 border border-carnival-pink/50 text-carnival-pink text-xs font-display font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2 · The Menu</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-carnival-cream tracking-tight drop-shadow-md">
          🎪 Spin Your Date
        </h1>

        <p className="text-base sm:text-lg text-carnival-creamMuted max-w-lg mx-auto font-sans leading-relaxed">
          {APP_CONFIG.page1Subtitle}
        </p>
      </div>

      {/* 3 Categories Section Cards */}
      <div className="space-y-5">
        {APP_CONFIG.categories.map((section) => (
          <CategoryCard
            key={section.id}
            section={section}
            selectedOptions={selectedOptions}
            onToggleOption={onToggleOption}
            onAddCustomOption={onAddCustomOption}
          />
        ))}
      </div>

      {/* Live Ticket Readout Counter */}
      <LiveCounter count={selectedOptions.length} />

      {/* Big Arcade CTA Button */}
      <div className="pt-2 flex flex-col items-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isReady}
          className="w-full sm:w-auto min-w-[280px] btn-arcade btn-arcade-lime px-8 py-4 text-xl sm:text-2xl shadow-arcade-lime flex items-center justify-center gap-3 group"
        >
          <span>Submit & Spin</span>
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1.5" />
        </button>
      </div>
    </div>
  );
};
