import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { MixtapeLetter } from './MixtapeLetter';
import { sound } from '../utils/soundEffects';

interface MixtapeCelebrationProps {
  selection: DateSelection;
  onReset: () => void;
}

export const MixtapeCelebration: React.FC<MixtapeCelebrationProps> = ({
  selection,
  onReset
}) => {
  const [showLetter, setShowLetter] = useState(false);
  const [cardDownloaded, setCardDownloaded] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setRecordedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Gentle multi-stage cassette-styled confetti shower
    const end = Date.now() + 4 * 1000;
    const colors = ['#c96f4a', '#e0a458', '#b45f6f', '#d88a8a', '#f9e8dd', '#d9a441'];

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

  // High-Resolution J-Card Cover Keepsake Generator
  const handleDownloadKeepsake = () => {
    sound.playChime();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution 1400x1400 cover art
    canvas.width = 1400;
    canvas.height = 1400;

    // 1. Warm Paper Background
    ctx.fillStyle = '#f6efe3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Double Tape-Strip Borders (top-left & bottom-right)
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#e0a458';
    ctx.fillRect(90, 60, 260, 70);
    ctx.rotate(-0.02);
    ctx.restore();

    ctx.fillStyle = '#fdfaf2';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.strokeStyle = '#d9a679';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.strokeStyle = '#e2d5c2';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

    // Decorative corner reels
    const drawReel = (x: number, y: number) => {
      ctx.fillStyle = '#3a3027';
      ctx.beginPath();
      ctx.arc(x, y, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b3a17e';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    };
    drawReel(120, 120);
    drawReel(canvas.width - 120, canvas.height - 120);

    // 3. Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b45f6f';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText('✦ THE DATE MIXTAPE · SIDE A ✦', 700, 190);

    ctx.fillStyle = '#4a3b32';
    ctx.font = 'bold 60px Georgia, serif';
    ctx.fillText(`A Date with ${APP_CONFIG.girlfriendName} 🎧`, 700, 270);

    ctx.fillStyle = '#8a7568';
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillText(`${APP_CONFIG.dateRangeText} • Pressed with Love`, 700, 320);

    // 4. Cassette Tape Window Graphic
    const winX = 430;
    const winY = 370;
    ctx.fillStyle = '#2f2620';
    ctx.fillRect(winX, winY, 540, 210);
    ctx.strokeStyle = '#b3a17e';
    ctx.lineWidth = 3;
    ctx.strokeRect(winX, winY, 540, 210);

    ctx.fillStyle = '#3a3027';
    ctx.beginPath();
    ctx.arc(winX + 150, winY + 105, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(winX + 390, winY + 105, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b3a17e';
    ctx.beginPath();
    ctx.arc(winX + 150, winY + 105, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(winX + 390, winY + 105, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e8dcc6';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText(`${APP_CONFIG.boyfriendInitial} ♥ ${APP_CONFIG.girlfriendInitial}`, 700, winY + 172);

    // 5. Tracklist Box
    const boxY = 630;
    ctx.fillStyle = '#fbf4e8';
    ctx.fillRect(130, boxY, 1140, 480);
    ctx.strokeStyle = '#d9a679';
    ctx.lineWidth = 2;
    ctx.strokeRect(130, boxY, 1140, 480);

    ctx.textAlign = 'left';
    let lineY = boxY + 65;

    const addField = (icon: string, label: string, val: string) => {
      ctx.fillStyle = '#b45f6f';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.fillText(`${icon} ${label}`, 170, lineY);

      ctx.fillStyle = '#4a3b32';
      ctx.font = '26px Georgia, serif';
      ctx.fillText(val, 170, lineY + 38);

      ctx.strokeStyle = '#e2d5c2';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(170, lineY + 60);
      ctx.lineTo(170 + 1060, lineY + 60);
      ctx.stroke();

      lineY += 100;
    };

    addField('🎧', 'TRACK 1 · WHEN:', selection.dayDate);
    addField('⏰', 'TRACK 2 · TIME:', selection.timeSlot);
    addField('📍', 'TRACK 3 · WHERE:', selection.customLocation || selection.location || 'Our Spot');

    const acts = selection.activities.join(', ') + (selection.customActivity ? ` + ${selection.customActivity}` : '');
    addField('🎸', 'TRACK 4 · VIBE:', acts);
    addField('☕', 'TRACK 5 · SIPS:', selection.customDrink || selection.drink);

    // 6. Footer Proclamation
    ctx.textAlign = 'center';
    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillStyle = '#b45f6f';
    ctx.fillText('~ Recorded, rewound, and replayed by my heart ~', 700, 1180);

    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillStyle = '#d9a441';
    ctx.fillText(`FOREVER YOURS, ${APP_CONFIG.boyfriendName.toUpperCase()} ❤️`, 700, 1230);

    ctx.font = '18px Georgia, serif';
    ctx.fillStyle = '#8a7568';
    ctx.fillText('No pause button • We play this one on repeat 😌✨', 700, 1280);

    // Export image
    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Mixtape_Cover_${selection.isoDate}.png`;
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
        className="jcard-card p-8 sm:p-10 rounded-2xl shadow-paper-lg mb-6 relative"
      >
        <div className="tape-strip -top-2.5 left-1/2 -translate-x-1/2 w-28" />

        <div className="text-4xl sm:text-5xl mb-3 flex items-center justify-center gap-3">
          <span className="animate-heart-beat inline-block">🔴</span>
          <span className="animate-bounce inline-block">🎧 💿 🎶</span>
          <span className="animate-heart-beat inline-block delay-300">💖</span>
        </div>

        <span className="text-xs font-typewriter tracking-[0.3em] text-mixtape-rose uppercase">
          RECORDING COMPLETE
        </span>

        <h1 className="font-serif-title text-2xl sm:text-3xl text-mixtape-coffee mt-1 mb-2">
          📼 The Date Mixtape Is Live! 📼
        </h1>

        <p className="font-handwriting text-2xl text-mixtape-roseDark mb-6">
          “Side A recorded. It's the only tape I'll ever need. 😌”
        </p>

        {/* Recording Meter */}
        <div className="bg-mixtape-cream border border-mixtape-border p-3 rounded-xl text-xs text-mixtape-coffeeLight flex items-center justify-center gap-2 shadow-xs">
          <span className="text-mixtape-rose animate-heart-beat inline-block">🔴</span>
          <span className="font-typewriter tracking-widest">
            REC {String(recordedSeconds).padStart(3, '0')}:{String(Math.floor(recordedSeconds * 60) % 60).padStart(2, '0')} ·
            REWINDING FOREVER
          </span>
        </div>

        {/* Email Notification Dispatch Status */}
        <div className="mt-3 bg-mixtape-cream border border-mixtape-border p-3 rounded-xl text-xs text-mixtape-coffeeLight flex items-center justify-center gap-2 shadow-xs">
          <span>💌</span>
          <span>Your mixtape was sealed & emailed! ✨</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleDownloadKeepsake}
          className="mix-btn-primary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>💿</span>
          <span>{cardDownloaded ? 'Cover Saved! ✓' : 'Save Mixtape Cover'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sound.playChime();
            setShowLetter(true);
          }}
          className="mix-btn-secondary py-3.5 px-5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>💌</span>
          <span>Open Liner Notes ✉️</span>
        </motion.button>
      </div>

      {/* Reset Link */}
      <div>
        <button
          onClick={() => {
            sound.playPageTurn();
            onReset();
          }}
          className="font-serif text-xs text-mixtape-coffeeLight hover:text-mixtape-roseDark underline cursor-pointer"
        >
          Start over / Record Side B
        </button>
      </div>

      <MixtapeLetter
        isOpen={showLetter}
        onClose={() => setShowLetter(false)}
      />
    </motion.div>
  );
};