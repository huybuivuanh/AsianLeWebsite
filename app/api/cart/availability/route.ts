import { NextRequest, NextResponse } from "next/server";
import { isAvailableNow } from "@/lib/availability";
import type { CartAvailabilityResponse, LineAvailabilityResult } from "@/lib/orderApi";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { jsonError, readJsonObject } from "@/lib/server/http";
import { itemOptionGroups, loadMenuIndex, optionQuantity } from "@/lib/server/orders/menuIndex";

/**
 * Read-only check of live item/option availability and pricing for a cart, so checkout
 * can flag stale cart lines (item went sold-out, availability window closed, price
 * changed) before the customer fills out the form — /api/orders re-checks the same
 * thing authoritatively at order time regardless, this is purely a UX nudge. Prices use
 * the same option rules as /api/orders (lib/server/orders/menuIndex.ts).
 */

type IncomingSelection = { optionId?: unknown; quantity?: unknown };
type IncomingLine = { menuItemId?: unknown; options?: unknown };

export async function POST(request: NextRequest) {
  const body = await readJsonObject<{ lines?: unknown }>(request);
  if (!body || !Array.isArray(body.lines)) return jsonError("Invalid request body");
  const lines = body.lines as (IncomingLine | null)[];

  const [menu, storeSettings] = await Promise.all([
    loadMenuIndex(),
    fetchStoreSettingsForServer(),
  ]);
  const now = new Date();
  const availableNow = (entry: MenuItem | ItemOption) =>
    isAvailableNow(entry, storeSettings.timezone, now);

  const results = lines.map((line): LineAvailabilityResult => {
    const menuItemId = typeof line?.menuItemId === "string" ? line.menuItemId : "";
    const item = menu.itemsById.get(menuItemId);
    if (!item) return { itemAvailable: false, unavailableOptionIds: [], currentPrice: null };

    const { groupByOptionId } = itemOptionGroups(item, menu);
    const selections: IncomingSelection[] = Array.isArray(line?.options) ? line.options : [];
    const unavailableOptionIds: string[] = [];
    let optionsTotal = 0;

    for (const sel of selections) {
      const optionId = typeof sel?.optionId === "string" ? sel.optionId : "";
      if (!optionId) continue;
      const option = menu.optionsById.get(optionId);
      const group = groupByOptionId.get(optionId);
      // An option no longer on this item would be rejected by /api/orders too.
      if (!option || !group || !availableNow(option)) {
        unavailableOptionIds.push(optionId);
        continue;
      }
      optionsTotal += option.price * optionQuantity(group, sel.quantity);
    }

    return {
      itemAvailable: availableNow(item),
      unavailableOptionIds,
      currentPrice: item.price + optionsTotal,
    };
  });

  return NextResponse.json<CartAvailabilityResponse>({ results });
}
