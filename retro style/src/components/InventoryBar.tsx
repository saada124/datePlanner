import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateSelection } from '../types';
import { findLocation, findDrink, findGreeting } from '../config/appConfig';

interface InventoryBarProps {
  selection: DateSelection;
}

// Robust Unicode Emoji Extractor
function extractEmoji(str: string | undefined, fallback: string): string {
  if (!str) return fallback;
  const match = str.match(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\u{200D}]+/u);
  return match ? match[0] : fallback;
}

function getLocationIcon(loc: string, customLoc?: string): string {
  if (customLoc) return '📍';
  return findLocation(loc)?.icon || extractEmoji(loc, '📍');
}

function getLocationLabel(loc: string, customLoc?: string): string {
  if (customLoc) return 'Fekra 😏';
  return findLocation(loc)?.shortLabel || 'Blasa';
}

function getDrinkLabel(drink: string, customDrink?: string): string {
  if (customDrink) return 'Mashroub';
  return findDrink(drink)?.shortLabel || drink.split(' ')[0] || 'Mashroub';
}

function getGreetingLabel(greeting: string): string {
  return findGreeting(greeting)?.shortLabel || 'Salam';
}

export const InventoryBar: React.FC<InventoryBarProps> = ({ selection }) => {
  const hasDate = Boolean(selection.dayDate);
  const hasActivities = selection.activities.length > 0 || Boolean(selection.customActivity);
  const hasLocation = Boolean(selection.location) || Boolean(selection.customLocation);
  const hasDrink = Boolean(selection.drink) || Boolean(selection.customDrink);
  const hasGreeting = selection.greetings.length > 0;

  const slots = [
    {
      category: 'Date & Time',
      filled: hasDate,
      icon: hasDate ? (extractEmoji(selection.timeSlot, '📅')) : '📅',
      label: hasDate ? (selection.dayDate.split(',')[0] || selection.dayDate.split(' ')[0]) : 'Nhar'
    },
    {
      category: 'Activity',
      filled: hasActivities,
      icon: hasActivities ? (selection.activities.length > 0 ? extractEmoji(selection.activities[0], '🎮') : '✨') : '🎯',
      label: hasActivities ? (selection.activities.length > 0 ? `${selection.activities.length} jaw` : 'Jaw') : 'Jaw'
    },
    {
      category: 'Location',
      filled: hasLocation,
      icon: hasLocation ? getLocationIcon(selection.location, selection.customLocation) : '🗺️',
      label: getLocationLabel(selection.location, selection.customLocation)
    },
    {
      category: 'Drink',
      filled: hasDrink,
      icon: hasDrink ? extractEmoji(selection.customDrink || selection.drink, '🧋') : '🥤',
      label: getDrinkLabel(selection.drink, selection.customDrink)
    },
    {
      category: 'Greeting',
      filled: hasGreeting,
      icon: hasGreeting ? extractEmoji(selection.greetings[0], '😘') : '❤️',
      label: hasGreeting ? getGreetingLabel(selection.greetings[0]) : 'Salam'
    }
  ];

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[95%] sm:w-auto">
      <div className="pixel-box bg-retro-dark/95 border-2 border-white/80 p-2 sm:px-4 sm:py-2 text-white flex items-center justify-between gap-1.5 sm:gap-3 shadow-pixel">
        <div className="hidden sm:flex items-center gap-1.5 border-r border-white/20 pr-3">
          <span className="text-sm">🎒</span>
          <span className="font-pixel text-[9px] text-retro-gold">BACKPACK</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-around">
          {slots.map((slot, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded border-2 flex items-center justify-center text-sm sm:text-base relative transition-all ${
                  slot.filled
                    ? 'border-retro-gold bg-retro-purple shadow-pixel-sm'
                    : 'border-dashed border-white/30 bg-black/30 opacity-60'
                }`}
              >
                <AnimatePresence mode="wait">
                  {slot.filled ? (
                    <motion.span
                      key="filled"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="select-none"
                    >
                      {slot.icon}
                    </motion.span>
                  ) : (
                    <span key="empty" className="text-white/40 text-xs font-pixel">
                      ?
                    </span>
                  )}
                </AnimatePresence>

                {slot.filled && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-retro-gold rounded-full animate-ping" />
                )}
              </div>
              <span className="font-pixel text-[7px] sm:text-[8px] text-retro-cream mt-0.5 max-w-[56px] truncate text-center">
                {slot.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
