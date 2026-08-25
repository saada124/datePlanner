import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { watercolorAudio } from '../utils/watercolorAudio';

interface EscapingButtonProps {
  onAttempt?: (count: number) => void;
}

interface WatercolorDroplet {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  symbol: string;
  rotation: number;
}

const VIBRANT_PIGMENT_COLORS = ['#e85d75', '#3a86ff', '#fb8500', '#2a9d8f', '#8338ec', '#f7b2c0'];
const PETAL_SYMBOLS = ['🌸', '🎨', '✨', '💧', '🌷', '🦋', '🖌️'];

export const EscapingButton: React.FC<EscapingButtonProps> = ({ onAttempt }) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [droplets, setDroplets] = useState<WatercolorDroplet[]>([]);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isCooldownRef = useRef<boolean>(false);

  const taunts = APP_CONFIG.escapingButtonTaunts;
  const currentText = attemptCount === 0 ? 'Maybe not 🙈' : taunts[(attemptCount - 1) % taunts.length];

  const triggerEscape = useCallback((cursorX?: number, cursorY?: number) => {
    if (isCooldownRef.current) return;
    isCooldownRef.current = true;

    watercolorAudio.playBrushStroke(1.2);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([15, 30]);
    }

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Trigger global canvas paint splatter at escaping location
      window.dispatchEvent(
        new CustomEvent('trigger-watercolor-splash', {
          detail: {
            x: originX,
            y: originY,
            color: VIBRANT_PIGMENT_COLORS[Math.floor(Math.random() * VIBRANT_PIGMENT_COLORS.length)]
          }
        })
      );

      // Spawn 3-4 soft watercolor bloom droplets
      const newDroplets: WatercolorDroplet[] = Array.from({ length: 4 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: originX + (Math.random() - 0.5) * 50,
        y: originY + (Math.random() - 0.5) * 40,
        color: VIBRANT_PIGMENT_COLORS[Math.floor(Math.random() * VIBRANT_PIGMENT_COLORS.length)],
        size: 16 + Math.random() * 14,
        symbol: PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)],
        rotation: (Math.random() - 0.5) * 60
      }));

      setDroplets(prev => [...prev.slice(-8), ...newDroplets]);
    }

    setAttemptCount(prev => {
      const next = prev + 1;
      if (onAttempt) onAttempt(next);

      if (next >= 3) {
        const miniComments = [
          'Too slow! 💨',
          'Painting in progress 🎨',
          'Almost caught the brush! 🌸',
          'Palette slipped away! 💦',
          'Obviously is over there! 👉'
        ];
        setSpeechBubble(miniComments[(next - 3) % miniComments.length]);
      }
      return next;
    });

    // Vector Calculation: Flee directly away from the pointer
    let dirX = (Math.random() - 0.5) * 2;
    let dirY = (Math.random() - 0.5) * 2;

    if (btn && cursorX !== undefined && cursorY !== undefined) {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      const dx = btnX - cursorX;
      const dy = btnY - cursorY;
      const len = Math.hypot(dx, dy) || 1;
      dirX = (dx / len) * 1.3 + (Math.random() - 0.5) * 0.8;
      dirY = (dy / len) * 1.3 + (Math.random() - 0.5) * 0.8;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const jumpDist = (isMobile ? 80 : 150) + Math.random() * (isMobile ? 60 : 100);

    const proposedX = offset.x + dirX * jumpDist;
    const proposedY = offset.y + dirY * jumpDist;

    // Viewport Boundary Clamping
    const maxBoundX = isMobile ? Math.min(window.innerWidth * 0.32, 110) : Math.min(window.innerWidth * 0.38, 260);
    const maxBoundY = isMobile ? Math.min(window.innerHeight * 0.22, 120) : Math.min(window.innerHeight * 0.3, 180);

    let finalX = proposedX;
    let finalY = proposedY;

    if (Math.abs(finalX) > maxBoundX) {
      finalX = finalX > 0 ? -maxBoundX * (0.35 + Math.random() * 0.4) : maxBoundX * (0.35 + Math.random() * 0.4);
    }
    if (Math.abs(finalY) > maxBoundY) {
      finalY = finalY > 0 ? -maxBoundY * (0.35 + Math.random() * 0.4) : maxBoundY * (0.35 + Math.random() * 0.4);
    }

    setOffset({ x: finalX, y: finalY });
    setRotation((Math.random() - 0.5) * 20);

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 160);
  }, [offset, onAttempt]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      if (distance < 95) {
        triggerEscape(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [triggerEscape]);

  const handleInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if ('touches' in e && (e as React.TouchEvent).touches?.[0]) {
      const t = (e as React.TouchEvent).touches[0];
      triggerEscape(t.clientX, t.clientY);
    } else if ('clientX' in e) {
      const m = e as React.MouseEvent;
      triggerEscape(m.clientX, m.clientY);
    } else {
      triggerEscape();
    }
  };

  return (
    <div className="relative inline-block select-none">
      {/* Floating Watercolor Droplets & Petals */}
      <AnimatePresence>
        {droplets.map(d => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0.9, scale: 0.4, x: d.x, y: d.y }}
            animate={{
              opacity: 0,
              scale: 1.6,
              y: d.y - 38,
              x: d.x + (Math.random() - 0.5) * 45,
              rotate: d.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 flex items-center justify-center filter drop-shadow-xs"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <span style={{ fontSize: `${d.size}px` }}>{d.symbol}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* The Evasive Watercolor Button */}
      <motion.div
        animate={{
          x: offset.x,
          y: offset.y,
          rotate: rotation,
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22,
          mass: 0.55
        }}
        style={{ willChange: 'transform' }}
        className="relative z-20"
      >
        {/* Playful Floating Speech Bubble */}
        <AnimatePresence>
          {speechBubble && attemptCount >= 3 && (
            <motion.div
              key={`bubble-${attemptCount}`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -30, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 -translate-x-1/2 -top-1 whitespace-nowrap bg-white/95 backdrop-blur-xs text-storybook-roseDark border border-storybook-rose/40 px-3 py-0.5 rounded-full text-[11px] font-handwriting shadow-sm pointer-events-none z-30"
            >
              {speechBubble}
              <div className="w-1.5 h-1.5 bg-white border-r border-b border-storybook-rose/40 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={buttonRef}
          type="button"
          onPointerEnter={(e) => triggerEscape(e.clientX, e.clientY)}
          onPointerDown={handleInteraction}
          onTouchStart={handleInteraction}
          onClick={handleInteraction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={`story-btn-secondary px-6 py-3.5 text-xs sm:text-sm font-sans rounded-full transition-all border shadow-sm cursor-not-allowed whitespace-nowrap flex items-center gap-1.5 ${
            attemptCount >= 5
              ? 'bg-storybook-blush/90 border-storybook-rose/60 text-storybook-roseDark font-semibold'
              : 'bg-white/90 border-storybook-border text-storybook-inkLight hover:border-storybook-rose/40'
          }`}
        >
          <span>{currentText}</span>
          {attemptCount >= 6 && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-xs"
            >
              👉
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};
