import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { WatercolorLetter } from './WatercolorLetter';
import { sound } from '../utils/soundEffects';

interface WatercolorCelebrationProps {
  selection: DateSelection;
  onReset: () => void;
}

export const WatercolorCelebration: React.FC<WatercolorCelebrationProps> = ({
  selection,
  onReset
}) => {
  const [showLetter, setShowLetter] = useState(false);
  const [cardDownloaded, setCardDownloaded] = useState(false);

  useEffect(() => {
    // Gentle multi-stage floral confetti shower
    const end = Date.now() + 4 * 1000;
    const colors = ['#e8a0b4', '#e7c782', '#fdeef2', '#ffffff', '#9fc3b8', '#c96f8a'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.65 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.65 },
        colors
      });
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Ultra-High Resolution Vintage Postcard Keepsake Generator
  const handleDownloadKeepsake = () => {
    sound.playChime();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution 1200x1600 canvas
    canvas.width = 1200;
    canvas.height = 1600;

    // 1. Soft Watercolor Paper Background
    ctx.fillStyle = '#f2f7fb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Paper Texture grain / shading
    const paperGrad = ctx.createRadialGradient(600, 800, 200, 600, 800, 900);
    paperGrad.addColorStop(0, '#ffffff');
    paperGrad.addColorStop(1, '#eef3f9');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

    // 2. Double Pastel Rose & Gold Borders
    ctx.strokeStyle = '#e8a0b4';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = '#e7c782';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Decorative Floral Corner Accents
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#e8a0b4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#e7c782';
      ctx.beginPath();
      ctx.arc(15, 15, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(70, 70, 0);
    drawCorner(canvas.width - 70, 70, Math.PI / 2);
    drawCorner(canvas.width - 70, canvas.height - 70, Math.PI);
    drawCorner(70, canvas.height - 70, -Math.PI / 2);

    // 3. Header Postcard Banner
    ctx.fillStyle = '#fdfcff';
    ctx.fillRect(90, 90, canvas.width - 180, 200);
    ctx.strokeStyle = '#dfe6ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(90, 90, canvas.width - 180, 200);

    ctx.fillStyle = '#c96f8a';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('❀ A WATERCOLOR CHAPTER OF US • DATE INVITATION ❀', 600, 145);

    ctx.fillStyle = '#3b4a63';
    ctx.font = 'bold 52px Georgia, serif';
    ctx.fillText(`A Date with ${APP_CONFIG.girlfriendName} 🎨`, 600, 215);

    ctx.fillStyle = '#6d7a93';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText(`${APP_CONFIG.dateRangeText} • Painted with Love`, 600, 260);

    // 4. Vintage Postcard Stamp & Postmark (Top Right)
    const stampX = canvas.width - 250;
    const stampY = 320;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(stampX, stampY, 110, 140);
    ctx.strokeStyle = '#e8a0b4';
    ctx.lineWidth = 3;
    ctx.strokeRect(stampX, stampY, 110, 140);

    ctx.fillStyle = '#e8a0b4';
    ctx.font = '40px serif';
    ctx.fillText('💌', stampX + 55, stampY + 70);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('LOVE POST', stampX + 55, stampY + 115);

    // Circular Postmark cancellation
    ctx.strokeStyle = 'rgba(109, 122, 147, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(stampX - 10, stampY + 60, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = 'rgba(109, 122, 147, 0.6)';
    ctx.fillText('PARIS • 2026', stampX - 10, stampY + 55);
    ctx.fillText('★ OFFICIAL ★', stampX - 10, stampY + 72);

    // 5. Itinerary Details Box
    const boxY = 320;
    const boxW = canvas.width - 430;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(90, boxY, boxW, 860);
    ctx.strokeStyle = '#dfe6ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(90, boxY, boxW, 860);

    ctx.textAlign = 'left';
    let lineY = boxY + 65;

    const addField = (icon: string, label: string, val: string) => {
      ctx.fillStyle = '#c96f8a';
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillText(`${icon} ${label}`, 130, lineY);

      ctx.fillStyle = '#3b4a63';
      ctx.font = '24px sans-serif';
      ctx.fillText(val, 130, lineY + 36);

      // Light separator
      ctx.strokeStyle = '#e5ecf3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(130, lineY + 58);
      ctx.lineTo(130 + boxW - 80, lineY + 58);
      ctx.stroke();

      lineY += 105;
    };

    addField('📅', 'THE CHOSEN DATE:', selection.dayDate);
    addField('⏰', 'ROMANTIC TIME:', selection.timeSlot);
    addField('📍', 'SECRET DESTINATION:', selection.customLocation || selection.location || 'Romantic Spot');
    
    const acts = selection.activities.join(', ') + (selection.customActivity ? ` + ${selection.customActivity}` : '');
    addField('🎨', 'PLANNED ADVENTURES:', acts);
    addField('🧋', 'REFRESHMENT:', selection.customDrink || selection.drink);
    addField('🤗', 'SWEET GREETING:', selection.greetings.join(', '));

    // Custom Handwritten Note Section
    if (selection.customNotes) {
      ctx.fillStyle = '#fdfcff';
      ctx.fillRect(90, boxY + 680, boxW, 140);
      ctx.strokeStyle = '#f2d8e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(90, boxY + 680, boxW, 140);

      ctx.fillStyle = '#c96f8a';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText(`💌 Personal Note for ${APP_CONFIG.boyfriendName}:`, 130, boxY + 725);

      ctx.fillStyle = '#3b4a63';
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText(`"${selection.customNotes}"`, 130, boxY + 775);
    }

    // 6. Right Side Watercolor Splash Stamp Graphic
    const sealX = canvas.width - 200;
    const sealY = 800;

    ctx.fillStyle = '#c96f8a';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#a4526a';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${APP_CONFIG.boyfriendInitial} & ${APP_CONFIG.girlfriendInitial}`, sealX, sealY + 10);

    // 7. Footer Romantic Proclamation
    ctx.textAlign = 'center';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.fillStyle = '#c96f8a';
    ctx.fillText('~ Signed, sealed, and painted with all my love ~', 600, canvas.height - 180);

    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillStyle = '#e7c782';
    ctx.fillText(`FOREVER YOURS, ${APP_CONFIG.boyfriendName.toUpperCase()} ❤️`, 600, canvas.height - 130);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#6d7a93';
    ctx.fillText('No erasing allowed • See you on our date! 😌✨', 600, canvas.height - 85);

    // Export image
    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Watercolor_Invitation_${selection.isoDate}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setCardDownloaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="max-w-xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="paper-card p-8 sm:p-10 rounded-2xl shadow-paper-lg mb-6 relative border border-storybook-border"
      >
        <div className="washi-tape -top-2.5 left-1/2 -translate-x-1/2 w-28" />

        <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
          🌸 💌 💖
        </div>

        <span className="text-xs font-semibold tracking-widest text-storybook-rose uppercase font-sans">
          FINAL STROKE
        </span>

        <h1 className="font-serif-title text-2xl sm:text-3xl text-storybook-ink mt-1 mb-2">
          🎨 Date Officially Painted! 🎨
        </h1>

        <p className="font-handwriting text-2xl text-storybook-roseDark mb-6">
          “No erasing this one, my love. 😌”
        </p>

        {/* Email Notification Dispatch Status */}
        <div className="bg-[#f2f7fb] border border-storybook-border p-3 rounded-xl text-xs text-storybook-inkLight flex items-center justify-center gap-2 shadow-xs">
          <span>💌</span>
          <span>Your painted date plan was sealed & emailed! ✨</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        {/* WhatsApp Share Button */}
        <motion.a
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Dearest ${APP_CONFIG.boyfriendName}! 🎨 Our watercolor date is officially painted!\n\n📅 Date & Time: ${selection.dayDate} (${selection.customTime || selection.timeSlot})\n📍 Secret Spot: ${selection.customLocation || selection.location || 'Our Spot'}\n🎨 Adventures: ${selection.activities.join(', ')}${selection.customActivity ? ` + ${selection.customActivity}` : ''}\n🧋 Elixir: ${selection.customDrink || selection.drink}\n\nCan't wait to paint this day with you! 💖✨`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.playChime()}
          className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>💬</span>
          <span>Send Date Summary on WhatsApp</span>
        </motion.a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownloadKeepsake}
            className="story-btn-primary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>🎟️</span>
            <span>{cardDownloaded ? 'Keepsake Saved! ✓' : 'Save Keepsake Card'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sound.playChime();
              setShowLetter(true);
            }}
            className="story-btn-secondary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-storybook-rose"
          >
            <span>💌</span>
            <span>Open Secret Letter ✉️</span>
          </motion.button>
        </div>
      </div>

      {/* Reset Link */}
      <div>
        <button
          onClick={() => {
            sound.playPageTurn();
            onReset();
          }}
          className="font-serif text-xs text-storybook-inkLight hover:text-storybook-roseDark underline cursor-pointer"
        >
          Start over / Plan another date
        </button>
      </div>

      <WatercolorLetter
        isOpen={showLetter}
        onClose={() => setShowLetter(false)}
      />
    </motion.div>
  );
};
