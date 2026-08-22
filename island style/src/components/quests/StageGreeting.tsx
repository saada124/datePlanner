import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG, ChoiceOption } from '../../config/appConfig';
import { islandSound } from '../../utils/soundEffects';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';

interface StageGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onToggleGreeting: (gr: ChoiceOption) => void;
  onChangeCustomNotes: (notes: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StageGreeting: React.FC<StageGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onToggleGreeting,
  onChangeCustomNotes,
  onNext,
  onPrev,
}) => {
  const hasSelected = selectedGreetings.length > 0;

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-4 py-4 w-full z-10">
      {/* Postcard Dialogue Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#fffdf0] border-4 border-rose-400 rounded-3xl p-5 shadow-bubble w-full mb-6"
      >
        <div className="absolute -top-4 left-6 bg-rose-500 text-white font-black text-xs px-3.5 py-1 rounded-full border-2 border-rose-600 shadow-sm flex items-center gap-1">
          <span>💌</span>
          <span>Airport Postcard & Welcome</span>
        </div>
        <p className="text-stone-700 text-base md:text-lg font-medium leading-relaxed">
          "When we touch down on the runway, how should we greet each other? Pick your favorite warm welcomes!" 🌸🤗
        </p>
      </motion.div>

      {/* Greeting Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
        {APP_CONFIG.greetings.map((gr) => {
          const isSelected = selectedGreetings.includes(gr.name);
          return (
            <motion.button
              key={gr.id}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                islandSound.playPop();
                onToggleGreeting(gr);
              }}
              className={`flex items-start gap-3.5 p-4 rounded-3xl border-3 text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-rose-100/90 border-rose-500 shadow-nook ring-4 ring-rose-200'
                  : 'bg-white hover:bg-rose-50/60 border-rose-200 text-stone-700 hover:border-rose-300 shadow-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                  isSelected ? 'bg-rose-200 border-rose-400' : 'bg-rose-50 border-rose-200'
                }`}
              >
                {gr.emoji}
              </div>

              <div className="flex-1 pr-2">
                <div className="font-black text-sm md:text-base text-stone-800 leading-snug">
                  {gr.name}
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">{gr.desc}</div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center font-black text-xs shadow-sm">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Personal Island Postcard Note */}
      <div className="w-full mb-6 bg-white border-2 border-emerald-300 rounded-3xl p-4 shadow-sm">
        <label className="block text-xs font-black uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
          <span>✍️</span>
          <span>Add a Sweet Island Postcard Note (Optional):</span>
        </label>
        <textarea
          rows={3}
          value={customNotes}
          onChange={(e) => onChangeCustomNotes(e.target.value)}
          placeholder={`Leave a cute message or secret wish for ${APP_CONFIG.boyfriendName}...`}
          className="w-full p-3 bg-emerald-50/40 border border-emerald-200 rounded-2xl text-stone-800 font-medium text-sm focus:outline-none focus:ring-3 focus:ring-emerald-300 resize-none"
        />
      </div>

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
          disabled={!hasSelected}
          onClick={() => {
            islandSound.playSuccess();
            onNext();
          }}
          className={`flex-1 py-4 rounded-3xl font-black text-lg md:text-xl shadow-nook flex items-center justify-center gap-2 border-b-4 transition-all ${
            hasSelected
              ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700 btn-nook-bounce cursor-pointer'
              : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Finalize Boarding Pass</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
