"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const UPDATE_IMAGES = [
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
];

const SWIPE_THRESHOLD = 50;

export default function NewsUpdatesSection() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToPrev = useCallback(() => {
    setIndex((i) => (i - 1 + UPDATE_IMAGES.length) % UPDATE_IMAGES.length);
  }, []);
  const goToNext = useCallback(() => {
    setIndex((i) => (i + 1) % UPDATE_IMAGES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(goToNext, 5000);
    return () => clearInterval(id);
  }, [goToNext]);

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
      id="news-updates"
      className="scroll-mt-28 border-t border-stone-200 bg-stone-50 py-16 md:py-20"
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

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
          <div
            className="relative aspect-[2/1] w-full min-h-[280px] sm:min-h-[320px] md:aspect-[5/2] md:min-h-[560px] touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {UPDATE_IMAGES.map((src, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
                aria-hidden={i !== index}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900/30 text-white backdrop-blur-sm transition hover:bg-stone-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 md:left-4"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-stone-900/30 text-white backdrop-blur-sm transition hover:bg-stone-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 md:right-4"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {UPDATE_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition ${i === index ? "w-6 bg-amber-500" : "w-2 bg-white/60 hover:bg-white/90"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
