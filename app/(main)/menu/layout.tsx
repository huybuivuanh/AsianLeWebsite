import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/menu",
  title: "Menu & daily lunch specials",
  description:
    "Full food menu at Asian Le Restaurant, Prince Albert — Chinese and Vietnamese appetizers, noodles, fried rice, combos, and weekday lunch specials (11am–2pm). Takeout and Skip the Dishes available.",
  ogTitle: "Menu | Asian Le Restaurant",
  ogDescription:
    "Chinese & Vietnamese dishes, daily specials, and takeout in Prince Albert, SK.",
});

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
