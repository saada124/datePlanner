import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { StarlightLetter } from './StarlightLetter';
import { sound } from '../utils/soundEffects';

interface MidnightCelebrationProps {
  selection: DateSelection;
  onReset: () => void;
}

export const MidnightCelebration: React.FC<MidnightCelebrationProps> = ({
  selection,
  onReset
}) => {
  const [showLetter, setShowLetter] = useState(false);
  const [ticketDownloaded, setTicketDownloaded] = useState(false);

  useEffect(() => {
    // Multi-stage celestial fireworks explosion
    const end = Date.now() + 4 * 1000;
    const colors = ['#ff7597', '#ffd166', '#c084fc', '#ffffff', '#38bdf8', '#a855f7'];

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

  // Ultra-High-Resolution 1200x1600 Cosmic Pass Ticket Generator
  const handleDownloadTicket = () => {
    sound.playCrystalChime();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1600;

    // 1. Deep Midnight Space Gradient Background
    const bgGrad = ctx.createRadialGradient(600, 800, 100, 600, 800, 1000);
    bgGrad.addColorStop(0, '#231545');
    bgGrad.addColorStop(0.6, '#0d091a');
    bgGrad.addColorStop(1, '#05030a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle twinkling stars on ticket background
    for (let i = 0; i < 90; i++) {
      const sx = Math.random() * canvas.width;
      const sy = Math.random() * canvas.height;
      const sr = 0.8 + Math.random() * 2;
      ctx.fillStyle = (i % 3 === 0) ? '#ffd166' : (i % 2 === 0) ? '#c084fc' : '#ffffff';
      ctx.globalAlpha = 0.3 + Math.random() * 0.7;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Cosmic Card Frame with side ticket notches
    const pad = 60;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;

    // Outer Glass Card
    ctx.fillStyle = 'rgba(23, 18, 43, 0.9)';
    ctx.fillRect(pad, pad, w, h);

    // Glowing Neon Border
    ctx.strokeStyle = '#ff7597';
    ctx.lineWidth = 6;
    ctx.strokeRect(pad, pad, w, h);

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.strokeRect(pad + 8, pad + 8, w - 16, h - 16);

    // Side Perforation Cutouts
    ctx.fillStyle = '#05030a';
    ctx.beginPath();
    ctx.arc(pad, 580, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width - pad, 580, 40, 0, Math.PI * 2);
    ctx.fill();

    // Dashed Perforation Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(pad + 60, 580);
    ctx.lineTo(canvas.width - pad - 60, 580);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Header Cosmic Banner
    const bannerGrad = ctx.createLinearGradient(pad + 20, pad + 20, canvas.width - pad - 20, 240);
    bannerGrad.addColorStop(0, '#ff7597');
    bannerGrad.addColorStop(0.5, '#a855f7');
    bannerGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(pad + 25, pad + 25, w - 50, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ ✦ ✦ OFFICIAL STARLIGHT VIP PASS ✦ ✦ ✦', 600, pad + 65);

    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(`A Date with ${APP_CONFIG.girlfriendName} ✨`, 600, pad + 130);

    ctx.font = '20px sans-serif';
    ctx.fillText(`${APP_CONFIG.boyfriendName.toUpperCase()} & ${APP_CONFIG.girlfriendName.toUpperCase()} • CELESTIAL EDITION 2026`, 600, pad + 175);

    // 4. Main Itinerary Details Section
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(pad + 40, 320, w - 80, 220);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(pad + 40, 320, w - 80, 220);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ff7597';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('📅 THE CHOSEN DATE & TIME:', pad + 70, 375);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`${selection.dayDate} • ${selection.timeSlot}`, pad + 70, 415);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('📍 DESTINATION:', pad + 70, 470);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(selection.customLocation || selection.location || `${APP_CONFIG.boyfriendName}’s Secret Starlight Spot`, pad + 70, 510);

    // 5. Bottom Itinerary Details
    const bottomY = 650;
    const addSection = (title: string, val: string, y: number, color: string) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(pad + 40, y, w - 80, 115);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(pad + 40, y, w - 80, 115);

      ctx.fillStyle = color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(title, pad + 70, y + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.fillText(val, pad + 70, y + 84);
    };

    const acts = selection.activities.join(', ') + (selection.customActivity ? ` + ${selection.customActivity}` : '');
    addSection('💫 PLANNED ADVENTURES:', acts, bottomY, '#ffd166');
    addSection('🥤 REFRESHING ELIXIR:', selection.customDrink || selection.drink, bottomY + 135, '#c084fc');
    addSection('🤗 WARM GREETING:', selection.greetings.join(', '), bottomY + 270, '#ff7597');

    // 6. Starlight Note (if any)
    if (selection.customNotes) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
      ctx.fillRect(pad + 40, bottomY + 405, w - 80, 95);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(pad + 40, bottomY + 405, w - 80, 95);

      ctx.fillStyle = '#ffd166';
      ctx.font = 'italic 22px sans-serif';
      ctx.fillText(`💬 "${selection.customNotes}"`, pad + 70, bottomY + 460);
    }

    // 7. Bottom Barcode & Verification Badge
    const barY = canvas.height - pad - 190;
    ctx.fillStyle = '#ffffff';
    const startX = 220;
    for (let i = 0; i < 76; i++) {
      const barW = (i % 4 === 0) ? 8 : (i % 3 === 0) ? 5 : (i % 2 === 0) ? 3 : 10;
      ctx.fillRect(startX + i * 10, barY, barW, 60);
    }

    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(`NO. 2026-STARLIGHT-${APP_CONFIG.girlfriendInitial}-${APP_CONFIG.boyfriendInitial}-CONFIRMED`, 600, barY + 90);

    // Glowing Guarantee Stamp
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('NO CANCELLATIONS ALLOWED • SEE YOU SOON 😌❤️', 600, canvas.height - pad - 25);

    // Export image
    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Midnight_Pass_${selection.isoDate}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setTicketDownloaded(true);
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
        className="cosmic-card-glow p-8 sm:p-10 rounded-3xl mb-6 relative overflow-hidden"
      >
        <div className="text-4xl sm:text-5xl mb-3 animate-bounce">
          🌌 💖 ✨
        </div>

        <span className="text-xs font-semibold tracking-widest text-midnight-neonPink uppercase font-display">
          ORBIT COMPLETE
        </span>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1 mb-2">
          ✨ Date Officially Locked In! ✨
        </h1>

        <p className="font-sans text-base sm:text-lg text-midnight-lavender font-medium mb-6">
          “Now don't cancel on me. 😌”
        </p>

        {/* Email Notification Dispatch Status */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-xs text-midnight-textMuted flex items-center justify-center gap-2 shadow-xs">
          <span>💌</span>
          <span>Date quest report automatically recorded & dispatched! ✨</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadTicket}
          className="cosmic-btn-primary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-neon-pink"
        >
          <span>🎟️</span>
          <span>{ticketDownloaded ? 'Celestial Pass Saved! ✓' : 'Save Celestial Pass'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playCrystalChime();
            setShowLetter(true);
          }}
          className="cosmic-btn-secondary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-midnight-neonPink"
        >
          <span>💌</span>
          <span>Open Secret Starlight Note ✉️</span>
        </motion.button>
      </div>

      {/* Reset Link */}
      <div>
        <button
          onClick={() => {
            sound.playCrystalChime();
            onReset();
          }}
          className="font-sans text-xs text-midnight-textMuted hover:text-white underline cursor-pointer"
        >
          🔄 Start over / Plan another date
        </button>
      </div>

      <StarlightLetter
        isOpen={showLetter}
        onClose={() => setShowLetter(false)}
      />
    </motion.div>
  );
};
