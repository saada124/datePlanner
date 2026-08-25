export const NAMES = {
  girlfriendName: 'Yosr',
  boyfriendName: 'Talel',
  girlfriendInitial: 'Y',
  boyfriendInitial: 'T'
};

export interface WatercolorTimeSlot {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface WatercolorActivity {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface WatercolorLocation {
  id: string;
  label: string;
  icon: string;
  tag: string;
}

export interface WatercolorDrink {
  id: string;
  label: string;
  icon: string;
  note: string;
}

export interface WatercolorGreeting {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface DateOption {
  day: string;
  date: string;
  fullDate: string;
  iso: string;
}

export const APP_CONFIG = {
  websiteTitle: 'A Watercolor Dream',
  websiteTagline: '~ Painted for Two ~',

  // Couple names
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  girlfriendInitial: NAMES.girlfriendInitial,
  boyfriendInitial: NAMES.boyfriendInitial,

  // Prefilled email for the ⚙️ settings modal (used when nothing is stored in localStorage yet)
  prefillEmail: '',

  // Dates: August 17 to August 23 (2026)
  dateRange: [
    { day: 'Mon', date: 'Aug 17', fullDate: 'Monday, August 17, 2026', iso: '2026-08-17' },
    { day: 'Tue', date: 'Aug 18', fullDate: 'Tuesday, August 18, 2026', iso: '2026-08-18' },
    { day: 'Wed', date: 'Aug 19', fullDate: 'Wednesday, August 19, 2026', iso: '2026-08-19' },
    { day: 'Thu', date: 'Aug 20', fullDate: 'Thursday, August 20, 2026', iso: '2026-08-20' },
    { day: 'Fri', date: 'Aug 21', fullDate: 'Friday, August 21, 2026', iso: '2026-08-21' },
    { day: 'Sat', date: 'Aug 22', fullDate: 'Saturday, August 22, 2026', iso: '2026-08-22' },
    { day: 'Sun', date: 'Aug 23', fullDate: 'Sunday, August 23, 2026', iso: '2026-08-23' },
  ] as DateOption[],

  // Free-form date range texts (shown on the cover, the invitation card and the chapter progress)
  dateRangeText: 'August 17–23',
  dateRangeShortText: 'Aug 17–23',
  dateRangeDescription: 'between August 17 and August 23',

  // Voice note — put an mp3 file at public/audio/voice-note.mp3 and it plays on the cover & finale.
  // Set src to '' to hide the voice note feature entirely.
  voiceNote: {
    title: 'A Message for You 🎙️',
    subtitle: 'Press play — this one is painted just for you',
    src: '/audio/voice-note.mp3'
  },

  // Time of day choices
  timeSlots: [
    { id: 'Golden Morning 🌅', label: 'Morning', icon: '🌅', desc: 'Soft light & fresh air' },
    { id: 'Lazy Afternoon ☁️', label: 'Afternoon', icon: '☁️', desc: 'Slow time & sunshine' },
    { id: 'Pink Sunset 🌸', label: 'Sunset', icon: '🌸', desc: 'Golden hour magic' },
    { id: 'Moonlit Night 🌙', label: 'Night', icon: '🌙', desc: 'Whispers under the stars' },
    { id: 'Custom Time ⏰', label: 'Custom', icon: '⏰', desc: 'Any exact time' },
  ] as WatercolorTimeSlot[],
  customTimeId: 'Custom Time ⏰',

  // Activity choices (multi-select)
  activities: [
    { id: 'Picnic by the Lake 🧺', title: 'Lakeside Picnic', icon: '🧺', desc: 'Blanket, snacks & swans' },
    { id: 'Flower Market Walk 💐', title: 'Flower Market', icon: '💐', desc: 'Bouquets & giggles' },
    { id: 'Painting Together 🎨', title: 'Paint & Sip', icon: '🎨', desc: 'Watercolors & cake' },
    { id: 'Sunset Beach Stroll 🌊', title: 'Beach Stroll', icon: '🌊', desc: 'Barefoot in the sand' },
    { id: 'Café & Pastries 🍰', title: 'Café Date', icon: '🍰', desc: 'Croissants & chatter' },
    { id: 'Pottery Class 🏺', title: 'Pottery Fun', icon: '🏺', desc: 'Messy, silly, adorable' },
    { id: 'Kite Flying 🪁', title: 'Kite Flying', icon: '🪁', desc: 'Chasing the wind' },
    { id: 'Surprise Me 🎁', title: 'Surprise Me', icon: '🎁', desc: `${NAMES.boyfriendName} paints a mystery plan` },
  ] as WatercolorActivity[],

  // Location choices
  locations: [
    { id: 'Under the Willow Tree 🌿', label: 'Under the willow tree', icon: '🌿', tag: 'Secret' },
    { id: 'The Lake Shore 🦢', label: 'The lake shore', icon: '🦢', tag: 'Serene' },
    { id: 'The Flower Meadow 🌼', label: 'The flower meadow', icon: '🌼', tag: 'Romantic' },
    { id: 'A Tiny Pastel Café 🍰', label: 'A tiny pastel café', icon: '🍰', tag: 'Cozy' },
    { id: 'The Old Art Gallery 🖼️', label: 'The old art gallery', icon: '🖼️', tag: 'Inspiring' },
    { id: 'The Rooftop at Dusk 🌇', label: 'The rooftop at dusk', icon: '🌇', tag: 'Dreamy' },
    { id: 'Surprise Me 🎁', label: `Surprise me (${NAMES.boyfriendName} picks the spot)`, icon: '🎁', tag: 'Mystery' },
  ] as WatercolorLocation[],
  customLocationId: "I'll paint the place myself...",
  customLocationButtonText: 'I have a specific place in mind...',

  // Drink choices
  drinks: [
    { id: 'Lavender Lemonade 🍋', label: 'Lavender Lemonade', icon: '🍋', note: 'Floral & cool' },
    { id: 'Strawberry Milkshake 🍓', label: 'Strawberry Shake', icon: '🍓', note: 'Sweet & creamy' },
    { id: 'Peach Iced Tea 🍑', label: 'Peach Iced Tea', icon: '🍑', note: 'Sunny & soft' },
    { id: 'Rose Latte 🌹', label: 'Rose Latte', icon: '🌹', note: 'Elegant & warm' },
    { id: 'Mint Hot Cocoa 🍫', label: 'Mint Cocoa', icon: '🍫', note: 'Cozy & dreamy' },
    { id: 'Hibiscus Flower Tea 🌺', label: 'Flower Tea', icon: '🌺', note: 'Ruby & calming' },
    { id: 'Sparkling Water ✨', label: 'Sparkling Water', icon: '✨', note: 'Light & fresh' },
    { id: 'You decide 😏', label: 'You decide 😏', icon: '😏', note: 'Mystery drink' },
  ] as WatercolorDrink[],
  customDrinkId: 'Custom Drink 🥤',

  // Greeting choices (multi-select)
  greetings: [
    { id: 'Soft kiss 💋', label: 'Soft kiss', icon: '💋', desc: 'A whispered hello' },
    { id: 'Long warm hug 🤗', label: 'Long warm hug', icon: '🤗', desc: 'Slow & tight' },
    { id: 'Twirl & Spin 🩰', label: 'Twirl & spin', icon: '🩰', desc: 'Lift me off my feet' },
    { id: 'Paint-smile 😄', label: 'Paint-smile', icon: '😄', desc: 'Your biggest grin' },
    { id: 'Cheek pinch 🤏', label: 'Cheek pinch', icon: '🤏', desc: 'Playful & cute' },
    { id: 'Starry eyes 😍', label: 'Starry eyes', icon: '😍', desc: 'Look at me like that' },
    { id: 'Running hug 🏃‍♀️', label: 'Running hug', icon: '🏃‍♀️', desc: 'Full-speed landing' },
    { id: 'Surprise me ❤️', label: 'Surprise me', icon: '❤️', desc: 'Anything you choose' },
  ] as WatercolorGreeting[],

  // Playful evasive button taunt lines
  escapingButtonTaunts: [
    'Oops, the paintbrush slipped! 🎨',
    "That's a watercolor illusion 🌈",
    'My palette ran away with it! 💦',
    'Almost — keep dreaming ✨',
    'The wind painted it away 🍃',
    "You're my favorite masterpiece 💖",
    'Nice try, my little muse 🌸',
    "Just say yes — it's a beautiful canvas 🌷",
    'Fate mixed the colors for us 🎨',
    'Destiny is a soft brushstroke ❤️'
  ],

  // Secret letter content
  secretLoveLetter: {
    salutation: `Dearest ${NAMES.girlfriendName},`,
    body: 'Some days are sketches, and some days are masterpieces. Every moment with you is a watercolor bloom — soft, bright, and impossible to forget. I cannot wait to paint our next memory together: your smile, your laugh, your hand in mine. Thank you for being the most beautiful color in my world.',
    signOff: 'With all my love,',
    author: `${NAMES.boyfriendName} ❤️`
  },

  // 10 Editable Reactions / Critiques for the Drawing Studio Mini-Game
  paintingReactions: [
    `🎨 100/10: The Louvre just called. Mona Lisa has officially been demoted for ${NAMES.girlfriendName}'s painting!`,
    `🌸 1000/10: Pure watercolor poetry. Destiny and love painted this together! ✨`,
    `👑 Infinity/10: Certified masterwork by Queen ${NAMES.girlfriendName} & ${NAMES.boyfriendName}! 👑`,
    `🍷 10/10: Monet and Van Gogh have been suspiciously quiet since you painted this.`,
    `💖 999/10: Warning: Extreme levels of cuteness and chemistry detected in this canvas!`,
    `🥐 10/10: Worth trading all the croissants in Paris for this single painting.`,
    `✨ 100/10: Picasso could never capture this much romantic magic.`,
    `🍰 10/10: Even sweeter than our favorite dessert after dinner. 🥠😏`,
    `🌹 1000/10: A masterpiece worthy of its own romantic museum exhibition.`,
    `🏆 100/10: Approved unconditionally by ${NAMES.boyfriendName} with maximum boyfriend pride! ❤️`
  ]
};