// ============================================================
//      ☕ COZY CAFÉ & BISTRO MENU CONFIGURATION
// ============================================================
//  Edit this file to customize the date menu, names, and text!
// ============================================================

export interface MenuItemOption {
  id: string;
  name: string;
  frenchTitle?: string;
  emoji: string;
  desc: string;
  priceTag: string; // e.g. "Free w/ Love", "Chef's Kiss"
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
  serviceType: string;
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
  bistroName: "Café d'Amour ☕✨",
  tableNumber: "Table N° 2 (Reserved)",
  
  // Evasive 'No' button funny text taunts
  taunts: [
    "Non merci? 🥐 Sacré bleu!",
    "The Chef would be heartbroken! 👨‍🍳",
    "Table N° 2 is already reserved! 🕯️",
    "Fresh croissants just came out! 🥐",
    "Espresso machine is warmed up! ☕",
    "100% Chef's Guarantee of Smiles! ✨",
    "Oui oui... try clicking the Left! 😉"
  ],

  // Cover Screen
  cover: {
    badge: "Café & French Bistro · Menu Spécial",
    headline: `Bonjour, ${NAMES.girlfriendName}! 🥐`,
    subtitle: `A table for two has been reserved by ${NAMES.boyfriendName}.`,
    bistroDialogue: `"Bienvenue! We invite you to curate our special date menu — course by course, from sunset to dessert."`,
    yesButton: "Reserve Table For Two 🥂",
    noButton: "No table today... 🙅‍♀️"
  },

