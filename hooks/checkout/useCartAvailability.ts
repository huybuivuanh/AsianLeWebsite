import { useEffect, useState } from "react";
import { postJson } from "@/lib/apiClient";
import type { CartLine } from "@/lib/cartStore";
import type { CartAvailabilityRequest, CartAvailabilityResponse } from "@/lib/orderApi";

/**
 * Re-checks the cart against the live menu (/api/cart/availability) whenever it changes:
 * which lines are no longer available, and which have a new price. A UX nudge only —
 * /api/orders checks again when the order is placed.
 */
export function useCartAvailability(lines: CartLine[]) {
  const [unavailableLineIds, setUnavailableLineIds] = useState<Set<string>>(new Set());
  const [priceUpdates, setPriceUpdates] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    const request: CartAvailabilityRequest = {
      lines: lines.map((line) => ({
        menuItemId: line.menuItemId,
        options: line.options.map((o) => ({ optionId: o.optionId, quantity: o.quantity })),
      })),
    };
    postJson<CartAvailabilityResponse>("/api/cart/availability", request)
      .then((result) => {
        if (cancelled || !result.ok) return;
        const unavailable = new Set<string>();
        const priceChanges = new Map<string, number>();
        lines.forEach((line, i) => {
          const check = result.data.results[i];
          if (!check) return;
          if (!check.itemAvailable || check.unavailableOptionIds.length > 0) {
            unavailable.add(line.id);
          } else if (check.currentPrice !== null && check.currentPrice !== line.price) {
            priceChanges.set(line.id, check.currentPrice);
          }
        });
        setUnavailableLineIds(unavailable);
        setPriceUpdates(priceChanges);
      })
      .catch(() => {
        // Best effort only — /api/orders re-validates when the order is placed.
      });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  return { unavailableLineIds, priceUpdates };
}
