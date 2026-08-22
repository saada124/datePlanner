// ============================================================
//           DATE QUEST — CUSTOMIZATION CONFIG
// ============================================================
//         EDIT THIS FILE to personalize the website.
// Every section below maps to a screen of the game.
// Keep "id" values unique within each list.
// ============================================================

export interface ChoiceOption {
  /** Unique key stored in state. Can be anything, e.g. "Cinema 🍿". */
  id: string;
  /** Main title shown on the card. */
  title: string;
  /** Emoji / pixel icon. */
  icon: string;
  /** Small subtitle text. */
  desc: string;
  /** Short label for the bottom RPG backpack bar (optional). */
  shortLabel?: string;
}

export interface LocationOption {
  /** Unique key stored in state. */
  id: string;
  /** Display label, e.g. "La Marsa & Corniche". */
  label: string;
  /** Extra badge text (e.g. "Waterside Romance"). */
  tag?: string;
  /** Emoji / pixel icon. */
  icon: string;
  /** Small subtitle text. */
  desc: string;
  /** Short label for the bottom RPG backpack bar (optional). */
  shortLabel?: string;
}

export interface DrinkOption {
  /** Unique key stored in state. */
  id: string;
  /** Display label. */
  label: string;
  /** Emoji / pixel icon. */
  icon: string;
  /** Fun stat popup, e.g. "+25 ENERGY ⚡". */
  stat: string;
  /** Short label for the bottom RPG backpack bar (optional). */
  shortLabel?: string;
}

export interface GreetingOption {
  /** Unique key stored in state. */
  id: string;
  /** Display label. */
  label: string;
  /** Emoji / pixel icon. */
  icon: string;
  /** Small subtitle text. */
  desc: string;
  /** Short label for the bottom RPG backpack bar. */
  shortLabel: string;
}

export interface TimeSlotOption {
  /** Unique key stored in state. */
  id: string;
  /** Display label. */
  label: string;
  /** Emoji icon. */
  icon: string;
  /** Small helper text, e.g. "10:00 AM". */
  desc: string;
  /** Mark the "custom time" slot so the app knows it needs an input. */
  isCustom?: boolean;
}

export interface DateOption {
  /** Short weekday, e.g. "Mon". */
  day: string;
  /** Short date, e.g. "Aug 17". */
  date: string;
  /** Day number, e.g. "17". */
  dayNum: string;
  /** Full readable date, e.g. "Monday, August 17, 2026". */
  fullDate: string;
  /** ISO date, e.g. "2026-08-17". */
  iso: string;
}

// 👇 Edit the couple's names once here — they flow into every
// option name, letter, and screen below automatically.
const NAMES = {
  girlfriendName: "Eva",
  boyfriendName: "Sam",
};

