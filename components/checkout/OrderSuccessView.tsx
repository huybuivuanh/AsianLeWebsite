import Link from "next/link";
import { formatPriceCAD } from "@/lib/utils";
import { TakeOutFulfillmentKind } from "@/types/enum";
import type { FulfillmentWire } from "@/hooks/useCheckoutForm";

type OrderSuccessViewProps = {
  orderNumber: string;
  total: number;
  fulfillment: FulfillmentWire;
};

/** Formats a "YYYY-MM-DD" + "HH:mm" pair for display — treats the numbers as-is (no
 * timezone conversion), since we're just re-presenting what the customer picked. */
function formatScheduledLabel(dateStr: string, timeStr: string): string {
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
}: OrderSuccessViewProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 p-8 text-center shadow-lg shadow-amber-900/5">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
        Order placed
      </p>
      <p className="mt-2 text-4xl font-bold text-stone-900">
        #{orderNumber}
      </p>
      <p className="mt-4 text-stone-700">
        {fulfillment.kind === TakeOutFulfillmentKind.Scheduled
          ? `Pickup ${formatScheduledLabel(fulfillment.date, fulfillment.time)}`
          : "Ready for pickup as soon as possible"}
      </p>
      <p className="mt-1 font-semibold text-stone-900">
        Total: {formatPriceCAD(total)} — pay at pickup.
      </p>
      <Link
        href="/order"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
      >
        Order again
      </Link>
    </div>
  );
}
