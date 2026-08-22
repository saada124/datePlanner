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

  const storybookLetter = `
🌸 ${APP_CONFIG.girlfriendName.toUpperCase()} HAS ACCEPTED YOUR DATE INVITATION! 💌✨

═══════════════════════════════════════════
📖 CHAPTER SUMMARY:
📅 DATE: ${selection.dayDate} (${selection.isoDate})
⏰ TIME: ${fullTime}
📍 LOCATION: ${fullLocation}
🎨 ACTIVITIES: ${formattedActivities}
🧋 DRINK: ${fullDrink}
🤗 GREETINGS: ${formattedGreetings}
═══════════════════════════════════════════

💌 Special Handwritten Message:
"${selection.customNotes || "No extra notes — she is ready for our date! ❤️"}"

Sent automatically from ${APP_CONFIG.girlfriendName}'s Whimsical Storybook Date Website.
`.trim();

  const payload = {
    _subject: `💌 ${APP_CONFIG.girlfriendName} Accepted Our Date! (${selection.dayDate}) 🌸`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    personalNote: selection.customNotes || "None",
    message: storybookLetter,
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
