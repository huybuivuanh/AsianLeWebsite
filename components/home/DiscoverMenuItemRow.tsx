"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { DiscoverMenuItem } from "@/components/home/discoverMenuData";

export default function DiscoverMenuItemRow({
  name,
  description,
  image,
}: DiscoverMenuItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label={`View larger image of ${name}`}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="100px"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-stone-900">{name}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel={`${name} image preview`}
        panelClassName="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-stone-900 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label="Close image preview"
        >
          Close
        </button>
        <div className="relative aspect-[4/3] w-full bg-stone-800">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      </Modal>
    </>
  );
}
