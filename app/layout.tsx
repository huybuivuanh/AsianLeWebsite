import "./globals.css";
import type { Metadata } from "next";
import Nav from "./components/Nav";

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
      <body className="min-h-screen antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
