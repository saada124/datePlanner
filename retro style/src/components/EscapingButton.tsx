import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface EscapingButtonProps {
  onAttempt?: (count: number) => void;
}

interface PoofParticle {
  id: number;
  x: number;
  y: number;
}

export const EscapingButton: React.FC<EscapingButtonProps> = ({ onAttempt }) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [poofs, setPoofs] = useState<PoofParticle[]>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isCooldownRef = useRef<boolean>(false);

  const taunts = APP_CONFIG.escapingButtonTaunts;
  const currentText = attemptCount === 0 ? taunts[0] : taunts[attemptCount % taunts.length];

  const triggerEscape = useCallback((cursorX?: number, cursorY?: number) => {
    if (isCooldownRef.current) return;
    isCooldownRef.current = true;

    sound.playEscape();

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const newPoof: PoofParticle = {
        id: Date.now() + Math.random(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      setPoofs(prev => [...prev.slice(-3), newPoof]);
    }

    setAttemptCount(prev => {
      const next = prev + 1;
      if (onAttempt) onAttempt(next);
      return next;
    });

    // Compute Directional Repulsion away from cursor
    let dirX = (Math.random() - 0.5) * 2;
    let dirY = (Math.random() - 0.5) * 2;

    if (btn && cursorX !== undefined && cursorY !== undefined) {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      const dx = btnX - cursorX;
      const dy = btnY - cursorY;
      const len = Math.hypot(dx, dy) || 1;
      dirX = (dx / len) + (Math.random() - 0.5) * 1.2;
      dirY = (dy / len) + (Math.random() - 0.5) * 1.2;
    }

    const jumpDist = 180 + Math.random() * 160;
    const proposedX = offset.x + dirX * jumpDist;
    const proposedY = offset.y + dirY * jumpDist;

    const maxBoundX = Math.min(window.innerWidth * 0.4, 280);
    const maxBoundY = Math.min(window.innerHeight * 0.35, 220);

    let finalX = proposedX;
    let finalY = proposedY;

    if (Math.abs(finalX) > maxBoundX) {
      finalX = finalX > 0 ? -maxBoundX * (0.5 + Math.random() * 0.4) : maxBoundX * (0.5 + Math.random() * 0.4);
    }
    if (Math.abs(finalY) > maxBoundY) {
      finalY = finalY > 0 ? -maxBoundY * (0.5 + Math.random() * 0.4) : maxBoundY * (0.5 + Math.random() * 0.4);
    }

    setOffset({ x: finalX, y: finalY });
    setRotation((Math.random() - 0.5) * 16);

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 180);
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
      {/* Poof Smoke Particles */}
      <AnimatePresence>
        {poofs.map(poof => (
          <motion.div
            key={poof.id}
            initial={{ opacity: 1, scale: 0.3 }}
            animate={{ opacity: 0, scale: 1.6, y: -25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 font-pixel text-xs text-retro-cream bg-retro-dark px-2 py-1 border-2 border-white rounded shadow-pixel-sm"
            style={{ left: poof.x, top: poof.y, transform: 'translate(-50%, -50%)' }}
          >
            POOF! 💨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* GPU Accelerated Spring-Driven Evasive Button */}
      <motion.button
        ref={buttonRef}
        type="button"
        onPointerEnter={(e) => triggerEscape(e.clientX, e.clientY)}
        onPointerDown={handleInteraction}
        onTouchStart={handleInteraction}
        onClick={handleInteraction}
        animate={{
          x: offset.x,
          y: offset.y,
          rotate: rotation,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 20,
          mass: 0.6
        }}
        style={{
          willChange: "transform",
        }}
        className="pixel-btn pixel-btn-secondary text-[10px] sm:text-xs text-gray-700 hover:text-retro-pinkDark border-gray-600 cursor-not-allowed whitespace-nowrap shadow-pixel relative z-20"
      >
        <span>{currentText}</span>
        {attemptCount > 3 && (
          <span className="ml-1 text-[8px] opacity-75">({attemptCount})</span>
        )}
      </motion.button>
    </div>
  );
};
