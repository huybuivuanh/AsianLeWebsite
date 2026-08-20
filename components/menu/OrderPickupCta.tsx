"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isStoreOpenNow } from "@/lib/availability";
import { useLiveStoreSettings } from "@/hooks/useLiveStoreSettings";
import OrderingUnavailableModal from "@/components/menu/OrderingUnavailableModal";

type OrderPickupCtaProps = {
  storeSettings: StoreSettings;
  className: string;
  children: ReactNode;
};

/** "Order and pay when pick up" CTA — checks live store availability before navigating to
 * /order, showing OrderingUnavailableModal instead of a dead-end redirect when the store
 * isn't currently accepting orders. Used by both the /menu hero and FloatingOrderBar.
 * `storeSettings` comes in as /menu's ISR-cached (up to 15 min stale) snapshot, so this
 * subscribes to live updates instead of trusting it directly — see useLiveStoreSettings. */
export default function OrderPickupCta({
  storeSettings: initialStoreSettings,
  className,
  children,
}: OrderPickupCtaProps) {
  const router = useRouter();
  const storeSettings = useLiveStoreSettings(initialStoreSettings);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const handleClick = useCallback(() => {
    if (isStoreOpenNow(storeSettings)) {
      router.push("/order");
    } else {
      setShowUnavailable(true);
    }
  }, [storeSettings, router]);

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      <OrderingUnavailableModal
        open={showUnavailable}
        onClose={() => setShowUnavailable(false)}
      />
    </>
  );
}
