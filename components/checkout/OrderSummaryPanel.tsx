import { lineTotal, type CartLine } from "@/lib/cartStore";
import { formatPriceCAD } from "@/lib/utils";
import type { SubmitState } from "@/hooks/useCheckoutForm";

type OrderSummaryPanelProps = {
  lines: CartLine[];
  unavailableLineIds: Set<string>;
  priceUpdates: Map<string, number>;
  removeLine: (lineId: string) => void;
  taxBreakDown: OrderTaxBreakDown;
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
              {line.instructions ? (
                <p className="mt-0.5 text-xs italic text-stone-500">
                  &ldquo;{line.instructions}&rdquo;
                </p>
              ) : null}
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
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          No payment now — you&apos;ll pay in person when you pick up your
          order.
        </span>
      </div>
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
