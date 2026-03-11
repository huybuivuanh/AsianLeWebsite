"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    title: "Welcome",
    subtitle:
      "Discover and experience our finest selection of Vietnamese Beef Noodle Soup",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
    cta: "See Our Menu",
  },
  {
    title: "Welcome",
    subtitle:
      "Come and taste for yourself our Grilled roasted pork — Bánh mì heo quay",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
    cta: "See Our Menu",
  },
  {
    title: "Welcome",
    subtitle:
      "Traditional dishes with local products of the highest quality — Chicken Noodle Soup",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
    cta: "See Our Menu",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-800 md:h-[85vh]">
      <div className="relative h-full w-full">
        <Image
          src={slide.image}
          alt=""
          fill
          className="object-cover transition-opacity duration-700"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-200">
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
