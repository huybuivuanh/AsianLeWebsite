import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About our restaurant",
  description:
    "Our story: Asian Le Restaurant serves fresh Chinese and Vietnamese food in Prince Albert with a family-friendly atmosphere and portions that keep guests coming back.",
  openGraph: {
    title: "About Asian Le Restaurant",
    description:
      "Fresh ingredients, authentic flavours, and hospitality in Prince Albert, Saskatchewan.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

