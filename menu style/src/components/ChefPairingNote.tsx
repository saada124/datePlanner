import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { Sparkles, Wine } from 'lucide-react';

interface ChefPairingNoteProps {
  selectedMood: string;
  selectedActivityId: string;
}

export const ChefPairingNote: React.FC<ChefPairingNoteProps> = ({
  selectedMood,
  selectedActivityId
}) => {
  // Find a specific matching pairing rule
  const matchedRule = APP_CONFIG.pairingTips.find((rule) => {
    const moodMatch = selectedMood.toLowerCase().includes(rule.mood);
    const activityMatch = selectedActivityId === rule.activity;
    return moodMatch && activityMatch;
  });

  const activeActivity = APP_CONFIG.mainCourses.find((c) => c.id === selectedActivityId);

  // Fallback dynamic pairing note
  const pairingText = matchedRule?.tip || (
    activeActivity
      ? `✦ Sommelier's Pairing Note: Pairing "${selectedMood.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}" with "${activeActivity.title}" — Chef guarantees 100% smiles & sweet memories.`
      : null
  );

  if (!pairingText) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${selectedMood}-${selectedActivityId}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="mt-3 p-4 bg-[var(--bg-highlight)] border border-[var(--border-card)] rounded-2xl flex items-start gap-3 text-left shadow-2xs"
      >
        <div className="p-1.5 rounded-full bg-[#E8635A]/15 text-[#E8635A] shrink-0 mt-0.5">
          <Wine className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E8635A] mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>Chef's Sommelier Pairing</span>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
            {pairingText}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
