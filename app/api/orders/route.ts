import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  fetchMenuItemsForServer,
  fetchOptionGroupsForServer,
  fetchItemOptionsForServer,
} from "@/lib/orderMenuData";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import {
  isValidScheduledPickup,
  resolveScheduledPickupInstant,
} from "@/lib/availability";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import { KitchenType, OrderStatus, TakeOutFulfillmentKind } from "@/types/enum";

/**
 * Places a pay-at-pickup order. Never trusts client-submitted prices — only
 * item/option ids and quantities are read from the request body; every price
 * is re-derived from live Firestore data here.
 *
 * Deliberately does NOT block on sold-out/availability-window state, store hours,
 * or pause-ordering — those are surfaced to the customer as UX nudges earlier in the
 * flow (menu page badges, /api/cart/availability at checkout), but honoring an order
 * placed during a pause or outside hours is the restaurant's call, not this site's.
 * Scheduled-pickup requests still get a data-sanity check (real date, not in the past,
 * within the scheduling horizon, minimum lead time) — see getScheduledPickupInvalidReason.
 *
 * Field names/shapes mirror the AsianLePOS app's Order model (a different Firebase
 * project — see orders-schema.md).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LINE_QUANTITY = 20;
const MAX_INSTRUCTIONS_LENGTH = 200;

// Hashes the Firestore doc id into a 6-digit number, purely for a short,
// easy-to-call-out pickup code — not a uniqueness guarantee.
function orderNumberFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1_000_000;
  }
  return hash.toString().padStart(6, "0");
}

type IncomingSelection = { optionId?: unknown; quantity?: unknown };
type IncomingLine = {
  menuItemId?: unknown;
  quantity?: unknown;
  options?: IncomingSelection[];
  instructions?: unknown;
};
type IncomingFulfillment = { kind?: unknown; date?: unknown; time?: unknown };
type IncomingOrder = {
  lines?: IncomingLine[];
  fulfillment?: IncomingFulfillment;
  customerName?: unknown;
  phoneNumber?: unknown;
  customerEmail?: unknown;
};

/** Wire shape returned to the client — "YYYY-MM-DD" + "HH:mm", not the persisted `scheduledAt: Date`. */
type FulfillmentWire =
  | { kind: TakeOutFulfillmentKind.Immediate }
  | { kind: TakeOutFulfillmentKind.Scheduled; date: string; time: string };

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: IncomingOrder;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }

  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return badRequest("Your cart is empty");
  }

  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
  if (!customerName) return badRequest("Name is required");
  if (!phoneNumber) return badRequest("Phone number is required");

  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  if (!customerEmail) return badRequest("Email is required");
  if (!EMAIL_RE.test(customerEmail)) return badRequest("Invalid email address");

  const [menuItems, optionGroups, options, storeSettings] = await Promise.all([
    fetchMenuItemsForServer(),
    fetchOptionGroupsForServer(),
    fetchItemOptionsForServer(),
    fetchStoreSettingsForServer(),
  ]);

  const now = new Date();
  const menuItemsById = new Map(menuItems.map((i) => [i.id, i]));
  const optionGroupsById = new Map(optionGroups.map((g) => [g.id, g]));
  const optionsById = new Map(options.map((o) => [o.id, o]));

  let fulfillment: OrderFulfillment;
  let fulfillmentWire: FulfillmentWire;
  if (body.fulfillment?.kind === TakeOutFulfillmentKind.Scheduled) {
    const date = body.fulfillment.date;
    const time = body.fulfillment.time;
    if (
      typeof date !== "string" ||
      typeof time !== "string" ||
      // Sanity only (format/past/too-far-ahead/lead-time) — not store hours/pause,
      // see the file-level comment above.
      !isValidScheduledPickup(storeSettings, date, time, now, { checkBusinessHours: false })
    ) {
      return badRequest("Selected pickup time is invalid");
    }
    const scheduledAt = resolveScheduledPickupInstant(storeSettings.timezone, date, time);
    fulfillment = { kind: TakeOutFulfillmentKind.Scheduled, scheduledAt };
    fulfillmentWire = { kind: TakeOutFulfillmentKind.Scheduled, date, time };
  } else {
    fulfillment = { kind: TakeOutFulfillmentKind.Immediate };
    fulfillmentWire = { kind: TakeOutFulfillmentKind.Immediate };
  }

  const orderItems: OrderItem[] = [];

  for (const line of body.lines) {
    const menuItemId = typeof line.menuItemId === "string" ? line.menuItemId : "";
    const quantity = typeof line.quantity === "number" ? Math.floor(line.quantity) : NaN;
    if (!menuItemId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
      return badRequest("Invalid item in cart");
    }

    const item = menuItemsById.get(menuItemId);
    if (!item) return badRequest("One of the items in your cart no longer exists");

    const itemGroups = (item.optionGroupIds ?? [])
      .map((ref) => optionGroupsById.get(ref.optionGroupId))
      .filter((g): g is OptionGroup => g != null);

    // Reverse index: which group does a given option belong to, for this item.
    const groupByOptionId = new Map<string, OptionGroup>();
    for (const group of itemGroups) {
      for (const optionId of group.optionIds ?? []) groupByOptionId.set(optionId, group);
    }

    const selectedOptions: OrderItemOption[] = [];
    const selectionCountByGroup = new Map<string, number>();
    let optionsTotal = 0;

    for (const sel of line.options ?? []) {
      const optionId = typeof sel.optionId === "string" ? sel.optionId : "";
      const group = groupByOptionId.get(optionId);
      if (!group) return badRequest(`Invalid option for ${item.name}`);

      const option = optionsById.get(optionId);
      if (!option) return badRequest(`Invalid option for ${item.name}`);

      const rawQty = typeof sel.quantity === "number" ? Math.floor(sel.quantity) : 1;
      const optionQuantity = group.multipleOptionQuantity
        ? Math.max(1, Math.min(MAX_LINE_QUANTITY, rawQty || 1))
        : 1;

      selectedOptions.push({
        name: option.name,
        price: option.price,
        quantity: optionQuantity,
      });
      optionsTotal += option.price * optionQuantity;
      selectionCountByGroup.set(group.id, (selectionCountByGroup.get(group.id) ?? 0) + 1);
    }

    for (const group of itemGroups) {
      const count = selectionCountByGroup.get(group.id) ?? 0;
      if (count < group.minSelection || count > group.maxSelection) {
        return badRequest(`Invalid selection for "${group.name}" on ${item.name}`);
      }
    }

    const instructions =
      typeof line.instructions === "string"
        ? line.instructions.trim().slice(0, MAX_INSTRUCTIONS_LENGTH)
        : "";

    orderItems.push({
      menuItemId: item.id,
      name: item.name,
      // Per-unit price INCLUDING selected options — matches POS's OrderItem.price convention.
      price: item.price + optionsTotal,
      quantity,
      options: selectedOptions,
      ...(instructions ? { instructions } : {}),
      kitchenType: item.kitchenType ?? KitchenType.Other,
    });
  }

  // Matches POS's orderItemsSubtotal: price already includes options, so just price * quantity.
  const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxBreakDown = calculateTaxBreakdown(subTotal);

  const ref = adminDb.collection("orders").doc();
  const orderNumber = orderNumberFromId(ref.id);

  await ref.set({
    orderNumber,
    status: OrderStatus.New,
    fulfillment,
    customerName,
    phoneNumber,
    customerEmail,
    orderItems,
    printed: false,
    paid: false,
    taxBreakDown,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({
    orderId: ref.id,
    orderNumber,
    taxBreakDown,
    fulfillment: fulfillmentWire,
  });
}
