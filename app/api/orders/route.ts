import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  fetchDemoMenuItemsForServer,
  fetchOptionGroupsForServer,
  fetchItemOptionsForServer,
} from "@/lib/orderMenuData";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import {
  isAvailableNow,
  isStoreOpenNow,
  isValidScheduledPickupTime,
  resolveScheduledPickupInstant,
} from "@/lib/availability";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import { OrderStatus, TakeOutFulfillmentKind } from "@/types/enum";

/**
 * Places a pay-at-pickup order. Never trusts client-submitted prices — only
 * item/option ids and quantities are read from the request body; every price
 * and availability check is re-derived from live Firestore data here.
 *
 * Field names/shapes mirror the AsianLePOS app's Order model (a different Firebase
 * project — see orders-schema.md).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LINE_QUANTITY = 20;
const DEFAULT_READY_TIME_MINUTES = 15;

type IncomingSelection = { optionId?: unknown; quantity?: unknown };
type IncomingLine = {
  menuItemId?: unknown;
  quantity?: unknown;
  options?: IncomingSelection[];
};
type IncomingFulfillment = { kind?: unknown; pickupTime?: unknown };
type IncomingOrder = {
  lines?: IncomingLine[];
  fulfillment?: IncomingFulfillment;
  customerName?: unknown;
  phoneNumber?: unknown;
  customerEmail?: unknown;
};

/** Wire shape returned to the client — same-day "HH:mm", not the persisted `scheduledAt: Date`. */
type FulfillmentWire =
  | { kind: TakeOutFulfillmentKind.Immediate }
  | { kind: TakeOutFulfillmentKind.Scheduled; pickupTime: string };

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

  const rawEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  if (rawEmail && !EMAIL_RE.test(rawEmail)) return badRequest("Invalid email address");
  const customerEmail = rawEmail || undefined;

  const [menuItems, optionGroups, options, storeSettings] = await Promise.all([
    fetchDemoMenuItemsForServer(),
    fetchOptionGroupsForServer(),
    fetchItemOptionsForServer(),
    fetchStoreSettingsForServer(),
  ]);

  const now = new Date();
  const menuItemsById = new Map(menuItems.map((i) => [i.id, i]));
  const optionGroupsById = new Map(optionGroups.map((g) => [g.id, g]));
  const optionsById = new Map(options.map((o) => [o.id, o]));

  let fulfillment: TakeOutFulfillment;
  let fulfillmentWire: FulfillmentWire;
  if (body.fulfillment?.kind === TakeOutFulfillmentKind.Scheduled) {
    const pickupTime = body.fulfillment.pickupTime;
    if (
      typeof pickupTime !== "string" ||
      !isValidScheduledPickupTime(storeSettings, pickupTime, now)
    ) {
      return badRequest("Selected pickup time is no longer available");
    }
    const scheduledAt = resolveScheduledPickupInstant(storeSettings.timezone, pickupTime, now);
    fulfillment = { kind: TakeOutFulfillmentKind.Scheduled, scheduledAt };
    fulfillmentWire = { kind: TakeOutFulfillmentKind.Scheduled, pickupTime };
  } else {
    if (!isStoreOpenNow(storeSettings, now)) {
      return badRequest("We're currently closed for ordering");
    }
    fulfillment = {
      kind: TakeOutFulfillmentKind.Immediate,
      readyTimeMinutes: DEFAULT_READY_TIME_MINUTES,
    };
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
    if (!isAvailableNow(item, storeSettings.timezone, now)) {
      return badRequest(`${item.name} is no longer available`);
    }

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
      if (!isAvailableNow(option, storeSettings.timezone, now)) {
        return badRequest(`${option.name} is no longer available`);
      }

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

    orderItems.push({
      menuItemId: item.id,
      name: item.name,
      // Per-unit price INCLUDING selected options — matches POS's OrderItem.price convention.
      price: item.price + optionsTotal,
      quantity,
      options: selectedOptions,
      kitchenType: item.kitchenType,
    });
  }

  // Matches POS's orderItemsSubtotal: price already includes options, so just price * quantity.
  const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxBreakDown = calculateTaxBreakdown(subTotal);

  const ref = adminDb.collection("orders").doc();
  const orderNumber = ref.id.slice(-6).toUpperCase();

  await ref.set({
    orderNumber,
    status: OrderStatus.New,
    fulfillment,
    customerName,
    phoneNumber,
    ...(customerEmail ? { customerEmail } : {}),
    orderItems,
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
