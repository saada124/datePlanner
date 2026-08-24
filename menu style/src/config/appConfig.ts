import { StarterMoodOption, MainCourseOption, SideOption, DateOption, TimeSlotOption } from '../types';

export const NAMES = {
  girlfriendName: "Sarah",
  boyfriendName: "Alex"
};

export const APP_CONFIG = {
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  prefillEmail: "",
  menuTitle: "Date Menu",
  menuSubtitle: "pick what sounds good — table for two reserved",
  tableNumber: "Table N° 07 · Private Booth",

  // Course 1: Starter (The Vibe / Mood Chips)
  starters: [
    { id: "cozy", name: "Cozy & Warm 🕯️", emoji: "🕯️", tagline: "low lighting, gentle laughs & close cuddles" },
    { id: "fancy", name: "Fancy & Dressed Up ✨", emoji: "✨", tagline: "best outfits, perfume & romantic ambiance" },
    { id: "adventurous", name: "Adventurous & Wild 🌲", emoji: "🌲", tagline: "exploring new spots & spontaneous detours" },
    { id: "lazy", name: "Lazy & Chill 🛋️", emoji: "🛋️", tagline: "soft blankets, takeout & zero rush" },
    { id: "playful", name: "Playful & Silly 🧃", emoji: "🧃", tagline: "arcade games, dessert bets & belly laughs" },
    { id: "starlit", name: "Starlit & Dreamy 🌙", emoji: "🌙", tagline: "midnight walks, deep talks & open skies" }
  ] as StarterMoodOption[],

  // Course 2: Main (The Activity)
  mainCourses: [
    {
      id: "bistro_dinner",
      title: "Candlelit Bistro & Wine Tasting",
      subtitle: "Main Course N° 1",
      emoji: "🍷",
      description: "Sharing warm crusty bread, exquisite pasta, dim lanterns & unhurried conversation.",
      priceTag: "Free w/ Love",
      badge: "Chef's Special"
    },
    {
      id: "sunset_gelato",
      title: "Sunset Promenade & Artisanal Gelato",
      subtitle: "Main Course N° 2",
      emoji: "🍨",
      description: "Golden hour river stroll holding hands, tasting pistachio & dark chocolate scoops.",
      priceTag: "Priceless",
      badge: "Romantic Pick"
    },
    {
      id: "cooking_together",
      title: "Gourmet Home Cook-Off & Playlist",
      subtitle: "Main Course N° 3",
      emoji: "🍝",
      description: "Rolling homemade pasta dough, tasting sauces together and dancing around the kitchen.",
      priceTag: "100% Fun",
      badge: "Cozy Classic"
    },
    {
      id: "art_museum",
      title: "Gallery Crawl & Hidden Coffee Nook",
      subtitle: "Main Course N° 4",
      emoji: "🖼️",
      description: "Browsing vintage oil paintings and sketching silly portraits in a quiet corner booth.",
      priceTag: "Pure Joy",
      badge: "Inspiring"
    },
    {
      id: "arcade_boba",
      title: "Arcade Showdown & Boba Stakes",
      subtitle: "Main Course N° 5",
      emoji: "🕹️",
      description: "Air hockey, claw machines & Mario Kart — winner gets treated to endless milk tea.",
      priceTag: "High Energy",
      badge: "Playful"
    },
    {
      id: "custom_adventure",
      title: "Chef's Secret Surprise Excursion",
      subtitle: "Special Request",
      emoji: "✨",
      description: "Have a specific dream plan in mind? Tell the chef your exact vision!",
      priceTag: "Customized",
      badge: "Your Choice"
    }
  ] as MainCourseOption[],

  // Course 3: Sides (Handwritten Checkbox Toggles)
  sides: [
    {
      id: "surprise_dessert",
      label: "Surprise dessert stop on the way home",
      desc: "Warm cookies, crêpes or midnight pastries",
      emoji: "🍰"
    },
    {
      id: "polaroid_film",
      label: "Bring the Polaroid / film camera",
      desc: "Candid vintage snaps we can keep forever",
      emoji: "📷"
    },
    {
      id: "no_phones",
      label: "No-phones rule during our meal",
      desc: "100% undivided attention & eye contact",
      emoji: "📵"
    },
    {
      id: "curated_playlist",
      label: "Alex handles the car & dinner soundtrack",
      desc: "Hand-picked tunes matching the mood",
      emoji: "🎵"
    },
    {
      id: "stargazing_drive",
      label: "Scenic detour for late-night stargazing",
      desc: "Sitting on the hood watching the night sky",
      emoji: "🌌"
    },
    {
      id: "fresh_flowers",
      label: "Fresh flower bouquet waiting on the seat",
      desc: "Hand-picked blooms just for you",
      emoji: "💐"
    }
  ] as SideOption[],

  // Course 4: Dessert (Dates & Times)
  dateRange: [
    { day: "Fri", date: "Aug 21", dayNum: "21", fullDate: "Friday, August 21, 2026", iso: "2026-08-21" },
    { day: "Sat", date: "Aug 22", dayNum: "22", fullDate: "Saturday, August 22, 2026", iso: "2026-08-22" },
    { day: "Sun", date: "Aug 23", dayNum: "23", fullDate: "Sunday, August 23, 2026", iso: "2026-08-23" },
    { day: "Mon", date: "Aug 24", dayNum: "24", fullDate: "Monday, August 24, 2026", iso: "2026-08-24" },
    { day: "Tue", date: "Aug 25", dayNum: "25", fullDate: "Tuesday, August 25, 2026", iso: "2026-08-25" },
    { day: "Wed", date: "Aug 26", dayNum: "26", fullDate: "Wednesday, August 26, 2026", iso: "2026-08-26" },
    { day: "Thu", date: "Aug 27", dayNum: "27", fullDate: "Thursday, August 27, 2026", iso: "2026-08-27" }
  ] as DateOption[],

  timeSlots: [
    { id: "afternoon", title: "Afternoon Light", timeRange: "03:30 PM", icon: "☀️", vibe: "Sunshine, gentle strolls & afternoon tea" },
    { id: "golden_hour", title: "Golden Hour & Sunset", timeRange: "06:30 PM", icon: "🌅", vibe: "Warm amber glow & pre-dinner appetizers" },
    { id: "dinner", title: "Candlelit Evening Service", timeRange: "08:30 PM", icon: "🕯️", vibe: "Dim romantic lights, cocktails & slow dining" },
    { id: "late_night", title: "Midnight Stargazing", timeRange: "10:30 PM", icon: "🌙", vibe: "Late city drive, dessert & quiet rooftops" },
    { id: "custom_time", title: "Custom Hour", timeRange: "Custom", icon: "⏱️", vibe: "Specify your exact dream hour!" }
  ] as TimeSlotOption[],

  // Chef's secret love letter
  chefLetter: {
    title: `Chef's Note to ${NAMES.girlfriendName} 💌`,
    badge: "Order Verified · Table Reserved",
    content: `Dearest ${NAMES.girlfriendName},\n\nEvery day with you feels like discovering the sweetest, rarest item on the menu.\n\nWhether we're dressed up at a candlelit table or sharing late-night takeout in pajamas, choosing to spend my time with you is my easiest, most favorite order in the world.\n\nYour order is officially locked in. I can't wait for our date! ❤️\n\nForever yours,\n${NAMES.boyfriendName}`
  },

  // Interactive Scratch-Off Mystery Perks
  scratchCard: {
    title: "Chef's Scratch-Off Mystery Perk",
    subtitle: "Rub with finger / mouse to reveal your complimentary dessert prize!",
    perk: "✨ Secret Perk Unlocked: Midnight Hot Gelato & Warm Bakery Detour! 🍨🥐",
    code: "PERK-VIP-07"
  },

  // Pairing Notes Dictionary
  pairingTips: [
    {
      mood: "fancy",
      activity: "bistro_dinner",
      tip: "✦ Sommelier's Pairing Note: High heels & your favorite dress — the chef is reserving our corner booth!"
    },
    {
      mood: "cozy",
      activity: "cooking_together",
      tip: "✦ Sommelier's Pairing Note: Oversized hoodies, Italian red wine & endless flour fights in the kitchen."
    },
    {
      mood: "adventurous",
      activity: "sunset_gelato",
      tip: "✦ Sommelier's Pairing Note: Comfortable shoes for golden-hour exploring & trying at least 3 gelato flavors."
    },
    {
      mood: "playful",
      activity: "arcade_boba",
      tip: "✦ Sommelier's Pairing Note: Loser buys boba with double brown sugar boba pearls!"
    },
    {
      mood: "starlit",
      activity: "bistro_dinner",
      tip: "✦ Sommelier's Pairing Note: A slow candlelit dinner followed by a rooftop drive under the stars."
    }
  ],

  // 🥠 Fortune Cookie Slips
  fortuneCookies: [
    "Tonight's forecast: 100% chance of you not wearing pants.",
    "Someone in this relationship is getting lucky. Hint: it's you. Both of you.",
    "A wise fortune once said: less talking, more cuddling. Then more of the other thing.",
    "You will find hidden treasure. It's snacks. You hid snacks from yourself again.",
    "Beware of dad jokes today. They multiply when least expected.",
    "A great adventure awaits you. It's called 'finding the TV remote.'",
    "Confucius say: good things come to those who wait... but better things come to those who don't.",
    "Your love language today is physical touch. Specifically, a lot of it.",
    "You are irresistible. Scientifically proven. Source: me, biased, don't care.",
    "You will be swept off your feet tonight. Possibly literally.",
    "Warning: extreme cuteness detected. Proceed with kisses.",
    "In the near future, someone will worship the ground you walk on. That someone naps a lot and drools. It's still you though."
  ],

  // 🎟️ Tearable Golden Love Coupons
  loveCoupons: [
    {
      id: "coupon-1",
      code: "VIP-PASS-01",
      title: "1x Unlimited Aux DJ Rights",
      description: "Grants 100% uninterrupted control of the car audio system without any skips from the driver.",
      icon: "🎵",
      badge: "NON-EXPIRING"
    },
    {
      id: "coupon-2",
      code: "VIP-PASS-02",
      title: "1x Emergency Shoulder Massage",
      description: "Redeemable on date night or anytime for a relaxing 15-minute tension-relief massage.",
      icon: "💆‍♀️",
      badge: "UNCONDITIONAL"
    },
    {
      id: "coupon-3",
      code: "VIP-PASS-03",
      title: "1x Chef Late-Night Snack Duty",
      description: "Boyfriend prepares whatever midnight snack or hot beverage you crave with zero objections.",
      icon: "🍨",
      badge: "LIFETIME GUARANTEE"
    }
  ],

  // 📸 Polaroid Memories on the Table
  // You can drop your images in the `menu style/public/` folder (e.g. `public/couple1.jpg`)
  // and reference them here as `"/couple1.jpg"`, or paste any direct image URL.
  polaroid: {
    imageUrl: "", // e.g. "/couple1.jpg" or "https://images.unsplash.com/..."
    caption: "Our Favorite Laughs · Table N° 07",
    noteOnBack: `To my favorite person in the world:\nEvery moment with you is a memory I never want to forget.\nCan't wait for our date! ❤️\n— ${NAMES.boyfriendName}`,
    dateBadge: "Memory No. 07",
    // Optional multiple photos to browse through:
    photos: [
      {
        url: "", // e.g. "/photo1.jpg"
        caption: "Our Favorite Laughs · Table N° 07"
      },
      {
        url: "", // e.g. "/photo2.jpg"
        caption: "Sunset strolls with you ✨"
      }
    ]
  },

  // 🎵 Background Jukebox Audio & Couple Song Settings
  // Place your own custom MP3 file in `menu style/public/audio/couple-song.mp3`
  // or provide any streaming audio URL.
  audio: {
    defaultVolume: 0.5,
    tracks: [
      {
        id: "chandelier",
        title: "Chandelier ❤️",
        artist: `${NAMES.girlfriendName} & ${NAMES.boyfriendName}`,
        src: "/audio/Chandelier.mp3",
        genre: "Our Song <3 💖"
      },
      {
        id: "paris",
        title: "Brahms Café Bistro Waltz",
        artist: "Parisian Acoustic Strings",
        src: "/audio/parisian-cafe.mp3",
        genre: "Café Jazz 🥐"
      },
      {
        id: "piano",
        title: "Pachelbel Canon in D",
        artist: "Intimate Romance Solo Piano",
        src: "/audio/candlelight-piano.mp3",
        genre: "Romantic Piano 🎹"
      },
      {
        id: "strings",
        title: "Bach Air on the G String",
        artist: "Warm Chamber Strings",
        src: "/audio/sunset-serenade.mp3",
        genre: "Sunset Strings 🎻"
      },
      {
        id: "vienna",
        title: "The Blue Danube Romance",
        artist: "Johann Strauss II · Vienna Symphony",
        src: "/audio/spring-waltz.mp3",
        genre: "Vienna Waltz ✨"
      },
      {
        id: "midnight",
        title: "Vivaldi Springtime Serenade",
        artist: "Midnight Romance Ensemble",
        src: "/audio/midnight-lofi.mp3",
        genre: "Midnight Serenade 🌙"
      }
    ]
  }
};




