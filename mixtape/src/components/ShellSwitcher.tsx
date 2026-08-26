import React from 'react';
import { ShellEditionId, LabelStyleId, sound } from '../utils/soundEffects';

interface ShellSwitcherProps {
  currentShell: ShellEditionId;
  currentLabel: LabelStyleId;
  onSelectShell: (shell: ShellEditionId) => void;
  onSelectLabel: (label: LabelStyleId) => void;
}

const SHELLS: { id: ShellEditionId; name: string; icon: string; desc: string; badge: string }[] = [
  { id: 'titanium', name: 'Smoked Titanium', icon: '📼', desc: 'Classic 80s dark smoked acrylic', badge: 'bg-[#2b221b] text-[#d4af37]' },
  { id: 'rose', name: 'Sunset Rose Quartz', icon: '🌸', desc: 'Translucent pastel blush shell', badge: 'bg-[#4a222c] text-[#fcdde2]' },
  { id: 'gold', name: 'Clear Gold Foil', icon: '✨', desc: 'Crystal clear with gold-leaf hubs', badge: 'bg-[#2b2410] text-[#d4af37]' },
  { id: 'chalk', name: 'Chalk Studio White', icon: '🤍', desc: 'Matte paper acoustic demo tape', badge: 'bg-[#1f1d1b] text-white' }
];

export const ShellSwitcher: React.FC<ShellSwitcherProps> = ({
  currentShell,
  onSelectShell
}) => {
  const handlePickShell = (shell: ShellEditionId) => {
    sound.playButtonClunk();
    onSelectShell(shell);
  };

  return (
    <div className="bg-[#1a1411] border border-[#44382f] rounded-2xl p-3 sm:p-4 select-none shadow-inner">
      <div className="flex items-center justify-between border-b border-[#362b23] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎨</span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-bold">
            COLLECTOR CASSETTE SHELLS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SHELLS.map((s) => {
          const isSelected = currentShell === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handlePickShell(s.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[70px] relative ${
                isSelected
                  ? 'bg-[#2b221b] border-[#d4af37] text-[#f4ebd9] shadow-md ring-1 ring-[#d4af37]/40'
                  : 'bg-[#1e1713] border-[#3d3229] hover:border-[#d4af37]/50 text-[#8c7a6b]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base">{s.icon}</span>
                <div className={`micro-led ${isSelected ? 'active-amber' : ''}`} />
              </div>
              <div className="text-[10px] font-serif font-bold text-[#f4ebd9] mt-1 leading-tight">
                {s.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
