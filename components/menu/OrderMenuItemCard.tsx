"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { selectionRuleLabel, type MenuItemViewModel } from "@/lib/menuOptions";
import { useCartStore, type CartOptionSelection } from "@/lib/cartStore";
import { useLiveMenuAvailability } from "@/components/menu/LiveMenuAvailabilityProvider";

type OrderMenuItemCardProps = MenuItemViewModel;

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

export default function OrderMenuItemCard({
  item,
  availability: initialAvailability,
  optionGroups: initialOptionGroups,
}: OrderMenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selections, setSelections] = useState<SelectionState>({});
  const addLine = useCartStore((s) => s.addLine);

  const { getItemAvailability, getOptionAvailability } = useLiveMenuAvailability();
  const availability = getItemAvailability(item.id, initialAvailability);
  const optionGroups = initialOptionGroups.map((og) => ({
    ...og,
    options: og.options.map((option) => ({
      ...option,
      availability: getOptionAvailability(option.id, option.availability),
    })),
  }));

  const open = useCallback(() => {
    setItemQuantity(1);
    setSelections(buildDefaultSelections(optionGroups));
    setIsOpen(true);
  }, [optionGroups]);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";

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

  function handleAddToCart() {
    if (!canAddToCart) return;

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
    close();
  }

  return (
    <li className="flex items-start gap-4">
      <button
        type="button"
        onClick={open}
        className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View details for ${item.name}`}
      >
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className={`object-cover ${availability.available ? "" : "grayscale"}`}
          sizes="100px"
          unoptimized={skipNextImageOptimization(imageSrc)}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} details`}
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label="Close details"
            >
              Close
            </button>
            <div className="relative aspect-[4/3] w-full bg-stone-800">
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                unoptimized={skipNextImageOptimization(imageSrc)}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-xl font-bold text-stone-900">{item.name}</h4>
                <p className="shrink-0 font-semibold tabular-nums text-amber-700">
                  {formatPriceCAD(item.price)}
                </p>
              </div>
              {item.description ? (
                <p className="mt-2 text-sm text-stone-600">{item.description}</p>
              ) : null}
              {!availability.available ? (
                <p className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {availability.label}
                </p>
              ) : null}

              {optionGroups.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {optionGroups.map(({ group, options }) => {
                    const selected = selections[group.id] ?? [];
                    const isSingle = group.maxSelection <= 1;
                    const atMax = selected.length >= group.maxSelection;
                    return (
                      <fieldset key={group.id}>
                        <div className="flex items-baseline justify-between gap-2">
                          <legend className="font-semibold text-stone-900">
                            {group.name}
                          </legend>
                          <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                            {selectionRuleLabel(group)}
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {options.map((option) => {
                            const isSelected = selected.some(
                              (s) => s.optionId === option.id,
                            );
                            const selectedQty =
                              selected.find((s) => s.optionId === option.id)
                                ?.quantity ?? 1;
                            const disabled =
                              !option.availability.available ||
                              (!isSingle && !isSelected && atMax);
                            return (
                              <li
                                key={option.id}
                                className={`flex items-center justify-between gap-3 text-sm ${
                                  option.availability.available
                                    ? "text-stone-700"
                                    : "text-stone-400"
                                }`}
                              >
                                <label className="flex flex-1 items-center gap-2">
                                  <input
                                    type={isSingle ? "radio" : "checkbox"}
                                    name={`group-${group.id}`}
                                    checked={isSelected}
                                    disabled={disabled}
                                    onChange={() =>
                                      isSingle
                                        ? selectSingle(
                                            group.id,
                                            option.id,
                                            group.minSelection === 0,
                                          )
                                        : toggleMulti(
                                            group.id,
                                            option.id,
                                            group.maxSelection,
                                          )
                                    }
                                    className="h-4 w-4 accent-amber-600"
                                  />
                                  <span className={option.availability.available ? "" : "line-through"}>
                                    {option.name}
                                    {!option.availability.available
                                      ? ` (${option.availability.label})`
                                      : ""}
                                  </span>
                                </label>
                                {isSelected && group.multipleOptionQuantity ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOptionQuantity(
                                          group.id,
                                          option.id,
                                          selectedQty - 1,
                                        )
                                      }
                                      className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                                      aria-label={`Decrease ${option.name} quantity`}
                                    >
                                      −
                                    </button>
                                    <span className="w-4 text-center tabular-nums">
                                      {selectedQty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOptionQuantity(
                                          group.id,
                                          option.id,
                                          selectedQty + 1,
                                        )
                                      }
                                      className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                                      aria-label={`Increase ${option.name} quantity`}
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <span className="tabular-nums">
                                    {option.price > 0
                                      ? `+${formatPriceCAD(option.price)}`
                                      : ""}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </fieldset>
                    );
                  })}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium tabular-nums">
                    {itemQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="flex-1 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
                >
                  {availability.available
                    ? `Add to cart — ${formatPriceCAD(total)}`
                    : availability.label}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <button
            type="button"
            onClick={open}
            className="text-left text-2xl font-semibold text-stone-900 hover:text-amber-700"
          >
            {item.name}
          </button>
          {!availability.available ? (
            <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {availability.label}
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">{item.description}</p>
        ) : null}
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-amber-700">
        {formatPriceCAD(item.price)}
      </p>
    </li>
  );
}
