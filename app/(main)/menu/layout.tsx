import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu & daily lunch specials",
  description:
    "Full food menu at Asian Le Restaurant, Prince Albert — Chinese and Vietnamese appetizers, noodles, fried rice, combos, and weekday lunch specials (11am–2pm). Takeout and Skip the Dishes available.",
  openGraph: {
    title: "Menu | Asian Le Restaurant",
    description:
      "Chinese & Vietnamese dishes, daily specials, and takeout in Prince Albert, SK.",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

