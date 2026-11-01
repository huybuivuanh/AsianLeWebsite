"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/availability";

const PLACEHOLDER = "/Soup Bowl Icon.jpg";

type MenuListItemProps = {
  item: MenuItem;
  availability: AvailabilityStatus;
};

/** One row of the /menu list: round photo (tap to enlarge; placeholder when there's no
 * photo), name, dotted leader, price, description. Read-only — ordering is on /order. */
export default function MenuListItem({ item, availability }: MenuListItemProps) {
  const [zoomed, setZoomed] = useState(false);
  const photo = item.image?.url || null;
  const src = photo ?? PLACEHOLDER;

  const thumb = (
    <span className="relative block h-16 w-16 overflow-hidden rounded-full bg-sand-deep">
      <Image
        src={src}
        alt=""
        fill
        className={`object-cover ${availability.available ? "" : "grayscale"}`}
        sizes="64px"
        unoptimized={skipNextImageOptimization(src)}
      />
    </span>
  );

  return (
    <li className="flex items-start gap-4 border-b border-sand-line py-4.5">
      {photo ? (
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`View a larger photo of ${item.name}`}
          className="shrink-0 rounded-full transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          {thumb}
        </button>
      ) : (
        <span className="shrink-0">{thumb}</span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2.5">
          <h3 className={`text-[17px] font-extrabold leading-snug ${availability.available ? "" : "text-muted"}`}>
            {item.name}
          </h3>
          <span aria-hidden className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-[#b9ae9b]" />
          {item.price > 0 ? (
            <span className="shrink-0 font-extrabold tabular-nums text-brand">
              {formatPriceCAD(item.price)}
            </span>
          ) : null}
        </div>
        {!availability.available ? (
          <p className="mt-1 inline-block rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-on-ink">
            {availability.label}
          </p>
        ) : null}
        {item.description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
        ) : null}
      </div>

      {photo ? (
        <Modal
          open={zoomed}
          onClose={() => setZoomed(false)}
          ariaLabel={`${item.name} photo`}
          panelClassName="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-ink shadow-2xl"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-3 top-3 z-10 min-h-10 rounded-full bg-black/55 px-4 text-sm font-semibold text-white backdrop-blur hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close photo"
          >
            Close
          </button>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={photo}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized={skipNextImageOptimization(photo)}
            />
          </div>
          <p className="px-5 py-4 font-bold text-on-ink">{item.name}</p>
        </Modal>
      ) : null}
    </li>
  );
}
