// ============================================================
// 🎧 THE DATE MIXTAPE — CUSTOMIZATION CONFIG
// ============================================================
// 👉 EDIT THIS FILE to personalize the website.
// Every name, choice, and word below is config-driven.
// ============================================================

export const NAMES = {
  girlfriendName: 'Yosr',
  boyfriendName: 'Talel',
  girlfriendInitial: 'Y',
  boyfriendInitial: 'T'
};

export interface MixtapeTimeSlot {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface MixtapeActivity {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface MixtapeLocation {
  id: string;
  label: string;
  icon: string;
  tag: string;
}

export interface MixtapeDrink {
  id: string;
  label: string;
  icon: string;
  note: string;
}

export interface MixtapeGreeting {
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
  websiteTitle: 'The Date Mixtape',
  websiteTagline: 'Side A — recorded with love',

  // Couple names
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  girlfriendInitial: NAMES.girlfriendInitial,
  boyfriendInitial: NAMES.boyfriendInitial,

  // Handwritten dedication on the cassette cover
  coverInscription: `for ${NAMES.girlfriendName} — the only song I never want to skip`,

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

  // Free-form date range texts
  dateRangeText: 'August 17–23',
  dateRangeShortText: 'Aug 17–23',
  dateRangeDescription: 'between August 17 and August 23',

  // Time of day choices
  timeSlots: [
    { id: 'Morning Set ☀️', label: 'Morning', icon: '☀️', desc: 'Fresh tapes, fresh coffee' },
    { id: 'Golden Hour Set 🎧', label: 'Golden Hour', icon: '🎧', desc: 'Warm light, slow songs' },
    { id: 'Sunset Jam 🌇', label: 'Sunset', icon: '🌇', desc: 'The sky does the mixing' },
    { id: 'Midnight Tape 🌙', label: 'Midnight', icon: '🌙', desc: 'Dancing close in the dark' },
    { id: 'Custom Time ⏰', label: 'Custom', icon: '⏰', desc: 'Any time you choose' },
  ] as MixtapeTimeSlot[],
  customTimeId: 'Custom Time ⏰',

  // Activity choices (multi-select)
  activities: [
    { id: 'Vinyl Hunt 💿', title: 'Vinyl Hunt', icon: '💿', desc: 'Digging for records, holding hands' },
    { id: 'Jam & Snack Session 🎸', title: 'Jam & Snack', icon: '🎸', desc: 'Air guitars & endless laughs' },
    { id: 'Dinner & Slow Tunes 🍝', title: 'Dinner & Slow Tunes', icon: '🍝', desc: 'Our song on loop' },
    { id: 'Starlit Walk 🚶‍♂️', title: 'Starlit Walk', icon: '🚶‍♂️', desc: 'Silence never feels awkward with you' },
    { id: 'Cozy Movie Night 🎬', title: 'Cozy Movie Night', icon: '🎬', desc: 'Blankets, popcorn, no phone' },
    { id: 'Sunset Picnic 🧺', title: 'Sunset Picnic', icon: '🧺', desc: 'Tape player on the grass' },
    { id: 'Dance Under Lights 💃', title: 'Dance Under Lights', icon: '💃', desc: 'We are the playlist' },
    { id: 'Surprise Me 🎁', title: 'Surprise Me', icon: '🎁', desc: `${NAMES.boyfriendName} picks the B-side` },
  ] as MixtapeActivity[],

