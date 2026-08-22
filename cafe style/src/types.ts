export type BistroStage =
  | 'COVER'
  | 'COURSE_1_DATE'
  | 'COURSE_2_MAIN_ACTIVITY'
  | 'COURSE_3_LOCATION'
  | 'COURSE_4_BEVERAGE'
  | 'COURSE_5_GREETING'
  | 'RECEIPT_REVIEW'
  | 'BISTRO_CELEBRATION';

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
