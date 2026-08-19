"use client";

import { useCallback, useState } from "react";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import { useMenuItemSelection } from "@/hooks/useMenuItemSelection";
import MenuItemCardFace from "@/components/menu/MenuItemCardFace";
import ItemDetailModal from "@/components/menu/ItemDetailModal";
import OrderingUnavailableModal from "@/components/menu/OrderingUnavailableModal";

type OrderMenuItemCardProps = MenuItemViewModel & {
  /** Whether the store is currently accepting orders at all (live, from the parent). */
  isOrderingAvailable: boolean;
  /** Auto-opens this item's modal on mount — used for deep links from /menu (?item=<id>). */
  autoOpen?: boolean;
};

export default function OrderMenuItemCard({
  item,
  availability,
  optionGroups,
  isOrderingAvailable,
  autoOpen = false,
}: OrderMenuItemCardProps) {
  // Mirrors the open() handler below (gate on isOrderingAvailable, else show the
  // unavailable modal) — evaluated once on mount instead of on click. Safe as a lazy
  // initializer since isOrderingAvailable is derived synchronously from the SSR-fetched
  // storeSettings on first render, no async wait involved.
  const [isOpen, setIsOpen] = useState(() => autoOpen && isOrderingAvailable);
  const [showOrderingUnavailable, setShowOrderingUnavailable] = useState(
    () => autoOpen && !isOrderingAvailable,
  );

  const selection = useMenuItemSelection(item, optionGroups, availability);

  const open = useCallback(() => {
    if (!isOrderingAvailable) {
      setShowOrderingUnavailable(true);
      return;
    }
    selection.reset();
    setIsOpen(true);
  }, [isOrderingAvailable, selection]);
  const close = useCallback(() => setIsOpen(false), []);
  const closeOrderingUnavailable = useCallback(() => setShowOrderingUnavailable(false), []);

  return (
    <li>
      <button
        type="button"
        onClick={open}
        className="group flex w-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View details for ${item.name}`}
      >
        <MenuItemCardFace item={item} availability={availability} />
      </button>

      <ItemDetailModal
        open={isOpen}
        onClose={close}
        item={item}
        availability={availability}
        optionGroups={optionGroups}
        selection={selection}
        onAddedToCart={close}
      />

      <OrderingUnavailableModal
        open={showOrderingUnavailable}
        onClose={closeOrderingUnavailable}
      />
    </li>
  );
}
