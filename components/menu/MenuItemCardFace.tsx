import Image from "next/image";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/availability";

type MenuItemCardFaceProps = {
  item: MenuItem;
  availability: AvailabilityStatus;
  /** Set for the first cards above the fold so Next.js eager-loads them. */
  priority?: boolean;
};

/** Face of a /order item card: photo (or the soup-bowl placeholder), name, description,
 * red price and a "+" add badge. The whole card is the button (OrderMenuItemCard). */
export default function MenuItemCardFace({
  item,
  availability,
  priority = false,
}: MenuItemCardFaceProps) {
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";
  const available = availability.available;

  return (
    <>
      <span className="relative block aspect-square w-24 shrink-0 self-start overflow-hidden rounded-2xl bg-sand-deep sm:w-28">
        <Image
          src={imageSrc}
          alt=""
          fill
          className={`object-cover transition duration-300 group-hover:scale-105 ${available ? "" : "grayscale"}`}
          sizes="112px"
          priority={priority}
          unoptimized={skipNextImageOptimization(imageSrc)}
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col py-1 pr-1">
        <span className={`text-[17px] font-extrabold leading-snug ${available ? "" : "text-muted"}`}>
          {item.name}
        </span>
        {!available ? (
          <span className="mt-1 self-start rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-on-ink">
            {availability.label}
          </span>
        ) : null}
        {item.description ? (
          <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {item.description}
          </span>
        ) : null}
        <span className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-extrabold tabular-nums text-brand">
            {item.price > 0 ? formatPriceCAD(item.price) : ""}
          </span>
          <span
            aria-hidden
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-bold leading-none transition ${available ? "bg-ink text-on-ink group-hover:bg-brand" : "bg-sand text-muted"}`}
          >
            +
          </span>
        </span>
      </span>
    </>
  );
}
