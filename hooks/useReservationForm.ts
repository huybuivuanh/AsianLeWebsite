import { useEffect, useMemo, useState, type FormEvent } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLiveStoreSettings } from "@/hooks/useLiveStoreSettings";
import {
  getMaxScheduleDateStr,
  getStoreLocalNow,
  isStorePaused,
} from "@/lib/availability";
import {
  getReservationInvalidReason,
  RESERVATION_INVALID_MESSAGES,
} from "@/lib/reservation";
import { formatTimeHHmmTo12h } from "@/lib/utils";
import { OrderStatus } from "@/types/enum";

export type ReservationDetails = { date: string; time: string; guests: number };

export type ReservationSubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  // Saved (status "New") but not yet accepted by the restaurant.
  | { status: "confirming"; orderId: string; orderNumber: string; details: ReservationDetails }
  | { status: "success"; orderNumber: string; details: ReservationDetails }
  | { status: "cancelled" };

/** State and submission for the /reservations form — mirrors useCheckoutForm's
 * place → wait for the restaurant to accept → success/cancelled flow. */
export function useReservationForm(initialStoreSettings: StoreSettings) {
  const storeSettings = useLiveStoreSettings(initialStoreSettings);

  const now = useMemo(() => new Date(), []);
  const canReserve = !isStorePaused(storeSettings.pausedUntil, new Date());

  const minLocal = useMemo(() => {
    const { dateStr, hhmm } = getStoreLocalNow(storeSettings, now);
    return `${dateStr}T${hhmm}`;
  }, [storeSettings, now]);
  const maxLocal = useMemo(
    () => `${getMaxScheduleDateStr(storeSettings, now)}T23:59`,
    [storeSettings, now],
  );
  const currentStoreTime = formatTimeHHmmTo12h(getStoreLocalNow(storeSettings, now).hhmm);

  const [scheduledLocal, setScheduledLocal] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<ReservationSubmitState>({ status: "idle" });
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Watch the saved order until the restaurant accepts or cancels it.
  const confirmingOrderId = submitState.status === "confirming" ? submitState.orderId : null;
  useEffect(() => {
    if (!confirmingOrderId) return;
    return onSnapshot(doc(db, "orders", confirmingOrderId), (snapshot) => {
      const status = snapshot.data()?.status as OrderStatus | undefined;
      setSubmitState((prev) => {
        if (prev.status !== "confirming") return prev;
        if (status === OrderStatus.Cancelled) return { status: "cancelled" };
        if (
          status === OrderStatus.InProgress ||
          status === OrderStatus.ReadyForPickup ||
          status === OrderStatus.Completed
        ) {
          return { status: "success", orderNumber: prev.orderNumber, details: prev.details };
        }
        return prev;
      });
    });
  }, [confirmingOrderId]);

  async function handleCancel() {
    if (submitState.status !== "confirming") return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/orders/${submitState.orderId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error ?? "Couldn't cancel your reservation. Please try again.");
        return;
      }
      setSubmitState({ status: "cancelled" });
    } catch {
      setCancelError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  /** Back to an empty form, keeping the customer's contact details. */
  function reset() {
    setScheduledLocal("");
    setGuests(2);
    setSpecialRequests("");
    setCancelError(null);
    setSubmitState({ status: "idle" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (phone.length !== 10) {
      setSubmitState({ status: "error", message: "Please enter a valid 10-digit phone number." });
      return;
    }
    if (!Number.isInteger(guests) || guests < 1) {
      setSubmitState({ status: "error", message: "Please enter the number of guests." });
      return;
    }

    const [date, rawTime] = scheduledLocal.split("T");
    const time = rawTime?.slice(0, 5);
    if (!date || !time) {
      setSubmitState({ status: "error", message: "Please choose a date and time." });
      return;
    }
    const invalidReason = getReservationInvalidReason(storeSettings, date, time);
    if (invalidReason) {
      setSubmitState({ status: "error", message: RESERVATION_INVALID_MESSAGES[invalidReason] });
      return;
    }

    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          guests,
          specialRequests,
          customerName: name.trim(),
          // 11 digits: leading "1" country code + the 10 entered digits.
          phoneNumber: `1${phone}`,
          customerEmail: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      setSubmitState({
        status: "confirming",
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        details: { date, time, guests },
      });
    } catch {
      setSubmitState({ status: "error", message: "Network error. Please try again." });
    }
  }

  return {
    canReserve,
    minLocal,
    maxLocal,
    currentStoreTime,
    scheduledLocal,
    setScheduledLocal,
    guests,
    setGuests,
    specialRequests,
    setSpecialRequests,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    submitState,
    handleSubmit,
    handleCancel,
    reset,
    cancelling,
    cancelError,
  };
}
