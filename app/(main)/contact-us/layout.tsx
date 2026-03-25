import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit, hours & contact",
  description:
    "Find Asian Le Restaurant at Unit #3, 1400 6 Ave E, Prince Albert, SK — phone (306) 764-7799, email, opening hours, map, and dine-in or takeout reservations.",
  openGraph: {
    title: "Contact Asian Le Restaurant | Prince Albert",
    description:
      "Address, hours, phone, and map for our Chinese & Vietnamese restaurant on 6 Ave E.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
