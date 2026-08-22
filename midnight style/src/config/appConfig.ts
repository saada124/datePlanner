// ============================================================
// 🌌 MIDNIGHT STARLIGHT EDITION — CUSTOMIZATION CONFIG
// ============================================================
// 👉 EDIT THIS FILE to personalize the website.
// Every section below maps to a screen of the game.
// Keep "id" values unique within each list.
// ============================================================

export interface MidnightTimeSlot {
  /** Unique key (internal). */
  id: string;
  /** Display label, e.g. "Twilight Moon". */
  label: string;
  /** Time text, e.g. "8:00 PM". */
  time: string;
  /** Emoji icon. */
  icon: string;
}

export interface MidnightChoice {
  /** Unique key (internal). */
  id: string;
  /** Display name (this is what gets stored in the date summary). */
  name: string;
  /** Emoji icon. */
  icon: string;
  /** Small subtitle text. */
  desc: string;
}

export interface MidnightLocation extends MidnightChoice {
  /** Extra badge text, e.g. "Waterside Romance". */
  tag: string;
}

export interface DateOption {
  /** Short weekday, e.g. "Mon". */
  day: string;
  /** Short date, e.g. "Aug 17". */
  date: string;
  /** Full readable date, e.g. "Monday, August 17, 2026". */
  fullDate: string;
  /** ISO date, e.g. "2026-08-17". */
  iso: string;
}

// 👇 Edit the couple's names once here — they flow into every
// option name, letter, and screen below automatically.
const NAMES = {
  girlfriendName: "Yosr",
  boyfriendName: "Talel",
  girlfriendInitial: "Y",
  boyfriendInitial: "T",
};

