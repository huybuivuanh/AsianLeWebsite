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
};

type AddLineInput = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl?: string;
  options: CartOptionSelection[];
  quantity?: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (input: AddLineInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clear: () => void;
};

/** Two lines are "the same" (and should stack quantity) if the item + exact option selections match. */
function lineConfigKey(menuItemId: string, options: CartOptionSelection[]): string {
  const optionsKey = options
    .map((o) => `${o.optionId}x${o.quantity}`)
    .sort()
    .join("|");
  return `${menuItemId}::${optionsKey}`;
}

export const useCartStore = create<CartState>()((set, get) => ({
  lines: [],

  addLine: (input) => {
    const quantity = input.quantity ?? 1;
    const key = lineConfigKey(input.menuItemId, input.options);
    const existing = get().lines.find(
      (line) => lineConfigKey(line.menuItemId, line.options) === key,
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
          id: crypto.randomUUID(),
          menuItemId: input.menuItemId,
          name: input.name,
          price: input.price,
          imageUrl: input.imageUrl,
          quantity,
          options: input.options,
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

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
