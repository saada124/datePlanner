import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

interface LiveCounterProps {
  count: number;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({ count }) => {
  const minRequired = APP_CONFIG.minSelectionsRequired;
  const isReady = count >= minRequired;

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      {/* Ticket Readout Badge */}
      <div 
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
          isReady
            ? 'bg-carnival-bgDark/90 border-carnival-gold shadow-marquee-glow text-carnival-gold scale-105'
            : 'bg-carnival-bgDark/70 border-carnival-border text-carnival-creamMuted'
        }`}
      >
        <span className="text-2xl animate-bounce-short">🎡</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-carnival-cream">
            {count}
          </span>
          <span className="text-sm sm:text-base font-display font-semibold uppercase tracking-wider">
            {count === 1 ? 'option' : 'options'} loaded onto the wheel
          </span>
        </div>
        {isReady ? (
          <Sparkles className="w-5 h-5 text-carnival-yellow animate-pulse" />
        ) : (
          <span className="text-xs font-mono-ticket text-carnival-pink px-2 py-0.5 rounded-full bg-carnival-pink/20">
            min {minRequired}
          </span>
        )}
      </div>

      {/* Helper text if not enough options */}
      {!isReady && (
        <div className="flex items-center gap-1.5 text-xs text-carnival-pink/90 font-display font-semibold mt-2.5 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>Pick at least {minRequired - count} more to activate the prize wheel!</span>
        </div>
      )}
    </div>
  );
};
