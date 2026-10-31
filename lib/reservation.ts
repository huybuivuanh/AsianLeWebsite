import {
  getScheduledPickupInvalidReason,
  MAX_SCHEDULE_DAYS_AHEAD,
  type ScheduledPickupInvalidReason,
  type ScheduledRequestOptions,
} from "@/lib/availability";

/**
 * Table reservations are saved as regular scheduled orders with a single hard-coded
 * "Reservation" item (not a Firestore menuItem), so the restaurant accepts them through
 * the same order flow. The guest count is stored as the quantity of its one option.
 */
export const RESERVATION_ITEM = {
  menuItemId: "reservation",
  name: "Reservation",
  // OrderItemOption has no group field, so the option itself carries the label.
  optionName: "Guests",
} as const;

export const RESERVATION_LEAD_MINUTES = 60;
/** Last seating is this many minutes before the day's closing time. */
export const RESERVATION_LAST_SEATING_MINUTES = 60;
/** Sanity cap on the guest count only — large parties are confirmed by phone, not blocked. */
export const RESERVATION_MAX_GUESTS_INPUT = 200;
export const RESERVATION_MAX_REQUESTS_LENGTH = 200;

/** Full business-hours check (paused, holiday, closed, hours) plus the reservation lead
 * time and last-seating cutoff. Unlike pickup orders, the API enforces all of this. */
export const RESERVATION_RULES: ScheduledRequestOptions = {
  checkBusinessHours: true,
  leadMinutes: RESERVATION_LEAD_MINUTES,
  closeBufferMinutes: RESERVATION_LAST_SEATING_MINUTES,
};

export const RESERVATION_INVALID_MESSAGES: Record<
  ScheduledPickupInvalidReason,
  string
> = {
  paused: "We're not taking reservations online right now — please call us.",
  "invalid-format": "Please choose a valid date and time.",
  past: "That time has already passed — please choose another.",
  "too-far-ahead": `Please choose a date within the next ${MAX_SCHEDULE_DAYS_AHEAD} days.`,
  holiday: "We're closed that day — please choose another date.",
  closed: "We're closed that day — please choose another date.",
  "outside-hours": "That time is outside our hours — please choose another.",
  "too-close-to-closing": `Last seating is ${RESERVATION_LAST_SEATING_MINUTES} minutes before closing — please choose an earlier time.`,
  "lead-time": `Please book at least ${RESERVATION_LEAD_MINUTES} minutes ahead.`,
};

export function getReservationInvalidReason(
  settings: StoreSettings,
  dateStr: string,
  time: string,
  now: Date = new Date(),
): ScheduledPickupInvalidReason | null {
  return getScheduledPickupInvalidReason(
    settings,
    dateStr,
    time,
    now,
    RESERVATION_RULES,
  );
}
