import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DateMenuSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Download, MessageCircle, Mail, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { ChefLetterModal } from './ChefLetterModal';
import { TablePlacardModal } from './TablePlacardModal';
import { LoveCouponsModal } from './LoveCouponsModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';

interface TicketStubModalProps {
  isOpen: boolean;
  selection: DateMenuSelection;
  onReset: () => void;
}

export const TicketStubModal: React.FC<TicketStubModalProps> = ({
  isOpen,
  selection,
  onReset
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showPlacard, setShowPlacard] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showCapsule, setShowCapsule] = useState(false);

  useEffect(() => {
    if (isOpen) {
      menuSound.playTearAndStamp();

      // Warm confetti shower
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#E8635A', '#F4A45C', '#4A7A6D', '#D8B29A', '#FFF8EC', '#D4AF37'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedSidesLabels = selection.sides
    .map((sideId) => APP_CONFIG.sides.find((s) => s.id === sideId)?.label || sideId)
    .join(', ');

  const fullActivity = selection.customActivity
    ? `${selection.activityTitle} ("${selection.customActivity}")`
    : selection.activityTitle;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      setDownloading(true);
      menuSound.playStampClick();

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: '#FFF8EC',
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_${APP_CONFIG.boyfriendName}_Date_Menu_Ticket.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      menuSound.playTearAndStamp();
      setDownloaded(true);
    } catch (err) {
      console.error('Ticket download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const whatsappMessage = `Hey ${APP_CONFIG.boyfriendName}! 📋 I just placed my Date Menu order for Table N° 07!\n\n✨ Vibe: ${selection.mood}\n🍽️ Main: ${fullActivity}\n🍟 Sides: ${selectedSidesLabels || 'All of them!'}\n📅 Date: ${selection.dayDate} (${fullTime})\n💬 Notes: "${selection.cravingsAndNotes || "Can't wait! ❤️"}"\n\nSee you at our table! 🥂`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B1B17]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        className="max-w-lg w-full my-auto flex flex-col items-center"
      >
        {/* Top Celebration Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4A7A6D] text-white rounded-full font-mono font-bold text-xs shadow-md mb-4 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A45C]" />
          <span>Order Redeemed · Pass Confirmed</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F4A45C]" />
        </div>

        {/* 🎫 Physical Perforated Ticket Stub Card */}
        <div
          ref={ticketRef}
          className="w-full bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-ticket text-left relative overflow-hidden font-mono text-xs text-[var(--text-primary)] mb-5"
        >
          {/* Top Scalloped Perforation Line */}
          <div className="absolute top-0 left-0 right-0 h-4 flex items-center justify-between px-2">
            <div className="w-3 h-3 rounded-full bg-[var(--bg-page)] -mt-3 shadow-inner" />
            <div className="flex-1 border-t border-dashed border-[var(--border-dashed)] mx-2" />
            <div className="w-3 h-3 rounded-full bg-[var(--bg-page)] -mt-3 shadow-inner" />
          </div>

          {/* Rubber Ink Stamp (Signature Moment Overlay) */}
          <div className="absolute top-8 right-4 z-20 pointer-events-none">
            <div className="rubber-stamp px-3 py-1.5 rounded-xl text-center shadow-xs animate-stamp-in">
              <div className="text-base font-bold tracking-widest font-mono">
                ORDER CONFIRMED
              </div>
              <div className="text-[9px] font-sans font-extrabold uppercase tracking-wider text-[#4A7A6D]">
                TABLE N° 07 · 100% LOVE
              </div>
            </div>
          </div>

          {/* Ticket Header */}
          <div className="border-b-2 border-dashed border-[var(--border-dashed)] pb-4 mb-4 pt-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              <span>✦ OFFICIAL DATE TICKET ✦</span>
              <span>ORDER N° 0721</span>
            </div>
            <h2 className="font-serif font-bold text-2xl text-[var(--text-primary)]">
              {APP_CONFIG.menuTitle}
            </h2>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              GUESTS: <strong className="text-[var(--text-primary)]">{APP_CONFIG.girlfriendName}</strong> & <strong className="text-[var(--text-primary)]">{APP_CONFIG.boyfriendName}</strong>
            </div>
          </div>

          {/* Order Details Body */}
          <div className="space-y-3 pb-4 border-b-2 border-dashed border-[var(--border-dashed)] text-xs">
            <div>
              <span className="font-bold block font-mono text-[10px] uppercase text-[#E8635A]">
                [I] STARTER VIBE:
              </span>
              <span className="font-sans font-semibold text-sm text-[var(--text-primary)]">{selection.mood}</span>
            </div>

            <div>
              <span className="font-bold block font-mono text-[10px] uppercase text-[#E8635A]">
                [II] MAIN ADVENTURE:
              </span>
              <span className="font-sans font-semibold text-sm text-[var(--text-primary)]">{fullActivity}</span>
            </div>

            {selectedSidesLabels && (
              <div>
                <span className="font-bold block font-mono text-[10px] uppercase text-[#E8635A]">
                  [III] COMPLIMENTARY SIDES:
                </span>
                <span className="font-sans text-xs text-[var(--text-primary)] leading-relaxed">
                  {selectedSidesLabels}
                </span>
              </div>
            )}

            <div>
              <span className="font-bold block font-mono text-[10px] uppercase text-[#E8635A]">
                [IV] RESERVATION SCHEDULE:
              </span>
              <span className="font-sans font-bold text-sm text-[var(--text-primary)]">
                📅 {selection.dayDate} · ⏰ {fullTime}
              </span>
            </div>

            {selection.cravingsAndNotes && (
              <div>
                <span className="font-bold block font-mono text-[10px] uppercase text-[#E8635A]">
                  [V] SPECIAL CRAVINGS:
                </span>
                <span className="font-sans italic text-xs text-[var(--text-secondary)]">
                  “{selection.cravingsAndNotes}”
                </span>
              </div>
            )}
          </div>

          {/* Barcode & Total */}
          <div className="pt-3 flex items-center justify-between font-mono">
            <div>
              <div className="font-bold text-xs text-[#4A7A6D]">TOTAL: PAID IN FULL</div>
              <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">
                NO EXPIRATION · REDEEM TOGETHER
              </div>
            </div>
            {/* Vintage Stylized Barcode */}
            <div className="flex gap-0.5 items-end h-8">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((w, i) => (
                <span
                  key={i}
                  className="bg-[var(--text-primary)]"
                  style={{ width: `${w}px`, height: `${16 + (i % 4) * 4}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {/* WhatsApp Share Button */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => menuSound.playStampClick()}
            className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-serif font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Date Order to {APP_CONFIG.boyfriendName} on WhatsApp 💬</span>
          </motion.a>

          {/* Download Keepsake Ticket */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="w-full py-3.5 px-5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-sm rounded-2xl shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#F4A45C]" />
                <span>Ticket Saved to Downloads! 🎟️</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Printing Ticket...' : 'Download Date Ticket Stub (.PNG) 🧾'}</span>
              </>
            )}
          </motion.button>

          {/* Open Secret Chef Letter */}
          <button
            type="button"
            onClick={() => {
              menuSound.playStampClick();
              setShowLetter(true);
            }}
            className="w-full py-3 bg-[#FFFCF5] hover:bg-[#FDF2E7] border border-[#D8B29A] text-[#2B1B17] font-serif font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Mail className="w-4 h-4 text-[#E8635A]" />
            <span>Read Chef's Secret Note 💌</span>
          </button>

          {/* Printable Table Tent Placard Button */}
          <button
            type="button"
            onClick={() => {
              menuSound.playStampClick();
              setShowPlacard(true);
            }}
            className="w-full py-3 bg-[#FDF2E7] hover:bg-[#FCEAD8] border border-[#E8635A]/50 text-[#E8635A] font-serif font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>🪧</span>
            <span>Printable Table Tent Placard (.PNG)</span>
          </button>

          {/* 🎟️ Tearable Golden Love Coupons Button */}
          <button
            type="button"
            onClick={() => {
              menuSound.playStampClick();
              setShowCoupons(true);
            }}
            className="w-full py-3 bg-[#FFFCF5] hover:bg-[#FDF2E7] border border-[#D8B29A] text-[#2B1B17] font-serif font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>🎟️</span>
            <span>Tearable Golden Love Coupons Pack</span>
          </button>

          {/* 🔒 Sealed Time Capsule Button */}
          <button
            type="button"
            onClick={() => {
              menuSound.playStampClick();
              setShowCapsule(true);
            }}
            className="w-full py-3 bg-[#FFFCF5] hover:bg-[#FDF2E7] border border-[#D8B29A] text-[#2B1B17] font-serif font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>🔒</span>
            <span>Seal Secret Date Night Time Capsule</span>
          </button>

          {/* Start Over / Reset */}
          <button
            type="button"
            onClick={() => {
              menuSound.playPenTick();
              onReset();
            }}
            className="py-2 text-[#70584E] hover:text-[#2B1B17] font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Order a different adventure</span>
          </button>
        </div>
      </motion.div>

      {/* Secret Chef Letter Modal */}
      <ChefLetterModal
        isOpen={showLetter}
        onClose={() => setShowLetter(false)}
      />

      {/* Printable Table Placard Modal */}
      <TablePlacardModal
        isOpen={showPlacard}
        onClose={() => setShowPlacard(false)}
        selection={selection}
      />

      {/* Tearable Golden Love Coupons Modal */}
      <LoveCouponsModal
        isOpen={showCoupons}
        onClose={() => setShowCoupons(false)}
      />

      {/* Sealed Time Capsule Modal */}
      <TimeCapsuleModal
        isOpen={showCapsule}
        onClose={() => setShowCapsule(false)}
        dateStr={selection.dayDate}
      />
    </div>
  );
};
