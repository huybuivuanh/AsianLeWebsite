import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo gallery",
  description:
    "Photos from Asian Le Restaurant in Prince Albert — dining room, signature Chinese and Vietnamese dishes, and community events.",
  openGraph: {
    title: "Gallery | Asian Le Restaurant",
    description:
      "See our Prince Albert restaurant, plates, and gatherings.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
