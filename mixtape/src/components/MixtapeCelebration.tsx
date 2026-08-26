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
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#c96f4a', '#e0a458', '#b45f6f', '#d4af37', '#f9e8dd'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.6 },
        colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.6 },
        colors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // High-Resolution 1:1 Scale True Printable J-Card Keepsake Generator (102mm x 165mm @ 300 DPI)
  const handleDownloadKeepsake = () => {
    sound.playChime();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1950 x 1200 high-res printable canvas
    canvas.width = 1950;
    canvas.height = 1200;

    // 1. Studio table background
    ctx.fillStyle = '#14110f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Printable Outer Border with Scissor Cut Guides
    const jcardX = 80;
    const jcardY = 80;
    const jcardW = 1790;
    const jcardH = 1040;

    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(jcardX, jcardY, jcardW, jcardH);
    ctx.strokeStyle = '#decbb2';
    ctx.lineWidth = 4;
    ctx.strokeRect(jcardX, jcardY, jcardW, jcardH);

    // Scissor Cut Guides at corners
    ctx.strokeStyle = '#8a7568';
    ctx.setLineDash([12, 10]);
    ctx.lineWidth = 2;
    ctx.strokeRect(jcardX - 15, jcardY - 15, jcardW + 30, jcardH + 30);
    ctx.setLineDash([]);

    // 3. Panel Dimensions (Flap: 220px, Spine: 280px, Front Cover: 580px, Tracklist: 710px)
    const flapW = 220;
    const spineW = 280;
    const coverW = 580;

    // Dashed Fold Lines
    ctx.strokeStyle = '#c8b69e';
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 2;

    // Flap fold
    ctx.beginPath();
    ctx.moveTo(jcardX + flapW, jcardY);
    ctx.lineTo(jcardX + flapW, jcardY + jcardH);
    ctx.stroke();

    // Spine fold
    ctx.beginPath();
    ctx.moveTo(jcardX + flapW + spineW, jcardY);
    ctx.lineTo(jcardX + flapW + spineW, jcardY + jcardH);
    ctx.stroke();

    // Cover fold
    ctx.beginPath();
    ctx.moveTo(jcardX + flapW + spineW + coverW, jcardY);
    ctx.lineTo(jcardX + flapW + spineW + coverW, jcardY + jcardH);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- PANEL 1: BACK FLAP (20mm) ---
    ctx.fillStyle = '#f7f1e5';
    ctx.fillRect(jcardX + 10, jcardY + 10, flapW - 20, jcardH - 20);
    ctx.save();
    ctx.translate(jcardX + flapW / 2, jcardY + jcardH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#c96f4a';
    ctx.font = 'bold 20px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ OFFICIAL DATE MIXTAPE ✦', 0, -25);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#6d5a4e';
    ctx.fillText('STANDARD CASSETTE CASE 1:1 INSERT', 0, 5);
    ctx.fillText('✂️ CUT ALONG DASHED LINES & FOLD CREASES', 0, 35);
    ctx.restore();

    // --- PANEL 2: SPINE (12mm) ---
    const spineX = jcardX + flapW;
    ctx.save();
    ctx.translate(spineX + spineW / 2, jcardY + jcardH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#2d221c';
    ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${APP_CONFIG.websiteTitle.toUpperCase()} · VOL. 01`, 0, -30);
    ctx.font = '22px "Special Elite", monospace';
    ctx.fillStyle = '#c96f4a';
    ctx.fillText(`${APP_CONFIG.boyfriendInitial} ♥ ${APP_CONFIG.girlfriendInitial} · MASTER RECORDING`, 0, 10);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#8a7568';
    ctx.fillText(`#DATE-2026-001 [BARCODE]`, 0, 45);
    ctx.restore();

    // --- PANEL 3: FRONT COVER (65mm) ---
    const coverX = spineX + spineW;
    ctx.fillStyle = '#fcf6ec';
    ctx.fillRect(coverX + 15, jcardY + 15, coverW - 30, jcardH - 30);
    ctx.strokeStyle = '#e2d6c3';
    ctx.strokeRect(coverX + 15, jcardY + 15, coverW - 30, jcardH - 30);

    ctx.fillStyle = '#c96f4a';
    ctx.font = 'bold 20px "Special Elite", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✦ THE DATE MIXTAPE ✦', coverX + coverW / 2, jcardY + 90);

    ctx.fillStyle = '#2d221c';
    ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
    ctx.fillText(`For ${APP_CONFIG.girlfriendName}`, coverX + coverW / 2, jcardY + 165);

    ctx.font = 'italic 24px "Caveat", cursive';
    ctx.fillStyle = '#6d5a4e';
    ctx.fillText(APP_CONFIG.coverInscription, coverX + coverW / 2, jcardY + 220);

    // Cassette Spools Vector Artwork on Cover
    ctx.strokeStyle = '#c96f4a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(coverX + coverW / 2 - 90, jcardY + 380, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(coverX + coverW / 2 + 90, jcardY + 380, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#2d221c';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('SIDE A · STEREO HIGH OUTPUT', coverX + coverW / 2, jcardY + 500);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#8a7568';
    ctx.fillText(APP_CONFIG.dateRangeText, coverX + coverW / 2, jcardY + 540);

    // If live doodle is saved, draw it on the front cover!
    const savedDoodle = localStorage.getItem('mixtape_doodle');
    if (savedDoodle) {
      const doodleImg = new Image();
      doodleImg.onload = () => {
        ctx.drawImage(doodleImg, coverX + coverW / 2 - 160, jcardY + 620, 320, 100);
      };
      doodleImg.src = savedDoodle;
    }

    // --- PANEL 4: TRACKLIST & LINER NOTES (68mm) ---
    const trackX = coverX + coverW + 35;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c96f4a';
    ctx.font = 'bold 24px "Special Elite", monospace';
    ctx.fillText('SIDE A: OFFICIAL DATE SETLIST', trackX, jcardY + 90);

    const items = [
      `01. The When: ${selection.dayDate}`,
      `02. The Set: ${selection.timeSlot} ${selection.customTime ? `(${selection.customTime})` : ''}`,
      `03. The Scene: ${selection.location} ${selection.customLocation ? `(${selection.customLocation})` : ''}`,
      `04. The Vibe: ${selection.activities.join(', ')}`,
      `05. The Sip: ${selection.drink} ${selection.customDrink ? `(${selection.customDrink})` : ''}`,
      `06. Bonus Greeting: ${selection.greetings.join(', ')}`
    ];

    ctx.font = '21px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#2d221c';
    items.forEach((txt, idx) => {
      ctx.fillText(txt, trackX, jcardY + 160 + idx * 55);
    });

    if (selection.customNotes) {
      ctx.font = 'italic 24px "Caveat", cursive';
      ctx.fillStyle = '#c96f4a';
      ctx.fillText(`Liner Note: "${selection.customNotes}"`, trackX, jcardY + 560);
    }

    ctx.font = '16px monospace';
    ctx.fillStyle = '#8a7568';
    ctx.fillText(`Recorded with love · ${APP_CONFIG.boyfriendName} & ${APP_CONFIG.girlfriendName}`, trackX, jcardY + 950);

    // Export & Download PNG
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `1-to-1-date-mixtape-jcard-${APP_CONFIG.girlfriendName.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setCardDownloaded(true);
    }, 100);
  };

  const handleWhatsAppShare = () => {
    sound.playChime();
    const formattedText = `🎧 *THE DATE MIXTAPE · SIDE A* 🎧\n\n` +
      `📅 *Date:* ${selection.dayDate}\n` +
      `⏰ *Time:* ${selection.timeSlot}\n` +
      `📍 *Location:* ${selection.location}\n` +
      `🎸 *Activities:* ${selection.activities.join(', ')}\n` +
      `☕ *Drink:* ${selection.drink}\n` +
      `💫 *Greeting:* ${selection.greetings.join(', ')}\n` +
      (selection.customNotes ? `\n✍️ *Liner Note:* "${selection.customNotes}"\n` : '') +
      `\n❤️ Pressed with love for you!`;

    const url = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto w-full px-3 pb-16 text-center select-none"
    >
      <div className="walkman-faceplate p-4 sm:p-7 rounded-3xl relative overflow-hidden mb-6">
        <div className="screw-fastener absolute left-3 top-3" />
        <div className="screw-fastener absolute right-3 top-3" />
        <div className="screw-fastener absolute left-3 bottom-3" />
        <div className="screw-fastener absolute right-3 bottom-3" />

        <div className="flex items-center justify-between border-b border-[#44382f] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-400 uppercase font-bold">
              ● MASTER TAPE RECORDED & LOCKED
            </span>
          </div>
          <div className="font-mono text-xs text-[#d4af37] bg-[#1a1410] px-2.5 py-0.5 rounded border border-[#5a483a]">
            REC TIME: {formatTimer(recordedSeconds)}
          </div>
        </div>

        {/* 3-Panel Unfolded J-Card Presentation */}
        <div className="mixtape-card p-4 sm:p-6 rounded-2xl relative text-left mb-6">
          <div className="tape-strip -top-2 left-8 w-24" />
          <div className="tape-strip tape-strip-reverse -top-2 right-8 w-24" />

          <div className="text-center pb-4 border-b border-[#decbb2]/80 mb-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#c96f4a] uppercase font-bold">
              ✦ OFFICIAL DATE J-CARD SLEEVE ✦
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#2d221c] mt-1">
              Recorded for {APP_CONFIG.girlfriendName} ❤️
            </h1>
            <p className="font-handwriting text-lg text-[#6d5a4e] mt-1">
              "The best tracks are the ones we live together"
            </p>
          </div>

          {/* 3 Panel Visual Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Panel 1: Spine */}
            <div className="bg-[#f7f1e5] p-3.5 rounded-xl border border-[#decbb2] flex flex-col justify-between text-center">
              <div>
                <span className="text-[9px] font-mono text-[#8a7568] tracking-widest uppercase">
                  SPINE · VOL 1
                </span>
                <div className="font-serif font-bold text-sm text-[#2d221c] mt-1">
                  THE DATE MIXTAPE
                </div>
              </div>
              <div className="my-3 font-mono text-xs text-[#c96f4a] font-bold">
                {APP_CONFIG.boyfriendInitial} ♥ {APP_CONFIG.girlfriendInitial}
              </div>
              <span className="text-[8px] font-mono text-[#8a7568]">
                #DATE-2026-001
              </span>
            </div>

            {/* Panel 2: Front Cover Artwork */}
            <div className="bg-[#fcf6ec] p-3.5 rounded-xl border border-[#decbb2] text-center flex flex-col justify-between">
              <span className="text-[9px] font-mono text-[#c96f4a] tracking-widest">
                FRONT COVER
              </span>
              <div className="my-2">
                <div className="font-display text-lg text-[#2d221c]">
                  Side A
                </div>
                <div className="font-serif text-xs text-[#6d5a4e]">
                  {APP_CONFIG.dateRangeText}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2b221b] border border-[#d4af37] mx-auto flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d85848]" />
              </div>
            </div>

            {/* Panel 3: Tracklist */}
            <div className="bg-[#f7f1e5] p-3.5 rounded-xl border border-[#decbb2] text-xs flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#c96f4a] tracking-widest uppercase font-bold">
                  TRACKLIST
                </span>
                <div className="space-y-1 mt-1 text-[11px] font-serif text-[#2d221c]">
                  <div>📅 {selection.dayDate}</div>
                  <div>⏰ {selection.timeSlot}</div>
                  <div>📍 {selection.location}</div>
                  <div>☕ {selection.drink}</div>
                </div>
              </div>
              <span className="text-[8px] font-mono text-[#8a7568] mt-2">
                MASTER CONFIRMED
              </span>
            </div>
          </div>

          {/* Liner Note Highlight */}
          {selection.customNotes && (
            <div className="mt-4 p-3 bg-[#fcf6ec] rounded-xl border border-[#decbb2] text-center font-handwriting text-lg text-[#c96f4a]">
              "{selection.customNotes}"
            </div>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownloadKeepsake}
            className="btn-transport-primary p-3 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>📥</span>
            <span>{cardDownloaded ? 'DOWNLOADED AGAIN ✦' : 'DOWNLOAD 1:1 CASSETTE J-CARD'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playChime();
              setShowLetter(true);
            }}
            className="btn-transport p-3 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💌</span>
            <span>OPEN SECRET LINER NOTE</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="btn-transport p-3 rounded-xl font-mono text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer text-emerald-400"
          >
            <span>💬</span>
            <span>SHARE SETLIST ON WHATSAPP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playButtonClunk();
              onReset();
            }}
            className="btn-transport p-3 rounded-xl font-mono text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer text-[#a89888]"
          >
            <span>🔄</span>
            <span>PRESS RECORD AGAIN</span>
          </button>
        </div>
      </div>

      {showLetter && (
        <MixtapeLetter onClose={() => setShowLetter(false)} />
      )}
    </motion.div>
  );
};