"use client";

import { useEffect, useState } from "react";
import { STORE } from "@/lib/store";
import OrderPickupCta from "@/components/menu/OrderPickupCta";

/** Both order choices, side by side in the bottom corner, once you scroll past the menu
 * hero: order here (pay when you pick up) or Skip the Dishes. */
export default function FloatingOrderButtons({ storeSettings }: { storeSettings: StoreSettings }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-3 bottom-4 z-40 flex justify-end gap-2 transition duration-200 sm:inset-x-auto sm:right-6 sm:bottom-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <OrderPickupCta
        storeSettings={storeSettings}
        className="inline-flex min-h-13 flex-1 flex-col items-center justify-center rounded-full bg-ink px-5 leading-tight text-on-ink shadow-[0_10px_30px_rgba(20,18,16,0.35)] transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:flex-none"
      >
        <span className="text-sm font-bold">Order online</span>
        <span className="text-[11px] font-semibold text-on-ink-muted">Pay when you pick up</span>
      </OrderPickupCta>
      <a
        href={STORE.socialLinks.skipthedishes}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-13 flex-1 items-center justify-center gap-1.5 rounded-full bg-skip px-5 text-sm font-bold text-ink shadow-[0_10px_30px_rgba(20,18,16,0.35)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 sm:flex-none"
      >
        Skip the Dishes
        <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      </a>
    </div>
  );
}
