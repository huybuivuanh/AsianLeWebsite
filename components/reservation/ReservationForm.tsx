"use client";

import Link from "next/link";
import { useState } from "react";
import { useReservationForm } from "@/hooks/useReservationForm";
import CustomerInfoSection from "@/components/checkout/CustomerInfoSection";
import OrderConfirmingView from "@/components/checkout/OrderConfirmingView";
import { formatScheduledLabel } from "@/components/checkout/OrderSuccessView";
import {
  RESERVATION_LEAD_MINUTES,
  RESERVATION_MAX_GUESTS_INPUT,
  RESERVATION_MAX_REQUESTS_LENGTH,
  RESERVATION_TIME_STEP_MINUTES,
} from "@/lib/reservation";
import { STORE } from "@/lib/store";
import { formatTimeHHmmTo12h } from "@/lib/utils";

const cardClass = "rounded-3xl border border-sand-line bg-white p-6 sm:p-8";
const resultCardClass =
  "mx-auto max-w-xl rounded-3xl border border-sand-line bg-white p-8 text-center sm:p-10";
const primaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";
const chipBase =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed";
const chipOn = "bg-ink text-on-ink";
const chipOff = "border border-sand-line bg-white text-ink hover:border-ink";
const QUICK_GUESTS = [1, 2, 3, 4, 5, 6, 7, 8];

const callHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

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
  const [largeGroup, setLargeGroup] = useState(false);
  const showGuestInput = largeGroup || form.guests > QUICK_GUESTS.length;

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
      <div className={resultCardClass}>
        <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
          Reservation confirmed
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">#{orderNumber}</p>
        <p className="mt-4 text-body">Table for {guestsLabel(details.guests)}</p>
        <p className="mt-1 text-lg font-bold">{formatScheduledLabel(details.date, details.time)}</p>
        <div className="mt-6 rounded-2xl bg-ivory px-5 py-4 text-sm text-body">
          <p className="font-bold text-ink">{STORE.name}</p>
          <p>
            {STORE.address.line1}, {STORE.address.city}
          </p>
          <a
            href={STORE.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block font-bold text-brand hover:text-brand-dark"
          >
            Get directions →
          </a>
        </div>
        <p className="mt-5 text-sm text-muted">
          Need to change something? Call us at{" "}
          <a href={callHref} className="font-bold text-brand hover:text-brand-dark">
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
      <div className={resultCardClass}>
        <p className="text-lg font-extrabold">Your reservation was cancelled.</p>
        <p className="mt-2 text-body">
          Questions? Call us at{" "}
          <a href={callHref} className="font-bold text-brand hover:text-brand-dark">
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
      <div className={resultCardClass}>
        <p className="text-lg font-extrabold">Online reservations are paused right now</p>
        <p className="mt-2 text-body">
          Please call us at{" "}
          <a href={callHref} className="font-bold text-brand hover:text-brand-dark">
            {STORE.phone}
          </a>{" "}
          to book a table.
        </p>
      </div>
    );
  }

  const selectedDay = form.days.find((d) => d.dateStr === form.selectedDate);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-5">
      <section className={cardClass} aria-labelledby="res-when">
        <h2 id="res-when" className="text-xl font-extrabold">
          When
        </h2>
        <p className="mt-1 text-sm text-muted">
          Book at least {RESERVATION_LEAD_MINUTES} minutes ahead · store time{" "}
          {form.currentStoreTime}
        </p>

        <p id="res-date-label" className="mt-5 text-sm font-bold">
          Date
        </p>
        <div
          role="radiogroup"
          aria-labelledby="res-date-label"
          className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
        >
          {form.days.map((day) => {
            const selected = day.dateStr === form.selectedDate;
            const closed = !day.window;
            return (
              <button
                key={day.dateStr}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${day.label}, ${day.dateLabel}${closed ? ", no times available" : ""}`}
                disabled={closed}
                onClick={() => form.selectDate(day.dateStr)}
                className={`flex min-w-[4.75rem] shrink-0 flex-col items-center rounded-2xl px-3 py-2.5 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                  selected
                    ? "bg-ink text-on-ink"
                    : closed
                      ? "border border-dashed border-sand-line bg-ivory/50 text-muted/70"
                      : "border border-sand-line bg-white text-ink hover:border-ink"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wide">{day.label}</span>
                <span className="text-[15px] font-extrabold">{day.dateLabel}</span>
                <span className={`text-[11px] font-semibold ${selected ? "text-gold" : "text-muted"}`}>
                  {closed ? "Closed" : "Open"}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-5 block max-w-xs text-sm font-bold">
          Time{selectedDay ? ` · ${selectedDay.label}, ${selectedDay.dateLabel}` : ""}
          <input
            type="time"
            value={form.time}
            onChange={(e) => form.setTime(e.target.value)}
            min={form.bookable?.earliest}
            max={form.bookable?.latest}
            step={RESERVATION_TIME_STEP_MINUTES * 60}
            required
            disabled={!form.bookable}
            aria-invalid={form.timeProblem ? true : undefined}
            aria-describedby="res-time-help"
            className={`${inputClass} font-normal`}
          />
        </label>
        <p id="res-time-help" className="mt-2 text-sm" aria-live="polite">
          {!form.bookable ? (
            <span className="text-body">No times left on this day — please pick another date.</span>
          ) : form.timeProblem ? (
            <span className="font-semibold text-brand">{form.timeProblem}</span>
          ) : (
            <span className="text-muted">
              Available {formatTimeHHmmTo12h(form.bookable.earliest)} –{" "}
              {formatTimeHHmmTo12h(form.bookable.latest)}
            </span>
          )}
        </p>

        {form.noBookingStretch ? (
          <div className="mt-5 flex gap-3 rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3.5 text-sm text-body">
            <svg className="mt-0.5 size-5 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              <span className="font-bold text-ink">
                No reservations {formatTimeHHmmTo12h(form.noBookingStretch.from)} –{" "}
                {formatTimeHHmmTo12h(form.noBookingStretch.until)}.
              </span>{" "}
              Lunch
              is our busiest time, so tables can&apos;t be reserved then. Please{" "}
              <a href={callHref} className="font-bold text-brand hover:text-brand-dark">
                call us
              </a>{" "}
              to check with the restaurant.
            </p>
          </div>
        ) : null}
      </section>

      <section className={cardClass} aria-labelledby="res-party">
        <h2 id="res-party" className="text-xl font-extrabold">
          Party
        </h2>
        <p id="res-guests-label" className="mt-4 text-sm font-bold">
          Number of guests
        </p>
        <div role="radiogroup" aria-labelledby="res-guests-label" className="mt-2 flex flex-wrap gap-2">
          {QUICK_GUESTS.map((n) => {
            const selected = !showGuestInput && form.guests === n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setLargeGroup(false);
                  form.setGuests(n);
                }}
                className={`${chipBase} w-12 px-0 ${selected ? chipOn : chipOff}`}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            role="radio"
            aria-checked={showGuestInput}
            onClick={() => {
              setLargeGroup(true);
              if (form.guests <= QUICK_GUESTS.length) form.setGuests(QUICK_GUESTS.length + 1);
            }}
            className={`${chipBase} ${showGuestInput ? chipOn : chipOff}`}
          >
            9+
          </button>
        </div>
        {showGuestInput ? (
          <label className="mt-3 block max-w-48 text-sm font-bold">
            How many guests?
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={RESERVATION_MAX_GUESTS_INPUT}
              value={Number.isNaN(form.guests) ? "" : form.guests}
              onChange={(e) => form.setGuests(e.target.valueAsNumber)}
              required
              className={inputClass}
            />
          </label>
        ) : null}
        <p className="mt-2 text-xs text-muted">
          For larger groups, we&apos;ll call you to confirm.
        </p>

        <label className="mt-5 block text-sm font-bold">
          Special requests <span className="font-normal text-muted">(optional)</span>
          <textarea
            value={form.specialRequests}
            onChange={(e) => form.setSpecialRequests(e.target.value)}
            maxLength={RESERVATION_MAX_REQUESTS_LENGTH}
            rows={3}
            placeholder="High chair, birthday, seating preference…"
            className={`${inputClass} font-normal`}
          />
        </label>
      </section>

      <CustomerInfoSection
        name={form.name}
        setName={form.setName}
        phone={form.phone}
        setPhone={form.setPhone}
        email={form.email}
        setEmail={form.setEmail}
      />

      {submitState.status === "error" ? (
        <p role="alert" className="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
          {submitState.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState.status === "submitting" || !form.time || Boolean(form.timeProblem)}
        className="flex min-h-14 w-full flex-col items-center justify-center rounded-full bg-ink px-6 text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-base font-bold">
          {submitState.status === "submitting" ? "Sending…" : "Request reservation"}
        </span>
        {form.time && !form.timeProblem && selectedDay && submitState.status !== "submitting" ? (
          <span className="text-xs font-semibold text-on-ink-muted">
            {selectedDay.label}, {selectedDay.dateLabel} · {formatTimeHHmmTo12h(form.time)} ·{" "}
            {Number.isNaN(form.guests) ? "?" : guestsLabel(form.guests)}
          </span>
        ) : null}
      </button>
    </form>
  );
}
