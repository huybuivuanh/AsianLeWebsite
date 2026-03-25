import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { STORE } from "@/lib/store";

const siteName = "Asian Le Restaurant";
const siteUrl = "https://asianle.ca";
const siteDescription =
  "Chinese and Vietnamese restaurant in Prince Albert, SK — dine-in, takeout, daily lunch specials, and Skip the Dishes delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_CA",
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
    name: STORE.name,
    description: siteDescription,
    url: siteUrl,
    telephone: "+1-306-764-7799",
    email: STORE.email,
    servesCuisine: ["Chinese", "Vietnamese"],
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.address.line1,
      addressLocality: "Prince Albert",
      addressRegion: "SK",
      postalCode: "S6V 2K2",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.2003288722473,
      longitude: -105.7397006232774,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "11:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      STORE.socialLinks.facebook,
      STORE.socialLinks.skipthedishes,
      STORE.socialLinks.tripadvisor,
      STORE.socialLinks.yelp,
      STORE.socialLinks.restaurantguru,
    ],
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
