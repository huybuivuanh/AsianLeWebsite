import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Asian Le Restaurant in Prince Albert, our story, and our commitment to fresh Chinese and Vietnamese cuisine.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

