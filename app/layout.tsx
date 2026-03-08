import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asian Le Restaurant",
  description: "Chinese & Vietnamese Restaurant in Prince Albert",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
