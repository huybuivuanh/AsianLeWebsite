"use client";

import { isStoreOpenNow } from "@/lib/availability";
import { useLiveStoreSettings } from "@/hooks/useLiveStoreSettings";

/** Live status pill under the /order heading: "Taking orders · ~N min wait" while open
 * (`waitTime` is set by the restaurant in settings/store and updates without a reload),
 * or a "not taking orders" notice while closed/paused. */
export default function WaitTimeBadge({
  initialStoreSettings,
}: {
  initialStoreSettings: StoreSettings;
}) {
  const storeSettings = useLiveStoreSettings(initialStoreSettings);

  if (!isStoreOpenNow(storeSettings)) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-raised px-4 py-1.5 text-sm font-semibold text-on-ink-muted">
        <span className="h-2 w-2 rounded-full bg-brand-bright" />
        Not taking online orders right now
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-raised px-4 py-1.5 text-sm font-semibold text-on-ink">
      <span className="h-2 w-2 rounded-full bg-gold motion-safe:animate-pulse" />
      Taking orders · ~{storeSettings.waitTime} min wait
    </span>
  );
}
