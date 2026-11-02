import {
  addDaysToDateStr,
  getScheduledPickupInvalidReason,
  getStoreLocalNow,
  MAX_SCHEDULE_DAYS_AHEAD,
  weekdayKeyForDateStr,
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
/** Sanity cap on the guest count only — large parties are confirmed by phone, not blocked. */
export const RESERVATION_MAX_GUESTS_INPUT = 200;
export const RESERVATION_MAX_REQUESTS_LENGTH = 200;

/** Reservation check: paused, holiday, the day's reservation hours (first to last
 * bookable time, set in the website-admin app) and the lead time. Unlike pickup orders,
 * the API enforces all of this. */
function reservationRules(settings: StoreSettings): ScheduledRequestOptions {
  return {
    checkBusinessHours: true,
    leadMinutes: RESERVATION_LEAD_MINUTES,
    weeklyHours: settings.reservationHours,
    closeIsLastTime: true,
  };
}

export const RESERVATION_INVALID_MESSAGES: Record<
  ScheduledPickupInvalidReason,
  string
> = {
  paused: "We're not taking reservations online right now — please call us.",
  "invalid-format": "Please choose a valid date and time.",
  past: "That time has already passed — please choose another.",
  "too-far-ahead": `Please choose a date within the next ${MAX_SCHEDULE_DAYS_AHEAD} days.`,
  holiday: "We're closed that day — please choose another date.",
  closed: "We don't take reservations that day — please choose another date.",
  "outside-hours": "Tables can't be booked at that time — please choose a time within the hours shown.",
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
    reservationRules(settings),
  );
}

/** Granularity used to work out a day's bookable window (and the time picker's step). */
export const RESERVATION_TIME_STEP_MINUTES = 5;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Earliest and latest "HH:mm" a table can be booked on a date — checked with the same
 * rules as the API (reservation hours, lead time, holidays, pause). Null when nothing
 * on that day is bookable. */
export function getReservationWindow(
  settings: StoreSettings,
  dateStr: string,
  now: Date = new Date(),
): { earliest: string; latest: string } | null {
  const hours = settings.reservationHours[weekdayKeyForDateStr(dateStr)];
  if (!hours?.isOpen) return null;
  let earliest: string | null = null;
  let latest: string | null = null;
  const step = RESERVATION_TIME_STEP_MINUTES;
  const start = Math.ceil(toMinutes(hours.open) / step) * step;
  for (let m = start; m <= toMinutes(hours.close) && m < 24 * 60; m += step) {
    const time = toHhmm(m);
    if (getReservationInvalidReason(settings, dateStr, time, now) === null) {
      earliest ??= time;
      latest = time;
    }
  }
  return earliest && latest ? { earliest, latest } : null;
}

export type ReservationDay = {
  dateStr: string;
  /** "Today", "Tomorrow" or a short weekday ("Tue"). */
  label: string;
  /** e.g. "Nov 4". */
  dateLabel: string;
  /** Bookable time range, or null (closed / holiday / no time left today). */
  window: { earliest: string; latest: string } | null;
};

/** The days a reservation can be made for, from today up to MAX_SCHEDULE_DAYS_AHEAD. */
export function getReservationDays(settings: StoreSettings, now: Date = new Date()): ReservationDay[] {
  const today = getStoreLocalNow(settings, now).dateStr;
  const days: ReservationDay[] = [];
  for (let i = 0; i <= MAX_SCHEDULE_DAYS_AHEAD; i++) {
    const dateStr = addDaysToDateStr(today, i);
    const [y, mo, d] = dateStr.split("-").map(Number);
    const utc = new Date(Date.UTC(y, mo - 1, d));
    days.push({
      dateStr,
      label:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : utc.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      dateLabel: utc.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      window: getReservationWindow(settings, dateStr, now),
    });
  }
  return days;
}
