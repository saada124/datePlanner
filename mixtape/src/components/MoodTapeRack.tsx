import React, { useState } from 'react';
import { sound, MoodTapeId } from '../utils/soundEffects';

interface MoodTapeRackProps {
  activeTape: MoodTapeId;
  onSelectTape: (tapeId: MoodTapeId) => void;
}

const TAPES: { id: MoodTapeId; title: string; subtitle: string; icon: string; tagColor: string }[] = [
  {
    id: 'tape_sunset',
    title: 'Tape 01 · Sunset Chords',
    subtitle: 'Warm Rhodes chords & mellow lo-fi drums',
    icon: '🌇',
    tagColor: 'border-[#c96f4a] text-[#c96f4a]'
  },
  {
    id: 'tape_rain',
    title: 'Tape 02 · Rainy Cafe',
    subtitle: 'Acoustic fingerpicking & soft rain crackle',
    icon: '🌧️',
    tagColor: 'border-blue-400 text-blue-400'
  },
  {
    id: 'tape_midnight',
    title: 'Tape 03 · Midnight Stargaze',
    subtitle: 'Dreamy ambient pads & analog tape flutter',
    icon: '🌙',
    tagColor: 'border-purple-400 text-purple-400'
  }
];

export const MoodTapeRack: React.FC<MoodTapeRackProps> = ({
  activeTape,
  onSelectTape
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleVoiceToggle = () => {
    sound.playButtonClunk();
    setIsPlayingVoice(!isPlayingVoice);
  };

  return (
    <div className="bg-[#1a1411] border border-[#44382f] rounded-2xl p-3 sm:p-4 select-none shadow-inner">
      <div className="flex items-center justify-between border-b border-[#362b23] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">📻</span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4af37] uppercase font-bold">
            LO-FI CASSETTE CADDY
          </span>
        </div>

        {/* Voice Note Head Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`px-2 py-0.5 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
            isPlayingVoice
              ? 'bg-[#3d1a10] border-[#c96f4a] text-white'
              : 'bg-[#251e18] border-[#4a3e35] text-[#8c7a6b] hover:border-[#d4af37]'
          }`}
          title="Boyfriend's Voice Memo Tape Greeting"
        >
          <span>🎙️</span>
          <span>INTRO NOTE</span>
        </button>
      </div>

      {/* 3 Cassette Tapes Rack */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TAPES.map((t) => {
          const isSelected = activeTape === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTape(t.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#2b221b] border-[#d4af37] text-[#f4ebd9] shadow-md ring-1 ring-[#d4af37]/30'
                  : 'bg-[#1e1713] border-[#3d3229] hover:border-[#d4af37]/50 text-[#8c7a6b]'
              }`}
            >
              <span className="text-xl shrink-0">{t.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono font-bold text-[#f4ebd9] truncate">
                  {t.title}
                </div>
                <div className="text-[9px] text-[#8a7568] truncate font-sans">
                  {t.subtitle}
                </div>
              </div>
              <div className={`micro-led shrink-0 ${isSelected ? 'active-green' : ''}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
