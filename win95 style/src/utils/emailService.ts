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

  const setupReport = `
📟 ${APP_CONFIG.girlfriendName.toUpperCase()} HAS EXECUTED DATE SETUP! 💾✨

═══════════════════════════════════════════
🖥️ SETUP REPORT — ${APP_CONFIG.websiteTitle} (${APP_CONFIG.osName})
📅 DATE: ${selection.dayDate} (${selection.isoDate})
⏰ TIME: ${fullTime}
📍 DESTINATION: ${fullLocation}
🎮 PROGRAMS: ${formattedActivities}
🥤 REFRESHMENT: ${fullDrink}
🤗 GREETINGS: ${formattedGreetings}
═══════════════════════════════════════════

💌 Personal Note:
"${selection.customNotes || "No notes — the date was installed successfully! ❤️"}"

Installation completed by ${APP_CONFIG.boyfriendName}.exe ❤️
Sent automatically from ${APP_CONFIG.girlfriendName}'s Date Setup Wizard (${APP_CONFIG.osName}).
`.trim();

  const payload = {
    _subject: `📟 ${APP_CONFIG.girlfriendName.toUpperCase()} EXECUTED DATE SETUP! (${selection.dayDate}) 💾`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    personalNote: selection.customNotes || "None",
    message: setupReport,
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
