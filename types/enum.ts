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
  DeepFry = "Deep Fry",
  StirFry = "Stir Fry",
  Other = "Other",
  Both = "Both",
  Drink = "Drink",
}

// --- Order enums below mirror the AsianLePOS app's src/types/enums.ts naming/values
// (different Firebase project — no shared data, just a consistent vocabulary). ---

/** Extends POS's InProgress/Completed/Cancelled with New, for orders not yet acknowledged by staff. */
export enum OrderStatus {
  New = "New",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum TakeOutFulfillmentKind {
  Immediate = "immediate",
  Scheduled = "scheduled",
}
