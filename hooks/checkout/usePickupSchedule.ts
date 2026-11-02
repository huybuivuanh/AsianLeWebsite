import { useMemo, useState } from "react";
import {
  getMaxScheduleDateStr,
  getScheduledPickupInvalidReason,
  getStoreLocalNow,
  isStoreOpenNow,
  isStorePaused,
  MAX_SCHEDULE_DAYS_AHEAD,
  SCHEDULE_LEAD_MINUTES,
  type ScheduledPickupInvalidReason,
} from "@/lib/availability";
import type { FulfillmentWire } from "@/lib/orderApi";
import { formatTimeHHmmTo12h } from "@/lib/utils";
import { TakeOutFulfillmentKind } from "@/types/enum";

const SCHEDULED_PICKUP_INVALID_MESSAGES: Record<ScheduledPickupInvalidReason, string> = {
  paused: "We're not taking online orders right now.",
  "invalid-format": "Please choose a valid pickup date and time.",
  past: "That time has already passed — please choose another.",
  "too-far-ahead": `Please choose a date within the next ${MAX_SCHEDULE_DAYS_AHEAD} days.`,
  holiday: "We're closed that day — please choose another date.",
  closed: "We're closed that day — please choose another date.",
  "outside-hours": "That time is outside store hours — please choose another.",
  "lead-time": `Please choose a time at least ${SCHEDULE_LEAD_MINUTES} minutes from now.`,
};

/**
 * Pickup choice at checkout: ASAP vs. a scheduled time, the allowed range for the
 * date/time input, and checking the choice before the order is placed. Uses the store
 * settings loaded with the page (checkout is rendered fresh on every visit).
 */
export function usePickupSchedule(settings: StoreSettings) {
  const now = useMemo(() => new Date(), []);
  const storeOpenNow = isStoreOpenNow(settings, now);
  const canOrderAtAll = !isStorePaused(settings.pausedUntil, now);

  const { minLocal, maxLocal, currentStoreTime } = useMemo(() => {
    const { dateStr, hhmm } = getStoreLocalNow(settings, now);
    return {
      minLocal: `${dateStr}T${hhmm}`,
      maxLocal: `${getMaxScheduleDateStr(settings, now)}T23:59`,
      currentStoreTime: formatTimeHHmmTo12h(hhmm),
    };
  }, [settings, now]);

  const [fulfillmentKind, setFulfillmentKind] = useState<TakeOutFulfillmentKind>(
    storeOpenNow ? TakeOutFulfillmentKind.Immediate : TakeOutFulfillmentKind.Scheduled,
  );
  /** The datetime-local input's value: "YYYY-MM-DDTHH:mm". */
  const [scheduledLocal, setScheduledLocal] = useState("");

  /** The chosen pickup if it's valid, otherwise a message for the customer. */
  function resolvePickup(): { fulfillment: FulfillmentWire } | { error: string } {
    if (fulfillmentKind !== TakeOutFulfillmentKind.Scheduled) {
      return { fulfillment: { kind: TakeOutFulfillmentKind.Immediate } };
    }
    const [date, rawTime] = scheduledLocal.split("T");
    if (!date || !rawTime) return { error: "Please choose a pickup date and time" };
    const time = rawTime.slice(0, 5);
    const invalidReason = getScheduledPickupInvalidReason(settings, date, time);
    if (invalidReason) return { error: SCHEDULED_PICKUP_INVALID_MESSAGES[invalidReason] };
    return { fulfillment: { kind: TakeOutFulfillmentKind.Scheduled, date, time } };
  }

  return {
    storeOpenNow,
    canOrderAtAll,
    minLocal,
    maxLocal,
    currentStoreTime,
    fulfillmentKind,
    setFulfillmentKind,
    scheduledLocal,
    setScheduledLocal,
    resolvePickup,
  };
}
