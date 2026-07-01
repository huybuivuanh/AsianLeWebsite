/**
 * Pure availability/hours logic for the ordering data model (see ecommerce.md).
 * No Firestore access here — see lib/orderMenuData.ts and lib/storeSettings.ts for fetching.
 */

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

/** True if the store is currently open for ordering per StoreSettings. */
export function isStoreOpenNow(settings: StoreSettings, now: Date = new Date()): boolean {
  if (settings.pauseOrdering) return false;

  const { dayKey, hhmm, dateStr } = getZonedParts(settings.timezone, now);

  const onHoliday = settings.holidays.some((holiday) => {
    const to = holiday.to ?? holiday.from;
    return dateStr >= holiday.from && dateStr <= to;
  });
  if (onHoliday) return false;

  const dayHours = settings.hours[dayKey];
  if (!dayHours.isOpen) return false;
  return hhmm >= dayHours.open && hhmm < dayHours.close;
}
