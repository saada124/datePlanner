import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG, isCustomTime } from '../config/appConfig';
import { sound } from '../utils/soundEffects';
import { PixelAvatars } from './PixelAvatars';

interface FinalDateCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const FinalDateCard: React.FC<FinalDateCardProps> = ({
  selection,
  onConfirm,
  onEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedActivities = selection.activities.length > 0
    ? selection.activities.join(', ') + (selection.customActivity ? ` (+ "${selection.customActivity}")` : '')
    : (selection.customActivity ? `"${selection.customActivity}"` : '');

  const formattedGreetings = selection.greetings.join(', ');

  const fullLocation = selection.customLocation
    ? (selection.location === APP_CONFIG.customLocationId || !selection.location
        ? `📍 ${selection.customLocation}`
        : `${selection.location} (${selection.customLocation})`)
    : selection.location;

  const fullTime = selection.customTime
    ? (isCustomTime(selection.timeSlot) ? `⏰ ${selection.customTime}` : `${selection.timeSlot} (${selection.customTime})`)
    : selection.timeSlot;

  const fullDrink = selection.customDrink
    ? (selection.drink === APP_CONFIG.customDrinkId ? `🥤 ${selection.customDrink}` : `${selection.drink} (${selection.customDrink})`)
    : selection.drink;

  const handleConfirmDate = async () => {
    setIsSubmitting(true);
    sound.playVictoryFanfare();

    setTimeout(() => {
      onConfirm();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-xl mx-auto w-full px-3 pb-24 text-center select-none"
    >
      {/* RPG Quest Completed Banner */}
      <div className="inline-block bg-retro-gold text-retro-dark font-pixel text-xs sm:text-sm px-4 py-1.5 border-2 border-retro-dark rounded shadow-pixel-sm mb-3 font-bold animate-bounce-slow">
        ⭐ QUEST COMPLETE! ⭐
      </div>

      {/* Main Collectible RPG Quest Card */}
      <div className="pixel-box-gold p-5 sm:p-7 mb-5 shadow-pixel-lg text-left relative overflow-hidden">
        {/* Card Header */}
        <div className="text-center border-b-2 border-retro-dark pb-3 mb-4">
          <div className="font-pixel text-[9px] text-retro-purple uppercase font-bold">
            ⚔️ OFFICIAL DATE CONTRACT ⚔️
          </div>
          <h1 className="font-pixel text-base sm:text-xl text-retro-dark mt-1 text-pixel-shadow">
            ❤️ OUR DATE WITH {APP_CONFIG.girlfriendName.toUpperCase()} ❤️
          </h1>
          <div className="flex justify-center items-center gap-2 mt-1">
            <span className="font-pixel text-[8px] bg-retro-pink text-white px-2 py-0.5 rounded border border-retro-dark">
              RARITY: LEGENDARY
            </span>
          </div>
        </div>

        {/* Characters Scene */}
        <div className="my-2">
          <PixelAvatars
            mood="dancing"
            speechText="Tfehemnaaaaa! Hedhi card mtaa l date el jey !"
            showSpeech={true}
          />
        </div>

        {/* Date Details RPG Table */}
        <div className="space-y-2.5 font-pixelify text-xs sm:text-sm bg-white/80 p-3 sm:p-4 rounded border-2 border-retro-dark shadow-inner mt-4">
          <div className="flex items-start gap-2 border-b border-gray-200 pb-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              📅 DATE:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {selection.dayDate}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-gray-200 pb-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              ⏰ TIME:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {fullTime}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-gray-200 pb-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              📍 LOCATION:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {fullLocation}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-gray-200 pb-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              🎯 PLAN:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {formattedActivities}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-gray-200 pb-1.5">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              🥤 DRINK:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {fullDrink}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-pixel text-[9px] sm:text-[10px] text-retro-purple min-w-[75px] sm:min-w-[90px] pt-0.5">
              🤗 GREETING:
            </span>
            <span className="font-bold text-retro-dark flex-1">
              {formattedGreetings}
            </span>
          </div>

          {selection.customNotes && (
            <div className="flex items-start gap-2 border-t border-gray-200 pt-1.5 text-xs text-retro-pinkDark italic">
              <span className="font-pixel text-[9px] not-italic text-retro-purple min-w-[75px] sm:min-w-[90px]">
                💬 NOTE:
              </span>
              <span className="flex-1">"{selection.customNotes}"</span>
            </div>
          )}
        </div>

        {/* Card Footer Rarity Stamp */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-retro-dark/20 text-[9px] font-pixel text-retro-purple/80">
          <span>ITEM #0817-23</span>
          <span>SIGNED BY {APP_CONFIG.boyfriendName.toUpperCase()} &amp; {APP_CONFIG.girlfriendName.toUpperCase()}</span>
        </div>
      </div>

      {/* Romantic Prompt */}
      <div className="mb-4">
        <p className="font-pixel text-xs sm:text-sm text-retro-cream text-pixel-shadow mb-1">
          CHAKHET ANDI WEEEEEEEEEEEE
        </p>
        <p className="font-pixelify text-sm text-retro-pinkLight">
          See you soon, Habibi.
        </p>
      </div>

      {/* Main Confirm Button & Edit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={onEdit}
          className="pixel-btn pixel-btn-secondary text-[10px] order-2 sm:order-1"
        >
          <span>✏️ Change Answers</span>
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => sound.playHover()}
          disabled={isSubmitting}
          onClick={handleConfirmDate}
          className="pixel-btn pixel-btn-primary text-xs sm:text-sm px-6 py-4 shadow-pixel-glow order-1 sm:order-2 w-full sm:w-auto animate-pulse-fast"
        >
          <span className="flex items-center justify-center gap-2">
            <span>🎉</span>
            <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM OUR DATE ❤️'}</span>
            <span>🎉</span>
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
