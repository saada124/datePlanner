import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import { Sparkles, Heart, Utensils, Calendar, Clock, MapPin } from 'lucide-react';
import { FortuneCookie } from './FortuneCookie';
import { PolaroidPin } from './PolaroidPin';

interface MenuLandingProps {
  onOpenMenu: () => void;
}

export const MenuLanding: React.FC<MenuLandingProps> = ({ onOpenMenu }) => {
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const taunts = [
    "No table today? 🥐 Sacré bleu!",
    "The Chef would be heartbroken! 👨‍🍳",
    "Table N° 07 is already candlelit! 🕯️",
    "Special dessert is already baking! 🍰",
    "100% Chef's Guarantee of Smiles! ✨",
    "Oui oui... try clicking Open Menu! 😉"
  ];

  const handleOpen = () => {
    menuSound.unlock();
    menuSound.playPaperTurn();
    menuSound.playChampagneClink();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(12);
    }
    onOpenMenu();
  };

  const handleNoHover = () => {
    menuSound.playPenTick();
    setNoIndex((prev) => (prev + 1) % taunts.length);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxOffset = isMobile ? 80 : 160;
    const signX = Math.random() > 0.5 ? 1 : -1;
    const signY = Math.random() > 0.5 ? 1 : -1;
    setNoPos({
      x: signX * (40 + Math.random() * maxOffset),
      y: signY * (30 + Math.random() * (isMobile ? 60 : 100))
    });
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center relative z-10 select-none">
      {/* Top Gold Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-highlight)] border border-[var(--border-card)] text-[var(--text-secondary)] rounded-full text-xs font-mono font-bold shadow-2xs mb-6 uppercase tracking-wider"
      >
        <Utensils className="w-3.5 h-3.5 text-[#E8635A]" />
        <span>Bespoke Date Reservation · Table N° 07</span>
        <Sparkles className="w-3.5 h-3.5 text-[#F4A45C]" />
      </motion.div>

      {/* Decorative Gold Emblem / Menu Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14 }}
        className="relative mb-4"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-full flex items-center justify-center shadow-paper text-4xl sm:text-5xl">
          📋
        </div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -top-1 -right-1 text-xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Main Fraunces Display Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight mb-2 leading-tight"
      >
        Bonjour, {APP_CONFIG.girlfriendName}! 🥐
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="text-base sm:text-lg font-serif italic text-[#E8635A] mb-8 font-medium"
      >
        A table for two has been reserved by {APP_CONFIG.boyfriendName}.
      </motion.p>

      {/* 2-Column Tabletop Grid: Invitation & Fortune Cookie on Left, Polaroid Pin on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full mb-8 text-left">
        {/* Left Column: Invitation Card Envelope & Fortune Cookie */}
        <div className="md:col-span-7 flex flex-col space-y-4">
          {/* Invitation Card Envelope */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="paper-menu-card rounded-3xl p-6 sm:p-7 w-full relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-3 text-xs font-mono text-[var(--text-secondary)]">
              <span>MAISON DES DÉLICES</span>
              <span className="text-[#E8635A] font-bold font-serif">{APP_CONFIG.tableNumber}</span>
            </div>

            <p className="font-serif italic text-[var(--text-primary)] text-sm sm:text-base leading-relaxed mb-4">
              “Welcome to our private tasting menu. Tonight, you are the chef of our adventure — pick what sounds good, choose our stops course by course, and lock in our date.”
            </p>

            {/* Quick Highlights Info Box */}
            <div className="pt-3 border-t border-dashed border-[var(--border-dashed)] grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-[var(--text-secondary)]">
              <div className="flex flex-col items-center gap-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#E8635A]" />
                <span>Aug 21–27</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="w-3.5 h-3.5 text-[#F4A45C]" />
                <span>4 Courses</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#4A7A6D]" />
                <span>Private Booth</span>
              </div>
            </div>
          </motion.div>

          {/* 🥠 Complimentary Fortune Cookie on Table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <FortuneCookie />
          </motion.div>
        </div>

        {/* Right Column: 📸 3D Flippable Polaroid Memory Pin beside the invitation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-5 flex justify-center md:justify-end items-center h-full"
        >
          <PolaroidPin />
        </motion.div>
      </div>

      {/* Primary Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full relative mb-4"
      >
        {/* Open Menu CTA Button */}
        <button
          type="button"
          onClick={handleOpen}
          className="w-full sm:w-auto min-w-[240px] px-8 py-4 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif text-lg sm:text-xl font-bold rounded-2xl shadow-coral-glow flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-5 h-5 text-[#F4A45C]" />
          <span>Open Date Menu 🥂</span>
          <Heart className="w-5 h-5 fill-white text-white" />
        </button>

        {/* Playful Evasive No Button */}
        <motion.div
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: 'spring', damping: 12, stiffness: 220 }}
          className="w-full sm:w-auto"
        >
          <button
            type="button"
            onMouseEnter={handleNoHover}
            onClick={handleNoHover}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FFFCF5] hover:bg-[#FDF2E7] text-[#70584E] font-medium text-xs sm:text-sm rounded-2xl border border-[#D8B29A] transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            {noIndex === 0 ? "No table today... 🙅‍♀️" : taunts[noIndex]}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
