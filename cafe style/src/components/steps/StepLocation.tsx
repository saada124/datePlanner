import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, MenuItemOption } from '../../config/appConfig';
import { bistroSound } from '../../utils/soundEffects';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepLocationProps {
  selectedLocation: string;
  customLocation: string;
  onSelectLocation: (loc: MenuItemOption) => void;
  onChangeCustomLocation: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  selectedLocation,
  customLocation,
  onSelectLocation,
  onChangeCustomLocation,
  onNext,
  onPrev,
}) => {
  const isCustom = selectedLocation.toLowerCase().includes('custom') || selectedLocation.toLowerCase().includes('personal');
  const canProceed = Boolean(selectedLocation && (!isCustom || customLocation.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fffdfa] border border-[#e7dccc] rounded-3xl p-6 shadow-menu w-full mb-6 text-left"
      >
        <div className="flex items-center justify-between border-b border-[#e7dccc] pb-3 mb-3 font-mono text-xs text-[#7a6e65]">
          <span>COURSE III · L'AMBIANCE & TABLES</span>
          <span className="font-bold text-[#80182a] font-serif">Places Réservées</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2b231f] mb-1">
          Where shall we sit, {APP_CONFIG.girlfriendName}? 🕯️
        </h2>
        <p className="text-stone-600 text-sm font-serif italic">
          "Pick the perfect atmosphere for our intimate bistro conversation."
        </p>
      </motion.div>

      {/* Location List */}
      <div className="grid grid-cols-1 gap-3 w-full mb-6 text-left">
        {APP_CONFIG.locations.map((loc) => {
          const isSelected = selectedLocation === loc.name;
          return (
            <motion.button
              key={loc.id}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                bistroSound.playKeyClick();
                onSelectLocation(loc);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative menu-item-hover ${
                isSelected
                  ? 'bg-[#fbebed] border-[#80182a] shadow-sm ring-2 ring-[#80182a]/20'
                  : 'bg-[#fffdfa] hover:bg-[#f7f2ea] border-[#e7dccc]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-[#f5ecdf] rounded-xl shrink-0">{loc.emoji}</span>
                  <div>
                    {loc.frenchTitle && (
                      <span className="text-[10px] font-serif italic text-[#80182a] font-bold block uppercase tracking-wider">
                        {loc.frenchTitle}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-base md:text-lg text-[#2b231f] leading-snug">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-sans mt-0.5">{loc.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-[#f5ecdf] px-2 py-0.5 rounded">
                    {loc.priceTag}
                  </span>
                  {isSelected && (
                    <div className="mt-1 text-xs text-[#80182a] font-bold font-serif">
                      ✓ Réservé
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom location input */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full mb-6"
        >
          <input
            type="text"
            value={customLocation}
            onChange={(e) => onChangeCustomLocation(e.target.value)}
            placeholder="Type your dream restaurant, terrace, or spot..."
            className="w-full px-4 py-3 bg-[#fffdfa] border border-[#d9c7b2] rounded-2xl text-[#2b231f] font-serif font-medium focus:outline-none focus:ring-2 focus:ring-[#80182a]/30 shadow-xs"
          />
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={() => {
            bistroSound.playKeyClick();
            onPrev();
          }}
          className="py-4 px-5 bg-[#fffdfa] hover:bg-[#f7f2ea] text-stone-700 border border-[#e7dccc] rounded-2xl font-serif font-bold shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            bistroSound.playClink();
            onNext();
          }}
          className={`flex-1 py-4 rounded-2xl font-serif font-bold text-lg md:text-xl shadow-gold-btn flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-[#80182a] hover:bg-[#681322] text-white cursor-pointer hover:scale-[1.01]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Select Table & Atmosphere</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
