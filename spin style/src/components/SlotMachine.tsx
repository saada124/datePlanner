import React, { useState, useCallback } from 'react';
import { Sparkles, Coins, CheckCircle, Flame } from 'lucide-react';
import { OptionItem, SlotWinners } from '../types';
import { SlotMachineCanvas } from './SlotMachineCanvas';
import { sounds } from '../utils/sound';

interface SlotMachineProps {
  vibeOptions: OptionItem[];
  activityOptions: OptionItem[];
  dressCodeOptions: OptionItem[];
  tokensCount: number;
  onSpendToken: (amount?: number) => boolean;
  secretRigged?: {
    vibeId?: string | null;
    activityId?: string | null;
    dressCodeId?: string | null;
  };
  onLockInDate: (winners: SlotWinners) => void;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  vibeOptions,
  activityOptions,
  dressCodeOptions,
  tokensCount,
  onSpendToken,
  secretRigged,
  onLockInDate,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [hasSpunAtLeastOnce, setHasSpunAtLeastOnce] = useState(false);

  // Lock state per reel (Hold feature)
  const [lockedReels, setLockedReels] = useState<{ vibe: boolean; activity: boolean; dressCode: boolean }>({
    vibe: false,
    activity: false,
    dressCode: false,
  });

  // Current winners
  const [currentWinners, setCurrentWinners] = useState<SlotWinners>({
    vibe: vibeOptions[0] || null,
    activity: activityOptions[0] || null,
    dressCode: dressCodeOptions[0] || null,
  });

  const handlePullLeverOrSpin = () => {
    if (isSpinning) return;

    sounds.playLeverPull();
    setLeverPulled(true);
    setTimeout(() => setLeverPulled(false), 500);

    setIsSpinning(true);
  };

  const handleSpinComplete = useCallback((winners: SlotWinners) => {
    setCurrentWinners(winners);
    setIsSpinning(false);
    setHasSpunAtLeastOnce(true);
  }, []);

  const toggleHold = (reel: 'vibe' | 'activity' | 'dressCode') => {
    if (isSpinning) return;
    if (lockedReels[reel]) {
      // Unlock
      setLockedReels((prev) => ({ ...prev, [reel]: false }));
      sounds.playPop(false);
    } else {
      // Spend 1 token to hold
      const ok = onSpendToken(1);
      if (ok) {
        setLockedReels((prev) => ({ ...prev, [reel]: true }));
        sounds.playPop(true);
      }
    }
  };

