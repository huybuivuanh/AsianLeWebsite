import Link from "next/link";
import type { AvailabilityStatus } from "@/lib/availability";
import MenuItemCardFace from "@/components/menu/MenuItemCardFace";

type MenuItemCardProps = {
  item: DemoMenuItem;
  availability: AvailabilityStatus;
};

/** Read-only menu card for /menu — no cart, no modal. Links straight into that
 * item's modal on /order via a deep-link query param. */
export default function MenuItemCard({ item, availability }: MenuItemCardProps) {
  return (
    <li>
      <Link
        href={`/order?item=${item.id}`}
        className="group flex w-full items-start gap-4 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`Order ${item.name}`}
      >
        <MenuItemCardFace item={item} availability={availability} />
      </Link>
    </li>
  );
}
