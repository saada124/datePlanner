import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../utils/soundEffects';

interface TrackSideBProps {
  onFlipBack: () => void;
}

const BONUS_WISHES = [
  { id: 'w1', title: 'Slow Dance in the Kitchen', desc: 'No music needed, just our heartbeat' },
  { id: 'w2', title: 'Watch the Night Sky Together', desc: 'Find our constellations' },
  { id: 'w3', title: 'Share a Secret Story', desc: 'Something I never told anyone' },
  { id: 'w4', title: 'Take a Roll of Disposable Film', desc: 'Unfiltered candid moments' }
];

export const TrackSideB: React.FC<TrackSideBProps> = ({ onFlipBack }) => {
  const [selectedWishes, setSelectedWishes] = useState<string[]>(['w1']);
  const [customWish, setCustomWish] = useState('');

  const toggleWish = (id: string) => {
    sound.playButtonClunk();
    if (selectedWishes.includes(id)) {
      setSelectedWishes(prev => prev.filter(w => w !== id));
    } else {
      setSelectedWishes(prev => [...prev, id]);
    }
  };

  const handleSpotifyClick = () => {
    sound.playChime();
    const query = encodeURIComponent(`romantic date night lo-fi chill`);
    window.open(`https://open.spotify.com/search/${query}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 text-left select-none"
    >
      {/* Side B Header */}
      <div className="flex items-center justify-between border-b border-[#decbb2]/80 pb-2.5">
        <div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#c96f4a] uppercase font-bold">
            SIDE B · UNRELEASED ACOUSTIC CUTS
          </span>
          <h3 className="font-serif text-lg font-bold text-[#2d221c]">
            Secret Date Wishes & Spotify Setlist
          </h3>
        </div>
        <button
          type="button"
          onClick={onFlipBack}
          className="btn-transport px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>🔄</span>
          <span>FLIP TO SIDE A</span>
        </button>
      </div>

      {/* Bonus Wishes Grid */}
      <div>
        <label className="block font-serif text-xs font-bold text-[#2d221c] mb-2">
          Pick Bonus Date Wishes (Side B Tracks):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BONUS_WISHES.map((w) => {
            const isSelected = selectedWishes.includes(w.id);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => toggleWish(w.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffdfa] border-[#c96f4a] text-[#2d221c] shadow-sm ring-1 ring-[#c96f4a]/30'
                    : 'bg-[#f7f1e5]/70 border-[#decbb2] hover:border-[#c96f4a]/50 text-[#4a3b32]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="font-serif text-xs font-bold truncate">{w.title}</div>
                  <div className="text-[10px] text-[#8a7568] font-sans truncate">{w.desc}</div>
                </div>
                <div className={`micro-led shrink-0 ${isSelected ? 'active-green' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Wish Input */}
      <div>
        <input
          type="text"
          value={customWish}
          onChange={(e) => setCustomWish(e.target.value)}
          placeholder="Write a custom secret wish for Side B..."
          className="w-full bg-[#fffdfa] border border-[#decbb2] rounded-xl p-2.5 text-xs font-serif text-[#2d221c] focus:outline-none focus:border-[#c96f4a] focus:ring-2 focus:ring-[#c96f4a]/30 shadow-inner"
        />
      </div>

      {/* Spotify Custom Playlist Link Button */}
      <div className="pt-2 border-t border-[#decbb2]/80 flex items-center justify-between">
        <div className="text-left">
          <div className="font-serif text-xs font-bold text-[#2d221c]">
            Curated Spotify Date Setlist 🎵
          </div>
          <div className="text-[10px] text-[#8a7568]">
            Matches our date theme & acoustic vibe
          </div>
        </div>

        <button
          type="button"
          onClick={handleSpotifyClick}
          className="px-3.5 py-2 rounded-xl bg-[#1db954] hover:bg-[#1ed760] text-black font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-transform active:scale-95"
        >
          <span>🎧</span>
          <span>OPEN IN SPOTIFY</span>
        </button>
      </div>
    </motion.div>
  );
};
