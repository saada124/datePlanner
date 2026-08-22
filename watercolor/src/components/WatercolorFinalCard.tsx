import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface WatercolorFinalCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const WatercolorFinalCard: React.FC<WatercolorFinalCardProps> = ({
  selection,
  onConfirm,
  onEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedActivities = selection.activities.join(', ') +
    (selection.customActivity ? ` (+ "${selection.customActivity}")` : '');

  const formattedGreetings = selection.greetings.join(', ');

  const fullLocation = selection.customLocation
    ? `${selection.location} (${selection.customLocation})`
    : selection.location;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const fullDrink = selection.customDrink
    ? `${selection.drink} (${selection.customDrink})`
    : selection.drink;

  const handleConfirmDate = async () => {
    setIsSubmitting(true);
    sound.playCelebrationTune();

    setTimeout(() => {
      onConfirm();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      {/* Header Tag */}
      <div className="inline-block bg-storybook-blush text-storybook-roseDark font-serif text-xs font-semibold px-4 py-1.5 rounded-full border border-storybook-rose mb-4">
        🎨 PAINTING PROCLAMATION 🎨
      </div>

      {/* Main Vintage Date Invitation Postcard */}
      <div className="paper-card p-6 sm:p-9 rounded-2xl shadow-paper-lg text-left relative overflow-hidden mb-6 border border-storybook-border">
        {/* Postcard Stamp & Seal in Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="wax-seal w-9 h-9 text-xs">
            {APP_CONFIG.boyfriendInitial} & {APP_CONFIG.girlfriendInitial}
          </div>
          <div className="w-12 h-14 bg-white border border-storybook-border rounded p-1 flex flex-col items-center justify-center shadow-xs">
            <span className="text-lg">💌</span>
            <span className="text-[7px] font-sans uppercase font-bold text-storybook-roseDark">LOVE</span>
          </div>
        </div>

        {/* Postcard Title */}
        <div className="border-b border-storybook-border pb-4 mb-5 max-w-[70%]">
          <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-storybook-rose">
            DATE INVITATION
          </span>
          <h1 className="font-serif-title text-xl sm:text-2xl text-storybook-ink mt-0.5">
            A Date with {APP_CONFIG.girlfriendName} 🎨
          </h1>
          <p className="font-handwriting text-sm text-storybook-inkLight">
            Signed, sealed, and planned with love
          </p>
        </div>

        {/* Itinerary Details Table */}
        <div className="space-y-3 bg-[#f2f7fb] p-4 rounded-xl border border-storybook-border text-xs sm:text-sm font-sans">
          <div className="flex items-start gap-2 border-b border-storybook-border/60 pb-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              📅 Date:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {selection.dayDate}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-storybook-border/60 pb-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              ⏰ Time:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {fullTime}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-storybook-border/60 pb-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              📍 Destination:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {fullLocation}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-storybook-border/60 pb-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              🎨 Activities:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {formattedActivities}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-storybook-border/60 pb-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              🥤 Refreshment:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {fullDrink}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
              🤗 Greeting:
            </span>
            <span className="font-medium text-storybook-ink flex-1">
              {formattedGreetings}
            </span>
          </div>

          {selection.customNotes && (
            <div className="flex items-start gap-2 border-t border-storybook-border/60 pt-2 text-storybook-inkLight">
              <span className="font-serif font-bold text-storybook-roseDark min-w-[85px] sm:min-w-[100px]">
                💌 Personal Note:
              </span>
              <span className="font-handwriting text-base text-storybook-ink flex-1">
                "{selection.customNotes}"
              </span>
            </div>
          )}
        </div>

        {/* Postcard Footer Note */}
        <div className="mt-4 text-center font-handwriting text-base text-storybook-roseDark">
          ~ Looks like I have a date with the most wonderful person in the world. ~
        </div>
      </div>

      {/* Confirm & Edit Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="story-btn-secondary px-6 py-3 text-xs sm:text-sm order-2 sm:order-1 cursor-pointer"
        >
          <span>✏️ Edit Selections</span>
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={isSubmitting}
          onClick={handleConfirmDate}
          className="story-btn-primary px-8 py-3.5 text-sm sm:text-base order-1 sm:order-2 flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <span>🌸</span>
          <span>{isSubmitting ? 'Sealing Invitation...' : 'CONFIRM OUR DATE ❤️'}</span>
          <span>🌸</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
