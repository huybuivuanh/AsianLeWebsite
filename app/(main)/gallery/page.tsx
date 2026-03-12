"use client";

import Image from "next/image";
import PageContainer from "@/components/PageContainer";
import { useGalleryStore } from "@/stores/galleryStore";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

export default function GalleryPage() {
  const { items, loading, error } = useGalleryStore();

  return (
    <>
      {/* Title section with background image */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src={TITLE_BG_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Gallery
          </h1>
          <p className="mt-4 text-lg text-stone-200 sm:text-xl">
            The most memorable moments are captured
          </p>
        </div>
      </section>

      <PageContainer>
        <div className="py-12">
          {error && (
            <p className="text-center text-red-600" role="alert">
              {error}
            </p>
          )}
          {loading && (
            <p className="text-center text-stone-500">Loading gallery…</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="text-center text-stone-500">No gallery items yet.</p>
          )}
          {!loading && items.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <figure key={item.id} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <figcaption className="mt-3 text-center font-medium text-stone-700">
                    {item.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
