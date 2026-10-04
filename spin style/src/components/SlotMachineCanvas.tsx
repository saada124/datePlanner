import React, { useEffect, useRef } from 'react';
import { Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { OptionItem, SlotWinners } from '../types';
import { sounds } from '../utils/sound';

interface SlotMachineCanvasProps {
  vibeOptions: OptionItem[];
  activityOptions: OptionItem[];
  dressCodeOptions: OptionItem[];
  isSpinning: boolean;
  onSpinComplete: (winners: SlotWinners) => void;
  secretRigged?: {
    vibeId?: string | null;
    activityId?: string | null;
    dressCodeId?: string | null;
  };
  lockedReels: { vibe: boolean; activity: boolean; dressCode: boolean };
  onToggleHold: (reel: 'vibe' | 'activity' | 'dressCode') => void;
  onNudge: (reel: 'vibe' | 'activity' | 'dressCode', direction: 'up' | 'down') => void;
  tokensCount: number;
}

export const SlotMachineCanvas: React.FC<SlotMachineCanvasProps> = ({
  vibeOptions,
  activityOptions,
  dressCodeOptions,
  isSpinning,
  onSpinComplete,
  secretRigged,
  lockedReels,
  onToggleHold,
  onNudge,
  tokensCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Safe non-empty option lists
  const safeVibes = vibeOptions.length > 0 ? vibeOptions : [{ id: 'vibe_1', label: 'Cozy Night', emoji: '🏠', category: 'vibe' as const }];
  const safeActs = activityOptions.length > 0 ? activityOptions : [{ id: 'act_1', label: 'Dinner', emoji: '🍝', category: 'activity' as const }];
  const safeDress = dressCodeOptions.length > 0 ? dressCodeOptions : [{ id: 'dress_1', label: 'Dress to Impress', emoji: '✨', category: 'dress_code' as const }];

  const reelsData = useRef([
    {
      id: 'vibe' as const,
      title: 'THE VIBE',
      emoji: '✨',
      accent: '#FF4D8D',
      items: safeVibes,
      angle: 0,
      targetAngle: 0,
      startAngle: 0,
      duration: 2200,
      currentIndex: 0,
      stopped: true,
      lastTickIndex: -1,
      flashTimer: 0,
    },
    {
      id: 'activity' as const,
      title: 'THE ACTIVITY',
      emoji: '🎡',
      accent: '#2EE6D6',
      items: safeActs,
      angle: 0,
      targetAngle: 0,
      startAngle: 0,
      duration: 2900,
      currentIndex: 0,
      stopped: true,
      lastTickIndex: -1,
      flashTimer: 0,
    },
    {
      id: 'dressCode' as const,
      title: 'THE DRESS CODE',
      emoji: '👗',
      accent: '#FFC53D',
      items: safeDress,
      angle: 0,
      targetAngle: 0,
      startAngle: 0,
      duration: 3600,
      currentIndex: 0,
      stopped: true,
      lastTickIndex: -1,
      flashTimer: 0,
    },
  ]);

  // Keep items updated in ref
  useEffect(() => {
    reelsData.current[0].items = safeVibes;
    reelsData.current[1].items = safeActs;
    reelsData.current[2].items = safeDress;
  }, [safeVibes, safeActs, safeDress]);

  const isSpinningRef = useRef(false);
  const spinStartTimeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Trigger Spin Sequence
  useEffect(() => {
    if (isSpinning && !isSpinningRef.current) {
      isSpinningRef.current = true;
      spinStartTimeRef.current = performance.now();

      // Configure targets for each reel
      reelsData.current.forEach((reel, idx) => {
        reel.startAngle = reel.angle;
        reel.stopped = false;
        reel.lastTickIndex = -1;
        reel.flashTimer = 0;

        const isLocked = (idx === 0 && lockedReels.vibe) || (idx === 1 && lockedReels.activity) || (idx === 2 && lockedReels.dressCode);

        if (isLocked) {
          reel.targetAngle = reel.angle;
          reel.stopped = true;
          return;
        }

        // Determine winning index
        let winnerIdx = Math.floor(Math.random() * reel.items.length);
        const riggedId = idx === 0 ? secretRigged?.vibeId : idx === 1 ? secretRigged?.activityId : secretRigged?.dressCodeId;
        if (riggedId) {
          const match = reel.items.findIndex((it) => it.id === riggedId);
          if (match >= 0) winnerIdx = match;
        }

        const sliceAngle = (2 * Math.PI) / reel.items.length;
        const extraLaps = (6 + idx * 3) * (2 * Math.PI);
        const targetOffset = winnerIdx * sliceAngle;

        reel.targetAngle = reel.startAngle + extraLaps + targetOffset;
      });
    }
  }, [isSpinning, lockedReels, secretRigged]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth || 540;
      const height = canvas.clientHeight || 260;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const elapsed = now - spinStartTimeRef.current;
      let allStopped = true;

      const reelWidth = (width - 32) / 3;
      const centerY = height / 2;
      const radius = 95; // 3D cylinder radius

      // Update and Draw each reel
      reelsData.current.forEach((reel, idx) => {
        const isLocked = (idx === 0 && lockedReels.vibe) || (idx === 1 && lockedReels.activity) || (idx === 2 && lockedReels.dressCode);

        // 1. Physics update if spinning
        if (isSpinningRef.current && !isLocked) {
          const progress = Math.min(elapsed / reel.duration, 1);

          if (progress < 1) {
            allStopped = false;
            let ease = 0;

            if (progress < 0.06) {
              // Anticipation jerk upward
              const pNorm = progress / 0.06;
              ease = -0.015 * Math.sin(pNorm * Math.PI);
            } else {
              // Quintic ease out with elastic spring settle
              const pNorm = (progress - 0.06) / 0.94;
              const decel = 1 - Math.pow(1 - pNorm, 4);
              const spring = 0.012 * Math.sin(pNorm * Math.PI) * Math.pow(1 - pNorm, 2);
              ease = decel + spring;
            }

            reel.angle = reel.startAngle + (reel.targetAngle - reel.startAngle) * ease;

            // Ticker sound check
            const sliceAngle = (2 * Math.PI) / reel.items.length;
            const currentSlice = Math.floor(reel.angle / sliceAngle);
            if (currentSlice !== reel.lastTickIndex) {
              const pitch = 1.3 - progress * 0.6;
              sounds.playTick(pitch);
              reel.lastTickIndex = currentSlice;
            }
          } else {
            if (!reel.stopped) {
              reel.stopped = true;
              reel.angle = reel.targetAngle;
              reel.flashTimer = now + 600;
              sounds.playReelStop(idx);
            }
          }
        }

        const sliceAngle = (2 * Math.PI) / reel.items.length;
        const normalizedAngle = (reel.angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const centerIndex = Math.round(normalizedAngle / sliceAngle) % reel.items.length;
        reel.currentIndex = (reel.items.length - centerIndex) % reel.items.length;

        // 2. Draw Reel Cabinet Column
        const rx = 12 + idx * (reelWidth + 4);

        // Reel window background
        ctx.fillStyle = '#FFFDF7';
        ctx.beginPath();
        ctx.roundRect(rx, 10, reelWidth, height - 20, 14);
        ctx.fill();

        // 3. Draw 3D Cylindrical Drum Items
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(rx, 10, reelWidth, height - 20, 14);
        ctx.clip();

        reel.items.forEach((item, itemIdx) => {
          const itemAngle = itemIdx * sliceAngle - normalizedAngle;
          // Normalize to [-PI, PI]
          const phi = (itemAngle + Math.PI) % (2 * Math.PI) - Math.PI;

          // Only draw visible front hemisphere (-PI/2 to PI/2)
          if (phi > -Math.PI / 2 && phi < Math.PI / 2) {
            const y = centerY - radius * Math.sin(phi);
            const scale = Math.cos(phi); // 3D perspective foreshortening
            const alpha = Math.max(0.2, Math.cos(phi));

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(rx + reelWidth / 2, y);
            ctx.scale(scale, scale);

            // Draw Emoji
            ctx.font = `${Math.round(36 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.emoji, 0, -8);

            // Draw Label
            ctx.fillStyle = '#2E1A47';
            ctx.font = `bold ${Math.max(10, Math.round(12 * scale))}px 'Fredoka', 'Nunito', sans-serif`;
            ctx.fillText(item.label, 0, 20);

            ctx.restore();
          }
        });

        // 4. Center Target Win Line / Payline
        const isFlashing = reel.flashTimer > now;
        ctx.fillStyle = isFlashing ? 'rgba(255, 209, 92, 0.45)' : 'rgba(255, 209, 92, 0.18)';
        ctx.strokeStyle = isFlashing ? '#FFD15C' : 'rgba(217, 155, 22, 0.7)';
        ctx.lineWidth = isFlashing ? 3 : 2;

        ctx.fillRect(rx, centerY - 35, reelWidth, 70);
        ctx.strokeRect(rx, centerY - 35, reelWidth, 70);

        // Target notches
        ctx.fillStyle = '#FFD15C';
        ctx.fillRect(rx + 2, centerY - 4, 3, 8);
        ctx.fillRect(rx + reelWidth - 5, centerY - 4, 3, 8);

        // 5. Top & Bottom Curved Cylinder Lighting Gradients
        const topGrad = ctx.createLinearGradient(rx, 10, rx, 10 + 65);
        topGrad.addColorStop(0, 'rgba(0,0,0,0.75)');
        topGrad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
        topGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(rx, 10, reelWidth, 65);

        const botGrad = ctx.createLinearGradient(rx, height - 75, rx, height - 10);
        botGrad.addColorStop(0, 'rgba(0,0,0,0)');
        botGrad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
        botGrad.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(rx, height - 75, reelWidth, 65);

        // Inner Border & Shadow
        ctx.strokeStyle = '#D99B16';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(rx, 10, reelWidth, height - 20, 14);
        ctx.stroke();

        ctx.restore();
      });

      ctx.restore();

      // Check if all reels finished spinning
      if (isSpinningRef.current && allStopped) {
        isSpinningRef.current = false;
        sounds.playWinFanfare();

        const w0 = reelsData.current[0].items[reelsData.current[0].currentIndex];
        const w1 = reelsData.current[1].items[reelsData.current[1].currentIndex];
        const w2 = reelsData.current[2].items[reelsData.current[2].currentIndex];

        onSpinComplete({
          vibe: w0,
          activity: w1,
          dressCode: w2,
        });
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [onSpinComplete, lockedReels]);

  // Handle Manual Nudge for Reel
  const handleManualNudge = (idx: number, dir: 'up' | 'down') => {
    if (isSpinningRef.current || tokensCount <= 0) return;
    const reel = reelsData.current[idx];
    const sliceAngle = (2 * Math.PI) / reel.items.length;
    const delta = dir === 'up' ? -sliceAngle : sliceAngle;

    reel.angle += delta;
    const normalizedAngle = (reel.angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const centerIndex = Math.round(normalizedAngle / sliceAngle) % reel.items.length;
    reel.currentIndex = (reel.items.length - centerIndex) % reel.items.length;

    const reelName = idx === 0 ? 'vibe' : idx === 1 ? 'activity' : 'dressCode';
    onNudge(reelName, dir);

    sounds.playPop(true);

    onSpinComplete({
      vibe: reelsData.current[0].items[reelsData.current[0].currentIndex],
      activity: reelsData.current[1].items[reelsData.current[1].currentIndex],
      dressCode: reelsData.current[2].items[reelsData.current[2].currentIndex],
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Canvas Drum Window */}
      <div className="w-full max-w-lg h-[260px] relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full block select-none"
        />
      </div>

      {/* Reel Action Buttons (HOLD & NUDGE) */}
      <div className="w-full max-w-lg grid grid-cols-3 gap-2 sm:gap-3 px-3 mt-3">
        {(['vibe', 'activity', 'dressCode'] as const).map((reelName, idx) => {
          const isLocked = lockedReels[reelName];
          return (
            <div key={reelName} className="flex flex-col gap-1">
              {/* Hold Button */}
              <button
                type="button"
                onClick={() => onToggleHold(reelName)}
                disabled={isSpinning || (!isLocked && tokensCount <= 0)}
                className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-mono-ticket font-bold uppercase transition-all flex items-center justify-center gap-1 shadow-sm ${
                  isLocked
                    ? 'bg-carnival-gold text-carnival-bgDark border-2 border-yellow-300 animate-pulse'
                    : 'bg-carnival-cardLight hover:bg-carnival-card text-carnival-creamMuted hover:text-white border border-carnival-border/60 disabled:opacity-30'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>{isLocked ? 'HELD' : 'HOLD (1 🪙)'}</span>
              </button>

              {/* Nudge Buttons */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleManualNudge(idx, 'up')}
                  disabled={isSpinning || tokensCount <= 0}
                  className="flex-1 py-1 bg-carnival-bg hover:bg-carnival-card text-carnival-creamMuted hover:text-white rounded-lg border border-carnival-border/50 text-[10px] font-mono-ticket flex items-center justify-center disabled:opacity-30 active:scale-95"
                  title="Nudge Up (1 Token)"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleManualNudge(idx, 'down')}
                  disabled={isSpinning || tokensCount <= 0}
                  className="flex-1 py-1 bg-carnival-bg hover:bg-carnival-card text-carnival-creamMuted hover:text-white rounded-lg border border-carnival-border/50 text-[10px] font-mono-ticket flex items-center justify-center disabled:opacity-30 active:scale-95"
                  title="Nudge Down (1 Token)"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