export const APP_CONFIG = {
  // ------------------------------------------------------------
  // 👫 THE COUPLE
  // ------------------------------------------------------------
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  girlfriendInitial: NAMES.girlfriendInitial,
  boyfriendInitial: NAMES.boyfriendInitial,

  // Text shown in the top-left header
  websiteTitle: "Talel & Yosr",
  websiteTagline: "Midnight Starlight Edition",

  // ------------------------------------------------------------
  // ✉️ EMAIL DELIVERY
  // ------------------------------------------------------------
  // Optional default email prefilled in the ⚙️ Settings modal
  // (only used when the visitor has no saved email yet).
  // Leave "" to force the visitor to type an email at the end.
  prefillEmail: "",

  // ------------------------------------------------------------
  // 📅 AVAILABLE DATES (the starlight calendar)
  // ------------------------------------------------------------
  dateRange: [
    { day: "Mon", date: "Aug 17", fullDate: "Monday, August 17, 2026", iso: "2026-08-17" },
    { day: "Tue", date: "Aug 18", fullDate: "Tuesday, August 18, 2026", iso: "2026-08-18" },
    { day: "Wed", date: "Aug 19", fullDate: "Wednesday, August 19, 2026", iso: "2026-08-19" },
    { day: "Thu", date: "Aug 20", fullDate: "Thursday, August 20, 2026", iso: "2026-08-20" },
    { day: "Fri", date: "Aug 21", fullDate: "Friday, August 21, 2026", iso: "2026-08-21" },
    { day: "Sat", date: "Aug 22", fullDate: "Saturday, August 22, 2026", iso: "2026-08-22" },
    { day: "Sun", date: "Aug 23", fullDate: "Sunday, August 23, 2026", iso: "2026-08-23" },
  ],

  // ------------------------------------------------------------
  // ⏰ TIME SLOTS (Stage 1)
  // ------------------------------------------------------------
  timeSlots: [
    { id: "sunset", label: "Sunset Starlight", time: "6:30 PM", icon: "🌆" },
    { id: "twilight", label: "Twilight Moon", time: "8:00 PM", icon: "🌙" },
    { id: "midnight", label: "Cozy Midnight Hour", time: "9:30 PM", icon: "🌌" },
  ],

  // ------------------------------------------------------------
  // 💫 ACTIVITIES (Stage 2 — multiple selection allowed)
  // ------------------------------------------------------------
  activities: [
    { id: "rooftop", name: "Stargazing Rooftop Lounge", icon: "✨", desc: "Sipping drinks while looking over the twinkling city" },
    { id: "cozy_dinner", name: "Candlelight Midnight Dinner", icon: "🍷", desc: "Delicious food, intimate vibes, and cozy laughter" },
    { id: "arcade", name: "Neon Arcade & Air Hockey", icon: "🕹️", desc: "Playful games, 2-player battles, and winning plushies" },
    { id: "sunset_walk", name: "Moonlit Romantic Walk", icon: "🌙", desc: "Walking hand in hand through glowing city streets" },
    { id: "dessert", name: "Late Night Gelato & Waffles", icon: "🍨", desc: "Sweet treats, warm dessert cafes, and stealing bites" },
    { id: "cinema", name: "Cozy Cinema & Popcorn", icon: "🎬", desc: "Watching a great movie with endless cuddles" },
  ],

  // ------------------------------------------------------------
  // 🗺️ LOCATIONS (Stage 3)
  // ------------------------------------------------------------
  locations: [
    { id: "lac_berges", name: "Les Berges du Lac", tag: "Waterside Romance", icon: "🌊", desc: "Serene lakeside night strolls & stylish cafes" },
    { id: "marsa", name: "La Marsa & Corniche", tag: "Breezy Seaside", icon: "🏖️", desc: "Ocean breezes, beachside lights & fresh air" },
    { id: "sidi_bou", name: "Sidi Bou Said", tag: "Historic Starlight", icon: "🏛️", desc: "Cobblestone alleys, glowing blue doors & cliffside views" },
    { id: "gam_arth", name: "Gammarth Hills", tag: "Panoramic Skyline", icon: "✨", desc: "Rooftop lounges with sweeping night vistas" },
    { id: "menzah", name: "Ennasr / Menzah", tag: "Vibrant Nightlife", icon: "☕", desc: "Buzzing cozy cafes, dessert spots & lively energy" },
    { id: "surprise", name: `${NAMES.boyfriendName}’s Secret Starlight Spot 🤫`, tag: "VIP Mystery", icon: "🎁", desc: "Let me surprise you with a hand-picked celestial spot" },
  ],

  // ------------------------------------------------------------
  // 🥤 DRINKS (Stage 4)
  // ------------------------------------------------------------
  drinks: [
    { id: "boba", name: "Starlight Boba & Taro Milk Tea", icon: "🧋", desc: "Chewy brown sugar boba with creamy starlight sweetness" },
    { id: "matcha", name: "Iced Cosmic Vanilla Matcha", icon: "🍵", desc: "Silky whipped oat milk with pure ceremonial matcha" },
    { id: "mocktail", name: "Neon Berry Sunset Mocktail", icon: "🍹", desc: "Fizzy sparkling berries, mint, and fresh lime zest" },
    { id: "coffee", name: "Caramel Macchiato / Spanish Latte", icon: "☕", desc: "Rich espresso, velvet foam, and warm caramel drizzle" },
    { id: "hot_choco", name: "Midnight Belgian Hot Chocolate", icon: "🍫", desc: "Decadent melted cocoa with mini roasted marshmallows" },
    { id: "surprise", name: `${NAMES.boyfriendName}’s Starlight Surprise Drink 🪄`, icon: "✨", desc: "Leave the drink order in my trustworthy hands" },
  ],

  // ------------------------------------------------------------
  // 🤗 GREETINGS (Stage 5 — multiple selection allowed)
  // ------------------------------------------------------------
  greetings: [
    { id: "tight_hug", name: "The Long Warm Hug", icon: "🫂", desc: "Squeezing you tight and not letting go for a minute" },
    { id: "forehead_kiss", name: "Gentle Forehead Kiss", icon: "💋", desc: "A soft, sweet kiss to make all stress melt away" },
    { id: "hand_kiss", name: "Gentleman Hand Kiss", icon: "✨", desc: "Taking your hand gently like a proper prince" },
    { id: "cheek_pinch", name: "Cheek Pinch & Tease", icon: "🥰", desc: "Smiling ear to ear because you look so adorable" },
  ],

  // ------------------------------------------------------------
  // 😜 ESCAPING "I DON'T THINK SO" BUTTON TAUNTS
  // ------------------------------------------------------------
  escapingButtonTaunts: [
    "I don't think so 🙄",
    "Caught in a gravitational orbit! 🪐",
    "Swooshed past like a shooting star ✨",
    "The stars say: absolutely not 😌",
    "You can't escape my universe! 💖",
    "Almost caught it! 🚀",
    "Written in the cosmos: Say Yes! 🌌",
    "Resistance is impossible, darling 🌸",
    "Nice try, cutie! 🥰",
    "Just click Obviously already! ❤️",
  ],

  // ------------------------------------------------------------
  // 💌 SECRET MIDNIGHT LETTER (the 💌 button on the celebration screen)
  // ------------------------------------------------------------
  secretMidnightLetter: {
    salutation: `To My Starlight, ${NAMES.girlfriendName} ✨`,
    body: "In a galaxy of eight billion people, you are the brightest, warmest, and most breathtaking light in my sky. I cannot wait to look into your eyes on our date, laugh with you, and create another celestial memory together.",
    signOff: "Loving you across all galaxies,",
    author: `${NAMES.boyfriendName} ❤️`,
  },
};

// Helper: build the stored time string, e.g. "Twilight Moon (8:00 PM)"
export const formatTimeSlot = (slot: MidnightTimeSlot) => `${slot.label} (${slot.time})`;