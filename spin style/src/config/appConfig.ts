import { CategorySectionData, OptionItem, TimeSlotOption, ThemeId } from '../types';

export const NAMES = {
  girlfriendName: "Sarah",
  boyfriendName: "Alex"
};

/**
 * ============================================================================
 * 🎪 "SPIN YOUR DATE" CARNIVAL SLOT MACHINE CONFIGURATION
 * ============================================================================
 */
export const APP_CONFIG = {
  girlfriendName: NAMES.girlfriendName,
  boyfriendName: NAMES.boyfriendName,
  
  // Email recipient for FormSubmit
  prefillEmail: "YOUR_EMAIL@example.com",
  
  // Page 1 Texts
  page1Title: "🎪 Spin Your Date",
  page1Subtitle: "pick everything you're down for — the slot machine decides our entire date!",
  minSelectionsRequired: 3,
  
  // VIP Ticket Copy
  ticketHeader: "YOU WON A DATE WITH ME 🎉",
  ticketFooter: "Redeemable anytime, no expiration ❤️",
  ticketStampText: "CONFIRMED ✅",

  // Segment Colors (cycled through for chips and wheel slices)
  segmentColors: [
    { hex: '#FF4D8D', text: '#FFFFFF', name: 'Hot Pink', border: '#D42666' },
    { hex: '#FFC53D', text: '#2E1A47', name: 'Golden Yellow', border: '#D99B16' },
    { hex: '#2EE6D6', text: '#1A3F3B', name: 'Electric Teal', border: '#12B5A7' },
    { hex: '#FF7A3D', text: '#FFFFFF', name: 'Tangerine', border: '#D95616' },
  ],

  // Slot Machine Settings
  initialTokens: 3,
  slotSpinDurationMs: 3200,

  // Feature 6: Theme Definitions
  themes: [
    {
      id: 'midnight' as ThemeId,
      name: 'Midnight Carnival',
      emoji: '🎪',
      bgClass: 'theme-midnight',
      accentColor: '#FF4D8D',
    },
    {
      id: 'cotton_candy' as ThemeId,
      name: 'Cotton Candy Fair',
      emoji: '🎡',
      bgClass: 'theme-cotton-candy',
      accentColor: '#EC4899',
    },
    {
      id: 'sunset' as ThemeId,
      name: 'Sunset Boardwalk',
      emoji: '🌅',
      bgClass: 'theme-sunset',
      accentColor: '#F97316',
    },
  ],

  // Feature 2: Dress Code Options (Reel 3)
  dressCodeOptions: [
    { id: 'dress_impress', label: 'Dress to Impress', emoji: '✨', category: 'dress_code' as const },
    { id: 'dress_cozy', label: 'Maximum Cozy', emoji: '🩳', category: 'dress_code' as const },
    { id: 'dress_casual', label: 'Casual Cool', emoji: '🕶️', category: 'dress_code' as const },
    { id: 'dress_match', label: 'Color Coordinated', emoji: '🎨', category: 'dress_code' as const },
  ] as OptionItem[],

  // Manual Date & Time Options (Selected manually on screen)
  timeSlots: [
    { id: 'fri_night', label: 'Friday Night', time: '8:00 PM', emoji: '🌙', tagline: 'Unwind after the week with late dinner & drinks' },
    { id: 'sat_sunset', label: 'Saturday Sunset', time: '6:30 PM', emoji: '🌅', tagline: 'Golden hour strolls, views & romantic ambiance' },
    { id: 'sat_night', label: 'Saturday Night Out', time: '8:30 PM', emoji: '✨', tagline: 'Dressed up, music, late laughs & city energy' },
    { id: 'sun_brunch', label: 'Sunday Afternoon / Brunch', time: '1:00 PM', emoji: '🥞', tagline: 'Warm pastries, iced matcha & slow cozy hours' },
    { id: 'weekend_surprise', label: 'This Weekend (Surprise Time)', time: 'Surprise Time', emoji: '🎁', tagline: 'I pick you up whenever the mood strikes' },
    { id: 'tomorrow_eve', label: 'Tomorrow Evening', time: '7:30 PM', emoji: '🕯️', tagline: 'Spontaneous weekday adventure together' },
  ] as TimeSlotOption[],

  // Feature 3: Secret Wax-Sealed Love Letter
  loveLetter: {
    title: "A Little Note For You ❤️",
    salutation: `My Dearest ${NAMES.girlfriendName},`,
    body: `I can't wait for our date! No matter what the reels landed on, the only thing that truly matters to me is getting to spend uninterrupted time with you, making you laugh, and seeing your smile. You mean the absolute world to me.`,
    closing: "Forever yours,",
    signature: NAMES.boyfriendName,
  },

  // Feature 2: Scratch-Off Bonus Perks Pool
  scratchBonusPerks: [
    "🎁 BONUS: Unlimited dessert & chocolate strawberries on me!",
    "💆 BONUS: 30-minute relaxing foot / back massage after the date!",
    "🥤 BONUS: I buy all the snacks, boba & treats with zero limits!",
    "👑 BONUS: You get complete control of the car AUX / music all night!",
    "🍦 BONUS: Midnight gelato & cozy late-night drive together!",
    "💐 BONUS: A bouquet of fresh flowers waiting in your passenger seat!"
  ],

  // Surprise Mystery Options Pool
  mysterySurprisePool: [
    { label: "Chef's Candlelit Rooftop Dinner", emoji: "🍷" },
    { label: "Sunset Picnic & Painting in the Park", emoji: "🎨" },
    { label: "Midnight Drive & Stargazing Blanket", emoji: "✨" },
    { label: "Arcade Showdown & Boba Stakes", emoji: "🕹️" },
    { label: "Secret Dessert Crawl (3 Sweet Spots)", emoji: "🍰" },
  ],

  // Preset Option Categories for Page 1 Multi-Select
  categories: [
    {
      id: 'vibe',
      title: 'THE VIBE',
      subtitle: 'What kind of energy are we bringing?',
      emoji: '✨',
      accentColor: '#FF4D8D',
      options: [
        { id: 'vibe_cozy', label: 'Cozy Night', emoji: '🏠', category: 'vibe' as const },
        { id: 'vibe_fancy', label: 'Fancy Night Out', emoji: '👗', category: 'vibe' as const },
        { id: 'vibe_adventurous', label: 'Adventurous', emoji: '⛺', category: 'vibe' as const },
        { id: 'vibe_lazy', label: 'Lazy Day', emoji: '🛋️', category: 'vibe' as const },
        { id: 'vibe_spontaneous', label: 'Spontaneous', emoji: '🎲', category: 'vibe' as const },
      ]
    },
    {
      id: 'activity',
      title: 'THE ACTIVITY',
      subtitle: 'What are we doing together?',
      emoji: '🎡',
      accentColor: '#2EE6D6',
      options: [
        { id: 'act_dinner', label: 'Dinner', emoji: '🍝', category: 'activity' as const },
        { id: 'act_movie', label: 'Movie Night', emoji: '🎬', category: 'activity' as const },
        { id: 'act_hike', label: 'Hike', emoji: '🥾', category: 'activity' as const },
        { id: 'act_museum', label: 'Museum', emoji: '🏛️', category: 'activity' as const },
        { id: 'act_games', label: 'Game Night', emoji: '🕹️', category: 'activity' as const },
        { id: 'act_beach_park', label: 'Beach / Park', emoji: '🏖️', category: 'activity' as const },
        { id: 'act_cooking', label: 'Cooking Together', emoji: '🍳', category: 'activity' as const },
        { id: 'act_roadtrip', label: 'Road Trip', emoji: '🚗', category: 'activity' as const },
      ]
    },
    {
      id: 'dress_code',
      title: 'THE DRESS CODE',
      subtitle: 'How are we styling our outfits?',
      emoji: '👗',
      accentColor: '#FFC53D',
      options: [
        { id: 'dress_impress', label: 'Dress to Impress', emoji: '✨', category: 'dress_code' as const },
        { id: 'dress_cozy', label: 'Maximum Cozy', emoji: '🩳', category: 'dress_code' as const },
        { id: 'dress_casual', label: 'Casual Cool', emoji: '🕶️', category: 'dress_code' as const },
        { id: 'dress_match', label: 'Color Coordinated', emoji: '🎨', category: 'dress_code' as const },
      ]
    },
    {
      id: 'extras',
      title: 'THE EXTRAS',
      subtitle: 'Any fun bonus rules or perks?',
      emoji: '🎁',
      accentColor: '#FF7A3D',
      options: [
        { id: 'ext_surprise', label: 'Surprise Me', emoji: '🎁', category: 'extras' as const, isMystery: true },
        { id: 'ext_im_cooking', label: "I'm Cooking", emoji: '👨‍🍳', category: 'extras' as const },
        { id: 'ext_you_pick', label: 'You Pick the Restaurant', emoji: '🍽️', category: 'extras' as const },
        { id: 'ext_dessert', label: 'Bring Dessert', emoji: '🍰', category: 'extras' as const },
      ]
    }
  ] as CategorySectionData[],

  // Default fallback emoji dictionary
  emojiMap: {
    'Dinner': '🍝',
    'Movie Night': '🎬',
    'Hike': '🥾',
    'Museum': '🏛️',
    'Game Night': '🕹️',
    'Beach / Park': '🏖️',
    'Cooking Together': '🍳',
    'Road Trip': '🚗',
    'Cozy Night': '🏠',
    'Fancy Night Out': '👗',
    'Adventurous': '⛺',
    'Lazy Day': '🛋️',
    'Spontaneous': '🎲',
    'Dress to Impress': '✨',
    'Maximum Cozy': '🩳',
    'Casual Cool': '🕶️',
    'Color Coordinated': '🎨',
    'Surprise Me': '🎁',
    "I'm Cooking": '👨‍🍳',
    'You Pick the Restaurant': '🍽️',
    'Bring Dessert': '🍰',
  } as Record<string, string>,
};

export const getOptionEmoji = (option: OptionItem | string): string => {
  if (typeof option !== 'string' && option.emoji) {
    return option.emoji;
  }
  const label = typeof option === 'string' ? option : option.label;
  return APP_CONFIG.emojiMap[label] || '🎉';
};
