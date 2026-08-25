export interface AlchemistRecipe {
  id: string;
  name: string;
  icon: string;
  requiredPigments: string[]; // e.g. ['rose', 'amber']
  gradient: string;
  clue: string;
  secretNote: string;
  perkTitle: string;
  perkDesc: string;
  isLegendary?: boolean;
}

export const ALCHEMIST_RECIPES: AlchemistRecipe[] = [
  {
    id: 'sunset_temptation',
    name: 'Sunset Temptation',
    icon: '🌅',
    requiredPigments: ['rose', 'amber'],
    gradient: 'linear-gradient(135deg, #e85d75, #fb8500)',
    clue: 'Mix the warmth of dusk with a sweet rose blush...',
    secretNote: "The fortune cookie predicts: you'll skip dessert at dinner because you already know what's for dessert. 🥠😏",
    perkTitle: 'Priority Dessert Upgrade 🍰',
    perkDesc: 'Talel guarantees private dessert time after dinner.'
  },
  {
    id: 'secret_garden',
    name: 'Secret Garden',
    icon: '🌿',
    requiredPigments: ['cerulean', 'emerald'],
    gradient: 'linear-gradient(135deg, #3a86ff, #2a9d8f)',
    clue: 'Blend sky water with fresh spring leaves...',
    secretNote: 'Any quiet corner of the world feels like a fairytale when your hand is in mine. 🌸',
    perkTitle: 'Handpicked Flora Bouquet 💐',
    perkDesc: 'A fresh flower bouquet waiting at our secret spot.'
  },
  {
    id: 'midnight_flexibility',
    name: 'Midnight Flexibility',
    icon: '🌙',
    requiredPigments: ['cerulean', 'lavender'],
    gradient: 'linear-gradient(135deg, #3a86ff, #8338ec)',
    clue: 'Combine the deep night sky with purple desires...',
    secretNote: 'Your flexibility will be tested tonight. Stretch beforehand, just in case. 🧘‍♀️😏',
    perkTitle: 'Extended Midnight Session ✨',
    perkDesc: 'Zero curfews — private late-night overtime unlocked.'
  },
  {
    id: 'sweet_whispers',
    name: 'Sweet Whispers',
    icon: '🤫',
    requiredPigments: ['rose', 'lavender'],
    gradient: 'linear-gradient(135deg, #e85d75, #8338ec)',
    clue: 'Stir sweet berries with a touch of purple mist...',
    secretNote: 'Warning: you may lose your voice tonight. Not from talking. 🤫😏',
    perkTitle: 'Next-Morning Room Service ☕',
    perkDesc: 'Warm coffee & croissants delivered to bed the next morning.'
  },
  {
    id: 'mediterranean_breeze',
    name: 'Mediterranean Breeze',
    icon: '🌊',
    requiredPigments: ['amber', 'cerulean'],
    gradient: 'linear-gradient(135deg, #3a86ff, #fb8500)',
    clue: 'Mingle coastal ocean waves with sunny amber rays...',
    secretNote: 'Looking into your eyes feels like an endless sun-drenched holiday. I never want to leave. 🏖️',
    perkTitle: 'Barefoot Seaside Walk 🐚',
    perkDesc: 'Sunset stroll with shoes off and gentle waves at our feet.'
  },
  {
    id: 'grand_masterpiece',
    name: 'Master Alchemist of Love',
    icon: '👑',
    requiredPigments: ['rose', 'cerulean', 'amber', 'emerald', 'lavender'],
    gradient: 'linear-gradient(135deg, #e85d75, #3a86ff, #fb8500, #2a9d8f, #8338ec)',
    clue: 'Master and discover all 5 recipes in the Alchemist Book...',
    secretNote: 'You are the grand masterpiece of my entire universe. Thank you for being my muse, my love, and my favorite adventure. ❤️',
    perkTitle: 'Supreme VIP Date Pass 🏆',
    perkDesc: 'Full executive date privileges: whatever Yosr asks for, Talel says yes unconditionally!',
    isLegendary: true
  }
];

const STORAGE_KEY = 'dateAppDiscoveredRecipes';

export function getDiscoveredRecipeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDiscoveredRecipeId(id: string): string[] {
  if (typeof window === 'undefined') return [id];
  try {
    const current = getDiscoveredRecipeIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch {
    return [id];
  }
}

export function findMatchingRecipe(selectedPigments: string[]): AlchemistRecipe | null {
  if (selectedPigments.length < 2) return null;

  // Check legendary full recipe
  if (selectedPigments.length >= 5) {
    return ALCHEMIST_RECIPES.find((r) => r.id === 'grand_masterpiece') || null;
  }

  // Check 2-pigment recipes
  const sortedSelected = [...selectedPigments].sort();
  for (const recipe of ALCHEMIST_RECIPES) {
    if (recipe.isLegendary) continue;
    const sortedRequired = [...recipe.requiredPigments].sort();
    if (
      sortedSelected.length === sortedRequired.length &&
      sortedSelected.every((val, idx) => val === sortedRequired[idx])
    ) {
      return recipe;
    }
  }

  return null;
}
