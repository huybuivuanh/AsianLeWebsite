import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
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
import { calculateTaxBreakdown, taxableSubtotalOf } from "@/lib/orderPricing";
import {
  estimatePoints,
  estimateWelcomeBonus,
  maxRedeemSteps,
  redeemStepsToDollars,
  redeemStepsToPoints,
} from "@/lib/rewardsRules";
import { useRewardsMember } from "@/hooks/useRewardsMember";
import { extractTenDigitPhoneFromPaste, formatTimeHHmmTo12h } from "@/lib/utils";
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
      // Only meaningful for Immediate fulfillment — computed once from the order's own
      // readyTimeMinutes at the moment it was placed, so it doesn't drift later if the
      // restaurant takes a bit to confirm or updates the live wait time in the meantime.
      readyBy: Date | null;
      // Estimated rewards points, if a member was signed in (earned at pickup).
      rewardsPoints: number | null;
      // Points used for money off (taken at pickup), 0 if none.
      pointsUsed: number;
      discount: number;
    }
  | {
      status: "success";
      orderNumber: string;
      total: number;
      fulfillment: FulfillmentWire;
      readyBy: Date | null;
      rewardsPoints: number | null;
      pointsUsed: number;
      discount: number;
    }
  | { status: "cancelled" };

/** Points the signed-in member can use on this order (see /api/rewards/points). */
export type RedeemAvailability =
  | { status: "off" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; balance: number; pending: number; available: number };

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
  const [showInstructionsWarning, setShowInstructionsWarning] = useState(false);
  const [pendingFulfillment, setPendingFulfillment] =
    useState<FulfillmentWire | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const rewards = useRewardsMember();
  // On rewards sign-in, replace the contact details with the member's (blank profile
  // fields are skipped). Once per sign-in, so later edits — and live points updates to
  // the member doc — don't get overwritten.
  const rewardsMember = rewards.member;
  const filledForMemberId = useRef<string | null>(null);
  useEffect(() => {
    if (!rewardsMember) {
      filledForMemberId.current = null;
      return;
    }
    if (filledForMemberId.current === rewardsMember.id) return;
    filledForMemberId.current = rewardsMember.id;
    if (rewardsMember.name) setName(rewardsMember.name);
    const memberPhone = extractTenDigitPhoneFromPaste(rewardsMember.phone);
    if (memberPhone) setPhone(memberPhone);
    if (rewardsMember.email) setEmail(rewardsMember.email);
  }, [rewardsMember]);

  // While "confirming", watch the order doc live for the restaurant's status change —
  // resolves to "success" once acknowledged (InProgress or beyond), or "cancelled" if
  // the restaurant (or our own handleCancelOrder below) cancels it first.
  const confirmingOrderId =
    submitState.status === "confirming" ? submitState.orderId : null;
  useEffect(() => {
    if (!confirmingOrderId) return;
    const unsubscribe = onSnapshot(doc(db, "orders", confirmingOrderId), (snapshot) => {
      const orderData = snapshot.data();
      const status = orderData?.status as OrderStatus | undefined;
      setSubmitState((prev) => {
        if (prev.status !== "confirming") return prev;
        if (status === OrderStatus.Cancelled) {
          return { status: "cancelled" };
        }
        if (status === OrderStatus.InProgress || status === OrderStatus.Completed) {
          // readyTimeMinutes is written by the POS app right when staff confirm the
          // order — read it straight off the order doc rather than estimating it here.
          const orderFulfillment = orderData?.fulfillment as OrderFulfillment | undefined;
          const readyBy =
            orderFulfillment?.kind === TakeOutFulfillmentKind.Immediate &&
            typeof orderFulfillment.readyTimeMinutes === "number"
              ? new Date(Date.now() + orderFulfillment.readyTimeMinutes * 60_000)
              : null;
          return {
            status: "success",
            orderNumber: prev.orderNumber,
            total: prev.total,
            fulfillment: prev.fulfillment,
            readyBy,
            rewardsPoints: prev.rewardsPoints,
            pointsUsed: prev.pointsUsed,
            discount: prev.discount,
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

  // --- Using points for money off (members only; taken from the balance at pickup). ---
  const memberSignedIn = rewards.status === "member" && rewardsMember != null;
  const [redeemAvailability, setRedeemAvailability] = useState<RedeemAvailability>({
    status: "off",
  });
  const [redeemRefresh, setRedeemRefresh] = useState(0);
  const getOrderRewardsFields = rewards.getOrderRewardsFields;
  // Re-check when the member, their live balance, or a failed order changes it.
  const memberIdForRedeem = memberSignedIn ? rewardsMember.id : null;
  const memberPoints = rewardsMember?.points;
  useEffect(() => {
    if (!memberIdForRedeem) {
      setRedeemAvailability({ status: "off" });
      return;
    }
    let cancelled = false;
    setRedeemAvailability((prev) => (prev.status === "ready" ? prev : { status: "loading" }));
    (async () => {
      try {
        const fields = await getOrderRewardsFields();
        if (!fields) return;
        const res = await fetch("/api/rewards/points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rewardsIdToken: fields.rewardsIdToken }),
        });
        const data = await res.json();
        if (cancelled) return;
        setRedeemAvailability(
          res.ok
            ? { status: "ready", balance: data.balance, pending: data.pending, available: data.available }
            : { status: "error" },
        );
      } catch {
        if (!cancelled) setRedeemAvailability({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
    // getOrderRewardsFields changes every render; the member id/points are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberIdForRedeem, memberPoints, redeemRefresh]);

  const subTotal = cartSubtotal(lines);
  const [chosenRedeemSteps, setRedeemSteps] = useState(0);
  const redeemMaxSteps =
    redeemAvailability.status === "ready"
      ? maxRedeemSteps(redeemAvailability.available, subTotal)
      : 0;
  // Never more than allowed right now (cart or points may have changed since choosing).
  const redeemSteps = memberSignedIn ? Math.min(chosenRedeemSteps, redeemMaxSteps) : 0;
  const taxBreakDown = calculateTaxBreakdown(subTotal, redeemStepsToDollars(redeemSteps));
  const earnableSubtotal = taxableSubtotalOf(taxBreakDown);

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

    // One extra confirmation step before actually placing the order — e.g. free-text
    // special instructions (substitutions, extras) aren't priced anywhere in this flow, so
    // any extra charge they need gets added at pickup instead of showing in this total.
    setPendingFulfillment(fulfillment);
    setShowInstructionsWarning(true);
  }

  async function submitOrder(fulfillment: FulfillmentWire) {
    setSubmitState({ status: "submitting" });

    let rewardsFields: Awaited<ReturnType<typeof rewards.getOrderRewardsFields>> = null;
    try {
      rewardsFields = await rewards.getOrderRewardsFields();
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Couldn't confirm your rewards sign-in — check your connection, or sign out of rewards to order without points.",
      });
      return;
    }

    const payload = {
      ...(rewardsFields ?? {}),
      ...(rewardsFields && redeemSteps > 0 ? { redeemSteps } : {}),
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
        // Points may have changed (used elsewhere) — show the current amount.
        if (redeemSteps > 0) setRedeemRefresh((n) => n + 1);
        return;
      }
      clearCart();
      const savedTaxBreakDown = data.taxBreakDown as OrderTaxBreakDown;
      const savedEarnable = taxableSubtotalOf(savedTaxBreakDown);
      setSubmitState({
        status: "confirming",
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        total: data.taxBreakDown.total,
        fulfillment: data.fulfillment,
        // Not known yet — the POS app only writes readyTimeMinutes onto the order once
        // staff confirm it, which the onSnapshot listener below picks up.
        readyBy: null,
        rewardsPoints: rewardsFields
          ? estimatePoints(savedEarnable) +
            estimateWelcomeBonus(rewards.member?.hasFirstOrder ?? null, savedEarnable)
          : null,
        pointsUsed: rewardsFields ? redeemStepsToPoints(redeemSteps) : 0,
        discount: savedTaxBreakDown.discount?.discountAmount ?? 0,
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  function confirmInstructionsWarning() {
    setShowInstructionsWarning(false);
    if (!pendingFulfillment) return;
    const fulfillment = pendingFulfillment;
    setPendingFulfillment(null);
    void submitOrder(fulfillment);
  }

  function dismissInstructionsWarning() {
    setShowInstructionsWarning(false);
    setPendingFulfillment(null);
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
    earnableSubtotal,
    rewards,
    redeem: {
      availability: redeemAvailability,
      steps: redeemSteps,
      maxSteps: redeemMaxSteps,
      setSteps: setRedeemSteps,
    },
    handleSubmit,
    handleCancelOrder,
    cancelling,
    cancelError,
    showInstructionsWarning,
    confirmInstructionsWarning,
    dismissInstructionsWarning,
  };
}

export type CheckoutFormState = ReturnType<typeof useCheckoutForm>;
