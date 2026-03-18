import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and moments from Asian Le Restaurant in Prince Albert — our Chinese and Vietnamese restaurant, dishes, and dining experience.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
