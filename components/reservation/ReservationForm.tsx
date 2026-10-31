"use client";

import Link from "next/link";
import { useReservationForm } from "@/hooks/useReservationForm";
import CustomerInfoSection from "@/components/checkout/CustomerInfoSection";
import OrderConfirmingView from "@/components/checkout/OrderConfirmingView";
import { formatScheduledLabel } from "@/components/checkout/OrderSuccessView";
import {
  RESERVATION_LAST_SEATING_MINUTES,
  RESERVATION_LEAD_MINUTES,
  RESERVATION_MAX_GUESTS_INPUT,
  RESERVATION_MAX_REQUESTS_LENGTH,
} from "@/lib/reservation";
import { STORE } from "@/lib/store";

const cardClass =
  "mx-auto max-w-xl rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 p-8 text-center shadow-lg shadow-amber-900/5";
const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2";
const stepperButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-lg font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40";

function guestsLabel(guests: number) {
  return `${guests} ${guests === 1 ? "guest" : "guests"}`;
}

export default function ReservationForm({
  initialStoreSettings,
}: {
  initialStoreSettings: StoreSettings;
}) {
  const form = useReservationForm(initialStoreSettings);
  const { submitState } = form;
  const callHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

  if (submitState.status === "confirming") {
    return (
      <OrderConfirmingView
        noun="reservation"
        onCancel={form.handleCancel}
        cancelling={form.cancelling}
        cancelError={form.cancelError}
      />
    );
  }

  if (submitState.status === "success") {
    const { details, orderNumber } = submitState;
    return (
      <div className={cardClass}>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Reservation confirmed
        </p>
        <p className="mt-2 text-4xl font-bold text-stone-900">#{orderNumber}</p>
        <p className="mt-4 text-stone-700">
          Table for {guestsLabel(details.guests)}
        </p>
        <p className="mt-1 font-semibold text-stone-900">
          {formatScheduledLabel(details.date, details.time)}
        </p>
        <p className="mt-4 text-sm text-stone-600">
          Need to change something? Call us at{" "}
          <a href={callHref} className="font-semibold text-amber-700 hover:underline">
            {STORE.phone}
          </a>
          .
        </p>
        <Link href="/menu" className={`mt-6 ${primaryButtonClass}`}>
          See our menu
        </Link>
      </div>
    );
  }

  if (submitState.status === "cancelled") {
    return (
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="text-lg font-semibold text-stone-900">Your reservation was cancelled.</p>
        <p className="mt-2 text-stone-600">
          Questions? Call us at{" "}
          <a href={callHref} className="font-semibold text-amber-700 hover:underline">
            {STORE.phone}
          </a>
          .
        </p>
        <button type="button" onClick={form.reset} className={`mt-6 ${primaryButtonClass}`}>
          Make another reservation
        </button>
      </div>
    );
  }

  if (!form.canReserve) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="text-lg text-stone-600">
          We&apos;re not taking reservations online right now. Please call us at{" "}
          <a href={callHref} className="font-semibold text-amber-700 hover:underline">
            {STORE.phone}
          </a>{" "}
          to book a table.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <fieldset className="rounded-xl border border-stone-200 p-5">
        <legend className="px-1 font-semibold text-stone-900">Your table</legend>

        <label className="mt-2 block text-sm text-stone-700">
          Date &amp; time
          <input
            type="datetime-local"
            value={form.scheduledLocal}
            onChange={(e) => form.setScheduledLocal(e.target.value)}
            min={form.minLocal}
            max={form.maxLocal}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900"
          />
        </label>
        <p className="mt-1 text-xs text-stone-500">
          Current store time: {form.currentStoreTime} · Book at least {RESERVATION_LEAD_MINUTES}{" "}
          minutes ahead · Last seating {RESERVATION_LAST_SEATING_MINUTES} minutes before closing
        </p>

        <div className="mt-5">
          <span className="block text-sm text-stone-700">Number of guests</span>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => form.setGuests(Math.max(1, form.guests - 1))}
              disabled={form.guests <= 1}
              className={stepperButtonClass}
              aria-label="Fewer guests"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={RESERVATION_MAX_GUESTS_INPUT}
              value={Number.isNaN(form.guests) ? "" : form.guests}
              onChange={(e) => form.setGuests(e.target.valueAsNumber)}
              required
              aria-label="Number of guests"
              className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-center text-base text-stone-900"
            />
            <button
              type="button"
              onClick={() =>
                form.setGuests(Math.min(RESERVATION_MAX_GUESTS_INPUT, (form.guests || 0) + 1))
              }
              className={stepperButtonClass}
              aria-label="More guests"
            >
              +
            </button>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            For larger groups, we&apos;ll call you to confirm.
          </p>
        </div>

        <label className="mt-5 block text-sm text-stone-700">
          Special requests <span className="text-stone-400">(optional)</span>
          <textarea
            value={form.specialRequests}
            onChange={(e) => form.setSpecialRequests(e.target.value)}
            maxLength={RESERVATION_MAX_REQUESTS_LENGTH}
            rows={3}
            placeholder="High chair, birthday, seating preference…"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900"
          />
        </label>
      </fieldset>

      <CustomerInfoSection
        name={form.name}
        setName={form.setName}
        phone={form.phone}
        setPhone={form.setPhone}
        email={form.email}
        setEmail={form.setEmail}
      />

      {submitState.status === "error" ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {submitState.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState.status === "submitting"}
        className="w-full rounded-full bg-amber-500 px-6 py-3.5 text-base font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitState.status === "submitting" ? "Sending…" : "Request reservation"}
      </button>
    </form>
  );
}
