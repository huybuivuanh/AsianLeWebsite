"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { selectionRuleLabel, type MenuItemViewModel } from "@/lib/menuOptions";
import type { AvailabilityStatus } from "@/lib/availability";
import type { MenuItemSelection } from "@/hooks/useMenuItemSelection";

type ItemDetailModalProps = {
  open: boolean;
  onClose: () => void;
  item: MenuItemViewModel["item"];
  availability: AvailabilityStatus;
  optionGroups: MenuItemViewModel["optionGroups"];
  selection: MenuItemSelection;
  onAddedToCart: () => void;
};

const INSTRUCTIONS_MAX_LENGTH = 200;

const stepperClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-sand-line bg-white text-lg font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Full-screen "item detail page" (not a centered dialog) — covers the whole viewport with
 * its own back-button header, like a native app screen. Centered dialogs read as
 * cramped on small screens; this reads as a page you navigate into and back out of.
 */
export default function ItemDetailModal({
  open,
  onClose,
  item,
  availability,
  optionGroups,
  selection,
  onAddedToCart,
}: ItemDetailModalProps) {
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";
  const {
    itemQuantity,
    setItemQuantity,
    selections,
    selectSingle,
    toggleMulti,
    setOptionQuantity,
    instructions,
    setInstructions,
    total,
    canAddToCart,
    addToCart,
  } = selection;

  function handleAddToCart() {
    if (addToCart()) onAddedToCart();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={`${item.name} details`}
      overlayClassName="fixed inset-0 z-50 bg-ivory"
      panelClassName="flex h-full w-full flex-col text-ink"
    >
      <div className="flex shrink-0 items-center gap-3 bg-ink px-4 py-3 text-on-ink sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-10 w-10 shrink-0 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-on-ink transition hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-20"
          aria-label="Back to menu"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-on-ink-muted">
          Pay when you pick up · no online payment
        </p>
        <div className="w-10 shrink-0 sm:w-20" aria-hidden />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl pb-8">
          <div className="relative aspect-[4/3] w-full bg-ink-raised sm:mt-6 sm:aspect-[16/9] sm:overflow-hidden sm:rounded-[28px]">
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
          <div className="px-4 pt-6 sm:px-0">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold leading-tight tracking-[-0.02em]">
                {item.name}
              </h2>
              {item.price > 0 ? (
                <p className="shrink-0 text-xl font-extrabold tabular-nums text-brand">
                  {formatPriceCAD(item.price)}
                </p>
              ) : null}
            </div>
            {item.description ? (
              <p className="mt-2 text-base leading-relaxed text-body">{item.description}</p>
            ) : null}
            {!availability.available ? (
              <p className="mt-3 inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-ink">
                {availability.label}
              </p>
            ) : null}

            {optionGroups.length > 0 ? (
              <div className="mt-7 space-y-5">
                {optionGroups.map(({ group, options }) => {
                  const selected = selections[group.id] ?? [];
                  const isSingle = group.maxSelection <= 1;
                  const atMax = selected.length >= group.maxSelection;
                  const required = group.minSelection > 0;
                  return (
                    <fieldset key={group.id} className="rounded-3xl border border-sand-line bg-white p-5">
                      <legend className="sr-only">
                        {group.name} — {selectionRuleLabel(group)}
                      </legend>
                      <div aria-hidden className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-lg font-extrabold">{group.name}</p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${required ? "bg-brand text-white" : "bg-sand text-muted"}`}
                        >
                          {selectionRuleLabel(group)}
                        </span>
                      </div>
                      <ul className="mt-2 divide-y divide-sand-line">
                        {options.map((option) => {
                          const isSelected = selected.some((s) => s.optionId === option.id);
                          const selectedQty =
                            selected.find((s) => s.optionId === option.id)?.quantity ?? 1;
                          const disabled =
                            !option.availability.available || (!isSingle && !isSelected && atMax);
                          return (
                            <li
                              key={option.id}
                              className={`flex min-h-12 items-center justify-between gap-3 text-[15px] ${
                                option.availability.available ? "text-ink" : "text-muted/70"
                              }`}
                            >
                              <label
                                className={`flex flex-1 items-center gap-3 py-2.5 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <input
                                  type={isSingle ? "radio" : "checkbox"}
                                  name={`group-${group.id}`}
                                  checked={isSelected}
                                  disabled={disabled}
                                  onChange={() =>
                                    isSingle
                                      ? selectSingle(group.id, option.id, group.minSelection === 0)
                                      : toggleMulti(group.id, option.id, group.maxSelection)
                                  }
                                  className="h-5 w-5 shrink-0 accent-brand"
                                />
                                <span
                                  className={`${isSelected ? "font-bold" : "font-medium"} ${option.availability.available ? "" : "line-through"}`}
                                >
                                  {option.name}
                                  {!option.availability.available
                                    ? ` (${option.availability.label})`
                                    : ""}
                                </span>
                              </label>
                              {isSelected && group.multipleOptionQuantity ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setOptionQuantity(group.id, option.id, selectedQty - 1)}
                                    className={stepperClass}
                                    aria-label={`Decrease ${option.name} quantity`}
                                  >
                                    −
                                  </button>
                                  <span className="w-5 text-center font-bold tabular-nums">
                                    {selectedQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setOptionQuantity(group.id, option.id, selectedQty + 1)}
                                    className={stepperClass}
                                    aria-label={`Increase ${option.name} quantity`}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="font-bold tabular-nums text-brand">
                                  {option.price > 0 ? `+${formatPriceCAD(option.price)}` : ""}
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

            <div className="mt-5 rounded-3xl border border-sand-line bg-white p-5">
              <label htmlFor="item-instructions" className="text-lg font-extrabold">
                Special instructions{" "}
                <span className="text-sm font-semibold text-muted">(optional)</span>
              </label>
              <textarea
                id="item-instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value.slice(0, INSTRUCTIONS_MAX_LENGTH))}
                maxLength={INSTRUCTIONS_MAX_LENGTH}
                rows={2}
                placeholder="e.g. no cilantro, extra spicy, allergies"
                className="mt-3 w-full resize-none rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
              <div className="mt-1 flex justify-between gap-3 text-xs text-muted">
                <span>Extras or substitutions may be added to your total at pickup.</span>
                <span className="shrink-0 tabular-nums">
                  {instructions.length}/{INSTRUCTIONS_MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-sand-line bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
              disabled={itemQuantity <= 1}
              className={stepperClass}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-lg font-extrabold tabular-nums" aria-live="polite">
              {itemQuantity}
            </span>
            <button
              type="button"
              onClick={() => setItemQuantity((q) => q + 1)}
              className={stepperClass}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="group min-h-12 flex-1 rounded-full bg-ink px-5 text-[15px] font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-sand-deep disabled:text-muted"
          >
            {availability.available ? (
              <>
                Add to order ·{" "}
                <span className="tabular-nums group-enabled:text-gold">{formatPriceCAD(total)}</span>
              </>
            ) : (
              availability.label
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
