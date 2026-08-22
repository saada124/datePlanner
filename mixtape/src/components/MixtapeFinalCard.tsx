import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface MixtapeFinalCardProps {
  selection: DateSelection;
  onConfirm: () => void;
  onEdit: () => void;
}

export const MixtapeFinalCard: React.FC<MixtapeFinalCardProps> = ({
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
      <div className="inline-block bg-mixtape-blush text-mixtape-roseDark font-typewriter text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full border border-mixtape-rose mb-4">
        📼 J-CARD · SIDE A TRACKLIST 📼
      </div>

      {/* Main Cassette J-Card */}
      <div className="jcard-card p-6 sm:p-9 rounded-2xl shadow-paper-lg text-left relative overflow-hidden mb-6">
        {/* Tape strips */}
        <div className="tape-strip -top-2 left-10 w-24" />
        <div className="tape-strip tape-strip-reverse -top-2 right-10 w-24" />

        {/* J-Card Header */}
        <div className="border-b border-mixtape-border pb-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-typewriter tracking-[0.3em] text-mixtape-rose">
                {APP_CONFIG.websiteTitle.toUpperCase()} · SIDE A
              </span>
              <h1 className="font-serif-title text-xl sm:text-2xl text-mixtape-coffee mt-0.5">
                A Date with {APP_CONFIG.girlfriendName} 🎧
              </h1>
              <p className="font-handwriting text-sm text-mixtape-coffeeLight">
                Mixed, pressed, and ready to spin
              </p>
            </div>
            <div className="deck-reel w-10 h-10 rounded-full shrink-0 relative">
              <div className="absolute inset-[18%] rounded-full bg-mixtape-parchment border border-mixtape-border" />
              <div className="absolute inset-[42%] rounded-full bg-mixtape-border" />
            </div>
          </div>
        </div>

        {/* Tracklist Itinerary */}
        <div className="space-y-3 bg-mixtape-cream p-4 rounded-xl border border-mixtape-border text-xs sm:text-sm font-sans">
          <div className="flex items-start gap-2 border-b border-mixtape-border/60 pb-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ TRACK 1 · DATE
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {selection.dayDate}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-mixtape-border/60 pb-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ TRACK 2 · TIME
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {fullTime}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-mixtape-border/60 pb-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ TRACK 3 · PLACE
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {fullLocation}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-mixtape-border/60 pb-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ TRACK 4 · VIBE
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {formattedActivities}
            </span>
          </div>

          <div className="flex items-start gap-2 border-b border-mixtape-border/60 pb-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ TRACK 5 · SIPS
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {fullDrink}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
              ♪ BONUS · GREETING
            </span>
            <span className="font-medium text-mixtape-coffee flex-1">
              {formattedGreetings}
            </span>
          </div>

          {selection.customNotes && (
            <div className="flex items-start gap-2 border-t border-mixtape-border/60 pt-2 text-mixtape-coffeeLight">
              <span className="font-typewriter text-[10px] tracking-widest text-mixtape-roseDark min-w-[85px] sm:min-w-[100px] pt-0.5">
                ♪ LINER NOTE
              </span>
              <span className="font-handwriting text-base text-mixtape-coffee flex-1">
                "{selection.customNotes}"
              </span>
            </div>
          )}
        </div>

        {/* J-Card Footer */}
        <div className="mt-4 text-center font-handwriting text-base text-mixtape-roseDark">
          ~ Pressed with love · {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial} ~
        </div>
      </div>

      {/* Confirm & Edit Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="mix-btn-secondary px-6 py-3 text-xs sm:text-sm order-2 sm:order-1 cursor-pointer"
        >
          <span>✏️ Edit Tracklist</span>
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={isSubmitting}
          onClick={handleConfirmDate}
          className="mix-btn-primary px-8 py-3.5 text-sm sm:text-base order-1 sm:order-2 flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <span>🔴</span>
          <span>{isSubmitting ? 'PRESSING RECORD...' : 'PRESS RECORD ❤️'}</span>
          <span>🎙️</span>
        </motion.button>
      </div>
    </motion.div>
  );
};