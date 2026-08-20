import { NextRequest, NextResponse } from "next/server";
import {
  fetchMenuItemsForServer,
  fetchItemOptionsForServer,
} from "@/lib/orderMenuData";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { isAvailableNow } from "@/lib/availability";

/**
 * Read-only check of live item/option availability and pricing for a cart, so checkout
 * can flag stale cart lines (item went sold-out, availability window closed, price
 * changed) before the customer fills out the form — /api/orders re-checks the same
 * thing authoritatively at order time regardless, this is purely a UX nudge.
 */

type IncomingOptionSelection = { optionId?: unknown; quantity?: unknown };
type IncomingLine = { menuItemId?: unknown; options?: IncomingOptionSelection[] };
type IncomingBody = { lines?: IncomingLine[] };

type LineAvailabilityResult = {
  itemAvailable: boolean;
  unavailableOptionIds: string[];
  // Per-unit price INCLUDING selected options (matches CartLine.price convention) —
  // null when the item itself is unavailable/missing, since price is meaningless then.
  currentPrice: number | null;
};

export async function POST(request: NextRequest) {
  let body: IncomingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.lines)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [menuItems, options, storeSettings] = await Promise.all([
    fetchMenuItemsForServer(),
    fetchItemOptionsForServer(),
    fetchStoreSettingsForServer(),
  ]);

  const menuItemsById = new Map(menuItems.map((i) => [i.id, i]));
  const optionsById = new Map(options.map((o) => [o.id, o]));
  const now = new Date();

  const results: LineAvailabilityResult[] = body.lines.map((line) => {
    const menuItemId = typeof line.menuItemId === "string" ? line.menuItemId : "";
    const item = menuItemsById.get(menuItemId);
    const itemAvailable = !!item && isAvailableNow(item, storeSettings.timezone, now);

    const selections = (Array.isArray(line.options) ? line.options : [])
      .map((sel) => ({
        optionId: typeof sel.optionId === "string" ? sel.optionId : "",
        quantity: typeof sel.quantity === "number" && sel.quantity > 0 ? sel.quantity : 1,
      }))
      .filter((sel) => sel.optionId);

    const unavailableOptionIds = selections
      .map((sel) => sel.optionId)
      .filter((id) => {
        const option = optionsById.get(id);
        return !option || !isAvailableNow(option, storeSettings.timezone, now);
      });

    const optionsTotal = selections.reduce((sum, sel) => {
      const option = optionsById.get(sel.optionId);
      return option ? sum + option.price * sel.quantity : sum;
    }, 0);
    const currentPrice = item ? item.price + optionsTotal : null;

    return { itemAvailable, unavailableOptionIds, currentPrice };
  });

  return NextResponse.json({ results });
}