export const APP_CONFIG = {
  // ------------------------------------------------------------
  // 👫 THE COUPLE
  // ------------------------------------------------------------
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,

  // Text shown in the top-left header
  websiteTitle: `${NAMES.girlfriendName.toUpperCase()}'S DATE QUEST`,

  // ------------------------------------------------------------
  // ✉️ EMAIL DELIVERY
  // ------------------------------------------------------------
  // Optional default email prefilled in the ⚙️ Settings modal
  // (only used when the visitor has no saved email yet).
  // Leave "" to force the visitor to type an email at the end.
  prefillEmail: "",

  // ------------------------------------------------------------
  // 📅 AVAILABLE DATES (the pixel calendar)
  // ------------------------------------------------------------
  dateRange: [
    { day: "Mon", date: "Aug 17", dayNum: "17", fullDate: "Monday, August 17, 2026", iso: "2026-08-17" },
    { day: "Tue", date: "Aug 18", dayNum: "18", fullDate: "Tuesday, August 18, 2026", iso: "2026-08-18" },
    { day: "Wed", date: "Aug 19", dayNum: "19", fullDate: "Wednesday, August 19, 2026", iso: "2026-08-19" },
    { day: "Thu", date: "Aug 20", dayNum: "20", fullDate: "Thursday, August 20, 2026", iso: "2026-08-20" },
    { day: "Fri", date: "Aug 21", dayNum: "21", fullDate: "Friday, August 21, 2026", iso: "2026-08-21" },
    { day: "Sat", date: "Aug 22", dayNum: "22", fullDate: "Saturday, August 22, 2026", iso: "2026-08-22" },
    { day: "Sun", date: "Aug 23", dayNum: "23", fullDate: "Sunday, August 23, 2026", iso: "2026-08-23" },
  ],

  // ------------------------------------------------------------
  // ⏰ TIME SLOTS (Quest #1)
  // ------------------------------------------------------------
  timeSlots: [
    { id: "Morning 🌅", label: "Morning", icon: "🌅", desc: "10:00 AM" },
    { id: "Afternoon ☀️", label: "Afternoon", icon: "☀️", desc: "2:30 PM" },
    { id: "Evening 🌇", label: "Evening", icon: "🌇", desc: "6:30 PM" },
    { id: "Night 🌙", label: "Night", icon: "🌙", desc: "8:30 PM" },
    { id: "Custom ⏰", label: "Custom", icon: "⏰", desc: "Any time", isCustom: true },
  ],

  // ------------------------------------------------------------
  // 🎯 ACTIVITIES (Quest #2 — multiple selection allowed)
  // ------------------------------------------------------------
  activities: [
    { id: "Cinema 🍿", title: "Cinema", icon: "🍿", desc: "Movie date", shortLabel: "Cinema" },
    { id: "Café ☕", title: "Café", icon: "☕", desc: "Rakcha fi kahwa", shortLabel: "Café" },
    { id: "Dinner 🍝", title: "Dinner", icon: "🍝", desc: "MEKLAAAAAAA", shortLabel: "Dinner" },
    { id: "Games / Arcade 🎮", title: "Games", icon: "🎮", desc: "Nalabou bl PC", shortLabel: "Games" },
    { id: "Sunset Walk 🌅", title: "Sunset Walk", icon: "🌅", desc: "Namlou marche", shortLabel: "Walk" },
    { id: "Shopping 🛍️", title: "Shopping", icon: "🛍️", desc: "SHOPPPINNGG", shortLabel: "Shopping" },
    { id: "Something Creative 🎨", title: "Creative Date", icon: "🎨", desc: "Nobd3o w jaw", shortLabel: "Creative" },
    { id: "Surprise Me 🎁", title: "Surprise Me", icon: "🎁", desc: "", shortLabel: "Surprise" },
  ],

  // ------------------------------------------------------------
  // 🗺️ LOCATIONS (Quest #3)
  // ------------------------------------------------------------
  locations: [
    { id: "Les Berges du Lac", label: "Les Berges du Lac", tag: "Waterside Romance", icon: "🌊", desc: "Namlo doura w machya bahdha Lac", shortLabel: "Lac" },
    { id: "El Marsa", label: "La Marsa & Corniche", tag: "Breezy Seaside", icon: "🏖️", desc: "Nemchiw l kahwa mezyena ghadika", shortLabel: "El Marsa" },
    { id: "Sidi Bou Said Heights", label: "Sidi Bou Said Heights", tag: "Historic Starlight", icon: "🏛️", desc: "Neklou bambalouni w nemchiw nokodou al bhar", shortLabel: "Sidi Bou" },
    { id: "Surprise me 🎁", label: `Surprise me (${NAMES.girlfriendName} decides)`, tag: "SECRET REALM", icon: "🎁", desc: "Enti tkhalihelna surprise", shortLabel: "Surprise" },
    { id: "Aouina", label: "Compozz", tag: "Food date", icon: "🍔🍟", desc: "Namlou date tma5mi5 w mekla", shortLabel: "Compozz" },
    { id: "Rades Parc", label: "Rades Parc", tag: "Nature & Romance", icon: "🌳", desc: "Nchemo hwé ndhif w namlou doura mezyena", shortLabel: "Rades" },
  ],

  // The "I'll choose the place myself…" special option (id + button text)
  customLocationId: "Andi fekra okhra 😏",
  customLocationLabel: "Andi fekra okhra...",

  // ------------------------------------------------------------
  // 🥤 DRINKS (Quest #4 — single selection)
  // ------------------------------------------------------------
  drinks: [
    { id: "Coffee ☕", label: "Coffee", icon: "☕", stat: "+25 ENERGY ⚡", shortLabel: "Coffee" },
    { id: "Frapuccino 🧋", label: "Frapuccino", icon: "🧋", stat: "+30 SWEETNESS 🧋", shortLabel: "Frapuccino" },
    { id: "Gazouza 🥤", label: "Gazouza", icon: "🥤", stat: "+15 KACHKOUCHA 🫧", shortLabel: "Gazouza" },
    { id: "Fresh Juice 🍹", label: "Fresh Juice", icon: "🍹", stat: "+20 VITAMIN C 🍊", shortLabel: "Juice" },
    { id: "Hata chy 🙄", label: "Hata chy", icon: "🙄", stat: "-10 SCORE 😆", shortLabel: "Hata chy" },
    { id: "Tea 🍵", label: "Warm Tea", icon: "🍵", stat: "+20 COZY VIBES 🍵", shortLabel: "Tea" },
    { id: "Water 💧", label: "Water", icon: "💧", stat: "+100 HYDRATION 💧", shortLabel: "Water" },
    { id: "Enti t9arer 😏", label: "Enti t9arer", icon: "😏", stat: "+50 MYSTERY 🔮", shortLabel: "Surprise" },
  ],

  // The "Custom drink" special option id
  customDrinkId: "Custom 🥤",

  // ------------------------------------------------------------
  // 🤗 GREETINGS (Quest #5 — multiple selection allowed)
  // ------------------------------------------------------------
  greetings: [
    { id: "Big hug 🤗", label: "Biiiiiig hug", icon: "🤗", desc: "Tight warm hug", shortLabel: "Biiig hug" },
    { id: "Sweet kiss 😘", label: "Bousa marsousaa", icon: "😘", desc: "Bousaa jamila", shortLabel: "Bousa" },
    { id: "Romantic wild kiss 💋", label: "Wild kiss", icon: "💋", desc: "Bousaa tdhaweeb 🫠", shortLabel: "Wild kiss" },
    { id: "Casual \"hey\" 👋", label: "Casual \"hey\"", icon: "👋", desc: "Tkoli Aslema Hob hyeti", shortLabel: "Hey" },
    { id: "Flirty look 😏", label: "Flirty look", icon: "😏", desc: "Nadhaarat ala jnab", shortLabel: "Nadhra" },
    { id: "Run toward me 🏃", label: "Run toward me", icon: "🏃", desc: "Jaryaaaa tji andi", shortLabel: "Jarya" },
    { id: "Tease me right away 😈", label: "Tetnamer aleyaa", icon: "😈", desc: "ntaychek ml karhba rani", shortLabel: "Tanmir" },
    { id: "Surprise me 🎁", label: "Surprise me", icon: "🎁", desc: "Tkhalihali SURPRISE", shortLabel: "Surprise" },
  ],

  // ------------------------------------------------------------
  // 😜 ESCAPING "I don't think so" BUTTON TAUNTS
  // ------------------------------------------------------------
  escapingButtonTaunts: [
    "I don't think so 🙄",
    "Krobt 😌",
    "ANSAAAA",
    "Jareb jareb chedni",
    "Rzinaaaaaaa yaser",
    "NO NO NO",
    "Betbi3aaa makch bch ta5let",
    "hehehehe",
    "ALEH MAZELT THAWEL 😭",
    "Ouuuh mamsetni 😆",
    "Makch herba meni ya rouhi 🥸",
    "Ti enzel ala 'EYY' w eb3edna! 🙄",
  ],

  // ------------------------------------------------------------
  // 💌 SECRET LOVE NOTE (the 💌 button on the celebration screen)
  // ------------------------------------------------------------
  secretLoveNote: {
    title: "A Little Secret Note For You 💌",
    message:
      "I cannot wait for our date! You make every single day brighter, funnier, and sweeter. Thank you for being the most amazing person ever. See you very soon, my love! ❤️🎮✨",
    signOff: `Forever yours, ${NAMES.boyfriendName} ❤️`,
  },
};

// Helpers used by components
export const findTimeSlot = (id: string) =>
  APP_CONFIG.timeSlots.find((t) => t.id === id);

export const findLocation = (id: string) =>
  APP_CONFIG.locations.find((l) => l.id === id);

export const findDrink = (id: string) =>
  APP_CONFIG.drinks.find((d) => d.id === id);

export const findGreeting = (id: string) =>
  APP_CONFIG.greetings.find((g) => g.id === id);

export const isCustomTime = (id: string) => findTimeSlot(id)?.isCustom === true;