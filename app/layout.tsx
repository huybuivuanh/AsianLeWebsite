import "./globals.css";
import type { Metadata } from "next";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import MenuDataLoader from "../components/MenuDataLoader";

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
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        <MenuDataLoader />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
