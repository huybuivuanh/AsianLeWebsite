import type { ReactNode } from "react";
import type { RedeemState } from "@/hooks/checkout/useRedeemPoints";
import {
  DOLLARS_PER_REDEEM_STEP,
  POINTS_PER_REDEEM_STEP,
  redeemStepsToDollars,
  redeemStepsToPoints,
} from "@/lib/rewardsRules";

const stepButtonClass =
  "h-9 w-9 rounded-full border border-sand-line bg-white text-lg font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40";

/** "Use points" picker: $5 off per 100 points, taken when the order is picked up. */
export default function RedeemPicker({ redeem }: { redeem: RedeemState }) {
  const { availability, steps, maxSteps, setSteps } = redeem;
  if (availability.status === "off") return null;

  let content: ReactNode;
  if (availability.status === "loading") {
    content = <p className="text-muted">Checking points you can use…</p>;
  } else if (availability.status === "error") {
    content = (
      <p className="text-muted">
        Couldn&apos;t load your points right now — you&apos;ll still earn points on this order.
      </p>
    );
  } else if (maxSteps === 0) {
    content = (
      <p className="text-muted">
        {availability.available < POINTS_PER_REDEEM_STEP
          ? `Collect ${POINTS_PER_REDEEM_STEP} points to get $${DOLLARS_PER_REDEEM_STEP} off.`
          : `Your order needs to be at least $${DOLLARS_PER_REDEEM_STEP} to use points.`}
      </p>
    );
  } else {
    content = (
      <>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-extrabold">Use points</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Use fewer points"
              className={stepButtonClass}
              disabled={steps <= 0}
              onClick={() => setSteps(Math.max(0, steps - 1))}
            >
              −
            </button>
            <span className="min-w-[9.5rem] text-center font-bold tabular-nums" aria-live="polite">
              {steps === 0
                ? "None"
                : `$${redeemStepsToDollars(steps)} off · ${redeemStepsToPoints(steps)} pts`}
            </span>
            <button
              type="button"
              aria-label="Use more points"
              className={stepButtonClass}
              disabled={steps >= maxSteps}
              onClick={() => setSteps(Math.min(maxSteps, steps + 1))}
            >
              +
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">
          {POINTS_PER_REDEEM_STEP} points = ${DOLLARS_PER_REDEEM_STEP} off.
          {steps > 0 ? " Points are taken from your balance when you pick up your order." : ""}
        </p>
      </>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-sand-line bg-ivory/60 p-4 text-sm text-body">
      {content}
    </div>
  );
}
