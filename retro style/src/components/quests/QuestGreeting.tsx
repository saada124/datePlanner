import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../config/appConfig';
import { sound } from '../../utils/soundEffects';
import { PixelAvatars } from '../PixelAvatars';

interface QuestGreetingProps {
  selectedGreetings: string[];
  customNotes: string;
  onUpdate: (data: { greetings: string[]; customNotes: string }) => void;
  onNext: () => void;
  onPrev: () => void;
  onStatPopup: (text: string) => void;
}

const GREETINGS = APP_CONFIG.greetings;

export const QuestGreeting: React.FC<QuestGreetingProps> = ({
  selectedGreetings,
  customNotes,
  onUpdate,
  onNext,
  onPrev,
  onStatPopup
}) => {
  const [greetings, setGreetings] = useState<string[]>(selectedGreetings);
  const [notes, setNotes] = useState<string>(customNotes);

  const toggleGreeting = (id: string) => {
    let next: string[];
    if (greetings.includes(id)) {
      sound.playSelect();
      next = greetings.filter(g => g !== id);
    } else {
      sound.playEquip();
      next = [...greetings, id];
      onStatPopup(`GREETING CHOSEN: ${id} ❤️`);
    }
    setGreetings(next);
    onUpdate({ greetings: next, customNotes: notes });
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    onUpdate({ greetings, customNotes: val });
  };

  const handleProceed = () => {
    sound.playLevelUp();
    onNext();
  };

  const isValid = greetings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto w-full px-3 pb-24"
    >
      <div className="pixel-box-pink p-4 sm:p-6 mb-4 shadow-pixel-lg relative">
        <PixelAvatars
          mood={greetings.length > 0 ? 'blushing' : 'excited'}
          speechText={
            greetings.length > 0
              ? "Final Boss stage conquered! Get ready to see the date card! 🥰❤️"
              : "FINAL QUEST: When we first see each other, what happens? ❤️"
          }
          showSpeech={true}
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-xs sm:text-sm text-retro-dark text-pixel-shadow">
              ❤️ Final Quest: How Are You Greeting Me?
            </h2>
            <span className="font-pixel text-[9px] text-retro-gold bg-retro-dark px-2 py-0.5 border border-retro-gold rounded font-bold animate-pulse">
              BOSS BATTLE
            </span>
          </div>

          {/* Greetings Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GREETINGS.map((item) => {
              const isSelected = greetings.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => toggleGreeting(item.id)}
                  className={`p-2.5 flex flex-col items-center justify-between min-h-[95px] text-center transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'pixel-box pixel-box-selected scale-105'
                      : 'pixel-box bg-white text-retro-dark hover:bg-retro-pinkLight/40'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl my-0.5">{item.icon}</span>
                  <span className="font-pixelify text-xs font-bold leading-tight">
                    {item.label}
                  </span>
                  <span className="font-pixel text-[7px] font-medium opacity-90 mt-0.5">
                    {item.desc}
                  </span>

                  {isSelected && (
                    <div className="absolute top-1 right-1 text-xs">
                      💖
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Extra Notes / Message for Boyfriend */}
          <div className="mt-4 border-t-2 border-retro-purple/20 pt-3">
            <label className="block font-pixel text-[9px] text-retro-dark mb-1">
              💬 Leave a cute message / note for {APP_CONFIG.boyfriendName} (optional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="e.g. Can't wait! Bring me flowers or wear that nice sweater ❤️"
              className="w-full pixel-box bg-white p-2 text-xs font-pixelify text-retro-dark focus:outline-none focus:ring-2 focus:ring-retro-pink resize-none"
            />
          </div>

          {/* Easter egg tiny greyed-out fleeing button in corner */}
          <div className="mt-3 flex justify-end">
            <div 
              title="Nice try, there's still no escape!"
              className="opacity-40 text-[8px] font-pixel text-gray-500 bg-gray-200 border border-gray-400 px-2 py-0.5 rounded cursor-not-allowed select-none"
            >
              🔒 "I don't think so" (Disabled - No escape! 😉)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="pixel-btn pixel-btn-secondary text-[10px]"
        >
          <span>⬅️ Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleProceed}
          className={`pixel-btn ${
            isValid
              ? 'pixel-btn-gold shadow-pixel-gold animate-bounce-slow text-xs'
              : 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700'
          }`}
        >
          <span>🏆 Finish Quest & View Date Card!</span>
        </button>
      </div>
    </motion.div>
  );
};
