import { useEffect, useMemo, useState, type FormEvent } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cartSubtotal, useCartStore } from "@/lib/cartStore";
import {
  getStoreLocalNow,
  getMaxScheduleDateStr,
  isStoreOpenNow,
  isStorePaused,
  getScheduledPickupInvalidReason,
  MAX_SCHEDULE_DAYS_AHEAD,
  SCHEDULE_LEAD_MINUTES,
  type ScheduledPickupInvalidReason,
} from "@/lib/availability";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import { formatTimeHHmmTo12h } from "@/lib/utils";
import { OrderStatus, TakeOutFulfillmentKind } from "@/types/enum";

/** Wire shape for fulfillment — "YYYY-MM-DD" + "HH:mm" over the wire; the persisted Order
 * stores a real `scheduledAt` Date instead, computed server-side (see app/api/orders/route.ts). */
export type FulfillmentWire =
  | { kind: TakeOutFulfillmentKind.Immediate }
  | { kind: TakeOutFulfillmentKind.Scheduled; date: string; time: string };

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | {
      // Order is placed (status "New" in Firestore) but not yet acknowledged by
      // the restaurant — waiting on a live status change before revealing the
      // order number.
      status: "confirming";
      orderId: string;
      orderNumber: string;
      total: number;
      fulfillment: FulfillmentWire;
    }
  | {
      status: "success";
      orderNumber: string;
      total: number;
      fulfillment: FulfillmentWire;
    }
  | { status: "cancelled" };

const SCHEDULED_PICKUP_INVALID_MESSAGES: Record<
  ScheduledPickupInvalidReason,
  string
> = {
  paused: "We're not taking online orders right now.",
  "invalid-format": "Please choose a valid pickup date and time.",
  past: "That time has already passed — please choose another.",
  "too-far-ahead": `Please choose a date within the next ${MAX_SCHEDULE_DAYS_AHEAD} days.`,
  holiday: "We're closed that day — please choose another date.",
  closed: "We're closed that day — please choose another date.",
  "outside-hours": "That time is outside store hours — please choose another.",
  "lead-time": `Please choose a time at least ${SCHEDULE_LEAD_MINUTES} minutes from now.`,
};

type LineAvailabilityResult = {
  itemAvailable: boolean;
  unavailableOptionIds: string[];
  currentPrice: number | null;
};

/**
 * All checkout state/business logic: live availability re-check against
 * /api/cart/availability, live wait-time subscription, pickup scheduling validity, form
 * fields, and order submission to /api/orders. Kept separate from CheckoutForm/its
 * subcomponents so those stay presentational.
 */
