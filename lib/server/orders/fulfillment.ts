import "server-only";
import { isValidScheduledPickup, resolveScheduledPickupInstant } from "@/lib/availability";
import type { FulfillmentWire } from "@/lib/orderApi";
import { TakeOutFulfillmentKind } from "@/types/enum";

type IncomingFulfillment = { kind?: unknown; date?: unknown; time?: unknown };

/**
 * The pickup the customer asked for, as saved (`fulfillment`) and as echoed back to the
 * browser (`wire`). A scheduled time only gets a sanity check (real date, not past, within
 * the scheduling horizon, lead time) — not store hours or pause; see app/api/orders/route.ts.
 */
export function resolveFulfillment(
  input: unknown,
  settings: StoreSettings,
  now: Date,
): { fulfillment: OrderFulfillment; wire: FulfillmentWire } | { error: string } {
  const requested = (input ?? {}) as IncomingFulfillment;

  if (requested.kind !== TakeOutFulfillmentKind.Scheduled) {
    // readyTimeMinutes is deliberately left unset — the POS/admin app writes it when staff
    // confirm the order into the kitchen, not guessed at creation time.
    return {
      fulfillment: { kind: TakeOutFulfillmentKind.Immediate },
      wire: { kind: TakeOutFulfillmentKind.Immediate },
    };
  }

  const { date, time } = requested;
  if (
    typeof date !== "string" ||
    typeof time !== "string" ||
    !isValidScheduledPickup(settings, date, time, now, { checkBusinessHours: false })
  ) {
    return { error: "Selected pickup time is invalid" };
  }
  return {
    fulfillment: {
      kind: TakeOutFulfillmentKind.Scheduled,
      scheduledAt: resolveScheduledPickupInstant(settings.timezone, date, time),
    },
    wire: { kind: TakeOutFulfillmentKind.Scheduled, date, time },
  };
}
