import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Sparkles, Heart, Check, RotateCcw, Calendar, MailOpen } from 'lucide-react';
import { DatePlannerState } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { ScratchCard } from './ScratchCard';
import { TicketPhotoSlot } from './TicketPhotoSlot';
import { LoveLetterModal } from './LoveLetterModal';
import { sounds } from '../utils/sound';

interface VipTicketModalProps {
  isOpen: boolean;
  state: DatePlannerState;
  onResetAll: () => void;
  onClose: () => void;
  onPhotoChange: (url: string | null) => void;
}

export const VipTicketModal: React.FC<VipTicketModalProps> = ({
  isOpen,
  state,
  onResetAll,
  onClose,
  onPhotoChange,
}) => {
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isLoveLetterOpen, setIsLoveLetterOpen] = useState(false);

  if (!isOpen) return null;

  const girlfriendName = state.girlfriendName.trim() || APP_CONFIG.girlfriendName;
  const vibe = state.slotWinners.vibe;
  const activity = state.slotWinners.activity || state.finalPick;
  const dressCode = state.slotWinners.dressCode;
  const timeSlot = state.selectedTimeSlot || APP_CONFIG.timeSlots[0];
  const ticketNumber = state.ticketNumber || `VIP-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = state.timestamp || new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const bonusPerk = state.mysteryBonusPerk || APP_CONFIG.scratchBonusPerks[0];

  const handleDownloadImage = async () => {
    if (!ticketRef.current || isDownloading) return;
    setIsDownloading(true);
    sounds.playPop(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFDF7',
        logging: false,
      });

      const cleanName = girlfriendName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Girlfriend';
      const fileName = `VIP_Date_Ticket_${cleanName}.png`;

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 1500);
        }, 'image/png');
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      sounds.playWinFanfare();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export ticket image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carnival-bgDark/90 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div className="w-full max-w-md my-auto py-6 animate-ticket-drop">
          
          {/* Printable / Downloadable VIP Ticket */}
          <div
            ref={ticketRef}
            className="ticket-wrapper p-5 sm:p-7 relative border-4 border-carnival-gold shadow-ticket"
            style={{
              background: 'linear-gradient(145deg, #FFFDF7 0%, #FFF9EB 100%)',
            }}
          >
            {/* Top Carnival Header Banner */}
            <div className="text-center pb-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-carnival-bg text-carnival-gold text-xs font-mono-ticket font-bold uppercase tracking-widest mb-1.5 border border-carnival-gold/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL VIP ADMISSION</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-carnival-bg uppercase tracking-tight">
                {APP_CONFIG.ticketHeader}
              </h2>
              <p className="text-[11px] font-mono-ticket text-carnival-cardLight uppercase tracking-wider mt-0.5">
                TICKET Nº {ticketNumber} · ISSUED {dateStr}
              </p>
            </div>

            {/* Perforated Tear Line */}
            <div className="ticket-tear-line my-3" />

            {/* Ticket Body Content */}
            <div className="space-y-3.5 text-center relative py-1">
              
              {/* Guest & Time Row */}
              <div className="text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-ticket text-gray-500 uppercase block">
                    SPECIAL GUEST:
                  </span>
                  <span className="text-xl sm:text-2xl font-display font-bold text-carnival-bg flex items-center gap-1.5">
                    <Heart className="w-5 h-5 text-carnival-pink fill-carnival-pink" />
                    {girlfriendName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono-ticket text-gray-500 uppercase block">
                    WHEN:
                  </span>
                  <span className="text-xs font-display font-bold text-carnival-tealDark flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-carnival-tealDark" />
                    {timeSlot.label} ({timeSlot.time})
                  </span>
                </div>
              </div>

              {/* Feature 2: Couple Pinned Photo Slot */}
              <TicketPhotoSlot
                photoUrl={state.uploadedPhotoUrl}
                onPhotoChange={onPhotoChange}
              />

              {/* Complete 3-Reel Date Master Plan */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-carnival-bgDark via-carnival-card to-carnival-bgDark text-carnival-cream border-2 border-carnival-gold/60 shadow-lg text-center my-2 space-y-2">
                <span className="text-[10px] font-mono-ticket text-carnival-gold uppercase tracking-widest block">
                  ★ THE WINNING DATE COMBO ★
                </span>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                  {/* Vibe */}
                  <div className="text-center p-1 rounded-xl bg-white/5">
                    <span className="text-2xl block">{vibe?.emoji || '✨'}</span>
                    <span className="text-[10px] font-mono-ticket text-carnival-pink uppercase block">VIBE</span>
                    <span className="text-xs font-display font-bold text-carnival-cream block truncate">{vibe?.label || 'Cozy'}</span>
                  </div>

                  {/* Activity */}
                  <div className="text-center p-1 rounded-xl bg-white/5">
                    <span className="text-2xl block">{activity?.emoji || '🍝'}</span>
                    <span className="text-[10px] font-mono-ticket text-carnival-teal uppercase block">ACTIVITY</span>
                    <span className="text-xs font-display font-bold text-carnival-lime block truncate">{activity?.label || 'Dinner'}</span>
                  </div>

                  {/* Dress Code */}
                  <div className="text-center p-1 rounded-xl bg-white/5">
                    <span className="text-2xl block">{dressCode?.emoji || '👗'}</span>
                    <span className="text-[10px] font-mono-ticket text-carnival-yellow uppercase block">OUTFIT</span>
                    <span className="text-xs font-display font-bold text-carnival-cream block truncate">{dressCode?.label || 'Cozy'}</span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Scratch-Off Carnival Bonus Perk */}
              <ScratchCard bonusPerk={bonusPerk} />

              {/* Feature 3: Wax-Sealed Secret Love Letter Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop(true);
                    setIsLoveLetterOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 text-xs font-mono-ticket font-bold transition-all shadow-sm hover:scale-105"
                >
                  <MailOpen className="w-4 h-4 text-red-600" />
                  <span>Open Secret Wax-Sealed Letter 💌</span>
                </button>
              </div>

              {/* Cute Expiration Guarantee */}
              <p className="text-xs font-display font-semibold text-gray-600 pt-1">
                {APP_CONFIG.ticketFooter}
              </p>

              {/* Confirmed Stamp Graphic */}
              <div className="absolute right-2 bottom-6 pointer-events-none transform rotate-[-12deg] opacity-90 animate-stamp-slam">
                <div className="px-3.5 py-1 border-4 border-dashed border-red-600 rounded-2xl text-red-600 font-mono-ticket font-extrabold text-xs sm:text-sm tracking-widest uppercase bg-white/80 backdrop-blur-[2px] shadow-sm">
                  {APP_CONFIG.ticketStampText}
                </div>
              </div>
            </div>

            {/* Bottom Barcode Motif */}
            <div className="mt-4 pt-2.5 border-t border-gray-200 flex flex-col items-center gap-1">
              <div className="flex gap-1 h-5 items-center opacity-70">
                {[4, 2, 6, 1, 8, 3, 5, 2, 7, 4, 1, 5, 3, 8, 2, 6, 4, 2, 9, 3, 5, 2, 7].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full rounded-sm"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono-ticket text-gray-500 tracking-widest">
                ★ 100% RESERVED WITH LOVE ★
              </span>
            </div>
          </div>

          {/* Action Buttons Below Ticket */}
          <div className="mt-5 flex flex-col gap-2.5">
            {/* Download VIP Ticket Button */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="w-full btn-arcade btn-arcade-lime py-3.5 text-lg shadow-arcade-lime flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Generating Ticket Image...
                </span>
              ) : downloadSuccess ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" /> Ticket Downloaded!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" /> Download VIP Ticket 🎟️
                </span>
              )}
            </button>

            {/* Secondary Reset / Re-Spin Options */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sounds.playArcadePress();
                  onClose();
                }}
                className="flex-1 btn-arcade btn-arcade-secondary py-2.5 text-sm"
              >
                <span>View Slot Machine</span>
              </button>

              <button
                onClick={() => {
                  sounds.playArcadePress();
                  onResetAll();
                }}
                className="flex-1 btn-arcade btn-arcade-secondary py-2.5 text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-1.5 inline text-carnival-teal" />
                <span>Plan Another ↺</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Wax-Sealed Love Letter Modal */}
      <LoveLetterModal
        isOpen={isLoveLetterOpen}
        onClose={() => setIsLoveLetterOpen(false)}
      />
    </>
  );
};
