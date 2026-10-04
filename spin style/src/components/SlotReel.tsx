import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { OptionItem } from '../types';
import { sounds } from '../utils/sound';

interface SlotReelProps {
  reelIndex: number;
  title: string;
  emoji: string;
  accentColor: string;
  items: OptionItem[];
  isSpinning: boolean;
  spinDurationMs: number;
  targetWinner: OptionItem | null;
  onReelStopped: (winner: OptionItem) => void;
  isLocked: boolean;
  onToggleLock: () => void;
  onNudge: (direction: 'up' | 'down') => void;
  canUseTokens: boolean;
}

export const SlotReel: React.FC<SlotReelProps> = ({
  reelIndex,
  title,
  emoji,
  accentColor,
  items,
  isSpinning,
  spinDurationMs,
  targetWinner,
  onReelStopped,
  isLocked,
  onToggleLock,
  onNudge,
  canUseTokens,
}) => {
  const safeItems = useMemo(() => {
    return items.length > 0 ? items : [{ id: 'none', label: 'Surprise', emoji: '✨', category: 'vibe' as const }];
  }, [items]);

  const ITEM_HEIGHT = 74; // Height of each slot item in px
  const REPEAT_COUNT = 16; // Extended strip for continuous drum rotation

  // Pre-build extended filmstrip of items
  const strip = useMemo(() => {
    const list: { item: OptionItem; key: string }[] = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      safeItems.forEach((it, idx) => {
        list.push({ item: it, key: `${r}-${idx}-${it.id}` });
      });
    }
    return list;
  }, [safeItems]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [justLockedIn, setJustLockedIn] = useState(false);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const currentPosIndexRef = useRef(3 * safeItems.length + 0);
  const selectedIdxRef = useRef(0);
  const tickTimerRef = useRef<number | null>(null);

  selectedIdxRef.current = selectedIdx;

  // Initialize initial drum position
  useEffect(() => {
    const initialIndex = 3 * safeItems.length + selectedIdx;
    currentPosIndexRef.current = initialIndex;
    if (stripRef.current) {
      stripRef.current.style.transition = 'none';
      stripRef.current.style.transform = `translate3d(0, -${initialIndex * ITEM_HEIGHT}px, 0)`;
    }
  }, [safeItems.length, selectedIdx]);

  // High-Realism Physics Spin Sequence
  useEffect(() => {
    if (!isSpinning) return;

    if (isLocked) {
      // Held reel stays fixed in place
      onReelStopped(safeItems[selectedIdxRef.current] || safeItems[0]);
      return;
    }

    setIsRolling(true);
    setJustLockedIn(false);

    // 1. Pick target winner item
    let winnerIndex = Math.floor(Math.random() * safeItems.length);
    if (targetWinner) {
      const match = safeItems.findIndex((it) => it.id === targetWinner.id);
      if (match >= 0) winnerIndex = match;
    }

    // 2. Calculate target position (8-12 full drum rotations ahead)
    const baseRotations = 7 + reelIndex * 2;
    const targetStripIndex = baseRotations * safeItems.length + winnerIndex;
    const targetY = targetStripIndex * ITEM_HEIGHT;

    // 3. Cadence-synced mechanical ticking audio during spin
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);
    const spinStartTime = performance.now();
    
    // Ticker loop with natural deceleration frequency
    const runTicker = () => {
      const elapsed = performance.now() - spinStartTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);
      
      if (progress < 1) {
        // Higher pitch & frequency early on, slowing cadence near the end
        const pitch = 1.2 - progress * 0.5;
        sounds.playTick(pitch);

        // Schedule next tick (starts at 55ms interval, decelerates up to 300ms)
        const nextInterval = progress < 0.65 ? 65 : 65 + Math.pow((progress - 0.65) / 0.35, 3) * 350;
        tickTimerRef.current = window.setTimeout(runTicker, nextInterval);
      }
    };
    runTicker();

    // 4. Multi-Stage Physical Drum Roll:
    // Step A: Anticipation jerk (the clutch releases, drum jerks upward -8px for 90ms)
    if (stripRef.current) {
      const startY = currentPosIndexRef.current * ITEM_HEIGHT;
      stripRef.current.style.transition = 'transform 90ms cubic-bezier(0.4, 0, 1, 1)';
      stripRef.current.style.transform = `translate3d(0, -${startY - 8}px, 0)`;
    }

    // Step B: Full acceleration & quartic deceleration with elastic spring overshoot
    const mainSpinTimer = window.setTimeout(() => {
      if (stripRef.current) {
        // High-realism easing: rapid acceleration into quartic deceleration + 4% elastic bounce-back
        stripRef.current.style.transition = `transform ${spinDurationMs - 90}ms cubic-bezier(0.12, 0.88, 0.16, 1.05)`;
        stripRef.current.style.transform = `translate3d(0, -${targetY}px, 0)`;
      }
    }, 90);

    // Step C: Arrival and ratchet brake stop
    const completeTimer = window.setTimeout(() => {
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current);

      // Snap & normalize base position modulo
      const normalizedBaseIndex = 3 * safeItems.length + winnerIndex;
      currentPosIndexRef.current = normalizedBaseIndex;
      setSelectedIdx(winnerIndex);
      setIsRolling(false);
      setJustLockedIn(true);

      // Reset transform silently without transition
      if (stripRef.current) {
        stripRef.current.style.transition = 'none';
        stripRef.current.style.transform = `translate3d(0, -${normalizedBaseIndex * ITEM_HEIGHT}px, 0)`;
      }

      // Play metallic ratchet stop clunk & flash win line
      sounds.playReelStop(reelIndex);
      onReelStopped(safeItems[winnerIndex]);

      setTimeout(() => setJustLockedIn(false), 800);
    }, spinDurationMs + 20);

    return () => {
      clearTimeout(mainSpinTimer);
      clearTimeout(completeTimer);
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current);
    };
  }, [isSpinning, isLocked, spinDurationMs, targetWinner, safeItems, reelIndex, onReelStopped, ITEM_HEIGHT]);

  // Handle Nudge Action
  const handleNudgeAction = (dir: 'up' | 'down') => {
    if (isRolling || !canUseTokens) return;
    const delta = dir === 'up' ? -1 : 1;
    const nextIdx = (selectedIdx + delta + safeItems.length) % safeItems.length;
    setSelectedIdx(nextIdx);

    const nextItemStripIndex = 3 * safeItems.length + nextIdx;
    currentPosIndexRef.current = nextItemStripIndex;

    if (stripRef.current) {
      stripRef.current.style.transition = 'transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1.15)';
      stripRef.current.style.transform = `translate3d(0, -${nextItemStripIndex * ITEM_HEIGHT}px, 0)`;
    }

    onNudge(dir);
    onReelStopped(safeItems[nextIdx]);
    sounds.playPop(true);
  };

  return (
    <div className="flex-1 min-w-[95px] max-w-[195px] flex flex-col items-center">
      {/* Category Header Ribbon */}
      <div 
        className="px-2.5 py-1 rounded-t-xl text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-white shadow-md mb-1 w-full text-center flex items-center justify-center gap-1 truncate"
        style={{ backgroundColor: accentColor }}
      >
        <span>{emoji}</span>
        <span className="truncate">{title}</span>
      </div>

      {/* 3D Drum Slot Window (Viewable height 222px = exactly 3 visible items) */}
      <div className="relative w-full h-[222px] slot-reel-window overflow-hidden flex flex-col items-center justify-center select-none shadow-inner border-2 border-carnival-gold/80 rounded-2xl bg-[#FFFDF7]">
        
        {/* Top Drum Cylindrical Shadow (darkens as it angles upward) */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-20" />
        
        {/* Bottom Drum Cylindrical Shadow (darkens as it angles downward) */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none z-20" />

        {/* Center Target Payline Highlight Glass */}
        <div className={`absolute inset-x-0 top-[74px] h-[74px] border-y-2 pointer-events-none z-20 transition-all duration-300 ${
          justLockedIn 
            ? 'bg-amber-300/45 border-carnival-gold shadow-[0_0_18px_rgba(255,209,92,0.9)]' 
            : 'bg-amber-100/25 border-carnival-gold/65 shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)]'
        }`}>
          {/* Target indicator notches on sides */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-carnival-gold rounded-r-full shadow-sm" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-carnival-gold rounded-l-full shadow-sm" />
        </div>

        {/* Hardware-Accelerated Continuous Filmstrip */}
        <div
          ref={stripRef}
          className={`w-full absolute top-[74px] flex flex-col items-center will-change-transform ${
            isRolling ? 'filter blur-[0.6px]' : ''
          }`}
        >
          {strip.map(({ item, key }) => (
            <div
              key={key}
              className="w-full h-[74px] flex flex-col items-center justify-center text-center px-1 shrink-0 select-none transform transition-transform"
            >
              <span className="text-3xl sm:text-4xl block leading-none filter drop-shadow-sm">
                {item.emoji}
              </span>
              <span className="text-[11px] sm:text-xs font-display font-extrabold text-carnival-bg truncate block px-1 leading-tight mt-1 max-w-[120px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Locked (Held) Overlay Badge */}
        {isLocked && (
          <div className="absolute top-2 right-2 z-30 px-2 py-0.5 rounded-full bg-carnival-gold text-carnival-bgDark text-[10px] font-mono-ticket font-extrabold flex items-center gap-1 shadow-md animate-pulse">
            <Lock className="w-3 h-3" />
            <span>HELD</span>
          </div>
        )}
      </div>

      {/* Reel Controls (HOLD & NUDGE) */}
      <div className="w-full mt-2 flex flex-col gap-1">
        {/* Hold Button */}
        <button
          type="button"
          onClick={onToggleLock}
          disabled={isRolling || (!isLocked && !canUseTokens)}
          className={`w-full py-1 px-1.5 rounded-lg text-[10px] sm:text-xs font-mono-ticket font-bold uppercase transition-all flex items-center justify-center gap-1 ${
            isLocked
              ? 'bg-carnival-gold text-carnival-bgDark shadow-sm'
              : 'bg-carnival-cardLight/80 hover:bg-carnival-card text-carnival-creamMuted hover:text-white border border-carnival-border/50 disabled:opacity-30'
          }`}
          title={isLocked ? "Unlock reel" : "Hold this reel for next spin (Costs 1 token)"}
        >
          <Lock className="w-3 h-3" />
          <span>{isLocked ? 'HELD (1 🪙)' : 'HOLD (1 🪙)'}</span>
        </button>

        {/* Nudge Up / Down Buttons */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => handleNudgeAction('up')}
            disabled={isRolling || !canUseTokens}
            className="flex-1 py-1 bg-carnival-bg/80 hover:bg-carnival-bg text-carnival-creamMuted hover:text-white rounded border border-carnival-border/40 text-[9px] font-mono-ticket flex items-center justify-center disabled:opacity-30 active:scale-95"
            title="Nudge Up (Costs 1 token)"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleNudgeAction('down')}
            disabled={isRolling || !canUseTokens}
            className="flex-1 py-1 bg-carnival-bg/80 hover:bg-carnival-bg text-carnival-creamMuted hover:text-white rounded border border-carnival-border/40 text-[9px] font-mono-ticket flex items-center justify-center disabled:opacity-30 active:scale-95"
            title="Nudge Down (Costs 1 token)"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