  // 1. Date & Service Options
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
    { id: "morning", name: "Morning Petit Déjeuner 🥐", serviceType: "Morning Service", icon: "☀️", desc: "10:00 AM — Fresh Warm Brioche & Cappuccino" },
    { id: "afternoon", name: "Afternoon Pâtisserie 🍰", serviceType: "Afternoon Tea", icon: "☕", desc: "03:00 PM — Macarons, Stroll & Laughs" },
    { id: "golden", name: "L'Apéro & Sunset Glow 🌅", serviceType: "Sunset Service", icon: "🍷", desc: "06:30 PM — Golden Hour Light & Appetizers" },
    { id: "dinner", name: "Candlelit Evening Soirée 🕯️", serviceType: "Dinner Service", icon: "✨", desc: "08:30 PM — Romantic Ambient Bistro Dinner" },
    { id: "custom", name: "Chef's Custom Reservation Time ⏱️", serviceType: "Special Request", icon: "✍️", desc: "Specify our exact dream hour!" }
  ] as TimeSlotOption[],

  // 2. Main Course (Date Adventures)
  activities: [
    { id: "art_gallery", name: "Stroll Through Old Town Art & Bookshops", frenchTitle: "Promenade des Arts", emoji: "🎨", desc: "Browsing cozy bookshops, antique prints & vintage finds", priceTag: "100 Smiles", badge: "Romantic" },
    { id: "bakery_crawl", name: "French Pâtisserie & Dessert Tour", frenchTitle: "Dégustation Sucrée", emoji: "🥐", desc: "Testing warm chocolate croissants, éclairs & soufflés", priceTag: "Priceless", badge: "Delicious" },
    { id: "jazz_lounge", name: "Candlelit Acoustic & Jazz Evening", frenchTitle: "Soirée Jazz Intime", emoji: "🎷", desc: "Dim ambient lighting, soft saxophone & quiet conversation", priceTag: "Chef's Pick", badge: "Atmospheric" },
    { id: "scenic_walk", name: "Waterside Promenade Under Lanterns", frenchTitle: "Balade aux Lanternes", emoji: "🏮", desc: "Holding hands along the riverfront evening breeze", priceTag: "Pure Joy", badge: "Classic" },
    { id: "cooking_together", name: "Cozy Gourmet Pasta & Dessert Making", frenchTitle: "Atelier Culinaire", emoji: "🍝", desc: "Rolling dough, tasting sauces & playful flour battles", priceTag: "Full Heart", badge: "Cozy" },
    { id: "arcade_fun", name: "Playful Arcade & Dessert Stakes", frenchTitle: "Jeux & Rires", emoji: "🕹️", desc: "Winner gets pampered with extra desserts and treats", priceTag: "Free Laughs", badge: "Playful" },
    { id: "custom", name: "Chef's Secret Surprise Excursion", frenchTitle: "Spécialité du Chef", emoji: "✨", desc: "Add our own custom date adventure!", priceTag: "Custom", badge: "Custom" }
  ] as MenuItemOption[],

  // 3. Location (The Ambiance / Tables)
  locations: [
    { id: "terrace", name: "Cobblestone Terrace Under Fairy Lights 🌿", frenchTitle: "Terrasse sous les Guirlandes", emoji: "✨", desc: "Open-air bistro table with warm string lights & cozy heaters", priceTag: "5 Stars", badge: "Scenic" },
    { id: "velvet_booth", name: "Cozy Velvet Corner Booth 🕯️", frenchTitle: "Banquette de Velours", emoji: "🍷", desc: "Intimate dim-lit booth with candles & soft velvet cushions", priceTag: "Top Rated", badge: "Intimate" },
    { id: "rooftop_garden", name: "Starlit Greenhouse Rooftop 🌸", frenchTitle: "Jardin sur le Toit", emoji: "🌿", desc: "Glass atrium filled with fragrant orchids & city view", priceTag: "Breathtaking", badge: "Enchanting" },
    { id: "riverside_cafe", name: "Waterside Wooden Pier Table ⛵", frenchTitle: "Table au Bord de l'Eau", emoji: "🌊", desc: "Lapping waves, warm lanterns & quiet privacy", priceTag: "Peaceful", badge: "Romantic" },
    { id: "custom", name: "Our Personal Dream Spot 📍", frenchTitle: "Lieu Préféré", emoji: "📍", desc: "Type any bistro, garden or spot you love!", priceTag: "Personalized", badge: "Custom" }
  ] as MenuItemOption[],

  // 4. Beverages (Boissons & Elixirs)
  drinks: [
    { id: "latte_art", name: "Velvety Honey Lavender Latte ☕", frenchTitle: "Café au Miel & Lavande", emoji: "☕", desc: "Silky oat milk foam with delicate lavender syrup & cinnamon", priceTag: "Complimentary" },
    { id: "hot_chocolate", name: "Thick Parisian Hot Chocolate 🍫", frenchTitle: "Chocolat Chaud Parisien", emoji: "🍫", desc: "Ultra-rich melted dark chocolate with Chantilly cream", priceTag: "Chef's Special" },
    { id: "sparkling_cider", name: "Sparkling French Berry Rosé Fizz 🥂", frenchTitle: "Élixir Pétillant aux Fruits", emoji: "🥂", desc: "Bubbling raspberry hibiscus infusion with lime", priceTag: "Refreshing" },
    { id: "caramel_macchiato", name: "Salted Caramel Vanilla Macchiato 🍮", frenchTitle: "Macchiato Caramel Salé", emoji: "🧋", desc: "Layered espresso, Madagascar vanilla & golden drizzle", priceTag: "Sweet & Smooth" },
    { id: "matcha_creme", name: "Ceremonial Iced Vanilla Matcha 🍵", frenchTitle: "Matcha Glacé à la Vanille", emoji: "🍵", desc: "Premium Uji matcha topped with sweet cream cloud", priceTag: "Silk Finish" },
    { id: "custom", name: "Custom Favorite Beverage 🥤", frenchTitle: "Boisson sur Mesure", emoji: "✨", desc: "Tell the barista your exact drink request!", priceTag: "Made For You" }
  ] as MenuItemOption[],

  // 5. Welcome Greetings
  greetings: [
    { id: "warm_hug", name: "Warm, Long Velvet Hug 🤗", frenchTitle: "L'Étreinte Chaleureuse", emoji: "🤗", desc: "The warmest embrace right as we meet at the table", priceTag: "Unlimited" },
    { id: "fresh_roses", name: "A Fragrant Bouquet of Fresh Blooms 💐", frenchTitle: "Bouquet de Roses", emoji: "💐", desc: "Hand-picked roses waiting gently on your chair", priceTag: "Pure Romance" },
    { id: "coffee_ready", name: "Steaming Drink Ready in Hand ☕", frenchTitle: "Café Prêt à Servir", emoji: "☕", desc: "Handing you your hot favorite before you even sit", priceTag: "Thoughtful" },
    { id: "cheek_kiss", name: "Sweet Double Cheek Greeting 😚", frenchTitle: "La Bise Parisienne", emoji: "😚", desc: "A loving gentle French-style cheek kiss & huge smile", priceTag: "Sweet" }
  ] as MenuItemOption[],

  // Chef's Note / Love Letter
  loveLetter: {
    title: `Chef's Note to ${NAMES.girlfriendName} 💌`,
    badge: "Maison Réservée",
    content: `Chère ${NAMES.girlfriendName},\n\nEvery day spent with you is sweeter than the finest Parisian pastry and warmer than morning espresso.\n\nI created this little café menu because choosing to spend time with you is always my easiest, most favorite reservation in the world.\n\nTable N° 2 is ready whenever you are. ☕✨`
  }
};
