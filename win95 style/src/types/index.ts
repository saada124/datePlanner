export interface DateSelection {
  dayDate: string; // e.g. "Wednesday, August 19, 2026"
  isoDate: string; // e.g. "2026-08-19"
  timeSlot: string; // e.g. "Twilight Evening 🌇"
  customTime?: string;
  activities: string[]; // e.g. ["Cinema Date 🍿", "Candlelit Dinner 🍝"]
  customActivity?: string;
  location: string; // e.g. "Somewhere romantic 🌹"
  customLocation?: string;
  drink: string; // e.g. "Sweet Boba Milk Tea 🧋"
  customDrink?: string;
  greetings: string[]; // e.g. ["Warm embrace 🤗", "Sweet kiss 💋"]
  customNotes?: string;
}

export type StoryChapter = 
  | 'PROLOGUE'
  | 'CHAPTER_1_DATE'
  | 'CHAPTER_2_ACTIVITY'
  | 'CHAPTER_3_LOCATION'
  | 'CHAPTER_4_DRINK'
  | 'CHAPTER_5_GREETING'
  | 'INVITATION_CARD'
  | 'EPILOGUE';
