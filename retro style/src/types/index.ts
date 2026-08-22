export type TimeSlot = 'Morning 🌅' | 'Afternoon ☀️' | 'Evening 🌇' | 'Night 🌙' | 'Custom ⏰';

export interface DateSelection {
  dayDate: string; // e.g. "Wednesday, Aug 19"
  isoDate: string; // e.g. "2026-08-19"
  timeSlot: string; // e.g. "Evening 🌇"
  customTime?: string;
  activities: string[]; // e.g. ["Cinema 🍿", "Dinner 🍝"]
  customActivity?: string;
  location: string; // e.g. "Somewhere romantic 🌹"
  customLocation?: string;
  drink: string; // e.g. "Bubble Tea 🧋"
  customDrink?: string;
  greetings: string[]; // e.g. ["Big hug 🤗", "Kiss 💋"]
  customNotes?: string;
}

export type QuestStep = 
  | 'LANDING'
  | 'QUEST_1_DATE'
  | 'QUEST_2_ACTIVITY'
  | 'QUEST_3_LOCATION'
  | 'QUEST_4_DRINK'
  | 'QUEST_5_GREETING'
  | 'FINAL_CARD'
  | 'CELEBRATION';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: 'date' | 'time' | 'activity' | 'location' | 'drink' | 'greeting';
}

export interface FloatingStat {
  id: number;
  text: string;
  x: number;
  y: number;
  color?: string;
}
