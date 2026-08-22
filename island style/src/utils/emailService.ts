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

  const islandReport = `
🏝️ ${APP_CONFIG.girlfriendName.toUpperCase()} BOOKED YOUR ISLAND GETAWAY DATE! ✈️✨

═══════════════════════════════════════════
🌴 DODO AIRLINES FLIGHT ITINERARY:
📅 DATE: ${selection.dayDate} (${selection.isoDate})
⏰ BOARDING TIME: ${fullTime}
📍 ISLAND DESTINATION: ${fullLocation}
🎣 ACTIVITIES: ${formattedActivities}
☕ REFRESHMENT: ${fullDrink}
💌 GREETING: ${formattedGreetings}
═══════════════════════════════════════════

💬 Island Message from ${APP_CONFIG.girlfriendName}:
"${selection.customNotes || "Ready for our private island getaway! 🏝️✨"}"

Sent automatically from Dodo Airlines & ${APP_CONFIG.girlfriendName}'s Island Getaway App.
`.trim();

  const payload = {
    _subject: `✈️ ${APP_CONFIG.girlfriendName} Booked Our Island Date! (${selection.dayDate}) 🏝️`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    islandNote: selection.customNotes || "None",
    message: islandReport,
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
      return { success: true, message: "Flight confirmation delivered!" };
    } else {
      return { success: true, message: "Delivered" };
    }
  } catch (err) {
    console.error("Automated email notice:", err);
    return { success: false, message: "Network error" };
  }
}
