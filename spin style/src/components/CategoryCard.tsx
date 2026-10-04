import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { CategorySectionData, OptionItem } from '../types';
import { sounds } from '../utils/sound';

interface CategoryCardProps {
  section: CategorySectionData;
  selectedOptions: OptionItem[];
  onToggleOption: (option: OptionItem) => void;
  onAddCustomOption: (category: import('../types').CategoryType, label: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  section,
  selectedOptions,
  onToggleOption,
  onAddCustomOption,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const isSelected = (optionId: string) => {
    return selectedOptions.some((item) => item.id === optionId);
  };

  const getSelectionIndex = (optionId: string) => {
    const idx = selectedOptions.findIndex((item) => item.id === optionId);
    return idx >= 0 ? idx % 4 : 0;
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddCustomOption(section.id, customInput.trim());
      setCustomInput('');
      setIsAddingCustom(false);
      sounds.playWinFanfare();
    }
  };

  return (
    <div className="carnival-card p-5 sm:p-7 relative overflow-hidden transition-all duration-300 hover:border-carnival-border/90">
      {/* Decorative carnival corner accent */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 pointer-events-none"
        style={{ backgroundColor: section.accentColor }}
      />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20"
            style={{ backgroundColor: `${section.accentColor}25` }}
          >
            {section.emoji}
          </div>
          <div>
            <h3 
              className="text-xl sm:text-2xl font-display font-bold tracking-wide"
              style={{ color: section.accentColor }}
            >
              {section.title}
            </h3>
            <p className="text-xs sm:text-sm text-carnival-creamMuted font-sans">
              {section.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Chunky Chips Grid / Flex */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {section.options.map((option) => {
          const active = isSelected(option.id);
          const colorIdx = getSelectionIndex(option.id);
          const selectedClass = active ? `chip-selected-${colorIdx}` : '';

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                sounds.playPop(!active);
                onToggleOption(option);
              }}
              className={`chip-toggle ${selectedClass} group`}
            >
              <span className="text-lg leading-none transition-transform group-hover:scale-110">
                {option.emoji}
              </span>
              <span className="tracking-wide">
                {option.label}
              </span>
              {active && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center animate-bounce-short">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}

        {/* Inline Custom Option Input or Trigger */}
        {isAddingCustom ? (
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Karaoke Bar..."
              autoFocus
              className="px-3.5 py-2 rounded-full bg-carnival-bg border-2 border-carnival-pink text-carnival-cream text-sm font-sans placeholder:text-carnival-creamMuted/40 focus:outline-none w-44"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-full bg-carnival-pink hover:bg-carnival-pinkDark text-white text-xs font-display font-bold uppercase transition-all"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-2 py-2 text-carnival-creamMuted hover:text-white text-xs font-display"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              sounds.playPop(true);
              setIsAddingCustom(true);
            }}
            className="chip-toggle border-dashed border-carnival-border/60 hover:border-carnival-gold text-carnival-creamMuted/80 hover:text-carnival-gold text-sm"
          >
            <Plus className="w-4 h-4 text-carnival-gold" />
            <span>+ Custom Option</span>
          </button>
        )}
      </div>
    </div>
  );
};
