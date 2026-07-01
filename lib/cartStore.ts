"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-side cart, persisted to localStorage. Snapshots name/price at add-to-cart
 * time so the cart renders anywhere without needing the full menu loaded — the
 * checkout API (Phase 4) re-derives the authoritative price from Firestore, it
 * never trusts these stored numbers.
 */

export type CartOptionSelection = {
  optionId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartOptionGroupSelection = {
  optionGroupId: string;
  optionGroupName: string;
  selections: CartOptionSelection[];
};

export type CartLine = {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  imageUrl?: string;
  quantity: number;
  optionGroups: CartOptionGroupSelection[];
};

type AddLineInput = {
  menuItemId: string;
  name: string;
  unitPrice: number;
  imageUrl?: string;
  optionGroups: CartOptionGroupSelection[];
  quantity?: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (input: AddLineInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

/** Two lines are "the same" (and should stack quantity) if the item + exact option selections match. */
function lineConfigKey(
  menuItemId: string,
  optionGroups: CartOptionGroupSelection[],
): string {
  const groupsKey = optionGroups
    .map((g) =>
      [
        g.optionGroupId,
        ...g.selections
          .map((s) => `${s.optionId}x${s.quantity}`)
          .sort(),
      ].join(":"),
    )
    .sort()
    .join("|");
  return `${menuItemId}::${groupsKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addLine: (input) => {
        const quantity = input.quantity ?? 1;
        const key = lineConfigKey(input.menuItemId, input.optionGroups);
        const existing = get().lines.find(
          (line) => lineConfigKey(line.menuItemId, line.optionGroups) === key,
        );

        if (existing) {
          set({
            lines: get().lines.map((line) =>
              line.lineId === existing.lineId
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
              lineId: crypto.randomUUID(),
              menuItemId: input.menuItemId,
              name: input.name,
              unitPrice: input.unitPrice,
              imageUrl: input.imageUrl,
              quantity,
              optionGroups: input.optionGroups,
            },
          ],
        });
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          set({ lines: get().lines.filter((l) => l.lineId !== lineId) });
          return;
        }
        set({
          lines: get().lines.map((l) =>
            l.lineId === lineId ? { ...l, quantity } : l,
          ),
        });
      },

      removeLine: (lineId) =>
        set({ lines: get().lines.filter((l) => l.lineId !== lineId) }),

      clear: () => set({ lines: [] }),
    }),
    // skipHydration: the store starts empty on both server and first client
    // render (matching SSR output), then CartDrawer triggers rehydrate() from
    // localStorage in a useEffect, after mount — avoids a hydration mismatch.
    { name: "asian-le-cart", skipHydration: true },
  ),
);

export function lineTotal(line: CartLine): number {
  const optionsTotal = line.optionGroups.reduce(
    (sum, group) =>
      sum + group.selections.reduce((s, sel) => s + sel.price * sel.quantity, 0),
    0,
  );
  return (line.unitPrice + optionsTotal) * line.quantity;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
