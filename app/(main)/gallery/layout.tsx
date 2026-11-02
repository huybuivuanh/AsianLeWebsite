import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/gallery",
  title: "Photo gallery",
  description:
    "Photos from Asian Le Restaurant in Prince Albert — dining room, signature Chinese and Vietnamese dishes, and community events.",
  ogTitle: "Gallery | Asian Le Restaurant",
  ogDescription: "See our Prince Albert restaurant, plates, and gatherings.",
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
