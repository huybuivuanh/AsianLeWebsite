# Menu Data Model — Reference for Customer-Facing Site

This document describes the Firestore data model that the admin app (this repo) writes,
so the customer-facing ordering site can read it correctly. The admin app has two parallel
menu models; **this doc covers the active/new one** (`demoCategories` / `demoMenuItems`),
which is the one being built out going forward. The old `/menu` section
(`categories` / `menuItems`, plain `options: string[]`) is legacy and should be ignored
for new work.

## Firebase setup

Read-only client access needs the standard public Firebase web config:

```
NEXT_PUBLIC_API_KEY
NEXT_PUBLIC_AUTH_DOMAIN
NEXT_PUBLIC_PROJECT_ID
NEXT_PUBLIC_STORAGE_BUCKET
NEXT_PUBLIC_MESSAGING_SENDER_ID
NEXT_PUBLIC_APP_ID
NEXT_PUBLIC_MEASUREMENT_ID
```

The customer site only needs `getDoc`/`getDocs`/`onSnapshot` (read) calls — it should never
write to these collections. Confirm Firestore security rules allow public read on the
collections below but deny write from unauthenticated clients.

## Collections

| Collection | Shape | Purpose |
|---|---|---|
| `demoCategories` | `DemoCategory` | Menu sections (Appetizers, Entrees, ...) |
| `demoMenuItems` | `DemoMenuItem` | Individual dishes |
| `optionGroups` | `OptionGroup` | Reusable modifier groups (e.g. "Spice Level", "Add Protein") — shared across all menu items |
| `options` | `ItemOption` | Individual modifier choices (e.g. "Mild", "Extra Chicken +$2") — shared across all option groups |
| `menuVersion` (doc `versionDoc`) | `{ version: number, lastUpdated: Timestamp }` | Bumped every time an admin publishes; poll/subscribe to this to know when to refetch the menu |
| `settings/store` (single doc) | `StoreSettings` | Store hours, holidays, and a global "pause ordering" kill switch |
| `hours` | `StoreHour` | Free-text display strings for storefront hours (e.g. "Mon–Fri", "11am–9pm") — **display only**, not used for open/closed logic |

### `DemoCategory`

```ts
{
  id: string;
  name: string;
  description?: string;
  itemIds?: string[];   // ordered? no — order is per-item via categoryIds, not stored here
  order: number;        // sort categories by this ascending
  createdAt: Date;
}
```

Fetch all, sort by `order` ascending (tie-break by name).

### `DemoMenuItem`

```ts
{
  id: string;
  name: string;
  description?: string;
  price: number;                    // dollars, e.g. 12.5 — NOT cents
  image?: { name: string; url: string };  // Firebase Storage download URL
  optionGroupIds?: { optionGroupId: string; order: number }[]; // ordered refs, see below
  categoryIds?: string[];           // which DemoCategory ids this item belongs to
  kitchenType: "Deep Fry" | "Stir Fry" | "Other" | "Both" | "Drink";
  availability?: { start: string; end: string };  // "HH:mm" 24h, daily recurring window
  soldOut?: { since: Date; hours?: number; indefinite: boolean };
  createdAt: Date;
}
```

Important nuances:
- **`optionGroupIds` is an array of `{ optionGroupId, order }`, not plain strings.** Some
  legacy docs may still have `string[]` — normalize defensively (map string → `{ optionGroupId: id, order: index }`)
  the same way the admin app does (see `lib/menu-item-option-groups.ts` if you want to port the logic).
  Sort by `order` ascending to get the display order of option groups for that item.
