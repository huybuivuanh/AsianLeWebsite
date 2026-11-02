"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";

/** Every Nth photo is shown as a large 2×2 tile, to break up the grid. */
const FEATURE_EVERY = 7;

/** Photo grid + full-screen viewer (arrows, arrow keys, swipe on phones). */
export default function GalleryGrid({ items }: { items: ImageItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const count = items.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  const current = openIndex === null ? null : items[openIndex];

  const arrowClass =
    "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <>
      <ul className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => {
          const featured = index % FEATURE_EVERY === 0;
          return (
            <li key={item.id ?? item.url} className={featured ? "col-span-2 row-span-2" : ""}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group relative block aspect-square w-full overflow-hidden rounded-3xl bg-sand-deep text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                aria-label={`View ${item.name || "photo"} larger`}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes={
                    featured
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  }
                  priority={index < 3}
                  unoptimized={skipNextImageOptimization(item.url)}
                />
                {item.name ? (
                  <span
                    className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3.5 pt-10 font-bold text-white ${featured ? "text-lg sm:text-xl" : "text-sm sm:text-[15px]"}`}
                  >
                    {item.name}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <Modal
        open={current !== null}
        onClose={close}
        ariaLabel={current?.name || "Photo"}
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6"
        panelClassName="relative flex max-h-full w-full max-w-5xl flex-col"
      >
        {current ? (
          <>
            <div
              className="relative h-[75vh] w-full"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current;
                touchStartX.current = null;
                if (start === null) return;
                const dx = e.changedTouches[0].clientX - start;
                if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              }}
            >
              <Image
                key={current.url}
                src={current.url}
                alt={current.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                unoptimized={skipNextImageOptimization(current.url)}
              />
              {count > 1 ? (
                <>
                  <button type="button" onClick={() => step(-1)} className={`${arrowClass} left-1 sm:left-3`} aria-label="Previous photo">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => step(1)} className={`${arrowClass} right-1 sm:right-3`} aria-label="Next photo">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-white">
              <p className="min-w-0 truncate text-lg font-bold">{current.name}</p>
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-sm tabular-nums text-on-ink-muted" aria-live="polite">
                  {(openIndex ?? 0) + 1} / {count}
                </span>
                <button
                  type="button"
                  onClick={close}
                  className="min-h-10 rounded-full border border-white/30 px-4 text-sm font-bold transition hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
}
