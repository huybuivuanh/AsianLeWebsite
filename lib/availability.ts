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
export function isSoldOut(soldOut: MenuItemSoldOut | undefined, now: Date = new Date()): boolean {
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
  if (isSoldOut(entity.soldOut, now)) return { available: false, label: "Sold out" };
  if (entity.availability && !isWithinAvailabilityWindow(entity.availability, timezone, now)) {
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
export function isStoreOpenNow(settings: StoreSettings, now: Date = new Date()): boolean {
  if (settings.pauseOrdering) return false;
  const { dayHours, hhmm, onHoliday } = getDayStatus(settings, now);
  if (onHoliday || !dayHours.isOpen) return false;
  return hhmm >= dayHours.open && hhmm < dayHours.close;
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHHmm(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// V1 scope: same-day pickup scheduling only, no multi-day date picker.
const PICKUP_LEAD_MINUTES = 20;
const PICKUP_SLOT_INTERVAL_MINUTES = 15;

/** "HH:mm" slots offered for same-day scheduled pickup, spaced 15min apart, starting ~20min out. */
export function getPickupSlotsForToday(
  settings: StoreSettings,
  now: Date = new Date(),
): string[] {
  if (settings.pauseOrdering) return [];
  const { dayHours, hhmm, onHoliday } = getDayStatus(settings, now);
  if (onHoliday || !dayHours.isOpen) return [];

  const nowMin = hhmmToMinutes(hhmm);
  const openMin = hhmmToMinutes(dayHours.open);
  const closeMin = hhmmToMinutes(dayHours.close);
  const earliest = Math.max(nowMin + PICKUP_LEAD_MINUTES, openMin);
  const firstSlot =
    Math.ceil(earliest / PICKUP_SLOT_INTERVAL_MINUTES) * PICKUP_SLOT_INTERVAL_MINUTES;

  const slots: string[] = [];
  for (let t = firstSlot; t < closeMin; t += PICKUP_SLOT_INTERVAL_MINUTES) {
    slots.push(minutesToHHmm(t));
  }
  return slots;
}

/**
 * True if a same-day "HH:mm" pickup time is currently valid to request. Uses a
 * shorter lead time than getPickupSlotsForToday's UI increments so a slot the
 * UI offered always still passes here (mismatched "now" between render and
 * request would otherwise cause spurious rejections).
 */
export function isValidScheduledPickupTime(
  settings: StoreSettings,
  pickupTime: string,
  now: Date = new Date(),
  leadMinutes = 15,
): boolean {
  if (settings.pauseOrdering) return false;
  const { dayHours, hhmm, onHoliday } = getDayStatus(settings, now);
  if (onHoliday || !dayHours.isOpen) return false;

  const requestedMin = hhmmToMinutes(pickupTime);
  const earliest = Math.max(hhmmToMinutes(hhmm) + leadMinutes, hhmmToMinutes(dayHours.open));
  return requestedMin >= earliest && requestedMin < hhmmToMinutes(dayHours.close);
}

/**
 * Resolves a validated same-day "HH:mm" pickup time to a real instant (today, in the
 * store's timezone), for persisting as `TakeOutFulfillment`'s `scheduledAt: Date` —
 * matches AsianLePOS's Timestamp-based fulfillment shape instead of a bare time string.
 */
export function resolveScheduledPickupInstant(
  timezone: string,
  pickupTime: string,
  now: Date = new Date(),
): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const byType: Record<string, string> = {};
  for (const part of parts) byType[part.type] = part.value;

  // Offset between "now" and its wall-clock representation in the target timezone,
  // then apply that same offset to today's date + the requested time.
  const nowAsIfUtc = Date.UTC(
    Number(byType.year),
    Number(byType.month) - 1,
    Number(byType.day),
    Number(byType.hour),
    Number(byType.minute),
    Number(byType.second),
  );
  const offsetMs = nowAsIfUtc - now.getTime();

  const [targetHour, targetMinute] = pickupTime.split(":").map(Number);
  const targetAsIfUtc = Date.UTC(
    Number(byType.year),
    Number(byType.month) - 1,
    Number(byType.day),
    targetHour,
    targetMinute,
    0,
  );
  return new Date(targetAsIfUtc - offsetMs);
}
