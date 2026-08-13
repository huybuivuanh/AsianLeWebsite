import Image from "next/image";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { AvailabilityStatus } from "@/lib/availability";
import type { MenuOptionGroupViewModel } from "@/lib/menuOptions";

type MenuItemCardFaceProps = {
  item: DemoMenuItem;
  availability: AvailabilityStatus;
  /** Flattened into a plain list of option names — /menu is browse-only, so the
   * group/selection-rule structure (relevant when actually building an order) is dropped. */
  optionGroups?: MenuOptionGroupViewModel[];
};

/** Shared image/name/price/availability-badge/description block used by both the
 * interactive card (/order) and the read-only card (/menu) — only the wrapping
 * element (button vs Link) and click behavior differ between them. */
export default function MenuItemCardFace({
  item,
  availability,
  optionGroups,
}: MenuItemCardFaceProps) {
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";
  const flatOptions = optionGroups?.flatMap((og) => og.options) ?? [];

  return (
    <>
      <div className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-white">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className={`object-cover ${availability.available ? "" : "grayscale"}`}
          sizes="100px"
          unoptimized={skipNextImageOptimization(imageSrc)}
        />
      </div>

      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold text-stone-900 group-hover:text-amber-700">
            {item.name}
          </span>
          {!availability.available ? (
            <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {availability.label}
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">{item.description}</p>
        ) : null}
        {flatOptions.length > 0 ? (
          <ul className="mt-1 space-y-0.5">
            {flatOptions.map((o) => (
              <li key={o.id} className="text-xs font-semibold text-amber-700">
                {o.name}
                {o.price > 0 ? ` (+${formatPriceCAD(o.price)})` : ""}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {item.price > 0 ? (
        <p className="shrink-0 font-semibold tabular-nums text-amber-700">
          {formatPriceCAD(item.price)}
        </p>
      ) : null}
    </>
  );
}
