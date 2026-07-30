import { lineTotal, type CartLine } from "@/lib/cartStore";
import { formatPriceCAD } from "@/lib/utils";
import type { SubmitState } from "@/hooks/useCheckoutForm";

type OrderSummaryPanelProps = {
  lines: CartLine[];
  unavailableLineIds: Set<string>;
  priceUpdates: Map<string, number>;
  removeLine: (lineId: string) => void;
  taxBreakDown: TaxBreakDown;
  submitState: SubmitState;
};

export default function OrderSummaryPanel({
  lines,
  unavailableLineIds,
  priceUpdates,
  removeLine,
  taxBreakDown,
  submitState,
}: OrderSummaryPanelProps) {
  return (
    <div className="h-fit rounded-xl border border-stone-200 p-5">
      <h2 className="font-semibold text-stone-900">Order summary</h2>
      <ul className="mt-3 space-y-3">
        {lines.map((line) => {
          const unavailable = unavailableLineIds.has(line.id);
          const updatedPrice = priceUpdates.get(line.id);
          return (
            <li key={line.id} className="text-sm text-stone-700">
              <div className="flex justify-between gap-3">
                <span
                  className={
                    unavailable ? "text-stone-400 line-through" : undefined
                  }
                >
                  {line.quantity}x {line.name}
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatPriceCAD(lineTotal(line))}
                </span>
              </div>
              {unavailable ? (
                <div className="mt-1 flex items-center justify-between gap-3 text-xs text-red-600">
                  <span>No longer available</span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : updatedPrice !== undefined ? (
                <p className="mt-1 text-xs text-amber-700">
                  Price updated to {formatPriceCAD(updatedPrice)} —
                  you&apos;ll be charged the current price.
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-sm text-stone-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">
            {formatPriceCAD(taxBreakDown.subTotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span className="tabular-nums">{formatPriceCAD(taxBreakDown.gst)}</span>
        </div>
        <div className="flex justify-between">
          <span>PST (6%)</span>
          <span className="tabular-nums">{formatPriceCAD(taxBreakDown.pst)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-stone-900">
          <span>Total</span>
          <span className="tabular-nums">
            {formatPriceCAD(taxBreakDown.total)}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-stone-500">Pay at pickup.</p>
      <button
        type="submit"
        disabled={
          submitState.status === "submitting" || unavailableLineIds.size > 0
        }
        className="mt-4 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
      >
        {submitState.status === "submitting"
          ? "Placing order…"
          : `Place order — ${formatPriceCAD(taxBreakDown.total)}`}
      </button>
    </div>
  );
}
