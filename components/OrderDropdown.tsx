"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { STORE } from "@/lib/store";
import OrderPickupCta from "@/components/menu/OrderPickupCta";

type OrderDropdownProps = {
  /** Trigger button content and style. */
  children: ReactNode;
  className: string;
  /** Called when a choice is picked (e.g. close the mobile menu). */
  onChoose?: () => void;
};

/** "Order online" button that opens two choices: order here and pay at pickup (checks the
 * store is open, like every order button), or order on Skip the Dishes. */
export default function OrderDropdown({ children, className, onChoose }: OrderDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = () => {
    setOpen(false);
    onChoose?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {children}
        <svg className={`size-4 shrink-0 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Kept mounted while closed, so the "ordering unavailable" popup from the pickup
          button can still show after the dropdown closes. */}
      <div
        id={menuId}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-ink-line bg-ink-raised p-2 text-on-ink shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      >
        <OrderPickupCta
          onPress={choose}
          className="flex w-full flex-col items-start rounded-xl px-4 py-3 text-left transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="font-bold">Order online</span>
          <span className="text-sm text-on-ink-muted">Pickup · pay when you pick up</span>
        </OrderPickupCta>
        <a
          href={STORE.socialLinks.skipthedishes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={choose}
          className="mt-1 flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="flex flex-col">
            <span className="font-bold text-skip">Order on Skip the Dishes</span>
            <span className="text-sm text-on-ink-muted">Delivery · pay on Skip</span>
          </span>
          <svg className="size-4 shrink-0 text-skip" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
