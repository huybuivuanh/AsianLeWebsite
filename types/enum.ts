export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

/** Numeric order for sorting (Sunday = 0, Monday = 1, ..., Saturday = 6). */
export const DAY_OF_WEEK_ORDER: Record<DayOfWeek, number> = {
  [DayOfWeek.SUNDAY]: 0,
  [DayOfWeek.MONDAY]: 1,
  [DayOfWeek.TUESDAY]: 2,
  [DayOfWeek.WEDNESDAY]: 3,
  [DayOfWeek.THURSDAY]: 4,
  [DayOfWeek.FRIDAY]: 5,
  [DayOfWeek.SATURDAY]: 6,
} as const;

/** Days in display order (Monday first, common for restaurant weeks). Use for sorted iteration. */
export const DAY_ORDER_MONDAY_FIRST: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

export enum KitchenType {
  DEEP_FRY = "Deep Fry",
  STIR_FRY = "Stir Fry",
  OTHER = "Other",
  BOTH = "Both",
  DRINK = "Drink",
}
