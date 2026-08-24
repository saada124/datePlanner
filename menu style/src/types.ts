export interface StarterMoodOption {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
}

export interface MainCourseOption {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  priceTag: string; // e.g. "Free w/ Love", "Chef's Choice", "Priceless"
  badge?: string;
}

export interface SideOption {
  id: string;
  label: string;
  desc: string;
  emoji: string;
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
  title: string;
  timeRange: string;
  icon: string;
  vibe: string;
}

export interface DateMenuSelection {
  mood: string;
  customMood?: string;
  activityId: string;
  activityTitle: string;
  customActivity?: string;
  sides: string[]; // List of selected side IDs
  dayDate: string;
  isoDate: string;
  timeSlot: string;
  customTime?: string;
  cravingsAndNotes?: string;
  scratchPerk?: string;
}