  const handleNudge = (_reel: 'vibe' | 'activity' | 'dressCode', _direction: 'up' | 'down') => {
    if (isSpinning) return;
    onSpendToken(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      
      {/* Top Arcade Header & Token Balance */}
      <div className="w-full flex items-center justify-between px-3 mb-3">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-carnival-gold/20 border border-carnival-gold/50 text-carnival-gold text-xs font-mono-ticket font-extrabold shadow-sm">
          <Coins className="w-4 h-4 text-carnival-yellow" />
          <span>TOKENS: {tokensCount} 🪙</span>
        </div>

        <div className="text-xs font-mono-ticket text-carnival-creamMuted/80 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-carnival-pink" />
          <span>3D DRUM DATE GENERATOR</span>
        </div>
      </div>

      {/* Main Arcade Slot Cabinet Frame */}
      <div className="relative w-full slot-cabinet p-4 sm:p-6 shadow-2xl">
        
        {/* Flashing Top Marquee Bulbs */}
        <div className="flex justify-center items-center gap-2.5 pb-4">
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0s' }}></span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.2s' }}></span>
          <span className="text-xs sm:text-sm font-mono-ticket text-carnival-gold font-bold uppercase tracking-widest px-2">
            ★ SPIN YOUR DATE JACKPOT ★
          </span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.4s' }}></span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.6s' }}></span>
        </div>

        {/* 3D Drum Canvas Display + Side Lever */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 w-full">
          
          {/* Main 3D Canvas Drum Engine */}
          <div className="flex-1 w-full flex flex-col items-center">
            <SlotMachineCanvas
              vibeOptions={vibeOptions}
              activityOptions={activityOptions}
              dressCodeOptions={dressCodeOptions}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
              secretRigged={secretRigged}
              lockedReels={lockedReels}
              onToggleHold={toggleHold}
              onNudge={handleNudge}
              tokensCount={tokensCount}
            />
          </div>

          {/* Interactive 3D Pull Lever on Right Side */}
          <div className="hidden sm:flex flex-col items-center pl-2">
            <button
              type="button"
              onClick={handlePullLeverOrSpin}
              disabled={isSpinning}
              className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none"
              title="Pull Lever to Spin!"
            >
              {/* Lever Knob (Cherry Red Sphere) */}
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-900 border-2 border-white/80 shadow-[0_4px_12px_rgba(220,38,38,0.6)] transition-all duration-300 ${
                  leverPulled ? 'translate-y-20 scale-90 rotate-12' : 'group-hover:scale-110 group-hover:-translate-y-1'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white/60 ml-2 mt-1.5 blur-[0.5px]" />
              </div>

              {/* Lever Arm Metal Shaft */}
              <div
                className={`w-3.5 h-24 bg-gradient-to-r from-gray-400 via-white to-gray-400 border border-gray-500 rounded-sm origin-bottom transition-all duration-300 shadow-md ${
                  leverPulled ? 'rotate-45 scale-y-75' : 'group-hover:brightness-110'
                }`}
              />

              {/* Brass Base */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 border-2 border-yellow-300 shadow-inner flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-yellow-900 shadow-inner" />
              </div>
            </button>
          </div>
        </div>

        {/* Cabinet Bottom Marquee Lights */}
        <div className="flex justify-center items-center gap-3 pt-4">
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.6s' }}></span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.4s' }}></span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0.2s' }}></span>
          <span className={`marquee-bulb ${isSpinning ? 'animate-marquee-light' : 'animate-pulse'}`} style={{ animationDelay: '0s' }}></span>
        </div>
      </div>

      {/* Outcome Reveal Banner */}
      {hasSpunAtLeastOnce && !isSpinning && currentWinners.vibe && currentWinners.activity && currentWinners.dressCode && (
        <div className="w-full max-w-md p-4 mt-5 rounded-2xl bg-gradient-to-r from-carnival-card via-carnival-cardLight to-carnival-card border-2 border-carnival-gold shadow-marquee-glow animate-bounce-short text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono-ticket text-carnival-gold uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 text-carnival-orange" />
            <span>DATE COMBO UNLOCKED</span>
            <Flame className="w-4 h-4 text-carnival-orange" />
          </div>
          <div className="text-base sm:text-lg font-display font-extrabold text-carnival-lime">
            {currentWinners.vibe.emoji} {currentWinners.vibe.label} + {currentWinners.activity.emoji} {currentWinners.activity.label} + {currentWinners.dressCode.emoji} {currentWinners.dressCode.label}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="w-full max-w-md mt-5 space-y-3">
        {!hasSpunAtLeastOnce ? (
          <button
            type="button"
            onClick={handlePullLeverOrSpin}
            disabled={isSpinning}
            className="w-full btn-arcade btn-arcade-pink py-4 text-2xl sm:text-3xl shadow-arcade-pink tracking-wider flex items-center justify-center gap-2"
          >
            <span>{isSpinning ? 'ROLLING REELS...' : 'SPIN REELS! 🎰'}</span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* Primary Confirm Button */}
            <button
              type="button"
              onClick={() => onLockInDate(currentWinners)}
              disabled={isSpinning}
              className="w-full btn-arcade btn-arcade-lime py-4 text-xl sm:text-2xl shadow-arcade-lime flex items-center justify-center gap-2.5"
            >
              <CheckCircle className="w-6 h-6 stroke-[2.5]" />
              <span>Lock it in ✅</span>
            </button>

            {/* Respin Reels Button */}
            <button
              type="button"
              onClick={handlePullLeverOrSpin}
              disabled={isSpinning}
              className="w-full btn-arcade btn-arcade-secondary py-3 text-base flex items-center justify-center gap-2"
            >
              <span>Respin Slot Machine 🎰</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
