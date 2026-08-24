"use client";

import { create } from "zustand";

/**
 * Client-side cart, in-memory only (no persistence — cart does not survive a
 * refresh or a new session, by design). Mirrors AsianLePOS's cart pattern
 * (a different Firebase project — no shared data, just a consistent shape): each
 * line is snapshotted at add-to-cart time, `price` is the per-unit price INCLUDING
 * selected options (matching POS's OrderItem convention), and `options` is kept
 * alongside only for itemized display. The checkout API re-derives the
 * authoritative price from Firestore — these stored numbers are never trusted.
 */

// Cart-only: OrderItemOption plus optionId, needed here for cart-stacking keys, React
// keys, and telling the server which option was picked — stripped before persisting
// (the stored OrderItemOption matches POS's exact name/price/quantity shape).
export type CartOptionSelection = OrderItemOption & { optionId: string };

export type CartLine = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  options: CartOptionSelection[];
  instructions?: string;
};

type AddLineInput = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl?: string;
  options: CartOptionSelection[];
  quantity?: number;
  instructions?: string;
};

type CartState = {
  lines: CartLine[];
  addLine: (input: AddLineInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
};

/** crypto.randomUUID() only exists in secure contexts (HTTPS, or "localhost" itself) — it's
 * undefined when browsing dev over a plain-http LAN IP. This id is only ever a client-side
 * React/stacking key, never sent to the server, so a non-cryptographic fallback is fine. */
function generateLineId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Two lines are "the same" (and should stack quantity) if the item + exact option
 * selections + instructions match — different instructions get their own line so
 * neither note is silently dropped when merging quantities. */
function lineConfigKey(
  menuItemId: string,
  options: CartOptionSelection[],
  instructions?: string,
): string {
  const optionsKey = options
    .map((o) => `${o.optionId}x${o.quantity}`)
    .sort()
    .join("|");
  return `${menuItemId}::${optionsKey}::${instructions ?? ""}`;
}

export const useCartStore = create<CartState>()((set, get) => ({
  lines: [],

  addLine: (input) => {
    const quantity = input.quantity ?? 1;
    const instructions = input.instructions?.trim().toUpperCase() || undefined;
    const key = lineConfigKey(input.menuItemId, input.options, instructions);
    const existing = get().lines.find(
      (line) =>
        lineConfigKey(line.menuItemId, line.options, line.instructions) === key,
    );

    if (existing) {
      set({
        lines: get().lines.map((line) =>
          line.id === existing.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        ),
      });
      return;
    }

    set({
      lines: [
        ...get().lines,
        {
          id: generateLineId(),
          menuItemId: input.menuItemId,
          name: input.name,
          price: input.price,
          imageUrl: input.imageUrl,
          quantity,
          options: input.options,
          instructions,
        },
      ],
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set({ lines: get().lines.filter((l) => l.id !== id) });
      return;
    }
    set({
      lines: get().lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
    });
  },

  removeLine: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),

  clear: () => set({ lines: [] }),
}));

/** price already includes selected options — matches POS's orderItemsSubtotal (price * quantity). */
export function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

/** Per-unit item price with selected options backed out, for itemized display only. */
export function lineBasePrice(line: CartLine): number {
  const optionsTotal = line.options.reduce(
    (sum, o) => sum + o.price * o.quantity,
    0,
  );
  return line.price - optionsTotal;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