- **`availability`**, when present, means the item should only be orderable/visible between
  `start` and `end` (24h `HH:mm`, store's local timezone — see `StoreSettings.timezone`) every day.
  If absent, the item has no time restriction.
- **`soldOut`**, when present, means the item is currently unavailable:
  - `indefinite: true` → sold out until an admin manually clears it. Treat as unavailable indefinitely.
  - `indefinite: false` with `hours: 1 | 2` → sold out for that many hours starting at `since`.
    Compute `since.getTime() + hours * 3600_000` and treat the item as available again once
    the current time passes that. Don't rely on Firestore to clear it automatically —
    it's a stored flag, not a TTL; you must compute expiry client/server-side.
- `price` is a plain number in dollars. Format for display with
  `new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 })`.

### `OptionGroup`

```ts
{
  id: string;
  name: string;
  minSelection: number;          // 0 = optional group
  maxSelection: number;          // >=1; if 1, render as radio/single-select
  multipleOptionQuantity: boolean; // if true, allow qty > 1 of the same option (e.g. "extra sauce x2")
  optionIds?: string[];          // which ItemOption ids belong to this group
  itemIds?: string[];            // reverse index of which items use this group (informational; use item.optionGroupIds as source of truth)
  defaultOptionId?: string;      // pre-selected option, if any
  createdAt: Date;
}
```

Selection rules to implement in the ordering UI:
- If `maxSelection === 1` and `minSelection === 1`: required single choice (radio), pre-select
  `defaultOptionId` if set.
- If `maxSelection === 1` and `minSelection === 0`: optional single choice.
- If `maxSelection > 1`: checkboxes, enforce `minSelection <= selectedCount <= maxSelection` before allowing add-to-cart.
- If `multipleOptionQuantity`: each selected option can have its own quantity stepper, not just checked/unchecked. Otherwise treat as a plain toggle.

### `ItemOption`

```ts
{
  id: string;
  name: string;
  price: number;               // additive price modifier in dollars (can be 0)
  groupIds?: string[];         // reverse index of groups this option belongs to
  availability?: { start: string; end: string };
  soldOut?: { since: Date; hours?: number; indefinite: boolean };
  createdAt: Date;
}
```

Options can independently have their own `availability`/`soldOut` — apply the same logic as
menu items when deciding whether to show/allow an option within a group.

### `MenuVersion`

```ts
{ version: number; lastUpdated: Date | null }
```

Every "Publish Menu" action in the admin bumps `version` and sets `lastUpdated`. The
customer site should `onSnapshot` this doc (or poll it) and refetch categories/items/option
groups/options whenever `version` changes, rather than re-fetching on every page load.

### `StoreSettings` (`settings/store`)

```ts
{
  pauseOrdering: boolean;   // global kill switch — if true, disable checkout/ordering entirely
  timezone: string;         // e.g. "America/Edmonton" — use this, not the browser's timezone, for availability/hours math
  hours: {
    mon: { isOpen: boolean; open: string; close: string }; // "HH:mm"
    tue: ...; wed: ...; thu: ...; fri: ...; sat: ...; sun: ...;
  };
  holidays: { id: string; from: string; to?: string }[]; // "YYYY-MM-DD"; single-day if `to` absent
}
```

This is the source of truth for whether the store is open for ordering right now:
1. If `pauseOrdering` is true → closed, regardless of everything else.
2. If today's date falls within any holiday range (`from`..`to` inclusive, in `timezone`) → closed.
3. Otherwise check the current day-of-week's `DayHours`: if `isOpen` is false, or current time
   (in `timezone`) is outside `[open, close)`, → closed.

`hours` (the plain `StoreHour[]` collection) is only for rendering a human-readable hours
string on the site (e.g. a footer "Hours" block) — don't use it to gate ordering.

## Implementation checklist for the customer site

1. Set up Firebase client SDK with the env vars above, read-only usage.
2. On load, fetch `demoCategories`, `demoMenuItems`, `optionGroups`, `options`, and
   `settings/store` in parallel; subscribe to `menuVersion` and refetch the first four when
   it changes.
3. Build categories sorted by `order`; for each, resolve its items via
   `item.categoryIds.includes(category.id)` (not `category.itemIds`, which is a
   convenience index maintained by the admin — either works, but `categoryIds` on the item
   is simpler to filter with).
4. For each item, filter out ones that are currently unavailable (`soldOut` active per the
   expiry rule above, or outside `availability` window) — or show them visibly greyed out
   with a "Sold out" / "Available 11am–2pm" badge instead of hiding them, per your UX preference.
5. When a customer opens an item's detail/add-to-cart view, resolve its option groups via
   `getOrderedOptionGroupRefs`-equivalent logic (sort `optionGroupIds` by `order`), then
   resolve each group's `optionIds` into full `ItemOption` objects, filtering out sold-out/
   out-of-window options.
6. Enforce `minSelection`/`maxSelection` per group before allowing "Add to cart".
7. Compute line-item price as `item.price + sum(selectedOption.price * quantity)`.
8. Before allowing checkout, check `StoreSettings` per the open/closed logic above — disable
   ordering entirely if closed, and consider showing a banner with hours/holiday info.
9. Use `formatPriceCAD`-style formatting (`Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" })`) for all displayed prices.

## Explicitly out of scope / do not use

- `categories` / `menuItems` collections — legacy model, no option groups, being phased out.
- Writing to any of these collections from the customer site — all writes belong to the admin app.
