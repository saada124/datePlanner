import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG, isCustomTime } from '../config/appConfig';
import { PixelAvatars } from './PixelAvatars';
import { SecretLoveNote } from './SecretLoveNote';
import { sound } from '../utils/soundEffects';

interface CelebrationScreenProps {
  selection: DateSelection;
  onReset: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  selection,
  onReset
}) => {
  const [showLoveNote, setShowLoveNote] = useState(false);
  const [ticketDownloaded, setTicketDownloaded] = useState(false);

  useEffect(() => {
    // Multi-stage celebration fireworks & confetti explosion
    const end = Date.now() + 4 * 1000;
    const colors = ['#ff7597', '#ffd166', '#c8b6ff', '#ffffff', '#ff0055', '#4ea8de'];

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
        particleCount: 3,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Premium High-Resolution Canvas Ticket Generator
  const handleDownloadTicket = () => {
    sound.playSelect();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ultra high resolution 1200x1600 for sharp print & phone wallpapers
    canvas.width = 1200;
    canvas.height = 1600;

    // 1. Dark Retro Velvet Background
    const bgGrad = ctx.createRadialGradient(600, 800, 100, 600, 800, 1000);
    bgGrad.addColorStop(0, '#3f2559');
    bgGrad.addColorStop(1, '#1b0f26');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Ticket Body with notched stub cutouts
    const pad = 60;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;

    // Outer pixel frame
    ctx.fillStyle = '#2b1b3d';
    ctx.fillRect(pad, pad, w, h);

    // Golden border
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 14;
    ctx.strokeRect(pad + 10, pad + 10, w - 20, h - 20);

    // Inner Cream Ticket Card
    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(pad + 24, pad + 24, w - 48, h - 48);

    // Side Perforation Cutout Circles (authentic ticket stub look)
    ctx.fillStyle = '#1b0f26';
    ctx.beginPath();
    ctx.arc(pad + 24, 600, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - pad - 24, 600, 36, 0, Math.PI * 2);
    ctx.fill();

    // Dashed Perforation Line across ticket
    ctx.strokeStyle = '#d9c8b7';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(pad + 70, 600);
    ctx.lineTo(canvas.width - pad - 70, 600);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Top Header: Holographic Gradient Banner
    const headerGrad = ctx.createLinearGradient(pad + 30, pad + 30, canvas.width - pad - 30, 220);
    headerGrad.addColorStop(0, '#ff7597');
    headerGrad.addColorStop(0.5, '#c8b6ff');
    headerGrad.addColorStop(1, '#ffd166');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(pad + 30, pad + 30, w - 60, 180);

    ctx.strokeStyle = '#2b1b3d';
    ctx.lineWidth = 6;
    ctx.strokeRect(pad + 30, pad + 30, w - 60, 180);

    // Header Text
    ctx.fillStyle = '#2b1b3d';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ ★ ★ OFFICIAL ARCADE DATE PASS ★ ★ ★', 600, pad + 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px monospace';
    ctx.shadowColor = '#2b1b3d';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.fillText('VIP DATE PASS ❤️', 600, pad + 130);
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#2b1b3d';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${APP_CONFIG.boyfriendName.toUpperCase()} & ${APP_CONFIG.girlfriendName.toUpperCase()} • SPECIAL EDITION`, 600, pad + 175);

    // 4. Character Sprites & Proposal Badge
    ctx.fillStyle = '#ff7597';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL: 9999 • RARITY: LEGENDARY ★★★★★', 600, 310);

    // 5. Date Itinerary Details Table
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pad + 50, 340, w - 100, 230);
    ctx.strokeStyle = '#2b1b3d';
    ctx.lineWidth = 4;
    ctx.strokeRect(pad + 50, 340, w - 100, 230);

    const fullLoc = selection.customLocation
      ? (selection.location === APP_CONFIG.customLocationId || !selection.location
          ? selection.customLocation
          : `${selection.location} (${selection.customLocation})`)
      : (selection.location || 'Romantic Secret Spot');

    const fullTimeVal = selection.customTime
      ? (isCustomTime(selection.timeSlot) ? selection.customTime : `${selection.timeSlot} (${selection.customTime})`)
      : selection.timeSlot;

    const fullDrinkVal = selection.customDrink
      ? (selection.drink === APP_CONFIG.customDrinkId ? selection.customDrink : `${selection.drink} (${selection.customDrink})`)
      : (selection.drink || 'Favorite Drink');

    ctx.textAlign = 'left';
    ctx.fillStyle = '#d94368';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('📅 DATE & TIME:', pad + 80, 400);
    ctx.fillStyle = '#2b1b3d';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`${selection.dayDate} • ${fullTimeVal}`, pad + 80, 440);

    ctx.fillStyle = '#d94368';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('📍 DESTINATION:', pad + 80, 500);
    ctx.fillStyle = '#2b1b3d';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(fullLoc, pad + 80, 540);

    // 6. Bottom Half Itinerary Details
    const bottomY = 670;
    const drawSection = (label: string, value: string, y: number) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pad + 50, y, w - 100, 110);
      ctx.strokeStyle = '#2b1b3d';
      ctx.lineWidth = 4;
      ctx.strokeRect(pad + 50, y, w - 100, 110);

      ctx.fillStyle = '#d94368';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(label, pad + 80, y + 40);

      ctx.fillStyle = '#2b1b3d';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(value, pad + 80, y + 80);
    };

    const acts = (selection.activities.length > 0 
      ? selection.activities.join(', ') + (selection.customActivity ? ` + ${selection.customActivity}` : '')
      : (selection.customActivity || 'Fun Date Adventures'));

    drawSection('🎯 PLANNED ACTIVITIES:', acts, bottomY);
    drawSection('🥤 DRINK / POTION:', fullDrinkVal, bottomY + 130);
    drawSection('🤗 GREETING:', selection.greetings.join(', '), bottomY + 260);

    // 7. Custom Note (if any)
    if (selection.customNotes) {
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(pad + 50, bottomY + 390, w - 100, 90);
      ctx.strokeStyle = '#ff7597';
      ctx.lineWidth = 4;
      ctx.strokeRect(pad + 50, bottomY + 390, w - 100, 90);

      ctx.fillStyle = '#d94368';
      ctx.font = 'italic bold 22px sans-serif';
      ctx.fillText(`💬 "${selection.customNotes}"`, pad + 80, bottomY + 445);
    }

    // 8. Bottom Barcode & Verification Stamp
    const barY = canvas.height - pad - 190;
    ctx.fillStyle = '#2b1b3d';
    const startX = 220;
    for (let i = 0; i < 76; i++) {
      const barW = (i % 4 === 0) ? 8 : (i % 3 === 0) ? 5 : (i % 2 === 0) ? 3 : 10;
      ctx.fillRect(startX + i * 10, barY, barW, 60);
    }

    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`NO. 2026-${APP_CONFIG.girlfriendName.toUpperCase()}-${APP_CONFIG.boyfriendName.toUpperCase()}-DATE-CONFIRMED`, 600, barY + 90);

    // Golden Wax Seal Stamp at Bottom
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(canvas.width - pad - 110, canvas.height - pad - 130, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2b1b3d';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#2b1b3d';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('VALID', canvas.width - pad - 110, canvas.height - pad - 135);
    ctx.fillText('100% ❤️', canvas.width - pad - 110, canvas.height - pad - 115);

    // Footer Guarantee
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('NO CANCELLATIONS ALLOWED • SEE YOU SOON 😌❤️', 600, canvas.height - pad - 25);

    // Export image
    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_VIP_Date_Ticket_${selection.isoDate}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setTicketDownloaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="max-w-xl mx-auto w-full px-3 pb-24 text-center select-none"
    >
      {/* Date Confirmed Box */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="pixel-box-gold p-6 sm:p-8 mb-5 shadow-pixel-lg relative overflow-hidden"
      >
        <div className="text-4xl sm:text-5xl mb-2 animate-bounce-slow">
          🎉 💖 🎮
        </div>

        <h1 className="font-pixel text-lg sm:text-2xl text-retro-dark text-pixel-shadow mb-2">
          🎉 DATE CONFIRMED! 🎉
        </h1>

        <p className="font-pixelify text-base sm:text-lg text-retro-pinkDark font-bold mb-4">
          “Now don't cancel on me. 😌”
        </p>

        {/* Dancing Character Sprites */}
        <PixelAvatars
          mood="dancing"
          speechText="SAYEEEE WALLA ANNA DATA ALA KRIB 🥰💖"
          showSpeech={true}
        />

        {/* Email Dispatch Notice */}
        <div className="mt-4 bg-retro-cream border-2 border-retro-dark p-2.5 rounded font-pixel text-[9px] text-retro-purple flex items-center justify-center gap-2 shadow-inner">
          <span>💌</span>
          <span>VIP Ticket pass IS SENT TO {APP_CONFIG.boyfriendName.toUpperCase()} <br/>(MA TANSECH TAAML SAVE LEL TICKET)</span>
        </div>
      </motion.div>

      {/* Interactive Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadTicket}
          className="pixel-btn pixel-btn-primary text-xs py-3.5 shadow-pixel flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🎟️</span>
          <span>{ticketDownloaded ? 'VIP Ticket Saved! ✓' : 'Save VIP Date Pass'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playSelect();
            setShowLoveNote(true);
          }}
          className="pixel-btn pixel-btn-gold text-xs py-3.5 shadow-pixel flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>💌</span>
          <span>Open Secret Love Note ✉️</span>
        </motion.button>
      </div>

      {/* Start Over Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            onReset();
          }}
          className="font-pixel text-[9px] text-white/60 hover:text-white underline cursor-pointer"
        >
          🔄 Start Over / Plan Another Date
        </button>
      </div>

      {/* Secret Love Note Modal */}
      <SecretLoveNote
        isOpen={showLoveNote}
        onClose={() => setShowLoveNote(false)}
      />
    </motion.div>
  );
};
