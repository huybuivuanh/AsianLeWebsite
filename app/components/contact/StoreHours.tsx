type StoreHoursProps = {
  hours: readonly { days: string; time: string }[];
  /** Optional: add border between rows (e.g. for Open Hours section card) */
  bordered?: boolean;
  className?: string;
};

export default function StoreHours({
  hours,
  bordered = false,
  className = "",
}: StoreHoursProps) {
  return (
    <dl className={`space-y-2 ${className}`}>
      {hours.map(({ days, time }) => (
        <div
          key={days}
          className={`flex justify-between gap-4 text-stone-700 ${bordered ? "border-b border-stone-100 pb-3 last:border-0 last:pb-0" : ""}`}
        >
          <dt>{days}</dt>
          <dd className="tabular-nums font-medium text-stone-900">{time}</dd>
        </div>
      ))}
    </dl>
  );
}
