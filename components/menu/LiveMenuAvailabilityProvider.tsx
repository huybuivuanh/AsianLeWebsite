"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapAvailability, mapSoldOutUntil } from "@/lib/orderMenuData";
import { mapWeeklyHours, mapHolidays } from "@/lib/storeSettings";
import {
  getAvailabilityStatus,
  isStoreOpenNow,
  INDEFINITE_PAUSE,
  type AvailabilityStatus,
} from "@/lib/availability";

/**
 * Live-patches item/option availability on top of the SSR-rendered `/menu` page —
 * the page itself stays server-rendered (ISR) for SEO/first paint; this just overlays
 * real-time sold-out/availability-window state from two collection-level Firestore
 * listeners, so staff toggling sold-out reflects immediately instead of waiting up to
 * `revalidate`'s 15-minute window. Falls back to the SSR-computed status passed in by
 * each card until the first snapshot arrives. Also mirrors settings/store (pausedUntil
 * + hours) so the pause-ordering kill switch takes effect immediately rather than at the
 * next ISR revalidation.
 */

type RawEntity = { availability?: MenuItemAvailability; soldOutUntil?: Date };

type LiveMenuAvailabilityContextValue = {
  getItemAvailability: (itemId: string, fallback: AvailabilityStatus) => AvailabilityStatus;
  getOptionAvailability: (optionId: string, fallback: AvailabilityStatus) => AvailabilityStatus;
  isOrderingAvailable: boolean;
};

const LiveMenuAvailabilityContext = createContext<LiveMenuAvailabilityContextValue | null>(null);

// Re-evaluate availability windows (e.g. "Available 11:00-14:00") periodically, since
// nothing in Firestore changes at the moment a window opens/closes.
const TIME_RECHECK_INTERVAL_MS = 60_000;

export function LiveMenuAvailabilityProvider({
  storeSettings: initialStoreSettings,
  children,
}: {
  storeSettings: StoreSettings;
  children: ReactNode;
}) {
  const [itemsById, setItemsById] = useState<Map<string, RawEntity> | null>(null);
  const [optionsById, setOptionsById] = useState<Map<string, RawEntity> | null>(null);
  const [storeSettings, setStoreSettings] = useState(initialStoreSettings);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, "demoMenuItems"), (snapshot) => {
      const map = new Map<string, RawEntity>();
      for (const doc of snapshot.docs) {
        const d = doc.data();
        map.set(doc.id, { availability: mapAvailability(d.availability), soldOutUntil: mapSoldOutUntil(d.soldOutUntil) });
      }
      setItemsById(map);
    });
    const unsubOptions = onSnapshot(collection(db, "options"), (snapshot) => {
      const map = new Map<string, RawEntity>();
      for (const doc of snapshot.docs) {
        const d = doc.data();
        map.set(doc.id, { availability: mapAvailability(d.availability), soldOutUntil: mapSoldOutUntil(d.soldOutUntil) });
      }
      setOptionsById(map);
    });
    const unsubStoreSettings = onSnapshot(doc(db, "settings", "store"), (snapshot) => {
      const d = snapshot.data();
      if (!d) return;
      setStoreSettings({
        pausedUntil:
          d.pausedUntil === null
            ? null
            : d.pausedUntil instanceof Timestamp
              ? d.pausedUntil.toDate()
              : INDEFINITE_PAUSE,
        timezone: typeof d.timezone === "string" ? d.timezone : initialStoreSettings.timezone,
        waitTime: typeof d.waitTime === "number" ? d.waitTime : initialStoreSettings.waitTime,
        hours: mapWeeklyHours(d.hours),
        holidays: mapHolidays(d.holidays),
      });
    });
    const interval = setInterval(() => setNow(new Date()), TIME_RECHECK_INTERVAL_MS);
    return () => {
      unsubItems();
      unsubOptions();
      unsubStoreSettings();
      clearInterval(interval);
    };
  }, [initialStoreSettings.timezone, initialStoreSettings.waitTime]);

  const value: LiveMenuAvailabilityContextValue = {
    getItemAvailability: (itemId, fallback) => {
      const entity = itemsById?.get(itemId);
      return entity ? getAvailabilityStatus(entity, storeSettings.timezone, now) : fallback;
    },
    getOptionAvailability: (optionId, fallback) => {
      const entity = optionsById?.get(optionId);
      return entity ? getAvailabilityStatus(entity, storeSettings.timezone, now) : fallback;
    },
    isOrderingAvailable: isStoreOpenNow(storeSettings, now),
  };

  return (
    <LiveMenuAvailabilityContext.Provider value={value}>
      {children}
    </LiveMenuAvailabilityContext.Provider>
  );
}

/** Safe to use outside the provider (e.g. in tests) — just returns the SSR fallback. */
export function useLiveMenuAvailability(): LiveMenuAvailabilityContextValue {
  const ctx = useContext(LiveMenuAvailabilityContext);
  return (
    ctx ?? {
      getItemAvailability: (_itemId, fallback) => fallback,
      getOptionAvailability: (_optionId, fallback) => fallback,
      isOrderingAvailable: true,
    }
  );
}
