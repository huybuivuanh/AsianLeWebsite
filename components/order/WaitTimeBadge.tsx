"use client";

import { isStoreOpenNow } from "@/lib/availability";
import { useLiveStoreSettings } from "@/hooks/useLiveStoreSettings";

/** Live "estimated wait" pill shown beside the "Order for pickup" heading. `waitTime`
 * (minutes) is set by the restaurant in settings/store; this subscribes to that doc so
 * the number reflects the current kitchen load without a page reload — see
 * useLiveStoreSettings. Hidden while the store is closed, matching checkout's PickupSection. */
export default function WaitTimeBadge({
  initialStoreSettings,
}: {
  initialStoreSettings: StoreSettings;
}) {
  const storeSettings = useLiveStoreSettings(initialStoreSettings);

  if (!isStoreOpenNow(storeSettings)) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse" />
      ~{storeSettings.waitTime} min wait
    </span>
  );
}
