import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { Win95Window } from './Win95Window';
import { Win95Letter } from './Win95Letter';
import { sound } from '../utils/soundEffects';

interface InstallCompleteProps {
  selection: DateSelection;
  letterOpen: boolean;
  onOpenLetter: () => void;
  onCloseLetter: () => void;
  onReset: () => void;
}

export const InstallComplete: React.FC<InstallCompleteProps> = ({ selection, letterOpen, onOpenLetter, onCloseLetter, onReset }) => {
  const [licenseDownloaded, setLicenseDownloaded] = useState(false);

  useEffect(() => {
    const end = Date.now() + 2500;
    const colors = ['#000080', '#1084d0', '#ffcc00', '#c0c0c0', '#ff7597'];
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0.05, y: 0.6 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 0.95, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleDownloadLicense = () => {
    sound.playChime();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 1600;

    // Gray window background
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bevel frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    // Title bar
    const barGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    barGrad.addColorStop(0, '#000080');
    barGrad.addColorStop(1, '#1084d0');
    ctx.fillStyle = barGrad;
    ctx.fillRect(24, 24, canvas.width - 48, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WINDOWS ™ 95', 50, 65);
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('DATE LICENSE', 50, 102);

    // Body
    const y0 = 160;
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 44px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('THIS LICENSE GRANTS', 600, y0 + 40);
    ctx.fillText(`${APP_CONFIG.girlfriendName.toUpperCase()}`, 600, y0 + 110);
    ctx.font = 'bold 34px "Times New Roman", serif';
    ctx.fillText('the right to date', 600, y0 + 165);
    ctx.fillText(`${APP_CONFIG.boyfriendName.toUpperCase()}`, 600, y0 + 225);
    ctx.font = 'italic 30px "Times New Roman", serif';
    ctx.fillText('forever. No expiration date.', 600, y0 + 290);

    // Divider
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, y0 + 340);
    ctx.lineTo(1080, y0 + 340);
    ctx.stroke();

    // Itinerary
    ctx.textAlign = 'left';
    ctx.font = 'bold 28px sans-serif';
    const fields: [string, string][] = [
      ['📅 Date:', selection.dayDate],
      ['⏰ Time:', selection.customTime ? `${selection.timeSlot} (${selection.customTime})` : selection.timeSlot],
      ['📍 Destination:', selection.customLocation || selection.location],
      ['🎮 Activities:', selection.activities.join(', ') + (selection.customActivity ? ` (+ ${selection.customActivity})` : '')],
      ['🥤 Refreshment:', selection.customDrink || selection.drink],
      ['🤗 Greetings:', selection.greetings.join(', ')],
    ];
    let ly = y0 + 390;
    fields.forEach(([label, val], i) => {
      if (i > 0) ly += 90;
      ctx.fillStyle = '#000080';
      ctx.fillText(label, 130, ly);
      ctx.fillStyle = '#000000';
      ctx.font = '26px sans-serif';
      ctx.fillText(val, 130, ly + 34);
      ctx.font = 'bold 28px sans-serif';
      if (i < fields.length - 1) {
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(130, ly + 52);
        ctx.lineTo(1070, ly + 52);
        ctx.stroke();
      }
    });

    // Barcode
    const by = 1330;
    ctx.fillStyle = '#000000';
    let bx = 300;
    let seed = 42;
    while (bx < 900) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const w = 2 + (seed % 5);
      ctx.fillRect(bx, by, w, 130);
      bx += w + 3 + (seed % 4);
    }

    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${APP_CONFIG.girlfriendInitial}${APP_CONFIG.boyfriendInitial}-95-LOVE-${selection.isoDate.replace(/-/g, '')}`, 600, by + 175);

    ctx.font = 'italic 26px "Times New Roman", serif';
    ctx.fillStyle = '#000080';
    ctx.fillText(`Installed by ${APP_CONFIG.boyfriendName}.exe ❤️ — LoveOS 95`, 600, 1520);

    const link = document.createElement('a');
    link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Windows_License_${selection.isoDate}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setLicenseDownloaded(true);
  };

  const fullLocation = selection.customLocation || selection.location;
  const fullTime = selection.customTime ? `${selection.timeSlot} (${selection.customTime})` : selection.timeSlot;
  const fullDrink = selection.customDrink || selection.drink;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
    >
      <Win95Window title="date-setup.exe — Setup Complete" icon="✅" defaultPos={{ x: 0, y: 0 }}>
        <div className="select-none text-center">
          <div className="font-win95 text-4xl text-win95-navy mb-1">✔</div>
          <div className="font-win95 text-2xl text-win95-navy mb-2">DATE INSTALLED SUCCESSFULLY!</div>
          <p className="text-xs text-win95-black mb-1">
            Registered to: <b>{APP_CONFIG.girlfriendName} & {APP_CONFIG.boyfriendName}</b>
          </p>
          <p className="text-[11px] text-win95-grayDark mb-3">
            {selection.dayDate} • {fullTime} • {fullLocation} • {fullDrink}
          </p>

          <div className="win95-field !bg-win95-gray text-left text-[11px] p-2 mb-4 leading-4">
            <span className="text-win95-grayDark">C:\</span>&gt; date-setup.exe /confirm
            <br />
            ✔ Date plan sealed &amp; emailed to the address in Settings (⚙️).
            <br />
            <span className="animate-blink">_</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleDownloadLicense}
              className="win95-btn font-bold cursor-pointer"
            >
              {licenseDownloaded ? 'License Saved! ✓' : '🎟️ Download Windows License'}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playChime();
                onOpenLetter();
              }}
              className="win95-btn cursor-pointer"
            >
              💌 View README.TXT
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playPageTurn();
                onReset();
              }}
              className="win95-btn cursor-pointer"
            >
              🔄 Run Setup Again
            </button>
          </div>
        </div>
      </Win95Window>

      <Win95Letter isOpen={letterOpen} onClose={onCloseLetter} />
    </motion.div>
  );
};