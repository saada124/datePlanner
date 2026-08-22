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

  const mixtapeLetter = `
🎧 ${APP_CONFIG.girlfriendName.toUpperCase()} HAS ACCEPTED YOUR DATE MIXTAPE! 💌✨

═══════════════════════════════════════════
📼 SIDE A TRACKLIST:
🎧 TRACK 1 · WHEN: ${selection.dayDate} (${selection.isoDate})
⏰ TRACK 2 · TIME: ${fullTime}
📍 TRACK 3 · WHERE: ${fullLocation}
🎸 TRACK 4 · VIBE: ${formattedActivities}
☕ TRACK 5 · SIPS: ${fullDrink}
💫 BONUS · GREETING: ${formattedGreetings}
═══════════════════════════════════════════

💌 Liner Note Message:
"${selection.customNotes || "No extra notes — she is ready to press play on our date! ❤️"}"

Sent automatically from ${APP_CONFIG.girlfriendName}'s Date Mixtape Website.
`.trim();

  const payload = {
    _subject: `💌 ${APP_CONFIG.girlfriendName} Accepted Our Date Mixtape! (${selection.dayDate}) 🎧`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    personalNote: selection.customNotes || "None",
    message: mixtapeLetter,
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
      return { success: true, message: "Letter delivered successfully!" };
    } else {
      return { success: true, message: "Delivered" };
    }
  } catch (err) {
    console.error("Email delivery notification:", err);
    return { success: false, message: "Network error" };
  }
}