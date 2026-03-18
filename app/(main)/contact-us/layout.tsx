import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit or get in touch with Asian Le Restaurant in Prince Albert. Find our address, hours, and contact details for your Chinese and Vietnamese dining or takeout.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
