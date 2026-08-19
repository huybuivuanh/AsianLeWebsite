type OrderConfirmingViewProps = {
  onCancel: () => void;
  cancelling: boolean;
  cancelError: string | null;
};

/** Shown after the order is placed (Firestore status "New") but before the restaurant
 * has acknowledged it — the order number is deliberately withheld until then, see
 * useCheckoutForm's "confirming" state. */
export default function OrderConfirmingView({
  onCancel,
  cancelling,
  cancelError,
}: OrderConfirmingViewProps) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 p-8 text-center shadow-lg shadow-amber-900/5">
      <svg
        className="mx-auto h-10 w-10 animate-spin text-amber-600"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="mt-4 text-lg font-semibold text-stone-900">
        Sending your order to the restaurant…
      </p>
      <p className="mt-2 text-sm text-stone-600">
        We&apos;re waiting for them to confirm it — this usually only takes a
        minute. Please don&apos;t close this page.
      </p>
      {cancelError ? (
        <p className="mt-3 text-sm font-medium text-red-600" role="alert">
          {cancelError}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onCancel}
        disabled={cancelling}
        className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelling ? "Cancelling…" : "Cancel order"}
      </button>
    </div>
  );
}
