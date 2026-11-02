import Link from "next/link";
import { resultButtonClass, resultCardClass } from "@/components/checkout/resultCard";

export default function EmptyCartView() {
  return (
    <div className={resultCardClass}>
      <p className="text-lg font-extrabold">Your order is empty.</p>
      <p className="mt-2 text-body">Add a few dishes and come back here to place it.</p>
      <Link href="/order" className={`mt-6 ${resultButtonClass}`}>
        Start your order
      </Link>
    </div>
  );
}
