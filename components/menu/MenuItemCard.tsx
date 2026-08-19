"use client";

import Image from "next/image";
import { useState } from "react";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import MenuItemCardFace from "@/components/menu/MenuItemCardFace";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";

type MenuItemCardProps = Pick<MenuItemViewModel, "item" | "availability">;

/** Read-only menu card for /menu — clicking an item zooms its photo, no cart/order flow. */
export default function MenuItemCard({ item, availability }: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex w-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View larger image of ${item.name}`}
      >
        <MenuItemCardFace item={item} availability={availability} />
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ariaLabel={`${item.name} image preview`}
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
            src={imageSrc}
            alt={item.name}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            unoptimized={skipNextImageOptimization(imageSrc)}
          />
        </div>
      </Modal>
    </li>
  );
}
