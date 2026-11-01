type OrderConfirmingViewProps = {
  onCancel: () => void;
  cancelling: boolean;
  cancelError: string | null;
  /** "order" (default) or "reservation" — only changes the wording. */
  noun?: string;
};

/** Shown after the order is placed (Firestore status "New") but before the restaurant
 * has acknowledged it — the order number is deliberately withheld until then, see
 * useCheckoutForm's "confirming" state. */
export default function OrderConfirmingView({
  onCancel,
  cancelling,
  cancelError,
  noun = "order",
}: OrderConfirmingViewProps) {
  return (
    <div
      className="mx-auto max-w-xl rounded-3xl border border-sand-line bg-white p-8 text-center sm:p-10"
      role="status"
      aria-live="polite"
    >
      <svg className="mx-auto h-10 w-10 animate-spin text-brand" fill="none" viewBox="0 0 24 24" aria-hidden>
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="mt-5 text-lg font-extrabold">Sending your {noun} to the restaurant…</p>
      <p className="mt-2 text-sm text-body">
        We&apos;re waiting for them to confirm it — this usually only takes a minute. Please
        don&apos;t close this page.
      </p>
      {cancelError ? (
        <p className="mt-3 text-sm font-semibold text-brand" role="alert">
          {cancelError}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onCancel}
        disabled={cancelling}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-sand-line px-6 text-sm font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelling ? "Cancelling…" : `Cancel ${noun}`}
      </button>
    </div>
  );
}
