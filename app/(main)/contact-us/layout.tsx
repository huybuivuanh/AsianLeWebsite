import type { Metadata } from "next";
import { STORE } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact-us",
  title: "Visit, hours & contact",
  description: `Find Asian Le Restaurant at ${STORE.address.line1}, ${STORE.address.city} — phone ${STORE.phone}, email ${STORE.email}, opening hours, map, and dine-in or takeout reservations.`,
  ogTitle: "Contact Asian Le Restaurant | Prince Albert",
  ogDescription: `Address, hours, phone, and map for our Chinese & Vietnamese restaurant at ${STORE.address.line1}, ${STORE.address.city}.`,
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
