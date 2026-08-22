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

  const emailBody = `
💖 ${APP_CONFIG.girlfriendName.toUpperCase()} HAS CONFIRMED YOUR DATE QUEST! 🎮✨

===========================================
📅 DATE: ${selection.dayDate} (${selection.isoDate})
⏰ TIME: ${fullTime}
📍 LOCATION: ${fullLocation}
🍿 ACTIVITIES: ${formattedActivities}
🥤 DRINK: ${fullDrink}
🤗 GREETING: ${formattedGreetings}
===========================================

📝 Extra Notes / Message:
${selection.customNotes || "No extra notes - she's ready for the date! ❤️"}

Sent automatically from ${APP_CONFIG.girlfriendName}'s Pixel Art Date Quest Web App.
`.trim();

  const payload = {
    _subject: `💌 ${APP_CONFIG.girlfriendName.toUpperCase()} ACCEPTED THE DATE! (${selection.dayDate}) ❤️`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    location: fullLocation,
    activities: formattedActivities,
    drink: fullDrink,
    greetings: formattedGreetings,
    customNotes: selection.customNotes || "None",
    message: emailBody,
    _template: "table",
    _captcha: "false"
  };

  try {
    // We send via formsubmit.co AJAX endpoint to deliver directly to the target email
    const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return { success: true, message: "Email sent successfully!" };
    } else {
      console.warn("Primary email service response:", response.status);
      return { success: true, message: "Submitted" };
    }
  } catch (err) {
    console.error("Automated email dispatch error:", err);
    // Don't interrupt her celebration experience even if network fails
    return { success: false, message: "Network error sending email" };
  }
}
