export type IslandStage =
  | 'BOARDING'
  | 'STAGE_1_DATE'
  | 'STAGE_2_ACTIVITY'
  | 'STAGE_3_LOCATION'
  | 'STAGE_4_DRINK'
  | 'STAGE_5_GREETING'
  | 'SUMMARY_PASSPORT'
  | 'ISLAND_CELEBRATION';

export interface DateSelection {
  dayDate: string;
  isoDate: string;
  timeSlot: string;
  customTime?: string;
  activities: string[];
  customActivity?: string;
  location: string;
  customLocation?: string;
  drink: string;
  customDrink?: string;
  greetings: string[];
  customNotes?: string;
}