  // Location choices
  locations: [
    { id: 'The Record Café ☕', label: 'The record café', icon: '☕', tag: 'Cozy' },
    { id: 'The Rooftop at Dusk 🌆', label: 'The rooftop at dusk', icon: '🌆', tag: 'Romantic' },
    { id: 'The Lake Shore 🏞️', label: 'The lake shore', icon: '🏞️', tag: 'Serene' },
    { id: 'A Tiny Old Cinema 🎬', label: 'A tiny old cinema', icon: '🎬', tag: 'Vintage' },
    { id: 'The Night Market 🌙', label: 'The night market', icon: '🌙', tag: 'Lively' },
    { id: 'Under the Big Tree 🌳', label: 'Under the big tree', icon: '🌳', tag: 'Secret' },
    { id: 'Surprise Me 🎁', label: `Surprise me (${NAMES.boyfriendName} picks the spot)`, icon: '🎁', tag: 'Mystery' },
  ] as MixtapeLocation[],
  customLocationId: "I'll pick the exact spot myself...",
  customLocationButtonText: 'I have a special place in mind...',

  // Drink choices
  drinks: [
    { id: 'Iced Vanilla Coffee ☕', label: 'Iced Vanilla Coffee', icon: '☕', note: 'Slow sips, long talks' },
    { id: 'Hot Chocolate & Marshmallows 🍫', label: 'Hot Chocolate', icon: '🍫', note: 'Warm as our hugs' },
    { id: 'Strawberry Milkshake 🍓', label: 'Strawberry Shake', icon: '🍓', note: 'Sweet like you' },
    { id: 'Peach Iced Tea 🍑', label: 'Peach Iced Tea', icon: '🍑', note: 'Sunshine in a cup' },
    { id: 'Berry Smoothie 🫐', label: 'Berry Smoothie', icon: '🫐', note: 'Good for dancing' },
    { id: 'Sparkling Lemonade ✨', label: 'Sparkling Lemonade', icon: '✨', note: 'Effervescent, like my heart' },
    { id: 'Surprise Drink 😏', label: 'Surprise Drink', icon: '😏', note: 'Mystery flavor' },
  ] as MixtapeDrink[],
  customDrinkId: 'Custom Drink 🥤',

  // Greeting choices (multi-select)
  greetings: [
    { id: 'A hug that lasts a whole song 🤗', label: 'A long, slow hug', icon: '🤗', desc: 'One full song, minimum' },
    { id: 'A soft kiss on the forehead 💋', label: 'Forehead kiss', icon: '💋', desc: 'Tender hello' },
    { id: 'Spinning me around 🎡', label: 'Spin me around', icon: '🎡', desc: 'Lift me off my feet' },
    { id: 'Your hand in mine 🤝', label: 'Hand in hand', icon: '🤝', desc: 'Linked the whole set' },
    { id: 'A whispered hello 👂', label: 'A whispered hello', icon: '👂', desc: 'Only for my ears' },
    { id: 'That smile that breaks me 😍', label: 'That smile', icon: '😍', desc: 'You know the one' },
    { id: 'A forehead bump 🥰', label: 'Forehead bump', icon: '🥰', desc: 'Slow & sweet' },
    { id: 'Surprise me ❤️', label: 'Surprise me', icon: '❤️', desc: 'Anything you choose' },
  ] as MixtapeGreeting[],

  // Playful evasive button taunt lines
  escapingButtonTaunts: [
    'The tape just rewound! ⏪',
    'ERROR: TRACK “NO” NOT FOUND 🎼',
    'Side B has no room for “no” 💿',
    'My recorder glitched! 📼',
    'Almost — but the reels say yes 💖',
    'Nice try, my favorite song 🎶',
    'Static… I only hear “yes” 📻',
    'The cassette is stuck on us 🔁',
    'Press play on “yes” already! ▶️',
    'This mixtape only knows love ❤️'
  ],

  // Secret letter — written like folded liner notes
  secretLoveLetter: {
    salutation: `My dearest ${NAMES.girlfriendName},`,
    body: 'Every great love deserves a soundtrack — and if this tape could hold all my feelings, it would still run out of room. You are the song I never skip, the chorus that gets stuck in my heart, the melody that makes ordinary days unforgettable. I pressed record with my hands shaking and my heart full, because this date is just another verse of us. Hit play, and let us make it our favorite track.',
    signOff: 'Forever yours,',
    author: `${NAMES.boyfriendName} 🎧`
  }
};