import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, ChoiceOption } from '../../config/appConfig';
import { islandSound } from '../../utils/soundEffects';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageLocationProps {
  selectedLocation: string;
  customLocation: string;
  onSelectLocation: (loc: ChoiceOption) => void;
  onChangeCustomLocation: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StageLocation: React.FC<StageLocationProps> = ({
  selectedLocation,
  customLocation,
  onSelectLocation,
  onChangeCustomLocation,
  onNext,
  onPrev,
}) => {
  const isCustom = selectedLocation.toLowerCase().includes('custom');
  const canProceed = Boolean(selectedLocation && (!isCustom || customLocation.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Dialogue Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#fffdf0] border-4 border-emerald-400 rounded-3xl p-5 shadow-bubble w-full mb-6"
      >
        <div className="absolute -top-4 left-6 bg-sky-500 text-white font-black text-xs px-3.5 py-1 rounded-full border-2 border-sky-600 shadow-sm flex items-center gap-1">
          <span>🗺️</span>
          <span>Island Map Coordinates</span>
        </div>
        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed">
          "Every 5-star island has a magical spot. Where should we head first?" 📍🌸
        </p>
      </motion.div>

      {/* Locations List */}
      <div className="grid grid-cols-1 gap-3 w-full mb-6">
        {APP_CONFIG.locations.map((loc) => {
          const isSelected = selectedLocation === loc.name;
          return (
            <motion.button
              key={loc.id}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                islandSound.playPop();
                onSelectLocation(loc);
              }}
              className={`flex items-center gap-4 p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-100/90 border-amber-500 shadow-nook ring-4 ring-amber-200 scale-[1.02]'
                  : 'bg-white hover:bg-emerald-50 border-emerald-200 text-stone-700 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 ${
                  isSelected ? 'bg-amber-200 border-amber-400' : 'bg-emerald-100/70 border-emerald-200'
                }`}
              >
                {loc.emoji}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-base md:text-lg text-stone-800">
                    {loc.name}
                  </span>
                  {loc.badge && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                      {loc.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">{loc.desc}</p>
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
            placeholder="Type our dream spot address or idea..."
            className="w-full px-4 py-3 bg-white border-2 border-amber-400 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 shadow-sm"
          />
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={() => {
            islandSound.playPop();
            onPrev();
          }}
          className="py-4 px-5 bg-white hover:bg-stone-100 text-stone-700 border-2 border-stone-300 rounded-3xl font-black shadow-sm flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            islandSound.playSuccess();
            onNext();
          }}
          className={`flex-1 py-4 rounded-3xl font-black text-lg md:text-xl shadow-nook flex items-center justify-center gap-2 border-b-4 transition-all ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 btn-nook-bounce cursor-pointer'
              : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Pin Destination</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
