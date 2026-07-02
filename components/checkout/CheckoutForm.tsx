"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { cartSubtotal, lineTotal, useCartStore } from "@/lib/cartStore";
import { getPickupSlotsForToday, isStoreOpenNow } from "@/lib/availability";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import { formatPriceCAD, formatTimeHHmmTo12h } from "@/lib/utils";
import { TakeOutFulfillmentKind } from "@/types/enum";

type CheckoutFormProps = {
  initialStoreSettings: StoreSettings;
};

/** Wire shape for fulfillment — same-day "HH:mm" over the wire; the persisted Order
 * stores a real `scheduledAt` Date instead, computed server-side (see app/api/orders/route.ts). */
type FulfillmentWire =
  | { kind: TakeOutFulfillmentKind.Immediate }
  | { kind: TakeOutFulfillmentKind.Scheduled; pickupTime: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | {
      status: "success";
      orderNumber: string;
      total: number;
      fulfillment: FulfillmentWire;
    };

export default function CheckoutForm({ initialStoreSettings }: CheckoutFormProps) {
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const now = useMemo(() => new Date(), []);
  const storeOpenNow = isStoreOpenNow(initialStoreSettings, now);
  const slots = useMemo(
    () => getPickupSlotsForToday(initialStoreSettings, now),
    [initialStoreSettings, now],
  );
  const canOrderAtAll = storeOpenNow || slots.length > 0;

  const [fulfillmentKind, setFulfillmentKind] = useState<TakeOutFulfillmentKind>(
    storeOpenNow ? TakeOutFulfillmentKind.Immediate : TakeOutFulfillmentKind.Scheduled,
  );
  const [pickupTime, setPickupTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const subTotal = cartSubtotal(lines);
  const taxBreakDown = calculateTaxBreakdown(subTotal);

  if (submitState.status === "success") {
    const { fulfillment } = submitState;
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 p-8 text-center shadow-lg shadow-amber-900/5">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Order placed
        </p>
        <p className="mt-2 text-4xl font-bold text-stone-900">
          #{submitState.orderNumber}
        </p>
        <p className="mt-4 text-stone-700">
          {fulfillment.kind === TakeOutFulfillmentKind.Scheduled
            ? `Pickup around ${formatTimeHHmmTo12h(fulfillment.pickupTime)}`
            : "Ready for pickup as soon as possible"}
        </p>
        <p className="mt-1 font-semibold text-stone-900">
          Total: {formatPriceCAD(submitState.total)} — pay at pickup.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="text-lg text-stone-600">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  if (!canOrderAtAll) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="text-lg text-stone-600">
          We&apos;re currently closed for ordering. Please check back during store hours.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (fulfillmentKind === TakeOutFulfillmentKind.Scheduled && !pickupTime) {
      setSubmitState({ status: "error", message: "Please choose a pickup time" });
      return;
    }

    setSubmitState({ status: "submitting" });

    const payload = {
      lines: lines.map((line) => ({
        menuItemId: line.menuItemId,
        quantity: line.quantity,
        options: line.options.map((s) => ({
          optionId: s.optionId,
          quantity: s.quantity,
        })),
      })),
      fulfillment:
        fulfillmentKind === TakeOutFulfillmentKind.Scheduled
          ? { kind: TakeOutFulfillmentKind.Scheduled, pickupTime }
          : { kind: TakeOutFulfillmentKind.Immediate },
      customerName: name.trim(),
      phoneNumber: phone.trim(),
      customerEmail: email.trim() || undefined,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      clearCart();
      setSubmitState({
        status: "success",
        orderNumber: data.orderNumber,
        total: data.taxBreakDown.total,
        fulfillment: data.fulfillment,
      });
    } catch {
      setSubmitState({ status: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_22rem]"
    >
      <div className="space-y-6">
        <fieldset className="rounded-xl border border-stone-200 p-5">
          <legend className="px-1 font-semibold text-stone-900">Pickup</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentKind === TakeOutFulfillmentKind.Immediate}
                onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Immediate)}
                disabled={!storeOpenNow}
                className="accent-amber-600"
              />
              As soon as possible
              {!storeOpenNow ? " (store not open yet)" : ""}
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentKind === TakeOutFulfillmentKind.Scheduled}
                onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Scheduled)}
                disabled={slots.length === 0}
                className="accent-amber-600"
              />
              Choose a time
            </label>
          </div>
          {fulfillmentKind === TakeOutFulfillmentKind.Scheduled ? (
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
              className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">Select a time</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTimeHHmmTo12h(slot)}
                </option>
              ))}
            </select>
          ) : null}
        </fieldset>

        <fieldset className="rounded-xl border border-stone-200 p-5">
          <legend className="px-1 font-semibold text-stone-900">Your info</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-stone-700 sm:col-span-1">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
              />
            </label>
            <label className="block text-sm text-stone-700 sm:col-span-1">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
              />
            </label>
            <label className="block text-sm text-stone-700 sm:col-span-2">
              Email (optional)
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
              />
            </label>
          </div>
        </fieldset>

        {submitState.status === "error" ? (
          <p role="alert" className="text-sm font-medium text-red-600">
            {submitState.message}
          </p>
        ) : null}
      </div>

      <div className="h-fit rounded-xl border border-stone-200 p-5">
        <h2 className="font-semibold text-stone-900">Order summary</h2>
        <ul className="mt-3 space-y-3">
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 text-sm text-stone-700">
              <span>
                {line.quantity}x {line.name}
              </span>
              <span className="shrink-0 tabular-nums">{formatPriceCAD(lineTotal(line))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-sm text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPriceCAD(taxBreakDown.subTotal)}</span>
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
            <span className="tabular-nums">{formatPriceCAD(taxBreakDown.total)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-500">Pay at pickup.</p>
        <button
          type="submit"
          disabled={submitState.status === "submitting"}
          className="mt-4 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
        >
          {submitState.status === "submitting"
            ? "Placing order…"
            : `Place order — ${formatPriceCAD(taxBreakDown.total)}`}
        </button>
      </div>
    </form>
  );
}
