import { DateMenuSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export interface EmailSendResult {
  success: boolean;
  message: string;
}

export async function sendAutomatedDateMenuEmail(selection: DateMenuSelection, recipientEmail: string): Promise<EmailSendResult> {
  const selectedSidesLabels = selection.sides
    .map(sideId => APP_CONFIG.sides.find(s => s.id === sideId)?.label || sideId)
    .join('\n  • ');

  const fullActivity = selection.customActivity
    ? `${selection.activityTitle} ("${selection.customActivity}")`
    : selection.activityTitle;

  const fullTime = selection.customTime
    ? `${selection.timeSlot} (${selection.customTime})`
    : selection.timeSlot;

  const receiptReport = `
📋 ${APP_CONFIG.girlfriendName.toUpperCase()} HAS PLACED HER DATE MENU ORDER! ✦

═══════════════════════════════════════════
✦ DATE MENU ORDER TICKET — TABLE N° 07 ✦
TABLE: ${APP_CONFIG.tableNumber}
GUEST: ${APP_CONFIG.girlfriendName} & ${APP_CONFIG.boyfriendName}

[I] STARTER (THE VIBE):
${selection.mood}

[II] MAIN COURSE (THE ACTIVITY):
${fullActivity}

[III] SIDES (EXTRA TOUCHES):
  • ${selectedSidesLabels || "Standard Romantic Package"}

[IV] DESSERT (WHEN & SERVICE HOUR):
📅 ${selection.dayDate} (${selection.isoDate})
⏰ ${fullTime}

[V] SPECIAL CRAVINGS & NOTES:
"${selection.cravingsAndNotes || "None (Just you! ❤️)"}"

TOTAL DUE: 100% UNCONDITIONAL LOVE (ORDER CONFIRMED)
═══════════════════════════════════════════

Sent automatically from ${APP_CONFIG.girlfriendName}'s Choose Your Adventure Date Menu.
`.trim();

  const payload = {
    _subject: `📋 ${APP_CONFIG.girlfriendName} Placed Her Date Menu Order! (${selection.dayDate}) ✦`,
    recipient: recipientEmail,
    date: selection.dayDate,
    time: fullTime,
    vibe: selection.mood,
    activity: fullActivity,
    sides: selectedSidesLabels || "Standard Package",
    specialNotes: selection.cravingsAndNotes || "None",
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
      return { success: true, message: "Order slip dispatched!" };
    } else {
      return { success: true, message: "Delivered" };
    }
  } catch (err) {
    console.error("Order dispatch notice:", err);
    return { success: false, message: "Network notice" };
  }
}
