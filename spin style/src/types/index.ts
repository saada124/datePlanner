export type CategoryType = 'vibe' | 'activity' | 'dress_code' | 'extras';

export type ThemeId = 'midnight' | 'cotton_candy' | 'sunset';

export interface OptionItem {
  id: string;
  label: string;
  emoji: string;
  category: CategoryType;
  colorIndex?: number;
  isMystery?: boolean;
}

export interface TimeSlotOption {
  id: string;
  label: string;
  time: string;
  emoji: string;
  tagline: string;
}

export interface CategorySectionData {
  id: CategoryType;
  title: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  options: OptionItem[];
}

export interface SlotWinners {
  vibe: OptionItem | null;
  activity: OptionItem | null;
  dressCode: OptionItem | null;
}

export interface DatePlannerState {
  girlfriendName: string;
  notes: string;
  selectedOptions: OptionItem[];
  slotWinners: SlotWinners;
  finalPick: OptionItem | null; // Overall composite or activity
  selectedTimeSlot: TimeSlotOption;
  mysteryBonusPerk: string;
  uploadedPhotoUrl: string | null;
  secretRiggedOptions?: {
    vibeId?: string | null;
    activityId?: string | null;
    dressCodeId?: string | null;
  };
  tokensCount: number;
  activeTheme: ThemeId;
  timestamp?: string;
  ticketNumber?: string;
}
