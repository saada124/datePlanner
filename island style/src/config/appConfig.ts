// ============================================================
//      🌴 ISLAND GETAWAY (ANIMAL CROSSING) CONFIG
// ============================================================
//  Edit this file to customize the date choices, names, and text!
// ============================================================

export interface ChoiceOption {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  badge?: string;
}

export interface DateOption {
  day: string;
  date: string;
  dayNum: string;
  fullDate: string;
  iso: string;
}

export interface TimeSlotOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

const NAMES = {
  girlfriendName: "Sarah",
  boyfriendName: "Alex"
};

export const APP_CONFIG = {
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  prefillEmail: "",
  islandName: "Paradise Island 🏝️",
  
  // Evasive 'No' button funny text taunts
  taunts: [
    "No way! 🐝 Bee attack!",
    "Are you sure, Mayor? 🍃",
    "Tom Nook says no refund! 💰",
    "Dodo Airlines is boarding! ✈️",
    "Brewster brewed this for you! ☕",
    "Look at this balloon present! 🎈",
    "I'll trade 10,000 Bells for a YES! 🔔"
  ],

  // Cover Screen
  cover: {
    badge: "✈️ Dodo Airlines Charter Flight",
    headline: `Hey ${NAMES.girlfriendName}! 🏝️`,
    subtitle: `Will you join ${NAMES.boyfriendName} for a cozy Island Getaway Date?`,
    nookDialogue: `"Pack your net and your cutest outfit! We're booking a private flight to our dream island date!"`,
    yesButton: "Yes, Let's Fly! 🛫✨",
    noButton: "Maybe later... 🙅‍♀️"
  },

  // 1. Date Options
  dateRange: [
    { day: "Fri", date: "Aug 21", dayNum: "21", fullDate: "Friday, August 21, 2026", iso: "2026-08-21" },
    { day: "Sat", date: "Aug 22", dayNum: "22", fullDate: "Saturday, August 22, 2026", iso: "2026-08-22" },
    { day: "Sun", date: "Aug 23", dayNum: "23", fullDate: "Sunday, August 23, 2026", iso: "2026-08-23" },
    { day: "Mon", date: "Aug 24", dayNum: "24", fullDate: "Monday, August 24, 2026", iso: "2026-08-24" },
    { day: "Tue", date: "Aug 25", dayNum: "25", fullDate: "Tuesday, August 25, 2026", iso: "2026-08-25" },
    { day: "Wed", date: "Aug 26", dayNum: "26", fullDate: "Wednesday, August 26, 2026", iso: "2026-08-26" },
    { day: "Thu", date: "Aug 27", dayNum: "27", fullDate: "Thursday, August 27, 2026", iso: "2026-08-27" }
  ] as DateOption[],

  // Time Slots
  timeSlots: [
    { id: "morning", name: "Sunny Morning ☀️", icon: "🥐", desc: "10:00 AM — Breakfast & Coffee" },
    { id: "afternoon", name: "Golden Afternoon ⛅", icon: "🧋", desc: "02:30 PM — Stroll & Fun" },
    { id: "sunset", name: "Sunset Cruise 🌅", icon: "✨", desc: "06:00 PM — Golden Hour Glow" },
    { id: "starlight", name: "Starlight Night 🌌", icon: "🔭", desc: "08:30 PM — Cozy Night Vibes" },
    { id: "custom", name: "Custom Flight Time ⏱️", icon: "✨", desc: "Write our exact time!" }
  ] as TimeSlotOption[],

  // 2. Activities (Pockets Inventory)
  activities: [
    { id: "stargazing", name: "Celeste's Stargazing & Wishing", emoji: "🌠", desc: "Watching shooting stars on the beach & making wishes", badge: "Magical" },
    { id: "cafe", name: "Brewster's Roost Coffee Date", emoji: "☕", desc: "Warm pigeon-milk brew & heart-to-heart chats", badge: "Cozy" },
    { id: "museum", name: "Blathers' Romantic Museum Tour", emoji: "🏛️", desc: "Aquarium glow, dinosaur hall & art wing stroll", badge: "Cute" },
    { id: "picnic", name: "Sunset Beach Picnic & Blankets", emoji: "🧺", desc: "Yummy treats, sparkling juice & sea breeze", badge: "Romantic" },
    { id: "kk_slider", name: "K.K. Slider Acoustic Concert", emoji: "🎸", desc: "Front row campfire acoustic guitar jam", badge: "Live Music" },
    { id: "boat_tour", name: "Kapp'n's Sunset Boat Tour", emoji: "⛵", desc: "Sea shanties, ocean waves & secret island exploring", badge: "Adventure" },
    { id: "arcade", name: "Bells & Arcade High-Scores", emoji: "🕹️", desc: "Air hockey, claw machines & 2-player battles", badge: "Playful" },
    { id: "dessert_crawl", name: "Sweet Treats & Pastry Crawl", emoji: "🍰", desc: "Hunting down the finest ice cream & pastries", badge: "Delicious" },
    { id: "diy_craft", name: "DIY Pottery & Craft Workshop", emoji: "🔨", desc: "Making custom cute keepsakes together", badge: "Creative" },
    { id: "custom", name: "Special Secret Island Quest", emoji: "🗺️", desc: "Add our own custom adventure!", badge: "Custom" }
  ] as ChoiceOption[],

  // 3. Secret Locations
  locations: [
    { id: "secret_beach", name: "The Secret Hidden Cove 🏖️", emoji: "🌊", desc: "Quiet secluded shore with soft waves, driftwood & stars", badge: "Hidden Gem" },
    { id: "highland_cliff", name: "Lighthouse Highland Cliff 🗼", emoji: "🌸", desc: "Panoramic golden hour view overlooking the entire island", badge: "Scenic View" },
    { id: "roost_cafe", name: "The Roost Jazz Lounge ☕", emoji: "🦉", desc: "Velvet seats, soothing vinyl jazz & warm amber lighting", badge: "Warm & Cozy" },
    { id: "bamboo_grove", name: "Moonlit Bamboo Garden 🎋", emoji: "🎋", desc: "Gentle breeze, glowing lanterns & tranquil stone paths", badge: "Enchanting" },
    { id: "town_plaza", name: "Bustling Lantern Town Square 🏮", emoji: "🎪", desc: "Fairy lights, street food stalls & central fountain", badge: "Vibrant" },
    { id: "rooftop", name: "Starlight Rooftop Overlook ✨", emoji: "🌌", desc: "Cozy string lights, fairy cushions & city skyline", badge: "Romantic" },
    { id: "custom", name: "Our Custom Dream Spot 📍", emoji: "✨", desc: "Type any special place you love!", badge: "Custom" }
  ] as ChoiceOption[],

  // 4. Refreshments
  drinks: [
    { id: "brewster_special", name: "Brewster's Roost Coffee Blend ☕", emoji: "☕", desc: "Fresh dark roast with silky sweet cream" },
    { id: "coconut_juice", name: "Fresh Island Coconut Water 🥥", emoji: "🥥", desc: "Ice-cold with a cute pink umbrella straw" },
    { id: "boba", name: "Brown Sugar Boba Milk Tea 🧋", emoji: "🧋", desc: "Warm brown sugar stripes & chewy pearls" },
    { id: "mocktail", name: "Sparkling Hibiscus Berry Fizz 🍹", emoji: "🍹", desc: "Refreshing bubbly island fruit punch" },
    { id: "matcha", name: "Iced Ceremonial Matcha Latte 🍵", emoji: "🍵", desc: "Rich Japanese matcha with creamy oat milk" },
    { id: "hot_cocoa", name: "Campfire S'mores Hot Chocolate 🍫", emoji: "🍫", desc: "Toasted marshmallows & cocoa drizzle" },
    { id: "custom", name: "Custom Favorite Drink 🥤", emoji: "✨", desc: "Your exact favorite drink!" }
  ] as ChoiceOption[],

  // 5. Postcard Greetings
  greetings: [
    { id: "hug", name: "A giant warm teddy-bear hug 🤗", emoji: "🤗", desc: "The longest, warmest squeeze upon landing" },
    { id: "flowers", name: "Fresh-picked Hybrid Roses Bouquet 💐", emoji: "💐", desc: "Rare gold & pink blooming island roses" },
    { id: "boba_gift", name: "Holding your favorite drink ready 🥤", emoji: "🥤", desc: "Prepared just the way you like before you arrive" },
    { id: "cheek_kiss", name: "Sweet cheek kiss & warm smile 😚", emoji: "😚", desc: "Pure excitement to see you in person" },
    { id: "hand_spin", name: "Dramatic movie-style hug & spin ✨", emoji: "💃", desc: "Picking you up with a big laugh" }
  ] as ChoiceOption[],

  // Postcard Secret Note
  loveLetter: {
    title: `A Message from ${NAMES.boyfriendName} 💌`,
    badge: "Special Delivery",
    content: `Dear ${NAMES.girlfriendName},\n\nEvery day with you feels like discovering a 5-star island full of magic and sunshine. I can't wait to make wonderful new memories together on this special date.\n\nReady for takeoff? 🛫✨`
  }
};
