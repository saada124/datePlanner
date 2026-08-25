import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { WatercolorScratchCard } from './WatercolorScratchCard';
import { watercolorAudio } from '../utils/watercolorAudio';

interface WatercolorCelebrationProps {
  selection: DateSelection;
  onReset: () => void;
}

export const WatercolorCelebration: React.FC<WatercolorCelebrationProps> = ({
  selection,
  onReset
}) => {
  const [cardDownloaded, setCardDownloaded] = useState(false);

  useEffect(() => {
    watercolorAudio.playFanfare();

    // Gentle multi-stage pastel floral confetti shower
    const end = Date.now() + 4.5 * 1000;
    const colors = ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#ffffff'];

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
  }, []);

  const handleDownloadKeepsake = () => {
    watercolorAudio.playFanfare();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1500;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#fbfcfe');
    bgGrad.addColorStop(0.5, '#fff2f5');
    bgGrad.addColorStop(1, '#edf5fc');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#e85d75';
    ctx.lineWidth = 6;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    ctx.strokeStyle = '#3a86ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Title
    ctx.fillStyle = '#3b4a63';
    ctx.font = 'bold 46px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎨 A Painted Date with ${APP_CONFIG.girlfriendName} 🌸`, 600, 130);

    ctx.fillStyle = '#e85d75';
    ctx.font = 'italic 26px "Caveat", cursive';
    ctx.fillText(`${APP_CONFIG.dateRangeText} • Signed & Painted with Love`, 600, 180);

    // Details Panel
    const boxY = 230;
    const boxW = canvas.width - 200;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, boxY, boxW, 960);
    ctx.strokeStyle = '#dfe6ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, boxY, boxW, 960);

    ctx.textAlign = 'left';
    let lineY = boxY + 70;

    const addField = (icon: string, label: string, val: string) => {
      ctx.fillStyle = '#e85d75';
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillText(`${icon} ${label}`, 140, lineY);

      ctx.fillStyle = '#3b4a63';
      ctx.font = '24px sans-serif';
      ctx.fillText(val, 140, lineY + 38);

      ctx.strokeStyle = '#e5ecf3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(140, lineY + 60);
      ctx.lineTo(140 + boxW - 80, lineY + 60);
      ctx.stroke();

      lineY += 110;
    };

    addField('📅', 'THE CHOSEN DATE:', selection.dayDate || 'Soon');
    addField('⏰', 'ROMANTIC TIME:', selection.customTime || selection.timeSlot || 'Afternoon');
    addField('📍', 'DESTINATION:', selection.customLocation || selection.location || 'Secret spot');
    
    const acts = selection.activities.join(', ') + (selection.customActivity ? ` + ${selection.customActivity}` : '');
    addField('🎨', 'PLANNED ADVENTURES:', acts || 'Exploring together');
    addField('🥤', 'REFRESHMENT:', selection.customDrink || selection.drink || 'Lavender Lemonade');
    addField('🤗', 'SWEET GREETING:', selection.greetings.join(', ') || 'Warm hug');

    if (selection.customNotes) {
      ctx.fillStyle = '#e85d75';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText(`💌 Note for ${APP_CONFIG.boyfriendName}:`, 140, lineY);
      ctx.fillStyle = '#3b4a63';
      ctx.font = 'italic 24px "Caveat", cursive';
      ctx.fillText(`"${selection.customNotes}"`, 140, lineY + 36);
    }

    // Signature
    ctx.textAlign = 'center';
    ctx.font = 'italic 28px "Caveat", cursive';
    ctx.fillStyle = '#e85d75';
    ctx.fillText('~ Signed, sealed, and painted forever in our hearts ~', 600, canvas.height - 180);

    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillStyle = '#3a86ff';
    ctx.fillText(`FOREVER YOURS, ${APP_CONFIG.boyfriendName.toUpperCase()} ❤️`, 600, canvas.height - 130);

    // Export image
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
        className="paper-card p-8 sm:p-10 rounded-2xl shadow-paper-lg mb-6 relative border border-storybook-border"
      >
        <div className="washi-tape -top-2.5 left-1/2 -translate-x-1/2 w-32" />

        <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
          🌸 🎨 💖
        </div>

        <span className="text-xs font-semibold tracking-widest text-storybook-roseDark uppercase font-sans">
          MASTERPIECE SEALED
        </span>

        <h1 className="font-serif-title text-2xl sm:text-3xl text-storybook-ink mt-1 mb-2">
          🎨 Date Officially Painted! 🎨
        </h1>

        <p className="font-handwriting text-2xl sm:text-3xl text-storybook-roseDark mb-5">
          “No erasing this masterpiece, my love. 😌”
        </p>

        {/* Email Notification Dispatch Status */}
        <div className="bg-[#f2f7fb] border border-storybook-border p-3.5 rounded-xl text-xs text-storybook-inkLight flex items-center justify-center gap-2 shadow-xs">
          <span>💌</span>
          <span className="font-medium">Your date invitation was sealed & emailed! ✨</span>
        </div>
      </motion.div>

      {/* Interactive Scratch-to-Reveal Love Letter Easel */}
      <WatercolorScratchCard />

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
          className="story-btn-primary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>🎟️</span>
          <span>{cardDownloaded ? 'Keepsake Saved to Device! ✓' : 'Save Keepsake Certificate 💌'}</span>
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
