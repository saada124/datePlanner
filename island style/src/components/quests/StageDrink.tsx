import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, ChoiceOption } from '../../config/appConfig';
import { islandSound } from '../../utils/soundEffects';
import { Coffee, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onSelectDrink: (drink: ChoiceOption) => void;
  onChangeCustomDrink: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StageDrink: React.FC<StageDrinkProps> = ({
  selectedDrink,
  customDrink,
  onSelectDrink,
  onChangeCustomDrink,
  onNext,
  onPrev,
}) => {
  const isCustom = selectedDrink.toLowerCase().includes('custom');
  const canProceed = Boolean(selectedDrink && (!isCustom || customDrink.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Brewster Roost Dialogue */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#fffdf0] border-4 border-amber-500 rounded-3xl p-5 shadow-bubble w-full mb-6"
      >
        <div className="absolute -top-4 left-6 bg-amber-600 text-white font-black text-xs px-3.5 py-1 rounded-full border-2 border-amber-700 shadow-sm flex items-center gap-1">
          <span>🦉</span>
          <span>Brewster @ The Roost</span>
        </div>
        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed italic">
          "Coo... what can I brew for you two today? Fresh pigeon-milk or an icy island refreshment?" ☕✨
        </p>
      </motion.div>

      {/* Drink list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
        {APP_CONFIG.drinks.map((drink) => {
          const isSelected = selectedDrink === drink.name;
          return (
            <motion.button
              key={drink.id}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                islandSound.playPop();
                onSelectDrink(drink);
              }}
              className={`flex items-center gap-3.5 p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-100/90 border-amber-500 shadow-nook ring-4 ring-amber-200'
                  : 'bg-white hover:bg-amber-50/60 border-amber-200/80 text-stone-700 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                  isSelected ? 'bg-amber-200 border-amber-400 scale-105' : 'bg-amber-50 border-amber-200'
                }`}
              >
                {drink.emoji}
              </div>

              <div>
                <div className="font-black text-sm md:text-base text-stone-800 leading-snug">
                  {drink.name}
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">{drink.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Drink Input */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full mb-6"
        >
          <input
            type="text"
            value={customDrink}
            onChange={(e) => onChangeCustomDrink(e.target.value)}
            placeholder="Type your favorite drink choice..."
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
          <span>Serve Refreshment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
