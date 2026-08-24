import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { menuSound } from '../utils/soundEffects';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { X, Sparkles, Download, CheckCircle2 } from 'lucide-react';

interface LoveCouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveCouponsModal: React.FC<LoveCouponsModalProps> = ({ isOpen, onClose }) => {
  const couponsRef = useRef<HTMLDivElement>(null);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleTear = (id: string) => {
    if (redeemed.includes(id)) return;
    menuSound.playTearAndStamp();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(25);
    }
    setRedeemed((prev) => [...prev, id]);

    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E8635A', '#F4A45C', '#FFE8A3']
    });
  };

  const handleDownloadCoupons = async () => {
    if (!couponsRef.current) return;
    try {
      setDownloading(true);
      menuSound.playStampClick();

      const canvas = await html2canvas(couponsRef.current, {
        scale: 3,
        backgroundColor: '#FFF8EC',
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${APP_CONFIG.girlfriendName}_Golden_Love_Coupons.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      menuSound.playTearAndStamp();
      setDownloaded(true);
    } catch (err) {
      console.error('Coupons download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B1B17]/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-lg w-full my-auto bg-[var(--bg-card)] border-2 border-[var(--border-card)] rounded-3xl p-6 sm:p-8 shadow-ticket text-left relative"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-highlight)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-highlight)] text-[#E8635A] rounded-full font-mono text-[10px] font-bold uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Complimentary VIP Pack</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-[var(--text-primary)]">
              Tearable Golden Love Coupons
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Tap any coupon to tear & redeem it with {APP_CONFIG.boyfriendName}!
            </p>
          </div>

          {/* Coupons Booklet */}
          <div ref={couponsRef} className="space-y-3 mb-6">
            {APP_CONFIG.loveCoupons.map((c) => {
              const isClaimed = redeemed.includes(c.id);

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleTear(c.id)}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all relative overflow-hidden cursor-pointer ${
                    isClaimed
                      ? 'bg-[#EBF3F1]/20 border-[#4A7A6D] opacity-90'
                      : 'bg-[var(--bg-chip)] border-[var(--border-dashed)] hover:border-[#E8635A]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl shrink-0 p-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] shadow-2xs">
                        {c.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                            {c.title}
                          </h4>
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg-highlight)] text-[#E8635A] uppercase">
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-[9px] text-[var(--text-secondary)] font-bold">
                        {c.code}
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded-md ${
                          isClaimed
                            ? 'bg-[#4A7A6D] text-white'
                            : 'bg-[#E8635A] text-white'
                        }`}
                      >
                        {isClaimed ? '✓ CLAIMED' : 'TAP TO TEAR'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadCoupons}
              className="w-full py-3.5 bg-[#E8635A] hover:bg-[#D45048] text-white font-serif font-bold text-sm rounded-2xl shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#F4A45C]" />
                  <span>Coupons Booklet Saved! 🎟️</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Exporting Booklet...' : 'Download Coupon Booklet (.PNG) 🎟️'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2 text-[#70584E] hover:text-[#2B1B17] font-mono text-xs cursor-pointer text-center"
            >
              Close Booklet
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
