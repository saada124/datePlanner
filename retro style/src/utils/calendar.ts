import { DateSelection } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export function downloadCalendarEvent(selection: DateSelection) {
  const title = `❤️ Date with ${APP_CONFIG.boyfriendName}! ✨`;
  const location = selection.customLocation || selection.location || "Secret Romantic Spot";
  const description = `Activities: ${selection.activities.join(', ')}\\nDrink: ${selection.drink}\\nGreeting: ${selection.greetings.join(', ')}\\n\\nCan't wait! ❤️`;
  
  // Format start & end date strings based on selected ISO date
  const baseDate = selection.isoDate.replace(/-/g, '');
  // Default to 19:00 (7 PM) or afternoon/morning
  let startHour = "190000";
  let endHour = "220000";
  
  if (selection.timeSlot.includes("Morning")) {
    startHour = "100000";
    endHour = "130000";
  } else if (selection.timeSlot.includes("Afternoon")) {
    startHour = "140000";
    endHour = "180000";
  } else if (selection.timeSlot.includes("Night")) {
    startHour = "200000";
    endHour = "233000";
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//${APP_CONFIG.girlfriendName} Date Quest//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${baseDate}T${startHour}`,
    `DTEND:${baseDate}T${endHour}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Date with ${APP_CONFIG.boyfriendName} in 2 hours! ❤️",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Date_with_${APP_CONFIG.boyfriendName}_${selection.isoDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
