"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    title: "Welcome",
    subtitle:
      "A place where family, tradition, and great food come together in Prince Albert.",
    image: "/home/hero carousel/1.jpg",
    cta: "See Our Menu",
  },
  {
    title: "Chào mừng",
    subtitle:
      "Đến với Asian Le — nơi ẩm thực Việt Nam và Trung Hoa gặp gỡ sự ấm áp và thân thiện.",
    image: "/home/hero carousel/2.jpg",
    cta: "Xem Thực Đơn",
  },
  {
    title: "Our Story",
    subtitle:
      "From our kitchen to your table. Authentic flavours and a warm welcome, every time.",
    image: "/home/hero carousel/3.jpg",
    cta: "See Our Menu",
  },
  {
    title: "Trải nghiệm ẩm thực",
    subtitle:
      "Khám phá hương vị truyền thống trong không gian ấm cúng. Chúng tôi mong được phục vụ bạn.",
    image: "/home/hero carousel/4.jpg",
    cta: "Xem Thực Đơn",
  },
  {
    title: "Visit Us",
    subtitle:
      "We look forward to sharing a meal with you. Dine in or order for pickup and delivery.",
    image: "/home/hero carousel/5.jpg",
    cta: "See Our Menu",
  },
];

const SWIPE_THRESHOLD = 50;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goToPrev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, []);
  const goToNext = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
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
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-800 md:h-[85vh]">
      <div
        className="relative h-full w-full touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 1 : 0,
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-stone-900/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
              <p className="text-3xl font-bold uppercase tracking-widest text-amber-200">
                {slide.title}
              </p>
              <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {slide.subtitle}
              </h1>
              <Link
                href="/menu"
                className="mt-8 inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 md:left-4"
        aria-label="Previous slide"
      >
        <svg
          className="h-6 w-6"
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
      <button
        type="button"
        onClick={goToNext}
        className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 md:right-4"
        aria-label="Next slide"
      >
        <svg
          className="h-6 w-6"
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition ${i === index ? "bg-amber-400 w-6" : "bg-white/50 hover:bg-white/80"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
