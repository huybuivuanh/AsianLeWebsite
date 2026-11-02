"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { STORE } from "@/lib/store";

const SWIPE_THRESHOLD = 50;
/** How long each update stays up before the next one slides in. */
const AUTOPLAY_MS = 6000;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
/** True when the visitor's device asks for less motion — autoplay stays off for them. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

type UpdatesSectionProps = {
  /** News images from Firestore `updates` — each image carries its own text. */
  items: ImageItem[];
};

/** News & updates: the update images shown whole (never cropped), one at a time,
 * advancing every few seconds and looping. Autoplay pauses on hover, with the pause
 * button, and for visitors who prefer reduced motion. With
 * nothing posted it shows a short placeholder instead, so the page's dark/light sections
 * keep alternating. */
export default function UpdatesSection({ items }: UpdatesSectionProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const count = items.length;
  const current = count ? index % count : 0;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);
  const playing = count > 1 && !paused && !reducedMotion;

  // One timer per slide, so the clock restarts after a manual arrow click or swipe.
  useEffect(() => {
    if (!playing || hovered) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [playing, hovered, index, count]);

  return (
    <section id="updates" className="scroll-mt-20 bg-ivory text-ink">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
              What&apos;s new
            </p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              News &amp;{" "}
              <span className="font-accent font-normal italic">
                updates
              </span>
            </h2>
          </div>
          {count > 1 ? (
            <div className="flex items-center gap-2.5">
              <ArrowButton
                label="Previous update"
                onClick={() => go(-1)}
                direction="prev"
              />
              <span
                className="min-w-12 text-center text-sm font-semibold tabular-nums text-muted"
                aria-live={playing ? "off" : "polite"}
              >
                {current + 1} / {count}
              </span>
              <ArrowButton
                label="Next update"
                onClick={() => go(1)}
                direction="next"
              />
              {reducedMotion ? null : (
                <button
                  type="button"
                  aria-label={paused ? "Play updates" : "Pause updates"}
                  onClick={() => setPaused((p) => !p)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-line bg-white text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    {paused ? (
                      <path d="M7 4.5v15l13-7.5z" />
                    ) : (
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          ) : null}
        </div>

        {count === 0 ? (
          <div className="mt-9 flex flex-col items-center justify-center gap-4 rounded-[28px] border border-sand-line bg-sand px-6 py-16 text-center sm:py-20">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand"
              aria-hidden
            >
              <path d="M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3z" />
              <path d="M8 9h8M8 13h8M8 17h4" />
            </svg>
            <p className="text-xl font-extrabold">No news right now</p>
            <p className="max-w-[38ch] text-muted">
              Specials, holiday hours and announcements show up here. For the
              latest, follow us on Facebook.
            </p>
            <a
              href={STORE.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
            >
              Follow us on Facebook
            </a>
          </div>
        ) : (
          <div
            className="relative mt-9 aspect-[16/9] touch-pan-y overflow-hidden rounded-[28px] border border-sand-line bg-sand"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta > 0 ? 1 : -1);
              touchStartX.current = null;
            }}
          >
            {items.map((item, i) => (
              <div
                key={item.id ?? item.url}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === current ? 1 : 0 }}
                aria-hidden={i !== current}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={i === 0}
                  unoptimized={skipNextImageOptimization(item.url)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-sand-line bg-white text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
