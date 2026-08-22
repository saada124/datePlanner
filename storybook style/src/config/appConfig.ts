export const NAMES = {
  girlfriendName: 'Yosr',
  boyfriendName: 'Talel',
  girlfriendInitial: 'Y',
  boyfriendInitial: 'T'
};

export interface StorybookTimeSlot {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface StorybookActivity {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface StorybookLocation {
  id: string;
  label: string;
  icon: string;
  tag: string;
}

export interface StorybookDrink {
  id: string;
  label: string;
  icon: string;
  note: string;
}

export interface StorybookGreeting {
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
  websiteTitle: 'A Story of Us',
  websiteTagline: '~ Date Edition ~',

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

  // Time of day choices
  timeSlots: [
    { id: 'Morning Sunrise 🌅', label: 'Morning', icon: '🌅', desc: 'Fresh coffee & daylight' },
    { id: 'Golden Afternoon ☀️', label: 'Afternoon', icon: '☀️', desc: 'Sunny walks & lunch' },
    { id: 'Twilight Evening 🌇', label: 'Evening', icon: '🌇', desc: 'Golden hour & dinner' },
    { id: 'Starlight Night 🌙', label: 'Night', icon: '🌙', desc: 'Cozy lights & night air' },
    { id: 'Custom Time ⏰', label: 'Custom', icon: '⏰', desc: 'Any exact time' },
  ] as StorybookTimeSlot[],
  customTimeId: 'Custom Time ⏰',

  // Activity choices (multi-select)
  activities: [
    { id: 'Cinema Date 🍿', title: 'Cinema Night', icon: '🍿', desc: 'Popcorn & film together' },
    { id: 'Cozy Café ☕', title: 'Cozy Café', icon: '☕', desc: 'Warm coffee & conversations' },
    { id: 'Candlelit Dinner 🍝', title: 'Romantic Dinner', icon: '🍝', desc: 'Delicious food & desserts' },
    { id: 'Arcade & Games 🎮', title: 'Arcade & Games', icon: '🎮', desc: 'Playful challenges & fun' },
    { id: 'Sunset Walk 🌅', title: 'Sunset Stroll', icon: '🌅', desc: 'Golden hour holding hands' },
    { id: 'Boutique Shopping 🛍️', title: 'Cute Shopping', icon: '🛍️', desc: 'Exploring cute local spots' },
    { id: 'Painting & Crafts 🎨', title: 'Creative Crafts', icon: '🎨', desc: 'Art, pottery, or sketching' },
    { id: 'Surprise Me 🎁', title: 'Surprise Me', icon: '🎁', desc: `${NAMES.boyfriendName} prepares a mystery date` },
  ] as StorybookActivity[],

  // Location choices
  locations: [
    { id: 'Your favorite place ❤️', label: 'Your favorite place', icon: '❤️', tag: 'Special' },
    { id: 'My favorite place 🏠', label: 'My favorite place', icon: '🏠', tag: 'Cozy' },
    { id: 'Somewhere new ✨', label: 'Somewhere brand new to explore', icon: '✨', tag: 'Adventure' },
    { id: 'Somewhere romantic 🌹', label: 'Somewhere deeply romantic', icon: '🌹', tag: 'Romantic' },
    { id: 'Somewhere peaceful 🌿', label: 'Somewhere peaceful & calm', icon: '🌿', tag: 'Serene' },
    { id: 'Somewhere fun 🎢', label: 'Somewhere lively & fun', icon: '🎢', tag: 'Playful' },
    { id: 'Surprise me 🎁', label: `Surprise me (${NAMES.boyfriendName} picks the spot)`, icon: '🎁', tag: 'Mystery' },
  ] as StorybookLocation[],
  customLocationId: "I'll choose the place myself...",
  customLocationButtonText: 'I have a specific location / place in mind...',

  // Drink choices
  drinks: [
    { id: 'Artisan Coffee ☕', label: 'Artisan Coffee', icon: '☕', note: 'Warm & aromatic' },
    { id: 'Sweet Boba Tea 🧋', label: 'Sweet Boba Tea', icon: '🧋', note: 'Brown sugar pearls' },
    { id: 'Sparkling Soda 🥤', label: 'Sparkling Soda', icon: '🥤', note: 'Bubbly & refreshing' },
    { id: 'Fresh Fruit Juice 🍹', label: 'Fruit Juice', icon: '🍹', note: 'Sweet & vibrant' },
    { id: 'Iced Vanilla Latte 🧊', label: 'Iced Latte', icon: '🧊', note: 'Cool & velvety' },
    { id: 'Herbal Flower Tea 🍵', label: 'Herbal Tea', icon: '🍵', note: 'Calming botanicals' },
    { id: 'Pure Water 💧', label: 'Pure Water', icon: '💧', note: 'Clean & responsible' },
    { id: 'You decide 😏', label: 'You decide 😏', icon: '😏', note: 'Mystery drink' },
  ] as StorybookDrink[],
  customDrinkId: 'Custom Drink 🥤',

  // Greeting choices (multi-select)
  greetings: [
    { id: 'Warm embrace 🤗', label: 'Warm embrace', icon: '🤗', desc: 'Tight comforting hug' },
    { id: 'Sweet kiss 💋', label: 'Sweet kiss', icon: '💋', desc: 'Soft romantic kiss' },
    { id: 'Glowing smile 😊', label: 'Glowing smile', icon: '😊', desc: 'Brightest happy smile' },
    { id: 'Casual "hey" 👋', label: 'Casual "hey"', icon: '👋', desc: 'Cool & relaxed' },
    { id: 'Flirty look 😏', label: 'Flirty look', icon: '😏', desc: 'Playful eye contact' },
    { id: 'Running hug 🏃', label: 'Running hug', icon: '🏃', desc: 'Dramatic slow-mo run' },
    { id: 'Playful tease 😈', label: 'Playful tease', icon: '😈', desc: 'Instant banter & laughs' },
    { id: 'Surprise me ❤️', label: 'Surprise me', icon: '❤️', desc: 'Spontaneous greeting' },
  ] as StorybookGreeting[],

  // Playful evasive button taunt lines
  escapingButtonTaunts: [
    "I don't think so 🙄",
    'Nice try, darling 🌸',
    'The wind carried it away! 🍃',
    'Almost caught it! 🕊️',
    'Fate has other plans ✨',
    "You're stuck with me forever 💖",
    'Nice reflexes! 😌',
    'Still trying? How adorable 💌',
    'Just say yes already! 🌹',
    'Destiny is calling... ❤️'
  ],

  // Secret letter content
  secretLoveLetter: {
    salutation: `Dearest ${NAMES.girlfriendName},`,
    body: 'Every chapter of my life is brighter, sweeter, and more magical because you are in it. I cannot wait for our date — to see your smile, hear your laugh, and make another unforgettable memory together. Thank you for being you.',
    signOff: 'With all my love,',
    author: `${NAMES.boyfriendName} ❤️`
  }
};