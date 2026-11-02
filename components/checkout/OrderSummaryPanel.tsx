import { lineBasePrice, lineTotal, type CartLine } from "@/lib/cartStore";
import { formatPriceCAD } from "@/lib/utils";
import type { SubmitState } from "@/hooks/useCheckoutForm";
import PayAtPickupNote from "@/components/checkout/PayAtPickupNote";

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
  const submitting = submitState.status === "submitting";

  return (
    <aside className="h-fit rounded-3xl bg-ink p-6 text-on-ink sm:p-7 lg:sticky lg:top-24">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
        Your order
      </h2>
      <ul className="mt-3 divide-y divide-ink-line">
        {lines.map((line) => {
          const unavailable = unavailableLineIds.has(line.id);
          const updatedPrice = priceUpdates.get(line.id);
          const basePrice = lineBasePrice(line);
          return (
            <li key={line.id} className="py-3.5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={
                    unavailable ? "font-bold text-on-ink-muted line-through" : "font-bold text-on-ink"
                  }
                >
                  {line.quantity}× {line.name}
                </span>
                <span
                  className={
                    unavailable
                      ? "shrink-0 tabular-nums text-on-ink-muted line-through"
                      : "shrink-0 font-extrabold tabular-nums text-brand-bright"
                  }
                >
                  {formatPriceCAD(lineTotal(line))}
                </span>
              </div>
              {basePrice !== 0 && (line.options.length > 0 || line.quantity > 1) ? (
                <div className="mt-0.5 flex justify-between gap-2 text-xs text-on-ink-muted">
                  <span>Item price</span>
                  <span className="shrink-0 tabular-nums">{formatPriceCAD(basePrice)}</span>
                </div>
              ) : null}
              {line.options && line.options.length > 0 ? (
                <ul className="mt-0.5 space-y-0.5 text-xs text-on-ink-muted">
                  {line.options.map((o) => (
                    <li key={o.optionId} className="flex justify-between gap-2">
                      <span>
                        {o.name}
                        {o.quantity > 1 ? ` ×${o.quantity}` : ""}
                      </span>
                      {o.price > 0 ? (
                        <span className="shrink-0 tabular-nums">
                          {formatPriceCAD(o.price * o.quantity)}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {line.instructions ? (
                <p className="mt-1 text-xs italic text-on-ink-muted">&ldquo;{line.instructions}&rdquo;</p>
              ) : null}
              {unavailable ? (
                <div className="mt-1.5 flex items-center justify-between gap-3 text-xs font-bold text-brand-bright">
                  <span>No longer available</span>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="min-h-8 rounded-full border border-brand-bright px-3 transition hover:bg-brand-bright hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              ) : updatedPrice !== undefined ? (
                <p className="mt-1.5 text-xs text-gold">
                  Price updated to {formatPriceCAD(updatedPrice)} — you&apos;ll pay the current
                  price.
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <dl className="mt-2 space-y-1.5 border-t border-ink-line pt-4 text-sm text-on-ink-muted">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPriceCAD(taxBreakDown.subTotal)}</dd>
        </div>
        {taxBreakDown.discount ? (
          <>
            <div className="flex justify-between font-bold text-gold">
              <dt>Rewards points</dt>
              <dd className="tabular-nums">−{formatPriceCAD(taxBreakDown.discount.discountAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Subtotal after points</dt>
              <dd className="tabular-nums">{formatPriceCAD(taxBreakDown.discount.taxableSubtotal)}</dd>
            </div>
          </>
        ) : null}
        <div className="flex justify-between">
          <dt>GST (5%)</dt>
          <dd className="tabular-nums">{formatPriceCAD(taxBreakDown.gst)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>PST (6%)</dt>
          <dd className="tabular-nums">{formatPriceCAD(taxBreakDown.pst)}</dd>
        </div>
        <div className="flex items-baseline justify-between pt-2 text-on-ink">
          <dt className="text-lg font-extrabold">Total</dt>
          <dd className="text-2xl font-extrabold tabular-nums">{formatPriceCAD(taxBreakDown.total)}</dd>
        </div>
      </dl>

      <PayAtPickupNote tone="dark" className="mt-4" />

      <button
        type="submit"
        disabled={submitting || unavailableLineIds.size > 0}
        className="mt-4 flex min-h-14 w-full flex-col items-center justify-center rounded-full bg-gold px-5 leading-tight text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:bg-ink-line disabled:text-on-ink-muted"
      >
        <span className="font-extrabold">
          {submitting ? "Placing order…" : `Place order · ${formatPriceCAD(taxBreakDown.total)}`}
        </span>
        {!submitting ? (
          <span className="text-xs font-semibold opacity-75">Pay when you pick up</span>
        ) : null}
      </button>
    </aside>
  );
}
