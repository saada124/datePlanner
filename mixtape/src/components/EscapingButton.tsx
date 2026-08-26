import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '../config/appConfig';
import { sound } from '../utils/soundEffects';

interface EscapingButtonProps {
  onAttempt?: (count: number) => void;
}

interface TeleportParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  symbol: string;
  rotation: number;
}

const TAPE_SYMBOLS = ['🎧', '💿', '✨', '♪', '📼', '♥', '🎵', '💫', '⚡', '⏪'];

export const EscapingButton: React.FC<EscapingButtonProps> = ({ onAttempt }) => {
  const [isTeleported, setIsTeleported] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [particles, setParticles] = useState<TeleportParticle[]>([]);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const isCooldownRef = useRef<boolean>(false);

  const taunts = APP_CONFIG.escapingButtonTaunts;
  const currentText = attemptCount === 0 ? 'Maybe not 🙈' : taunts[(attemptCount - 1) % taunts.length];

  const teleportAcrossPage = useCallback((cursorX?: number, cursorY?: number) => {
    if (isCooldownRef.current) return;
    isCooldownRef.current = true;

    sound.playButtonClunk();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([20, 40]);
    }

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Spawn burst of particles at the disappearance spot
      const newParticles: TeleportParticle[] = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        size: 16 + Math.random() * 14,
        symbol: TAPE_SYMBOLS[Math.floor(Math.random() * TAPE_SYMBOLS.length)],
        rotation: (Math.random() - 0.5) * 60
      }));

      setParticles(prev => [...prev.slice(-10), ...newParticles]);
    }

    setAttemptCount(prev => {
      const next = prev + 1;
      if (onAttempt) onAttempt(next);

      if (next >= 2) {
        const miniComments = [
          'Teleported! ⚡',
          'Fast-forwarded across the room! 💨',
          'Track skipped away! 📼',
          'Almost pressed stop! 🎧',
          'Reels jumped! 💫',
          'This button is unreachable! 🤭',
          'Only YES works here! 👉'
        ];
        setSpeechBubble(miniComments[(next - 2) % miniComments.length]);
      }
      return next;
    });

    // Calculate full-page teleport destination
    const winW = typeof window !== 'undefined' ? window.innerWidth : 800;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 600;

    const btnW = 200;
    const btnH = 50;

    const minX = 24;
    const maxX = Math.max(minX, winW - btnW - 24);
    const minY = 75; // Below header
    const maxY = Math.max(minY, winH - btnH - 60); // Above footer

    let targetX = minX + Math.random() * (maxX - minX);
    let targetY = minY + Math.random() * (maxY - minY);

    // Ensure the new spot is far from current cursor (at least 180px away)
    if (cursorX !== undefined && cursorY !== undefined) {
      for (let i = 0; i < 8; i++) {
        const dist = Math.hypot(targetX + btnW / 2 - cursorX, targetY + btnH / 2 - cursorY);
        if (dist >= 180) break;
        targetX = minX + Math.random() * (maxX - minX);
        targetY = minY + Math.random() * (maxY - minY);
      }
    }

    setIsTeleported(true);
    setPosition({ x: targetX, y: targetY });
    setRotation((Math.random() - 0.5) * 16);

    setTimeout(() => {
      isCooldownRef.current = false;
    }, 150);
  }, [onAttempt]);

  // Global mousemove proximity trigger (watches distance wherever the button teleports on the whole page)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      if (distance < 110) {
        teleportAcrossPage(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [teleportAcrossPage]);

  const handleInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if ('touches' in e && (e as React.TouchEvent).touches?.[0]) {
      const t = (e as React.TouchEvent).touches[0];
      teleportAcrossPage(t.clientX, t.clientY);
    } else if ('clientX' in e) {
      const m = e as React.MouseEvent;
      teleportAcrossPage(m.clientX, m.clientY);
    } else {
      teleportAcrossPage();
    }
  };

  return (
    <>
      {/* Floating Teleport Particles Left Behind on Disappearance */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.8, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 1.8,
              y: p.y - 45,
              x: p.x + (Math.random() - 0.5) * 50,
              rotate: p.rotation
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 flex items-center justify-center filter drop-shadow-md"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <span style={{ fontSize: `${p.size}px` }}>{p.symbol}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Placeholder in original layout when teleported to maintain spacing */}
      {!isTeleported ? (
        <div className="relative inline-block select-none z-20">
          <motion.button
            ref={buttonRef}
            type="button"
            onPointerEnter={(e) => teleportAcrossPage(e.clientX, e.clientY)}
            onPointerDown={handleInteraction}
            onTouchStart={handleInteraction}
            onClick={handleInteraction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="btn-transport px-5 py-3 rounded-xl text-xs sm:text-sm font-mono text-[#a89888] hover:text-[#ede3d8] cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
          >
            <span>⏸ {currentText}</span>
          </motion.button>
        </div>
      ) : (
        <div className="hidden sm:inline-block w-36 h-12 pointer-events-none opacity-0" />
      )}

      {/* Full-Page Teleported Floating Button */}
      {isTeleported && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            left: position.x,
            top: position.y,
            rotate: rotation
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 24,
            mass: 0.5
          }}
          className="fixed z-50 select-none"
          style={{ willChange: 'transform, left, top' }}
        >
          {/* Attached Playful Floating Speech Bubble */}
          <AnimatePresence>
            {speechBubble && attemptCount >= 2 && (
              <motion.div
                key={`bubble-${attemptCount}`}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -28, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 -top-1 whitespace-nowrap bg-[#1c1815]/95 backdrop-blur-xs text-[#d4af37] border border-[#d4af37]/60 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold shadow-xl pointer-events-none z-50"
              >
                {speechBubble}
                <div className="w-1.5 h-1.5 bg-[#1c1815] border-r border-b border-[#d4af37]/60 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            ref={buttonRef}
            type="button"
            onPointerEnter={(e) => teleportAcrossPage(e.clientX, e.clientY)}
            onPointerDown={handleInteraction}
            onTouchStart={handleInteraction}
            onClick={handleInteraction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`btn-transport px-5 py-3 rounded-xl text-xs sm:text-sm font-mono transition-all duration-150 cursor-not-allowed whitespace-nowrap flex items-center gap-1.5 shadow-2xl ${
              attemptCount >= 4
                ? 'border-[#c96f4a] text-[#c96f4a] font-bold shadow-[0_0_16px_rgba(201,111,74,0.5)]'
                : 'text-[#a89888] hover:text-[#ede3d8]'
            }`}
          >
            <span>⏸ {currentText}</span>
            {attemptCount >= 5 && (
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
      )}
    </>
  );
};