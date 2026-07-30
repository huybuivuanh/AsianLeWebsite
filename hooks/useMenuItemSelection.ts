import { useCallback, useState } from "react";
import { useCartStore, type CartOptionSelection } from "@/lib/cartStore";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import type { AvailabilityStatus } from "@/lib/availability";

/** groupId -> selected {optionId, quantity}[] */
type SelectionState = Record<string, { optionId: string; quantity: number }[]>;

function buildDefaultSelections(
  optionGroups: MenuItemViewModel["optionGroups"],
): SelectionState {
  const state: SelectionState = {};
  for (const { group, options } of optionGroups) {
    const defaultOption = options.find(
      (o) => o.id === group.defaultOptionId && o.availability.available,
    );
    state[group.id] = defaultOption
      ? [{ optionId: defaultOption.id, quantity: 1 }]
      : [];
  }
  return state;
}

/**
 * Option-selection state, pricing, and add-to-cart logic for a single menu item's
 * detail modal — kept separate from OrderMenuItemCard/ItemDetailModal so those stay
 * presentational.
 */
export function useMenuItemSelection(
  item: MenuItemViewModel["item"],
  optionGroups: MenuItemViewModel["optionGroups"],
  availability: AvailabilityStatus,
) {
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selections, setSelections] = useState<SelectionState>({});
  const addLine = useCartStore((s) => s.addLine);

  const reset = useCallback(() => {
    setItemQuantity(1);
    setSelections(buildDefaultSelections(optionGroups));
  }, [optionGroups]);

  function selectSingle(groupId: string, optionId: string, optional: boolean) {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      const alreadySelected = current[0]?.optionId === optionId;
      if (alreadySelected && optional) {
        return { ...prev, [groupId]: [] };
      }
      return { ...prev, [groupId]: [{ optionId, quantity: 1 }] };
    });
  }

  function toggleMulti(groupId: string, optionId: string, maxSelection: number) {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      const isSelected = current.some((s) => s.optionId === optionId);
      if (isSelected) {
        return { ...prev, [groupId]: current.filter((s) => s.optionId !== optionId) };
      }
      if (current.length >= maxSelection) return prev;
      return { ...prev, [groupId]: [...current, { optionId, quantity: 1 }] };
    });
  }

  function setOptionQuantity(groupId: string, optionId: string, quantity: number) {
    setSelections((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] ?? []).map((s) =>
        s.optionId === optionId ? { ...s, quantity: Math.max(1, quantity) } : s,
      ),
    }));
  }

  const allGroupsValid = optionGroups.every(({ group }) => {
    const count = (selections[group.id] ?? []).length;
    return count >= group.minSelection && count <= group.maxSelection;
  });

  const optionsTotal = optionGroups.reduce((sum, { group, options }) => {
    const selected = selections[group.id] ?? [];
    return (
      sum +
      selected.reduce((s, sel) => {
        const opt = options.find((o) => o.id === sel.optionId);
        return s + (opt ? opt.price * sel.quantity : 0);
      }, 0)
    );
  }, 0);

  const total = (item.price + optionsTotal) * itemQuantity;
  const canAddToCart = availability.available && allGroupsValid;

  /** Adds the current selection to the cart. Returns false (no-op) if not addable. */
  function addToCart(): boolean {
    if (!canAddToCart) return false;

    const cartOptions: CartOptionSelection[] = optionGroups.flatMap(({ group, options }) =>
      (selections[group.id] ?? []).map((sel) => {
        const opt = options.find((o) => o.id === sel.optionId)!;
        return {
          optionId: opt.id,
          name: opt.name,
          price: opt.price,
          quantity: sel.quantity,
        };
      }),
    );

    addLine({
      menuItemId: item.id,
      name: item.name,
      // Per-unit price INCLUDING selected options — matches POS's OrderItem.price convention.
      price: item.price + optionsTotal,
      imageUrl: item.image?.url,
      options: cartOptions,
      quantity: itemQuantity,
    });
    return true;
  }

  return {
    itemQuantity,
    setItemQuantity,
    selections,
    selectSingle,
    toggleMulti,
    setOptionQuantity,
    allGroupsValid,
    optionsTotal,
    total,
    canAddToCart,
    addToCart,
    reset,
  };
}

export type MenuItemSelection = ReturnType<typeof useMenuItemSelection>;
