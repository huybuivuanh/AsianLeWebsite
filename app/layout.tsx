import "./globals.css";
import type { Metadata } from "next";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import MenuDataLoader from "../components/MenuDataLoader";

const siteName = "Asian Le Restaurant";
const siteDescription = "Chinese & Vietnamese restaurant in Prince Albert.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Asian Le Restaurant",
    description:
      "Chinese & Vietnamese restaurant offering dine-in and takeout in Prince Albert.",
    servesCuisine: ["Chinese", "Vietnamese"],
    // Fill these out accurately once you decide on exact details / URLs
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prince Albert",
      addressRegion: "SK",
      addressCountry: "CA",
    },
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <MenuDataLoader />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
