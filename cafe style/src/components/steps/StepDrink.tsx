import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, MenuItemOption } from '../../config/appConfig';
import { bistroSound } from '../../utils/soundEffects';
import { Coffee, ArrowRight, ArrowLeft } from 'lucide-react';

interface StepDrinkProps {
  selectedDrink: string;
  customDrink: string;
  onSelectDrink: (drink: MenuItemOption) => void;
  onChangeCustomDrink: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepDrink: React.FC<StepDrinkProps> = ({
  selectedDrink,
  customDrink,
  onSelectDrink,
  onChangeCustomDrink,
  onNext,
  onPrev,
}) => {
  const isCustom = selectedDrink.toLowerCase().includes('custom') || selectedDrink.toLowerCase().includes('mesure');
  const canProceed = Boolean(selectedDrink && (!isCustom || customDrink.trim().length > 0));

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fffdfa] border border-[#e7dccc] rounded-3xl p-6 shadow-menu w-full mb-6 text-left"
      >
        <div className="flex items-center justify-between border-b border-[#e7dccc] pb-3 mb-3 font-mono text-xs text-[#7a6e65]">
          <span>COURSE IV · BOISSONS & ÉLIXIRS</span>
          <span className="font-bold text-[#80182a] font-serif">Barista & Cave</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2b231f] mb-1">
          What shall we sip, {APP_CONFIG.girlfriendName}? ☕
        </h2>
        <p className="text-stone-600 text-sm font-serif italic">
          "Rich hot chocolates, velvety honey lattes, or sparkling berry spritzes."
        </p>
      </motion.div>

      {/* Drinks list */}
      <div className="grid grid-cols-1 gap-3 w-full mb-6 text-left">
        {APP_CONFIG.drinks.map((drink) => {
          const isSelected = selectedDrink === drink.name;
          return (
            <motion.button
              key={drink.id}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                bistroSound.playKeyClick();
                onSelectDrink(drink);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative menu-item-hover ${
                isSelected
                  ? 'bg-[#fbebed] border-[#80182a] shadow-sm ring-2 ring-[#80182a]/20'
                  : 'bg-[#fffdfa] hover:bg-[#f7f2ea] border-[#e7dccc]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 bg-[#f5ecdf] rounded-xl shrink-0">{drink.emoji}</span>
                  <div>
                    {drink.frenchTitle && (
                      <span className="text-[10px] font-serif italic text-[#80182a] font-bold block uppercase tracking-wider">
                        {drink.frenchTitle}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-base md:text-lg text-[#2b231f] leading-snug">
                      {drink.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-sans mt-0.5">{drink.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-amber-900 bg-[#f5ecdf] px-2 py-0.5 rounded">
                    {drink.priceTag}
                  </span>
                  {isSelected && (
                    <div className="mt-1 text-xs text-[#80182a] font-bold font-serif">
                      ✓ Servi
                    </div>
                  )}
                </div>
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
            placeholder="Type your favorite beverage or custom order..."
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
          <span>Serve Beverage</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
