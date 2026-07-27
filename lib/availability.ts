import { formatTimeHHmmTo12h } from "@/lib/utils";

/**
 * Pure availability/hours logic for the ordering data model (see ecommerce.md).
 * No Firestore access here — see lib/orderMenuData.ts and lib/storeSettings.ts for fetching.
 */

export type AvailabilityStatus = { available: boolean; label?: string };

type StoreDayKey = keyof StoreSettings["hours"];

const WEEKDAY_TO_KEY: Record<string, StoreDayKey> = {
  Sun: "sun",
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

/** Current date/time decomposed in a given IANA timezone, without pulling in a date library. */
function getZonedParts(timeZone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const byType: Record<string, string> = {};
  for (const part of parts) byType[part.type] = part.value;

  return {
    dayKey: WEEKDAY_TO_KEY[byType.weekday] ?? "sun",
    hhmm: `${byType.hour}:${byType.minute}`,
    dateStr: `${byType.year}-${byType.month}-${byType.day}`,
  };
}

/** True if a sold-out flag currently makes the item/option unavailable. */
export function isSoldOut(
  soldOut: MenuItemSoldOut | undefined,
  now: Date = new Date(),
): boolean {
  if (!soldOut) return false;
  if (soldOut.indefinite) return true;
  if (!soldOut.hours) return false;
  const expiresAt = soldOut.since.getTime() + soldOut.hours * 3600_000;
  return now.getTime() < expiresAt;
}

/** True if the current store-local time falls within an item's/option's availability window. */
export function isWithinAvailabilityWindow(
  availability: MenuItemAvailability | undefined,
  timezone: string,
  now: Date = new Date(),
): boolean {
  if (!availability) return true;
  const { hhmm } = getZonedParts(timezone, now);
  return hhmm >= availability.start && hhmm < availability.end;
}

/** Combined availability check shared by DemoMenuItem and ItemOption. */
export function isAvailableNow(
  entity: { availability?: MenuItemAvailability; soldOut?: MenuItemSoldOut },
  timezone: string,
  now: Date = new Date(),
): boolean {
  if (isSoldOut(entity.soldOut, now)) return false;
  return isWithinAvailabilityWindow(entity.availability, timezone, now);
}

/** Availability as a display-ready status: whether to show it, and what label to show if not. */
export function getAvailabilityStatus(
  entity: { availability?: MenuItemAvailability; soldOut?: MenuItemSoldOut },
  timezone: string,
  now: Date = new Date(),
): AvailabilityStatus {
  if (isSoldOut(entity.soldOut, now))
    return { available: false, label: "Sold out" };
  if (
    entity.availability &&
    !isWithinAvailabilityWindow(entity.availability, timezone, now)
  ) {
    return {
      available: false,
      label: `Available ${formatTimeHHmmTo12h(entity.availability.start)} – ${formatTimeHHmmTo12h(entity.availability.end)}`,
    };
  }
  return { available: true };
}

function getDayStatus(settings: StoreSettings, now: Date) {
  const { dayKey, hhmm, dateStr } = getZonedParts(settings.timezone, now);
  const onHoliday = settings.holidays.some((holiday) => {
    const to = holiday.to ?? holiday.from;
    return dateStr >= holiday.from && dateStr <= to;
  });
  return { dayHours: settings.hours[dayKey], hhmm, onHoliday };
}

/** True if the store is currently open for ordering per StoreSettings. */
export function isStoreOpenNow(
  settings: StoreSettings,
  now: Date = new Date(),
): boolean {
  if (settings.pauseOrdering) return false;
  const { dayHours, hhmm, onHoliday } = getDayStatus(settings, now);
  if (onHoliday || !dayHours.isOpen) return false;
  return hhmm >= dayHours.open && hhmm < dayHours.close;
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const WEEKDAY_KEYS: StoreDayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

/** Which day-of-week a "YYYY-MM-DD" calendar date falls on — a pure calendar fact,
 * independent of timezone (unlike "now", which needs one). */
function weekdayKeyForDateStr(dateStr: string): StoreDayKey {
  const [year, month, day] = dateStr.split("-").map(Number);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return WEEKDAY_KEYS[weekdayIndex];
}

/** Adds `days` calendar days to a "YYYY-MM-DD" string. */
function addDaysToDateStr(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day + days));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

/**
 * True if "YYYY-MM-DD" is a real calendar date (rejects e.g. "2026-06-31" — June has 30
 * days). `Date.UTC` silently normalizes overflowing dates (rolls into the next month),
 * which would otherwise let a hand-crafted request's date sort differently as a raw
 * string than it resolves to as an actual date — e.g. bypassing a holiday-range check
 * that compares `dateStr` lexicographically.
 */
function isRealDateStr(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

/** Current date/time in the store's timezone, exposed for UI bounds (e.g. a date/time picker's `min`). */
export function getStoreLocalNow(
  settings: StoreSettings,
  now: Date = new Date(),
): { dateStr: string; hhmm: string } {
  const { dateStr, hhmm } = getZonedParts(settings.timezone, now);
  return { dateStr, hhmm };
}

// How far ahead customers can schedule a pickup — adjust freely, no other code depends on this value.
export const MAX_SCHEDULE_DAYS_AHEAD = 30;

/** The last "YYYY-MM-DD" a customer can schedule for, exposed for a date/time picker's `max`. */
export function getMaxScheduleDateStr(
  settings: StoreSettings,
  now: Date = new Date(),
): string {
  return addDaysToDateStr(
    getStoreLocalNow(settings, now).dateStr,
    MAX_SCHEDULE_DAYS_AHEAD,
  );
}
export const SCHEDULE_LEAD_MINUTES = 30;

export type ScheduledPickupInvalidReason =
  | "paused"
  | "invalid-format"
  | "past"
  | "too-far-ahead"
  | "holiday"
  | "closed"
  | "outside-hours"
  | "lead-time";

/**
 * Why a "YYYY-MM-DD" + "HH:mm" pickup request is currently invalid, or `null` if it's
 * valid: not in the past, not beyond MAX_SCHEDULE_DAYS_AHEAD, not a holiday, within that
 * day's store hours, and (if today) at least SCHEDULE_LEAD_MINUTES from now.
 */
export function getScheduledPickupInvalidReason(
  settings: StoreSettings,
  dateStr: string,
  pickupTime: string,
  now: Date = new Date(),
): ScheduledPickupInvalidReason | null {
  if (settings.pauseOrdering) return "paused";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateStr) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime) ||
    !isRealDateStr(dateStr)
  ) {
    return "invalid-format";
  }

  const today = getStoreLocalNow(settings, now);
  if (dateStr < today.dateStr) return "past";
  if (dateStr > addDaysToDateStr(today.dateStr, MAX_SCHEDULE_DAYS_AHEAD))
    return "too-far-ahead";

  const onHoliday = settings.holidays.some((holiday) => {
    const to = holiday.to ?? holiday.from;
    return dateStr >= holiday.from && dateStr <= to;
  });
  if (onHoliday) return "holiday";

  const dayHours = settings.hours[weekdayKeyForDateStr(dateStr)];
  if (!dayHours.isOpen) return "closed";

  const requestedMin = hhmmToMinutes(pickupTime);
  if (
    requestedMin < hhmmToMinutes(dayHours.open) ||
    requestedMin >= hhmmToMinutes(dayHours.close)
  ) {
    return "outside-hours";
  }

  if (
    dateStr === today.dateStr &&
    requestedMin < hhmmToMinutes(today.hhmm) + SCHEDULE_LEAD_MINUTES
  ) {
    return "lead-time";
  }

  return null;
}

