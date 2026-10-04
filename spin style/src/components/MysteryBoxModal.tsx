import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { OptionItem } from '../types';
import { sounds } from '../utils/sound';

interface MysteryBoxModalProps {
  isOpen: boolean;
  onRevealSurprise: (surpriseOption: OptionItem) => void;
}

export const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({
  isOpen,
  onRevealSurprise,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [revealedPick, setRevealedPick] = useState<{ label: string; emoji: string } | null>(null);

  if (!isOpen) return null;

  const handleUnbox = () => {
    if (isOpened) return;
    sounds.playPresentOpen();

    const pool = APP_CONFIG.mysterySurprisePool;
    const randomPick = pool[Math.floor(Math.random() * pool.length)] || pool[0];
    setRevealedPick(randomPick);
    setIsOpened(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FFD15C', '#FF4D8D', '#2EE6D6', '#B4FF3D'],
      });
    } catch {
      // Fallback
    }
  };

  const handleConfirmSurprise = () => {
    if (!revealedPick) return;
    const surpriseItem: OptionItem = {
      id: `mystery_${Date.now()}`,
      label: revealedPick.label,
      emoji: revealedPick.emoji,
      category: 'activity',
    };
    onRevealSurprise(surpriseItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carnival-bgDark/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm carnival-card p-6 border-4 border-carnival-gold text-center space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-carnival-pink/20 border border-carnival-pink/50 text-carnival-pink text-xs font-display font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MYSTERY BOX UNLOCKED</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-carnival-cream">
          {isOpened ? "🎉 Surpriiise!" : "What's in the Box?"}
        </h3>

        {/* 3D Present Box Animation */}
        {!isOpened ? (
          <div className="py-6 flex flex-col items-center">
            <button
              type="button"
              onClick={handleUnbox}
              className="text-7xl sm:text-8xl animate-bounce-short hover:scale-110 active:scale-95 transition-transform filter drop-shadow-[0_10px_20px_rgba(255,209,92,0.5)] cursor-pointer"
            >
              🎁
            </button>
            <p className="text-xs font-mono-ticket text-carnival-gold uppercase tracking-widest mt-4 animate-pulse">
              ★ TAP THE GIFT TO OPEN ★
            </p>
          </div>
        ) : (
          /* Revealed Surprise Content */
          <div className="py-3 space-y-4 animate-bounce-short">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-carnival-bgDark via-carnival-card to-carnival-bgDark border-2 border-carnival-gold shadow-marquee-glow">
              <div className="text-4xl sm:text-5xl mb-2">{revealedPick?.emoji}</div>
              <div className="text-xl sm:text-2xl font-display font-extrabold text-carnival-lime">
                {revealedPick?.label}
              </div>
            </div>

            <p className="text-xs font-display text-carnival-creamMuted">
              The mystery box has granted you this exclusive date adventure!
            </p>

            <button
              type="button"
              onClick={handleConfirmSurprise}
              className="w-full btn-arcade btn-arcade-lime py-3.5 text-lg shadow-arcade-lime flex items-center justify-center gap-2"
            >
              <span>Accept Surprise Pick</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
