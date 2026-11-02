import Link from "next/link";
import { resultButtonClass, resultCardClass } from "@/components/checkout/resultCard";

export default function OrderCancelledView() {
  return (
    <div className={resultCardClass}>
      <p className="text-lg font-extrabold">Your order was cancelled.</p>
      <p className="mt-2 text-body">No payment was taken — nothing to worry about there.</p>
      <Link href="/order" className={`mt-6 ${resultButtonClass}`}>
        Order again
      </Link>
    </div>
  );
}