/**
 * True if a "YYYY-MM-DD" + "HH:mm" pickup request is currently valid — see
 * {@link getScheduledPickupInvalidReason} for the specific reason when it's not.
 */
export function isValidScheduledPickup(
  settings: StoreSettings,
  dateStr: string,
  pickupTime: string,
  now: Date = new Date(),
): boolean {
  return (
    getScheduledPickupInvalidReason(settings, dateStr, pickupTime, now) ===
    null
  );
}

/**
 * Resolves a validated "YYYY-MM-DD" + "HH:mm" pickup request to a real instant in the
 * store's timezone, for persisting as `TakeOutFulfillment`'s `scheduledAt: Date` —
 * matches AsianLePOS's Timestamp-based fulfillment shape instead of a bare time string.
 */
export function resolveScheduledPickupInstant(
  timezone: string,
  dateStr: string,
  pickupTime: string,
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = pickupTime.split(":").map(Number);

  // Probe the zone's UTC offset near the target date/time (not "now") so this stays
  // correct even for timezones that observe DST, across a scheduling horizon of weeks.
  const probeInstant = new Date(
    Date.UTC(year, month - 1, day, hour, minute, 0),
  );
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(probeInstant);

  const byType: Record<string, string> = {};
  for (const part of parts) byType[part.type] = part.value;

  const probeAsIfUtc = Date.UTC(
    Number(byType.year),
    Number(byType.month) - 1,
    Number(byType.day),
    Number(byType.hour),
    Number(byType.minute),
    Number(byType.second),
  );
  const offsetMs = probeAsIfUtc - probeInstant.getTime();

  const targetAsIfUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  return new Date(targetAsIfUtc - offsetMs);
}
