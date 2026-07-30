/** Maps a Firestore `{name, url}`-shaped field to ImageItem, or undefined if malformed. */
export function mapImageItemField(raw: unknown): ImageItem | undefined {
  if (!raw || typeof raw !== "object" || !("url" in raw)) return undefined;
  const url = (raw as { url: unknown }).url;
  if (typeof url !== "string") return undefined;
  const name = (raw as { name?: unknown }).name;
  return { name: typeof name === "string" ? name : "", url };
}

export function formatPriceCAD(price: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Format "11:00" / "14:00" style string to "11:00 AM" / "2:00 PM" */
export function formatTimeHHmmTo12h(timeStr: string): string {
  if (!timeStr || typeof timeStr !== "string") return "";
  const [h, m] = timeStr.trim().split(":").map(Number);
  if (Number.isNaN(h)) return timeStr;
  const hours = h % 24;
  const mins = Number.isNaN(m) ? 0 : m % 60;
  const period = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${mins.toString().padStart(2, "0")} ${period}`;
}

/** "MONDAY" -> "Monday" */
export function formatDayOfWeekLabel(day: string): string {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
}

/** Strips a typed phone value down to at most 10 digits. Since the input's displayed
 * value always carries a literal "+1 " prefix, that has to be dropped first — otherwise
 * its "1" gets miscounted as a digit the user typed on every keystroke. Once 10 digits
 * are present, further typing is simply ignored (capped, not shifted) — dropping a
 * "country code" digit here would be wrong whenever the real number happens to start
 * with 1. Use {@link extractTenDigitPhoneFromPaste} for pasted values instead. */
export function extractTenDigitPhone(raw: string): string {
  const withoutPrefix = raw.startsWith("+1") ? raw.slice(2) : raw;
  return withoutPrefix.replace(/\D/g, "").slice(0, 10);
}

/** Strips a leading "1" country code from a pasted full number (e.g. pasting
 * "+1 234-567-8901" or "12345678901"), then caps at 10 digits. */
export function extractTenDigitPhoneFromPaste(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Formats up to 10 raw digits as "+1 (000) 000-0000", partial while still typing. */
export function formatPhoneInput(digits: string): string {
  const d = extractTenDigitPhone(digits);
  if (d.length === 0) return "+1 ";
  if (d.length < 4) return `+1 (${d}`;
  if (d.length < 7) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Returns a new array sorted alphabetically by a key.
 * Defaults to case-insensitive comparison with numeric sorting.
 */
export function sortAlphabetically<T>(
  list: readonly T[],
  getKey: (item: T) => string,
  locale: string = "en",
): T[] {
  return [...list].sort((a, b) =>
    getKey(a).localeCompare(getKey(b), locale, {
      sensitivity: "base",
      numeric: true,
    }),
  );
}
