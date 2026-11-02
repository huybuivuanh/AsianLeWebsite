import Link from "next/link";
import { STORE } from "@/lib/store";
import { resultButtonClass, resultCardClass } from "@/components/checkout/resultCard";

export default function StoreClosedView() {
  return (
    <div className={resultCardClass}>
      <p className="text-lg font-extrabold">Online ordering is paused right now</p>
      <p className="mt-2 text-body">
        Please check back later, or call us at{" "}
        <a href={`tel:${STORE.phone.replace(/\D/g, "")}`} className="font-bold text-brand hover:text-brand-dark">
          {STORE.phone}
        </a>
        .
      </p>
      <Link href="/menu" className={`mt-6 ${resultButtonClass}`}>
        Back to menu
      </Link>
    </div>
  );
}
