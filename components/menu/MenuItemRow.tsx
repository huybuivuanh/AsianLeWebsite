import Image from "next/image";
import { formatPriceCAD } from "@/lib/utils";

type MenuItemRowProps = {
  item: MenuItem;
  index: number;
};

export default function MenuItemRow({ item }: MenuItemRowProps) {
  return (
    <li className="flex items-end gap-4">
      {item.image?.url && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-stone-200">
          <Image
            src={item.image.url}
            alt={item.image.name || item.name}
            fill
            className="object-cover"
            sizes="256px"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <p className="text-2xl font-semibold text-stone-900">{item.name}</p>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">
            {item.description}
          </p>
        ) : null}
        {item.options && item.options.length > 0 ? (
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 pl-2 text-medium font-bold text-blue-500">
            {item.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-stone-900">
        {formatPriceCAD(item.price)}
      </p>
    </li>
  );
}
