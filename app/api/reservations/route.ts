import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { resolveScheduledPickupInstant } from "@/lib/availability";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import {
  getReservationInvalidReason,
  RESERVATION_INVALID_MESSAGES,
  RESERVATION_ITEM,
  RESERVATION_MAX_GUESTS_INPUT,
  RESERVATION_MAX_REQUESTS_LENGTH,
} from "@/lib/reservation";
import { orderNumberFromId, parseCustomerInfo } from "@/lib/server/orderHelpers";
import { KitchenType, OrderStatus, TakeOutFulfillmentKind } from "@/types/enum";

/**
 * Books a table. Saved as a regular scheduled order (same `orders` shape the admin app
 * already reads) with one hard-coded $0 "Reservation" item — see lib/reservation.ts.
 *
 * Unlike /api/orders, this enforces store hours, holidays and pause-ordering, plus the
 * reservation lead time and last-seating cutoff.
 */

type IncomingReservation = {
  date?: unknown;
  time?: unknown;
  guests?: unknown;
  specialRequests?: unknown;
  customerName?: unknown;
  phoneNumber?: unknown;
  customerEmail?: unknown;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: IncomingReservation;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  const customer = parseCustomerInfo(body);
  if ("error" in customer) return badRequest(customer.error);

  const guests = typeof body.guests === "number" ? body.guests : NaN;
  if (!Number.isInteger(guests) || guests < 1 || guests > RESERVATION_MAX_GUESTS_INPUT) {
    return badRequest("Please enter a valid number of guests");
  }

  const date = typeof body.date === "string" ? body.date : "";
  const time = typeof body.time === "string" ? body.time : "";

  const storeSettings = await fetchStoreSettingsForServer();
  const invalidReason = getReservationInvalidReason(storeSettings, date, time, new Date());
  if (invalidReason) return badRequest(RESERVATION_INVALID_MESSAGES[invalidReason]);

  const specialRequests =
    typeof body.specialRequests === "string"
      ? body.specialRequests.trim().slice(0, RESERVATION_MAX_REQUESTS_LENGTH)
      : "";

  const orderItems: OrderItem[] = [
    {
      menuItemId: RESERVATION_ITEM.menuItemId,
      name: RESERVATION_ITEM.name,
      price: 0,
      quantity: 1,
      options: [{ name: RESERVATION_ITEM.optionName, price: 0, quantity: guests }],
      ...(specialRequests ? { instructions: specialRequests } : {}),
      kitchenType: KitchenType.Other,
    },
  ];

  const fulfillment: OrderFulfillment = {
    kind: TakeOutFulfillmentKind.Scheduled,
    scheduledAt: resolveScheduledPickupInstant(storeSettings.timezone, date, time),
  };

  const ref = adminDb.collection("orders").doc();
  const orderNumber = orderNumberFromId(ref.id);

  await ref.set({
    orderNumber,
    status: OrderStatus.New,
    fulfillment,
    ...customer,
    orderItems,
    printed: false,
    paid: false,
    taxBreakDown: calculateTaxBreakdown(0),
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ orderId: ref.id, orderNumber, date, time, guests });
}
