import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about-us",
  title: "About our restaurant",
  description:
    "Our story: Asian Le Restaurant serves fresh Chinese and Vietnamese food in Prince Albert with a family-friendly atmosphere and portions that keep guests coming back.",
  ogTitle: "About Asian Le Restaurant",
  ogDescription:
    "Fresh ingredients, authentic flavours, and hospitality in Prince Albert, Saskatchewan.",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
