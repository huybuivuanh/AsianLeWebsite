import "server-only";
import {
  itemOptionGroups,
  MAX_LINE_QUANTITY,
  optionQuantity,
  type MenuIndex,
} from "@/lib/server/orders/menuIndex";
import { KitchenType } from "@/types/enum";

/**
 * Turns the cart sent by the browser into priced order items. Only item/option ids,
 * quantities and instructions are read from the request — every price comes from the
 * live menu. Checks min/max option picks per group.
 */

const MAX_INSTRUCTIONS_LENGTH = 200;

type IncomingSelection = { optionId?: unknown; quantity?: unknown };
type IncomingLine = {
  menuItemId?: unknown;
  quantity?: unknown;
  options?: unknown;
  instructions?: unknown;
};

type PricedCart = { orderItems: OrderItem[]; subTotal: number };

function buildOrderItem(line: IncomingLine, menu: MenuIndex): OrderItem | { error: string } {
  const menuItemId = typeof line.menuItemId === "string" ? line.menuItemId : "";
  const quantity = typeof line.quantity === "number" ? Math.floor(line.quantity) : NaN;
  if (!menuItemId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
    return { error: "Invalid item in cart" };
  }

  const item = menu.itemsById.get(menuItemId);
  if (!item) return { error: "One of the items in your cart no longer exists" };

  const { groups, groupByOptionId } = itemOptionGroups(item, menu);
  const selectedOptions: OrderItemOption[] = [];
  const pickedPerGroup = new Map<string, number>();
  let optionsTotal = 0;

  const selections: IncomingSelection[] = Array.isArray(line.options) ? line.options : [];
  for (const sel of selections) {
    const optionId = typeof sel?.optionId === "string" ? sel.optionId : "";
    const group = groupByOptionId.get(optionId);
    const option = menu.optionsById.get(optionId);
    if (!group || !option) return { error: `Invalid option for ${item.name}` };

    const qty = optionQuantity(group, sel.quantity);
    selectedOptions.push({ name: option.name, price: option.price, quantity: qty });
    optionsTotal += option.price * qty;
    pickedPerGroup.set(group.id, (pickedPerGroup.get(group.id) ?? 0) + 1);
  }

  for (const group of groups) {
    const count = pickedPerGroup.get(group.id) ?? 0;
    if (count < group.minSelection || count > group.maxSelection) {
      return { error: `Invalid selection for "${group.name}" on ${item.name}` };
    }
  }

  const instructions =
    typeof line.instructions === "string"
      ? line.instructions.trim().slice(0, MAX_INSTRUCTIONS_LENGTH)
      : "";

  return {
    menuItemId: item.id,
    name: item.name,
    // Per-unit price INCLUDING selected options — matches POS's OrderItem.price convention.
    price: item.price + optionsTotal,
    quantity,
    options: selectedOptions,
    ...(instructions ? { instructions } : {}),
    kitchenType: item.kitchenType ?? KitchenType.Other,
  };
}

export function buildOrderItems(
  lines: unknown[],
  menu: MenuIndex,
): PricedCart | { error: string } {
  const orderItems: OrderItem[] = [];
  for (const line of lines) {
    if (line === null || typeof line !== "object") return { error: "Invalid item in cart" };
    const result = buildOrderItem(line as IncomingLine, menu);
    if ("error" in result) return result;
    orderItems.push(result);
  }
  // Matches POS's orderItemsSubtotal: price already includes options, so just price * quantity.
  const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { orderItems, subTotal };
}
