import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { Sparkles, Utensils } from 'lucide-react';

export const BrassClipHeader: React.FC = () => {
  return (
    <div className="relative w-full flex justify-center -mb-5 z-20 pointer-events-none select-none">
      {/* Brass Binder Clip Body */}
      <div className="relative">
        <div className="w-28 sm:w-36 h-9 bg-gradient-to-b from-[#E7C782] via-[#D4AF37] to-[#9C782B] rounded-b-xl shadow-md border-t-2 border-[#FFE8A3] flex items-center justify-center gap-1.5 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#593E12]/50 shadow-inner" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#4A320A] font-bold uppercase">
            RESERVED
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#593E12]/50 shadow-inner" />
        </div>
        {/* Silver Wire Loop Top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-5 border-2 border-[#C0C0C0] rounded-t-full shadow-xs" />
      </div>
    </div>
  );
};

export const MenuHeader: React.FC = () => {
  return (
    <header className="text-center pt-8 pb-6 px-4">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--bg-highlight)] border border-[var(--border-card)] text-[var(--text-secondary)] rounded-full text-xs font-mono font-medium mb-4 shadow-2xs"
      >
        <Utensils className="w-3.5 h-3.5 text-[#E8635A]" />
        <span>{APP_CONFIG.tableNumber}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#F4A45C]" />
      </motion.div>

      {/* Main Fraunces Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] tracking-tight mb-2"
      >
        ✦ {APP_CONFIG.menuTitle} ✦
      </motion.h1>

      {/* Italic Tasting Subhead */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-serif italic text-base sm:text-lg text-[#E8635A] max-w-md mx-auto leading-relaxed mb-4"
      >
        “{APP_CONFIG.menuSubtitle}”
      </motion.p>

      {/* Guest Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest"
      >
        Curated for <span className="font-bold text-[var(--text-primary)] border-b border-[#E8635A] pb-0.5">{APP_CONFIG.girlfriendName}</span> · Hosted by <span className="font-bold text-[var(--text-primary)]">{APP_CONFIG.boyfriendName}</span>
      </motion.div>
    </header>
  );
};
