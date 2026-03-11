"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const UPDATE_IMAGES = [
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
];

export default function NewsUpdatesSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % UPDATE_IMAGES.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const imageSrc = UPDATE_IMAGES[index];

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
          <div className="relative aspect-[2/1] w-full min-h-[280px] sm:min-h-[320px] md:aspect-[5/2] md:min-h-[560px]">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-opacity duration-700"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={index === 0}
            />
          </div>
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