export function useCheckoutForm(initialStoreSettings: StoreSettings) {
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const removeLine = useCartStore((s) => s.removeLine);

  const [unavailableLineIds, setUnavailableLineIds] = useState<Set<string>>(
    new Set(),
  );
  const [priceUpdates, setPriceUpdates] = useState<Map<string, number>>(
    new Map(),
  );

  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    fetch("/api/cart/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: lines.map((line) => ({
          menuItemId: line.menuItemId,
          options: line.options.map((s) => ({
            optionId: s.optionId,
            quantity: s.quantity,
          })),
        })),
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { results: LineAvailabilityResult[] } | null) => {
        if (cancelled || !data) return;
        const unavailable = new Set<string>();
        const priceChanges = new Map<string, number>();
        lines.forEach((line, i) => {
          const result = data.results[i];
          if (!result) return;
          if (!result.itemAvailable || result.unavailableOptionIds.length > 0) {
            unavailable.add(line.id);
          } else if (
            result.currentPrice !== null &&
            result.currentPrice !== line.price
          ) {
            priceChanges.set(line.id, result.currentPrice);
          }
        });
        setUnavailableLineIds(unavailable);
        setPriceUpdates(priceChanges);
      })
      .catch(() => {
        // Best-effort UX nudge only — /api/orders re-validates authoritatively at submit time.
      });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  // Live estimated wait time — staff can update this often while the store is busy, so
  // patch it on top of the SSR-fetched value instead of waiting for a page reload.
  const [waitTime, setWaitTime] = useState(initialStoreSettings.waitTime);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "store"), (snapshot) => {
      const data = snapshot.data();
      if (typeof data?.waitTime === "number") setWaitTime(data.waitTime);
    });
    return unsubscribe;
  }, []);

  const now = useMemo(() => new Date(), []);
  const storeOpenNow = isStoreOpenNow(initialStoreSettings, now);
  const canOrderAtAll = !isStorePaused(initialStoreSettings.pausedUntil, now);

  const minLocal = useMemo(() => {
    const { dateStr, hhmm } = getStoreLocalNow(initialStoreSettings, now);
    return `${dateStr}T${hhmm}`;
  }, [initialStoreSettings, now]);
  const currentStoreTime = useMemo(
    () => formatTimeHHmmTo12h(getStoreLocalNow(initialStoreSettings, now).hhmm),
    [initialStoreSettings, now],
  );
  const maxLocal = useMemo(
    () => `${getMaxScheduleDateStr(initialStoreSettings, now)}T23:59`,
    [initialStoreSettings, now],
  );

  const [fulfillmentKind, setFulfillmentKind] =
    useState<TakeOutFulfillmentKind>(
      storeOpenNow
        ? TakeOutFulfillmentKind.Immediate
        : TakeOutFulfillmentKind.Scheduled,
    );
  const [scheduledLocal, setScheduledLocal] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // While "confirming", watch the order doc live for the restaurant's status change —
  // resolves to "success" once acknowledged (InProgress or beyond), or "cancelled" if
  // the restaurant (or our own handleCancelOrder below) cancels it first.
  const confirmingOrderId =
    submitState.status === "confirming" ? submitState.orderId : null;
  useEffect(() => {
    if (!confirmingOrderId) return;
    const unsubscribe = onSnapshot(doc(db, "orders", confirmingOrderId), (snapshot) => {
      const status = snapshot.data()?.status as OrderStatus | undefined;
      setSubmitState((prev) => {
        if (prev.status !== "confirming") return prev;
        if (status === OrderStatus.Cancelled) {
          return { status: "cancelled" };
        }
        if (status === OrderStatus.InProgress || status === OrderStatus.Completed) {
          return {
            status: "success",
            orderNumber: prev.orderNumber,
            total: prev.total,
            fulfillment: prev.fulfillment,
          };
        }
        return prev;
      });
    });
    return unsubscribe;
  }, [confirmingOrderId]);

  async function handleCancelOrder() {
    if (submitState.status !== "confirming") return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/orders/${submitState.orderId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        // If the restaurant just confirmed, the onSnapshot listener above will move
        // this to "success" on its own — surface the reason in the meantime.
        setCancelError(data.error ?? "Couldn't cancel your order. Please try again.");
        return;
      }
      setSubmitState({ status: "cancelled" });
    } catch {
      setCancelError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  const subTotal = cartSubtotal(lines);
  const taxBreakDown = calculateTaxBreakdown(subTotal);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (unavailableLineIds.size > 0) {
      setSubmitState({
        status: "error",
        message:
          "Some items in your cart are no longer available — remove them to continue.",
      });
      return;
    }

    if (phone.length !== 10) {
      setSubmitState({
        status: "error",
        message: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    let fulfillment: FulfillmentWire;
    if (fulfillmentKind === TakeOutFulfillmentKind.Scheduled) {
      const [date, time] = scheduledLocal.split("T");
      if (!date || !time) {
        setSubmitState({
          status: "error",
          message: "Please choose a pickup date and time",
        });
        return;
      }
      const invalidReason = getScheduledPickupInvalidReason(
        initialStoreSettings,
        date,
        time.slice(0, 5),
      );
      if (invalidReason) {
        setSubmitState({
          status: "error",
          message: SCHEDULED_PICKUP_INVALID_MESSAGES[invalidReason],
        });
        return;
      }
      fulfillment = {
        kind: TakeOutFulfillmentKind.Scheduled,
        date,
        time: time.slice(0, 5),
      };
    } else {
      fulfillment = { kind: TakeOutFulfillmentKind.Immediate };
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
        instructions: line.instructions,
      })),
      fulfillment,
      customerName: name.trim(),
      // 11 digits: leading "1" country code + the 10 entered digits.
      phoneNumber: `1${phone}`,
      customerEmail: email.trim(),
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
        status: "confirming",
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        total: data.taxBreakDown.total,
        fulfillment: data.fulfillment,
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return {
    lines,
    removeLine,
    unavailableLineIds,
    priceUpdates,
    waitTime,
    storeOpenNow,
    canOrderAtAll,
    minLocal,
    maxLocal,
    currentStoreTime,
    fulfillmentKind,
    setFulfillmentKind,
    scheduledLocal,
    setScheduledLocal,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    submitState,
    taxBreakDown,
    handleSubmit,
    handleCancelOrder,
    cancelling,
    cancelError,
  };
}

export type CheckoutFormState = ReturnType<typeof useCheckoutForm>;
