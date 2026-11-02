/** "No payment now — pay at pickup" reminder, shown in the cart and at checkout. */
export default function PayAtPickupNote({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "dark" for use on an ink card. */
  tone?: "light" | "dark";
}) {
  const colors =
    tone === "dark" ? "bg-ink-raised text-on-ink border-ink-line" : "bg-ivory text-ink border-sand-line";
  return (
    <div className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm ${colors} ${className}`}>
      <svg
        className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "dark" ? "text-gold" : "text-brand"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 0 0-10 0v2M5 9h14l-1 11H6L5 9z" />
      </svg>
      <span>
        <strong className="font-bold">No payment now.</strong> You&apos;ll pay in person when you
        pick up your order.
      </span>
    </div>
  );
}
