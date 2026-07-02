# Orders Data Model — Reference for the Admin App

This document describes the `orders` collection **written by this repo** (the customer-facing
ordering site, `asian-le-website`) so the separate admin app can read/manage it correctly.
This is the reverse of `ecommerce.md` in this repo, which describes the menu data model the
admin app writes and this site reads.

This site currently has **no order-management UI of its own** — no dashboard, no auth, no
notifications. Orders are written to Firestore and need to be surfaced to staff somewhere;
that's the admin app's job.

**Field names/enum values mirror the `AsianLePOS` staff app's `Order` model** (`src/types/global.d.ts`,
`src/types/enums.ts`) — a completely different Firebase project (`asianlepos` vs `asianlewebsite`),
so there's no shared data, just a consistent vocabulary in case admin tooling wants to treat both
similarly. Divergences from POS are called out explicitly below; anything not called out matches
POS exactly. This site has no `dineInOrders`/`takeOutOrders` split or `orderType` field — it only
ever writes pay-at-pickup orders to the single `orders` collection.

## Collection

| Collection | Shape | Written by | Read by |
|---|---|---|---|
| `orders` | `Order` | This site, via `app/api/orders/route.ts`, using a Firebase Admin service account (bypasses security rules) | The admin app |

Firestore security rules should **deny all client reads/writes** on `orders` — nothing but the
trusted server write path (this site's API route) and the admin app's own trusted access should
ever touch it.

### Enums (mirrors `AsianLePOS/src/types/enums.ts`)

```ts
// Extends POS's InProgress/Completed/Cancelled with New, for orders not yet acknowledged by staff.
enum OrderStatus { New = "New", InProgress = "InProgress", Completed = "Completed", Cancelled = "Cancelled" }

enum TakeOutFulfillmentKind { Immediate = "immediate", Scheduled = "scheduled" }
```

### `Order`

```ts
{
  id?: string;                 // Firestore doc id
  orderNumber: string;         // extension — short human-readable code (last 6 chars of doc id,
                                // uppercased), for calling out at pickup; computed in route.ts at
                                // order-creation time, POS has no analog
  status: OrderStatus;
  fulfillment:
    | { kind: TakeOutFulfillmentKind.Immediate; readyTimeMinutes?: number }  // default 15
    | { kind: TakeOutFulfillmentKind.Scheduled; scheduledAt: Timestamp };    // up to 30 days out
  customerName: string;
  phoneNumber: string;
  customerEmail: string;       // extension — mandatory (reserved for an order-confirmation email feature)
  orderItems: {
    menuItemId: string;         // extension — traces back to demoMenuItems; POS keeps no doc reference
    name: string;                // snapshot at order time
    price: number;               // dollars, PER-UNIT, INCLUDING selected options — matches POS's
                                  // OrderItem.price convention (options are summed into this, not additive)
    quantity: number;
    kitchenType: KitchenType;     // "Deep Fry" | "Stir Fry" | "Other" | "Both" | "Drink" — from demoMenuItems
    instructions?: string;        // per-item special instructions — not wired to any checkout UI yet
    options?: {
      name: string;
      price: number;              // additive modifier, dollars (already baked into item.price above)
      quantity: number;           // >1 only possible if the option's group has multipleOptionQuantity
    }[];
  }[];
  taxBreakDown: {
    subTotal: number;            // sum of orderItems[].price * quantity
    pst: number;                  // 6%
    gst: number;                  // 5% — Saskatchewan restaurant meal rates
    total: number;                 // subTotal + pst + gst
  };
  createdAt: Timestamp;
}
```

## Important nuances

- **This site writes `status: OrderStatus.New` on every order and never changes it.** All status
  transitions (`InProgress` → `Completed`, or `Cancelled`) are the admin app's responsibility.
- **`orderItems[].price` already includes selected options** — it is NOT the bare menu price.
  `subTotal` is simply `sum(price * quantity)`, matching POS's `orderItemsSubtotal`. Don't
  re-add `options[].price` on top when computing totals; it's for itemized display only.
- **`orderItems[].options` has no `optionId`** — unlike this site's own client-side cart, which
  keeps it internally for stacking/dedup. It's stripped before persisting, matching POS's
  `OrderItemOption` exactly (`name`/`price`/`quantity` only).
- **Every price in this document is authoritative** — recomputed server-side from live
  `demoMenuItems`/`optionGroups`/`options` data at order time, never trusted from the client. If
  a discrepancy ever shows up between an order's prices and current menu prices, that's expected
  (menu prices may have changed since); it is not a bug to reconcile.
- **Pay-at-pickup only, no online payment yet.** There is no `paymentStatus`/`paymentIntentId`
  field — that will be added if/when online payment is integrated.
- **`fulfillment.kind === Scheduled` allows any date up to `MAX_SCHEDULE_DAYS_AHEAD` (30) days
  out** (`lib/availability.ts`), via a `datetime-local` calendar+clock input — matching POS's own
  web scheduling UI (`WebScheduledDateTimeInput.tsx`). `scheduledAt` is a real Firestore Timestamp.
- **No `staff` field** (present and required on POS's base `Order`) — there's no staff member
  involved in placing an online order. Omitted rather than faked.
- **No order-level notes field.** Customers can't currently leave a general order note; only
  per-item `instructions` exists in the type (matching POS), and it isn't wired to any checkout
  UI yet either — reserved for future use.
- **No notification mechanism exists yet.** The admin app needs its own polling/`onSnapshot`
  subscription on `orders` (e.g. `where("status", "==", "New")`) to know a new order arrived —
  there's no push/email/SMS from this site.
