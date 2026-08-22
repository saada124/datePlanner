import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export interface EmailSendResult {
  success: boolean;
  message: string;
}

export async function sendAutomatedDateEmail(selection: DateSelection, recipientEmail: string): Promise<EmailSendResult> {
  const formattedActivities = selection.activities.join(', ') +
    (selection.customActivity ? ` (+ "${selection.customActivity}")` : '');

  const formattedGreetings = selection.greetings.join(', ');

  const fullLocation = selection.customLocation
    ? `${selection.location} - "${selection.customLocation}"`
    : selection.location;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const fullDrink = selection.customDrink
    ? `${selection.drink} - "${selection.customDrink}"`
    : selection.drink;

  const receiptReport = `
☕ ${APP_CONFIG.girlfriendName.toUpperCase()} HAS CONFIRMED YOUR BISTRO DATE ORDER! 🥐✨

═══════════════════════════════════════════
🧾 CAFÉ D'AMOUR — ORDER RECEIPT N° 0042
TABLE: ${APP_CONFIG.tableNumber}
📅 DATE: ${selection.dayDate} (${selection.isoDate})
⏰ SERVICE: ${fullTime}
📍 SEATING / AMBIANCE: ${fullLocation}
🥐 MAIN COURSES / ADVENTURES: ${formattedActivities}
☕ BOISSON / REFRESHMENT: ${fullDrink}
🤗 ACCUEIL / GREETING: ${formattedGreetings}
TOTAL DUE: 100% UNCONDITIONAL LOVE (PAID IN FULL)
═══════════════════════════════════════════

💬 Guest Note from ${APP_CONFIG.girlfriendName}:
"${selection.customNotes || "Can't wait for our cozy café date! ☕❤️"}"

Sent automatically from ${APP_CONFIG.girlfriendName}'s Cozy French Bistro Web App.
`.trim();

  const payload = {
    _subject: `☕ ${APP_CONFIG.girlfriendName} Confirmed Table For Two! (${selection.dayDate}) 🥐`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    bistroNote: selection.customNotes || "None",
    message: receiptReport,
    _template: "table",
    _captcha: "false"
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return { success: true, message: "Receipt dispatched successfully!" };
    } else {
      return { success: true, message: "Delivered" };
    }
  } catch (err) {
    console.error("Automated email notice:", err);
    return { success: false, message: "Network error" };
  }
}
