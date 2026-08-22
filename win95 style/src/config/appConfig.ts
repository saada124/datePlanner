export const NAMES = {
  girlfriendName: 'Yosr',
  boyfriendName: 'Talel',
  girlfriendInitial: 'Y',
  boyfriendInitial: 'T'
};

export interface Win95TimeSlot {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface Win95Activity {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface Win95Location {
  id: string;
  label: string;
  icon: string;
  tag: string;
}

export interface Win95Drink {
  id: string;
  label: string;
  icon: string;
  note: string;
}

export interface Win95Greeting {
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
  websiteTitle: 'DATE SETUP WIZARD',
  websiteTagline: 'LoveOS 95 • Build 2026',
  osName: 'LoveOS 95',

  // Couple names
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  girlfriendInitial: NAMES.girlfriendInitial,
  boyfriendInitial: NAMES.boyfriendInitial,

  // Prefilled email for the ⚙️ settings dialog (used when nothing is stored in localStorage yet)
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

  // Free-form date range texts (shown on the boot screen, wizard and license)
  dateRangeText: 'August 17–23',
  dateRangeShortText: 'Aug 17–23',
  dateRangeDescription: 'between August 17 and August 23',

  // Time of day choices
  timeSlots: [
    { id: 'morning.exe 🌅', label: 'Morning', icon: '🌅', desc: '07:00–12:00 • fresh drivers loaded' },
    { id: 'afternoon.sys ☀️', label: 'Afternoon', icon: '☀️', desc: '12:00–17:00 • sunny runtime' },
    { id: 'golden_hour.dll 🌇', label: 'Golden Hour', icon: '🌇', desc: '17:00–19:00 • best lighting' },
    { id: 'night.bat 🌙', label: 'Night', icon: '🌙', desc: '19:00+ • moonlight mode' },
    { id: 'custom.time ⏰', label: 'Custom', icon: '⏰', desc: 'Any exact time' },
  ] as Win95TimeSlot[],
  customTimeId: 'custom.time ⏰',

  // Activity choices (multi-select)
  activities: [
    { id: 'cinema.exe 🍿', title: 'Cinema', icon: '🍿', desc: 'Popcorn & film' },
    { id: 'café.exe ☕', title: 'Café', icon: '☕', desc: 'Coffee & chatter' },
    { id: 'arcade.exe 🎮', title: 'Arcade', icon: '🎮', desc: 'Playful challenges' },
    { id: 'dinner.exe 🍝', title: 'Dinner', icon: '🍝', desc: 'Delicious food' },
    { id: 'sunset_walk.bat 🌅', title: 'Sunset Walk', icon: '🌅', desc: 'Golden hour stroll' },
    { id: 'shopping.exe 🛍️', title: 'Shopping', icon: '🛍️', desc: 'Cute boutiques' },
    { id: 'picnic.exe 🧺', title: 'Picnic', icon: '🧺', desc: 'Blanket & snacks' },
    { id: 'surprise.exe 🎁', title: 'Surprise Me', icon: '🎁', desc: `${NAMES.boyfriendName} runs a mystery program` },
  ] as Win95Activity[],

  // Location choices (as file paths, obviously)
  locations: [
    { id: 'C:\\LAKE\\', label: 'C:\\LAKE\\', icon: '🦢', tag: 'Serene' },
    { id: 'C:\\CAFÉ\\', label: 'C:\\CAFÉ\\', icon: '☕', tag: 'Cozy' },
    { id: 'D:\\BEACH\\', label: 'D:\\BEACH\\', icon: '🌊', tag: 'Adventure' },
    { id: 'C:\\WILLOW_PARK\\', label: 'C:\\WILLOW_PARK\\', icon: '🌿', tag: 'Secret' },
    { id: 'C:\\ROOFTOP\\', label: 'C:\\ROOFTOP\\', icon: '🌇', tag: 'Dreamy' },
    { id: 'C:\\GALLERY\\', label: 'C:\\GALLERY\\', icon: '🖼️', tag: 'Inspiring' },
    { id: 'C:\\SURPRISE\\', label: `C:\\SURPRISE\\ (${NAMES.boyfriendName} picks)`, icon: '🎁', tag: 'Mystery' },
  ] as Win95Location[],
  customLocationId: 'C:\\MY_CHOICE\\',
  customLocationButtonText: 'Specify custom path...',

  // Drink choices
  drinks: [
    { id: 'coffee.sys ☕', label: 'coffee.sys', icon: '☕', note: 'Warm & aromatic' },
    { id: 'boba.dll 🧋', label: 'boba.dll', icon: '🧋', note: 'Brown sugar pearls' },
    { id: 'soda.exe 🥤', label: 'soda.exe', icon: '🥤', note: 'Bubbly & fresh' },
    { id: 'juice.bat 🍹', label: 'juice.bat', icon: '🍹', note: 'Sweet & vibrant' },
    { id: 'latte.drv 🧊', label: 'latte.drv', icon: '🧊', note: 'Cool & velvety' },
    { id: 'tea.ini 🍵', label: 'tea.ini', icon: '🍵', note: 'Calming botanicals' },
    { id: 'water.txt 💧', label: 'water.txt', icon: '💧', note: 'Clean & pure' },
    { id: 'root_beer.w95 😏', label: 'root_beer.w95', icon: '😏', note: 'Mystery drink' },
  ] as Win95Drink[],
  customDrinkId: 'custom.dll 🥤',

  // Greeting choices (multi-select)
  greetings: [
    { id: 'hug.exe 🤗', label: 'hug.exe', icon: '🤗', desc: 'Tight comforting hug' },
    { id: 'kiss.dll 💋', label: 'kiss.dll', icon: '💋', desc: 'Soft romantic kiss' },
    { id: 'smile.sys 😊', label: 'smile.sys', icon: '😊', desc: 'Brightest smile' },
    { id: 'hello.bat 👋', label: 'hello.bat', icon: '👋', desc: 'Cool & relaxed' },
    { id: 'wink.ocx 😉', label: 'wink.ocx', icon: '😉', desc: 'Playful eye contact' },
    { id: 'running_hug.exe 🏃', label: 'running_hug.exe', icon: '🏃', desc: 'Full-speed landing' },
    { id: 'tease.vbs 😈', label: 'tease.vbs', icon: '😈', desc: 'Instant banter' },
    { id: 'surprise.dll ❤️', label: 'surprise.dll', icon: '❤️', desc: 'Spontaneous greeting' },
  ] as Win95Greeting[],

  // Playful escaping button taunts (shown as system error dialogs)
  escapingButtonTaunts: [
    'ERROR 403: CANCEL NOT PERMITTED 💾',
    'ACCESS DENIED — try YES instead 😌',
    'Bad command or file name ❌',
    "I'm sorry Dave, I can't let you say no 🤖",
    'Fatal exception: your smile 😊',
    'Unexpected error: too cute to refuse 💕',
    'Rebooting... into YES 💖',
    'The floppy is full of love 💽',
    'This action is not supported ❤️',
    'System halted: please press YES 😏'
  ],

  // Secret letter content (a hidden README.TXT, naturally)
  secretLoveLetter: {
    fileTitle: 'README.TXT',
    salutation: `To: ${NAMES.girlfriendName}`,
    body: 'CONGRATULATIONS! You have been selected to receive 1 (one) guaranteed date, fully configured, virus-free, and impossible to cancel. The date setup wizard has detected 100% compatibility between our hearts. No further action is required — except showing up and smiling. Thank you for choosing LoveOS.',
    signOff: 'Installation completed by',
    author: `${NAMES.boyfriendName}.exe ❤️`
  }
};