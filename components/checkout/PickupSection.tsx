import { TakeOutFulfillmentKind } from "@/types/enum";

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
  return (
    <fieldset className="rounded-xl border border-stone-200 p-5">
      <legend className="px-1 font-semibold text-stone-900">Pickup</legend>
      <p className="text-xs text-stone-500">
        Current store time: {currentStoreTime}
        {storeOpenNow && ` · Estimated wait: ${waitTime} min`}
      </p>
      <div className="mt-2 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillmentKind === TakeOutFulfillmentKind.Immediate}
            onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Immediate)}
            disabled={!storeOpenNow}
            className="accent-amber-600"
          />
          As soon as possible
          {!storeOpenNow ? " (store not open yet)" : ""}
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillmentKind === TakeOutFulfillmentKind.Scheduled}
            onChange={() => setFulfillmentKind(TakeOutFulfillmentKind.Scheduled)}
            className="accent-amber-600"
          />
          Choose a date &amp; time
        </label>
      </div>
      {fulfillmentKind === TakeOutFulfillmentKind.Scheduled ? (
        <input
          type="datetime-local"
          value={scheduledLocal}
          onChange={(e) => setScheduledLocal(e.target.value)}
          min={minLocal}
          max={maxLocal}
          required
          className="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900"
        />
      ) : null}
    </fieldset>
  );
}
