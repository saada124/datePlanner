import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { WatercolorScratchCard } from './WatercolorScratchCard';
import { watercolorAudio } from '../utils/watercolorAudio';
import { getDiscoveredRecipeIds } from '../config/alchemistRecipes';

interface WatercolorCelebrationProps {
  selection: DateSelection;
  cardSnapshotUrl?: string | null;
  onReset: () => void;
}

export const WatercolorCelebration: React.FC<WatercolorCelebrationProps> = ({
  selection,
  cardSnapshotUrl,
  onReset
}) => {
  const [cardDownloaded, setCardDownloaded] = useState(false);
  const discoveredIds = getDiscoveredRecipeIds();
  const isMasterAlchemist = discoveredIds.includes('grand_masterpiece') || discoveredIds.length >= 5;

  useEffect(() => {
    watercolorAudio.playFanfare();

    // Gentle multi-stage pastel floral confetti shower
    const end = Date.now() + 4.5 * 1000;
    const colors = isMasterAlchemist
      ? ['#a855f7', '#ec4899', '#fbbf24', '#38bdf8', '#c084fc', '#ffffff']
      : ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0.05, y: 0.65 },
        colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 0.95, y: 0.65 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 110,
        origin: { x: 0.5, y: 0.4 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isMasterAlchemist]);

  const handleDownloadKeepsake = () => {
    watercolorAudio.playFanfare();

    // If the exact rendered card was captured with barcode, download it directly!
    if (cardSnapshotUrl) {
      try {
        const link = document.createElement('a');
        link.download = isMasterAlchemist
          ? `Royal-Alchemist-Keepsake-Queen-${APP_CONFIG.girlfriendName}.png`
          : `Watercolor-Date-Keepsake-${APP_CONFIG.girlfriendName}.png`;
        link.href = cardSnapshotUrl;
        link.click();
        setCardDownloaded(true);
        return;
      } catch (err) {
        console.error('Direct download of snapshot failed, using fallback:', err);
      }
    }

    // Fallback Canvas Renderer if no snapshot was captured
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1500;

    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isMasterAlchemist) {
      bgGrad.addColorStop(0, '#faf7ff');
      bgGrad.addColorStop(0.5, '#f4edfe');
      bgGrad.addColorStop(1, '#ebe0fb');
    } else {
      bgGrad.addColorStop(0, '#fbfcfe');
      bgGrad.addColorStop(0.5, '#fff2f5');
      bgGrad.addColorStop(1, '#edf5fc');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = isMasterAlchemist ? '#a855f7' : '#e85d75';
    ctx.lineWidth = 6;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Watercolor_Date_${selection.isoDate || '2026'}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setCardDownloaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="max-w-2xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      {/* Celebration Card */}
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className={`paper-card p-8 sm:p-10 rounded-2xl shadow-paper-lg mb-6 relative border ${
          isMasterAlchemist
            ? 'bg-gradient-to-br from-[#faf7ff] via-[#f5edff] to-[#ebe0fb] border-purple-300'
            : 'border-storybook-border'
        }`}
      >
        <div className="washi-tape -top-2.5 left-1/2 -translate-x-1/2 w-32" />

        <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
          {isMasterAlchemist ? '👑 💜 🌸' : '🌸 🎨 💖'}
        </div>

        <span
          className={`text-xs font-semibold tracking-widest uppercase font-sans ${
            isMasterAlchemist ? 'text-purple-800' : 'text-storybook-roseDark'
          }`}
        >
          {isMasterAlchemist ? 'ROYAL MASTERPIECE SEALED' : 'MASTERPIECE SEALED'}
        </span>

        <h1 className="font-serif-title text-2xl sm:text-3xl text-storybook-ink mt-1 mb-2">
          {isMasterAlchemist ? '👑 Royal Date Officially Sealed! 👑' : '🎨 Date Officially Painted! 🎨'}
        </h1>

        <p
          className={`font-handwriting text-2xl sm:text-3xl mb-5 ${
            isMasterAlchemist ? 'text-purple-700' : 'text-storybook-roseDark'
          }`}
        >
          {isMasterAlchemist
            ? `“The kingdom is yours tonight, Queen ${APP_CONFIG.girlfriendName}. 👑❤️”`
            : '“No erasing this masterpiece, my love. 😌”'}
        </p>

        {/* Email Notification Dispatch Status */}
        <div className="bg-[#f2f7fb] border border-storybook-border p-3.5 rounded-xl text-xs text-storybook-inkLight flex items-center justify-center gap-2 shadow-xs">
          <span>💌</span>
          <span className="font-medium">Your date invitation was sealed & emailed! ✨</span>
        </div>
      </motion.div>

      {/* Interactive Scratch-to-Reveal Love Letter Easel */}
      <WatercolorScratchCard />

      {/* Exact Card Preview Display (If Snapshot is available) */}
      {cardSnapshotUrl && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-6 text-center"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-storybook-roseDark uppercase tracking-wider mb-2">
            <span>🎟️</span>
            <span>Your Official Date Keepsake Pass (With Barcode)</span>
          </div>
          <div className="p-2 sm:p-3 bg-white/80 rounded-2xl border border-storybook-border shadow-paper max-w-lg mx-auto">
            <img
              src={cardSnapshotUrl}
              alt="Official Date Keepsake"
              className="w-full h-auto rounded-xl shadow-xs border border-storybook-border/60"
            />
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        {/* WhatsApp Share Button */}
        <motion.a
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Dearest ${APP_CONFIG.boyfriendName}! 🎨 Our watercolor date is officially painted!\n\n📅 Date & Time: ${selection.dayDate} (${selection.customTime || selection.timeSlot})\n📍 Secret Spot: ${selection.customLocation || selection.location || 'Our Spot'}\n🎨 Adventures: ${selection.activities.join(', ')}${selection.customActivity ? ` + ${selection.customActivity}` : ''}\n🥤 Elixir: ${selection.customDrink || selection.drink}\n\nCan't wait to paint this day with you! 💖✨`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => watercolorAudio.playWaterDrip(1.1)}
          className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>💬</span>
          <span>Send Date Summary on WhatsApp</span>
        </motion.a>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadKeepsake}
          className={`py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-2xl text-white transition-all ${
            isMasterAlchemist
              ? 'bg-gradient-to-r from-purple-700 via-fuchsia-600 to-amber-500 hover:from-purple-800 hover:to-amber-600'
              : 'story-btn-primary'
          }`}
        >
          <span>🎟️</span>
          <span>
            {cardDownloaded
              ? 'Keepsake Saved to Device! ✓'
              : isMasterAlchemist
              ? 'Save Royal Keepsake Pass (With Barcode) 💌'
              : 'Save Keepsake Certificate (With Barcode) 💌'}
          </span>
        </motion.button>
      </div>

      {/* Reset Link */}
      <div>
        <button
          onClick={() => {
            watercolorAudio.playBrushStroke(0.8);
            onReset();
          }}
          className="font-serif text-xs text-storybook-inkLight hover:text-storybook-roseDark underline cursor-pointer"
        >
          Start over / Plan another date
        </button>
      </div>
    </motion.div>
  );
};
