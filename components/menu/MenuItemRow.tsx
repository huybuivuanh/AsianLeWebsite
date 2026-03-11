import Image from "next/image";

type MenuItemRowProps = {
  item: MenuItem;
  index: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(price);
}

export default function MenuItemRow({ item }: MenuItemRowProps) {
  return (
    <li className="flex items-end gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-stone-200">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <p className="text-2xl font-semibold text-stone-900">{item.name}</p>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">
            {item.description}
          </p>
        ) : null}
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-stone-900">
        {formatPrice(item.price)}
      </p>
    </li>
  );
}
