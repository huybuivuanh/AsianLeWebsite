import Link from "next/link";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import MenuItemCardFace from "@/components/menu/MenuItemCardFace";

type MenuItemCardProps = Pick<MenuItemViewModel, "item" | "availability" | "optionGroups">;

/** Read-only menu card for /menu — no cart, no modal. Links straight into that
 * item's modal on /order via a deep-link query param. */
export default function MenuItemCard({ item, availability, optionGroups }: MenuItemCardProps) {
  return (
    <li>
      <Link
        href={`/order?item=${item.id}`}
        className="group flex w-full items-start gap-4 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`Order ${item.name}`}
      >
        <MenuItemCardFace item={item} availability={availability} optionGroups={optionGroups} />
      </Link>
    </li>
  );
}
