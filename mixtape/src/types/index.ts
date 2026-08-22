export interface DateSelection {
  dayDate: string; // e.g. "Wednesday, August 19, 2026"
  isoDate: string; // e.g. "2026-08-19"
  timeSlot: string; // e.g. "Golden Hour Set 🎧"
  customTime?: string;
  activities: string[]; // e.g. ["Vinyl Hunt 💿", "Dinner & Slow Tunes 🍝"]
  customActivity?: string;
  location: string; // e.g. "The Rooftop at Dusk 🌆"
  customLocation?: string;
  drink: string; // e.g. "Iced Vanilla Coffee ☕"
  customDrink?: string;
  greetings: string[]; // e.g. ["A long, slow hug 🤗"]
  customNotes?: string;
}

export type MixtapeStage =
  | 'COVER'
  | 'TRACK_1_DATE'
  | 'TRACK_2_ACTIVITY'
  | 'TRACK_3_LOCATION'
  | 'TRACK_4_DRINK'
  | 'TRACK_5_GREETING'
  | 'J_CARD'
  | 'RECORDED';