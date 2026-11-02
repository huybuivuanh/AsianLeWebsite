import Link from "next/link";
import { formatPriceCAD } from "@/lib/utils";
import { STORE } from "@/lib/store";
import { resultButtonClass, resultCardClass } from "@/components/checkout/resultCard";
import { TakeOutFulfillmentKind } from "@/types/enum";
import type { FulfillmentWire } from "@/hooks/useCheckoutForm";

type OrderSuccessViewProps = {
  orderNumber: string;
  total: number;
  fulfillment: FulfillmentWire;
  readyBy: Date | null;
  rewardsPoints: number | null;
  pointsUsed: number;
  discount: number;
};

function formatReadyByLabel(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Formats a "YYYY-MM-DD" + "HH:mm" pair for display — treats the numbers as-is (no
 * timezone conversion), since we're just re-presenting what the customer picked. */
export function formatScheduledLabel(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const local = new Date(year, month - 1, day, hour, minute);
  const datePart = local.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timePart = local.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

export default function OrderSuccessView({
  orderNumber,
  total,
  fulfillment,
  readyBy,
  rewardsPoints,
  pointsUsed,
  discount,
}: OrderSuccessViewProps) {
  const when =
    fulfillment.kind === TakeOutFulfillmentKind.Scheduled
      ? `Pickup ${formatScheduledLabel(fulfillment.date, fulfillment.time)}`
      : readyBy
        ? `Ready by ${formatReadyByLabel(readyBy)}`
        : "Ready for pickup as soon as possible";

  return (
    <div className={resultCardClass}>
      <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
        Order confirmed
      </p>
      <p className="mt-2 text-4xl font-extrabold tracking-tight">#{orderNumber}</p>
      <p className="mt-4 text-lg font-bold">{when}</p>

      <div className="mt-6 rounded-2xl bg-ink px-5 py-4 text-on-ink">
        <p className="flex items-baseline justify-between gap-3">
          <span className="font-bold">Total to pay at pickup</span>
          <span className="text-2xl font-extrabold tabular-nums text-gold">
            {formatPriceCAD(total)}
          </span>
        </p>
        {pointsUsed > 0 ? (
          <p className="mt-2 text-left text-sm text-on-ink-muted">
            Includes {formatPriceCAD(discount)} off with {pointsUsed} rewards points — they&apos;re
            taken from your balance when you pick it up.
          </p>
        ) : null}
      </div>

      {rewardsPoints ? (
        <p className="mt-4 text-sm font-bold text-brand">
          You&apos;ll earn about {rewardsPoints} rewards points when you pick it up.
        </p>
      ) : null}

      <div className="mt-5 rounded-2xl bg-ivory px-5 py-4 text-sm text-body">
        <p className="font-bold text-ink">{STORE.name}</p>
        <p>
          {STORE.address.line1}, {STORE.address.city}
        </p>
        <a
          href={STORE.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-bold text-brand hover:text-brand-dark"
        >
          Get directions →
        </a>
      </div>

      <p className="mt-5 text-sm text-muted">
        Need to change something? Call us at{" "}
        <a
          href={`tel:${STORE.phone.replace(/\D/g, "")}`}
          className="font-bold text-brand hover:text-brand-dark"
        >
          {STORE.phone}
        </a>
        .
      </p>
      <Link href="/order" className={`mt-6 ${resultButtonClass}`}>
        Order again
      </Link>
    </div>
  );
}
