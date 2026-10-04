import { DatePlannerState } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  isMock?: boolean;
}

/**
 * Dispatches the locked-in date combo to FormSubmit in the background.
 * Uses no-cors mode so the user is never redirected away from the ticket experience.
 */
export async function sendDateResultEmail(
  state: DatePlannerState,
  recipientEmail: string
): Promise<EmailDispatchResult> {
  const senderName = state.girlfriendName.trim() || 'Your Girlfriend';
  const vibeText = state.slotWinners.vibe ? `${state.slotWinners.vibe.emoji} ${state.slotWinners.vibe.label}` : 'Cozy';
  const activityText = state.slotWinners.activity ? `${state.slotWinners.activity.emoji} ${state.slotWinners.activity.label}` : (state.finalPick ? `${state.finalPick.emoji} ${state.finalPick.label}` : 'Dinner');
  const dressCodeText = state.slotWinners.dressCode ? `${state.slotWinners.dressCode.emoji} ${state.slotWinners.dressCode.label}` : 'Dress to Impress';
  const timeText = state.selectedTimeSlot ? `${state.selectedTimeSlot.emoji} ${state.selectedTimeSlot.label} (${state.selectedTimeSlot.time})` : 'Friday Night';
  const bonusText = state.mysteryBonusPerk || 'Unlimited dessert';

  // If email is still default placeholder or empty, skip sending gracefully
  if (!recipientEmail || recipientEmail.includes('YOUR_EMAIL') || !recipientEmail.includes('@')) {
    console.warn(
      `[FormSubmit] Email recipient is set to "${recipientEmail}". Update this in appConfig.ts or the Settings modal to receive real emails!`
    );
    return {
      success: true,
      isMock: true,
      message: 'Demo mode: Please configure your email in Settings to receive real notifications.'
    };
  }

  const formData = new FormData();
  formData.append('name', senderName);
  formData.append('date_vibe', vibeText);
  formData.append('date_activity', activityText);
  formData.append('date_dress_code', dressCodeText);
  formData.append('date_when', timeText);
  formData.append('bonus_perk', bonusText);
  formData.append('ticket_id', state.ticketNumber || `SLOT-${Date.now().toString().slice(-6)}`);
  formData.append('timestamp', new Date().toLocaleString());
  formData.append('_subject', `🎰 ${senderName} locked in a date: ${activityText} (${timeText})!`);
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');

  try {
    const endpoint = `https://formsubmit.co/${encodeURIComponent(recipientEmail.trim())}`;
    
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });

    return {
      success: true,
      message: `Date confirmed! Sent to ${recipientEmail}.`
    };
  } catch (err) {
    console.error('[FormSubmit] Submission error:', err);
    return {
      success: false,
      message: 'Network issue dispatching email, but your VIP ticket is ready!'
    };
  }
}
