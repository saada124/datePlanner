import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, ChoiceOption } from '../../config/appConfig';
import { islandSound } from '../../utils/soundEffects';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageActivityProps {
  selectedActivities: string[];
  customActivity: string;
  onToggleActivity: (act: ChoiceOption) => void;
  onChangeCustomActivity: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StageActivity: React.FC<StageActivityProps> = ({
  selectedActivities,
  customActivity,
  onToggleActivity,
  onChangeCustomActivity,
  onNext,
  onPrev,
}) => {
  const hasSelected = selectedActivities.length > 0;
  const isCustomSelected = selectedActivities.some((a) => a.toLowerCase().includes('secret') || a.toLowerCase().includes('custom'));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Animal Crossing Inventory Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#fffdf0] border-4 border-emerald-400 rounded-3xl p-5 shadow-bubble w-full mb-6"
      >
        <div className="absolute -top-4 left-6 bg-amber-400 text-stone-900 font-black text-xs px-3.5 py-1 rounded-full border-2 border-amber-500 shadow-sm flex items-center gap-1">
          <span>🎒</span>
          <span>Pocket Inventory</span>
        </div>
        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed">
          "What shall we pack into our day on the island? Tap everything you'd love us to do together!" 🏝️✨
        </p>
      </motion.div>

      {/* Grid of Pocket Items / Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
        {APP_CONFIG.activities.map((act) => {
          const isSelected = selectedActivities.includes(act.name);
          return (
            <motion.button
              key={act.id}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                islandSound.playPop();
                onToggleActivity(act);
              }}
              className={`flex items-start gap-3.5 p-4 rounded-3xl border-3 text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-100/90 border-amber-500 shadow-nook ring-4 ring-amber-200'
                  : 'bg-white hover:bg-emerald-50/70 border-emerald-200 text-stone-700 hover:border-emerald-300 shadow-sm'
              }`}
            >
              {/* AC Item Bubble */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                  isSelected ? 'bg-amber-200 border-amber-400 scale-105' : 'bg-emerald-100/60 border-emerald-200'
                }`}
              >
                {act.emoji}
              </div>

              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-sm md:text-base text-stone-800 leading-snug">
                    {act.name}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">{act.desc}</p>
                {act.badge && (
                  <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {act.badge}
                  </span>
                )}
              </div>

              {/* Selection Check Circle */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 border-2 border-amber-600 rounded-full flex items-center justify-center text-stone-900 font-black text-xs">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Custom activity field */}
      {isCustomSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full mb-6"
        >
          <input
            type="text"
            value={customActivity}
            onChange={(e) => onChangeCustomActivity(e.target.value)}
            placeholder="Type your secret custom adventure..."
            className="w-full px-4 py-3 bg-white border-2 border-amber-400 rounded-2xl text-stone-800 font-bold focus:outline-none focus:ring-4 focus:ring-amber-200 shadow-sm"
          />
        </motion.div>
      )}

      {/* Navigation Buttons */}
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
          disabled={!hasSelected}
          onClick={() => {
            islandSound.playSuccess();
            onNext();
          }}
          className={`flex-1 py-4 rounded-3xl font-black text-lg md:text-xl shadow-nook flex items-center justify-center gap-2 border-b-4 transition-all ${
            hasSelected
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 btn-nook-bounce cursor-pointer'
              : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Pack Adventures ({selectedActivities.length})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
