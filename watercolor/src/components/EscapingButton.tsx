import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

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

const PASTEL_COLORS = ['#e8a0b4', '#c9b8e8', '#9fc3b8', '#e7c782', '#f6c4c4', '#d1d5db'];
const PETAL_SYMBOLS = ['🌸', '🍃', '✨', '💧', '🎨', '🌷', '🦋'];

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

    sound.playFlutter();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([15, 30]);
    }

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Spawn 3-4 soft watercolor bloom droplets
      const newDroplets: WatercolorDroplet[] = Array.from({ length: 3 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        size: 14 + Math.random() * 12,
        symbol: PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)],
        rotation: (Math.random() - 0.5) * 60
      }));

      setDroplets(prev => [...prev.slice(-6), ...newDroplets]);
    }

    setAttemptCount(prev => {
      const next = prev + 1;
      if (onAttempt) onAttempt(next);

      if (next >= 4) {
        const miniComments = [
          'Too slow! 💨',
          'Painting in progress 🎨',
          'Almost! 🌸',
          'Destiny says no! ✨',
          'Obviously is over there! 👉'
        ];
        setSpeechBubble(miniComments[(next - 4) % miniComments.length]);
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
              scale: 1.5,
              y: d.y - 35,
              x: d.x + (Math.random() - 0.5) * 40,
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
          stiffness: 300,
          damping: 20,
          mass: 0.55
        }}
        style={{ willChange: 'transform' }}
        className="relative z-20"
      >
        {/* Playful Floating Speech Bubble */}
        <AnimatePresence>
          {speechBubble && attemptCount >= 4 && (
            <motion.div
              key={`bubble-${attemptCount}`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="absolute left-1/2 -translate-x-1/2 -top-1 whitespace-nowrap bg-storybook-card/95 backdrop-blur-xs text-storybook-roseDark border border-storybook-rose/40 px-2.5 py-0.5 rounded-full text-[11px] font-handwriting shadow-sm pointer-events-none z-30"
            >
              {speechBubble}
              <div className="w-1.5 h-1.5 bg-storybook-card border-r border-b border-storybook-rose/40 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
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
          className={`story-btn-secondary px-6 py-3.5 text-xs sm:text-sm font-serif-body rounded-full transition-all border shadow-sm cursor-not-allowed whitespace-nowrap flex items-center gap-1.5 ${
            attemptCount >= 6
              ? 'bg-storybook-blush/80 border-storybook-rose/50 text-storybook-roseDark'
              : 'bg-white/80 border-storybook-border text-storybook-inkLight hover:border-storybook-rose/40'
          }`}
        >
          <span>{currentText}</span>
          {attemptCount >= 7 && (
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
