import { TakeOutFulfillmentKind } from "@/types/enum";
import { MAX_SCHEDULE_DAYS_AHEAD } from "@/lib/availability";

type PickupSectionProps = {
  storeOpenNow: boolean;
  currentStoreTime: string;
  waitTime: number;
  fulfillmentKind: TakeOutFulfillmentKind;
  setFulfillmentKind: (kind: TakeOutFulfillmentKind) => void;
  scheduledLocal: string;
  setScheduledLocal: (value: string) => void;
  minLocal: string;
  maxLocal: string;
};

const tileBase =
  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2";

export default function PickupSection({
  storeOpenNow,
  currentStoreTime,
  waitTime,
  fulfillmentKind,
  setFulfillmentKind,
  scheduledLocal,
  setScheduledLocal,
  minLocal,
  maxLocal,
}: PickupSectionProps) {
  const asap = fulfillmentKind === TakeOutFulfillmentKind.Immediate;
  const scheduled = fulfillmentKind === TakeOutFulfillmentKind.Scheduled;

  return (
    <fieldset className="rounded-3xl border border-sand-line bg-white p-6 sm:p-8">
      <legend className="sr-only">Pickup time</legend>
      <p aria-hidden className="text-xl font-extrabold">
        Pickup time
      </p>
      <p className="mt-1 text-sm text-muted">Store time: {currentStoreTime}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label
          className={`${tileBase} ${
            !storeOpenNow
              ? "cursor-not-allowed border-dashed border-sand-line bg-ivory/50 text-muted"
              : asap
                ? "border-ink bg-ink text-on-ink"
                : "border-sand-line bg-white hover:border-ink"
          }`}
        >
          <input
            type="radio"
            name="fulfillment"
            checked={asap}
            onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Immediate)}
            disabled={!storeOpenNow}
            className="mt-1 h-4 w-4 shrink-0 accent-gold"
          />
          <span>
            <span className="block font-extrabold">As soon as possible</span>
            <span className={`text-sm ${asap && storeOpenNow ? "text-gold" : "text-muted"}`}>
              {storeOpenNow ? `Ready in about ${waitTime} min` : "Store isn't open yet"}
            </span>
          </span>
        </label>

        <label
          className={`${tileBase} ${
            scheduled ? "border-ink bg-ink text-on-ink" : "border-sand-line bg-white hover:border-ink"
          }`}
        >
          <input
            type="radio"
            name="fulfillment"
            checked={scheduled}
            onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Scheduled)}
            className="mt-1 h-4 w-4 shrink-0 accent-gold"
          />
          <span>
            <span className="block font-extrabold">Schedule for later</span>
            <span className={`text-sm ${scheduled ? "text-gold" : "text-muted"}`}>
              Pick a day &amp; time, up to {MAX_SCHEDULE_DAYS_AHEAD} days ahead
            </span>
          </span>
        </label>
      </div>

      {scheduled ? (
        <label className="mt-4 block max-w-sm text-sm font-bold">
          Pickup date &amp; time
          <input
            type="datetime-local"
            value={scheduledLocal}
            onChange={(e) => setScheduledLocal(e.target.value)}
            min={minLocal}
            max={maxLocal}
            required
            className="mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </label>
      ) : null}
    </fieldset>
  );
}
