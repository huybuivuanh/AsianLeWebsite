import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse the Asian Le Restaurant menu featuring Chinese and Vietnamese dishes, lunch specials, and takeout options in Prince Albert.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

