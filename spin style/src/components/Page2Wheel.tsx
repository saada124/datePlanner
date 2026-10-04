import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { DatePlannerState, SlotWinners, TimeSlotOption } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { SlotMachine } from './SlotMachine';
import { TimePickerSection } from './TimePickerSection';
import { sounds } from '../utils/sound';
import { sendDateResultEmail } from '../utils/emailService';

interface Page2SlotMachineProps {
  plannerState: DatePlannerState;
  recipientEmail: string;
  onSpendToken: (amount?: number) => boolean;
  onSelectTimeSlot: (slot: TimeSlotOption) => void;
  onLockInDate: (winners: SlotWinners, timeSlot: TimeSlotOption) => void;
}

export const Page2Wheel: React.FC<Page2SlotMachineProps> = ({
  plannerState,
  recipientEmail,
  onSpendToken,
  onSelectTimeSlot,
  onLockInDate,
}) => {
  const vibeOptions = plannerState.selectedOptions.filter((o) => o.category === 'vibe');
  const activityOptions = plannerState.selectedOptions.filter((o) => o.category === 'activity' || o.category === 'extras');
  const dressCodeOptions = plannerState.selectedOptions.filter((o) => o.category === 'dress_code');

  // Fallback defaults if fewer were selected in a category
  const safeVibes = vibeOptions.length > 0 ? vibeOptions : APP_CONFIG.categories[0].options;
  const safeActivities = activityOptions.length > 0 ? activityOptions : APP_CONFIG.categories[1].options;
  const safeDressCodes = dressCodeOptions.length > 0 ? dressCodeOptions : APP_CONFIG.dressCodeOptions;

  const handleLockIn = (winners: SlotWinners) => {
    sounds.playStampThud();

    // 1. Celebratory Confetti Burst
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF4D8D', '#FFC53D', '#2EE6D6', '#FF7A3D', '#B4FF3D'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#FF4D8D', '#FFC53D', '#2EE6D6'],
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#FF7A3D', '#B4FF3D', '#FFD15C'],
        });
      }, 250);
    } catch {
      // Fallback
    }

    // 2. Background FormSubmit Email
    sendDateResultEmail(
      {
        ...plannerState,
        slotWinners: winners,
        finalPick: winners.activity || winners.vibe,
        selectedTimeSlot: plannerState.selectedTimeSlot,
      },
      recipientEmail
    );

    // 3. Open VIP Ticket
    setTimeout(() => {
      onLockInDate(winners, plannerState.selectedTimeSlot);
    }, 400);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-16 flex flex-col items-center text-center space-y-6">
      {/* Top Banner */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-carnival-teal/20 border border-carnival-teal/50 text-carnival-teal text-xs font-display font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2 of 2 · Carnival Slot Machine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-carnival-cream tracking-tight drop-shadow-md">
          Spin Our Date Plan! 🎰
        </h1>

        <p className="text-sm sm:text-base text-carnival-creamMuted max-w-md mx-auto font-sans">
          Pull the lever or press spin to lock in our Vibe, Activity &amp; Outfit!
        </p>
      </div>

      {/* 3-Reel Arcade Slot Machine */}
      <SlotMachine
        vibeOptions={safeVibes}
        activityOptions={safeActivities}
        dressCodeOptions={safeDressCodes}
        tokensCount={plannerState.tokensCount}
        onSpendToken={onSpendToken}
        secretRigged={plannerState.secretRiggedOptions}
        onLockInDate={handleLockIn}
      />

      {/* Manual On-Screen Date & Time Selection */}
      <TimePickerSection
        selectedSlot={plannerState.selectedTimeSlot}
        onSelectSlot={onSelectTimeSlot}
      />
    </div>
  );
};
