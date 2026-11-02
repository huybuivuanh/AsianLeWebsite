import type { Metadata } from "next";
import { STORE } from "@/lib/store";

export const metadata: Metadata = {
  title: "Visit, hours & contact",
  description: `Find Asian Le Restaurant at ${STORE.address.line1}, ${STORE.address.city} — phone ${STORE.phone}, email ${STORE.email}, opening hours, map, and dine-in or takeout reservations.`,
  openGraph: {
    title: "Contact Asian Le Restaurant | Prince Albert",
    description: `Address, hours, phone, and map for our Chinese & Vietnamese restaurant at ${STORE.address.line1}, ${STORE.address.city}.`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
