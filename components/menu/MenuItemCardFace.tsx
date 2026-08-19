import Image from "next/image";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/availability";

type MenuItemCardFaceProps = {
  item: DemoMenuItem;
  availability: AvailabilityStatus;
};

/** Shared image/name/price/availability-badge/description card face, used by both /menu (MenuItemCard, read-only) and /order (OrderMenuItemCard, opens the order flow). */
export default function MenuItemCardFace({
  item,
  availability,
}: MenuItemCardFaceProps) {
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";

  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className={`object-cover transition duration-300 group-hover:scale-105 ${availability.available ? "" : "grayscale"}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized={skipNextImageOptimization(imageSrc)}
        />
        {!availability.available ? (
          <span className="absolute left-2 top-2 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {availability.label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="line-clamp-1 font-semibold text-stone-900 group-hover:text-amber-700">
          {item.name}
        </span>
        {item.description ? (
          <p className="line-clamp-2 text-xs text-stone-500">{item.description}</p>
        ) : null}
        <span
          className={`mt-auto pt-1 font-semibold tabular-nums text-amber-700 ${item.price > 0 ? "" : "invisible"}`}
          aria-hidden={item.price > 0 ? undefined : true}
        >
          {formatPriceCAD(item.price > 0 ? item.price : 1)}
        </span>
      </div>
    </>
  );
}
