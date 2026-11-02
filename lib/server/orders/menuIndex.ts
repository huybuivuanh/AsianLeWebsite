import "server-only";
import {
  fetchItemOptionsForServer,
  fetchMenuItemsForServer,
  fetchOptionGroupsForServer,
} from "@/lib/orderMenuData";

/**
 * The live menu, indexed by id, plus the option rules both /api/orders and
 * /api/cart/availability price a cart line with — so the price check at checkout and
 * the price actually charged can't drift apart.
 */

/** Most of one item (and of one option) per cart line. */
export const MAX_LINE_QUANTITY = 20;

export type MenuIndex = {
  itemsById: Map<string, MenuItem>;
  groupsById: Map<string, OptionGroup>;
  optionsById: Map<string, ItemOption>;
};

export async function loadMenuIndex(): Promise<MenuIndex> {
  const [items, groups, options] = await Promise.all([
    fetchMenuItemsForServer(),
    fetchOptionGroupsForServer(),
    fetchItemOptionsForServer(),
  ]);
  return {
    itemsById: new Map(items.map((i) => [i.id, i])),
    groupsById: new Map(groups.map((g) => [g.id, g])),
    optionsById: new Map(options.map((o) => [o.id, o])),
  };
}

/** An item's option groups, and which of them each of its options belongs to. */
export function itemOptionGroups(
  item: MenuItem,
  menu: MenuIndex,
): { groups: OptionGroup[]; groupByOptionId: Map<string, OptionGroup> } {
  const groups = (item.optionGroupIds ?? [])
    .map((ref) => menu.groupsById.get(ref.optionGroupId))
    .filter((g): g is OptionGroup => g != null);
  const groupByOptionId = new Map<string, OptionGroup>();
  for (const group of groups) {
    for (const optionId of group.optionIds ?? []) groupByOptionId.set(optionId, group);
  }
  return { groups, groupByOptionId };
}

/** How many of a picked option count: only groups with `multipleOptionQuantity` allow
 * more than one (capped at MAX_LINE_QUANTITY). */
export function optionQuantity(group: OptionGroup, requested: unknown): number {
  if (!group.multipleOptionQuantity) return 1;
  const raw = typeof requested === "number" ? Math.floor(requested) : 1;
  return Math.max(1, Math.min(MAX_LINE_QUANTITY, raw || 1));
}
