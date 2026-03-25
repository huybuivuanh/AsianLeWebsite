"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const SWIPE_THRESHOLD = 50;

type UpdatesSectionProps = {
  items: ImageItem[];
  error?: string | null;
};

export default function UpdatesSection({ items, error }: UpdatesSectionProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToPrev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
  }, [items.length]);
  const goToNext = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(items.length, 1));
  }, [items.length]);

  const safeIndex = items.length ? index % items.length : 0;

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(goToNext, 5000);
    return () => clearInterval(id);
  }, [items.length, goToNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="updates"
      className="scroll-mt-28 border-t border-stone-200 bg-white py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          What&apos;s new
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          News & Updates
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-stone-600">
          Latest offers, events, and news — all in one place.
        </p>

        {error ? (
          <p className="mt-6 text-center text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {!error && items.length === 0 ? (
          <p className="mt-6 text-center text-stone-500">No updates yet.</p>
        ) : null}

        {!error && items.length > 0 ? (
          <div className="relative mt-10 overflow-hidden rounded-2xl border-2 border-stone-300 bg-stone-100 p-3 shadow-lg sm:p-4 md:p-5">
            <div
              className="relative aspect-[16/10] w-full min-h-[240px] touch-pan-y sm:min-h-[280px] md:aspect-[2/1] md:min-h-[320px]"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: i === safeIndex ? 1 : 0,
                    zIndex: i === safeIndex ? 1 : 0,
                  }}
                  aria-hidden={i !== safeIndex}
                >
                  <div className="relative h-full w-full bg-stone-100 pb-14 sm:pb-16">
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority={i === 0}
                    />
                  </div>
                </div>
              ))}
              {/* Bottom controls: prev, dots (always visible), next */}
              <div
                className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent px-3 pb-4 pt-12 sm:px-4 sm:pb-5 sm:pt-14"
                role="group"
                aria-label="Carousel controls"
              >
                <div className="flex w-full max-w-md shrink-0 items-center justify-center gap-2 sm:max-w-lg sm:gap-3">
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900/45 text-white backdrop-blur-sm transition hover:bg-stone-900/65 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:h-10 sm:w-10"
                    aria-label="Previous slide"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-1">
                    {items.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`h-2 shrink-0 rounded-full transition ${i === safeIndex ? "w-6 bg-amber-400" : "w-2 bg-white/60 hover:bg-white/90"}`}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === safeIndex}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900/45 text-white backdrop-blur-sm transition hover:bg-stone-900/65 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:h-10 sm:w-10"
                    aria-label="Next slide"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
