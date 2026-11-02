import { STORE } from "@/lib/store";
import { SHARE_IMAGE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

/** Restaurant details for Google (schema.org JSON-LD). Hours are left out on purpose:
 * Google takes them from the Google Business Profile, and the site's `hours` collection
 * is free text for visitors. */
export default function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: STORE.name,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}${SHARE_IMAGE.url}`,
    telephone: `+1-${STORE.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`,
    email: STORE.email,
    servesCuisine: ["Chinese", "Vietnamese"],
    hasMenu: `${SITE_URL}/menu`,
    acceptsReservations: `${SITE_URL}/reservations`,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.address.line1,
      addressLocality: "Prince Albert",
      addressRegion: "SK",
      postalCode: "S6V 2R9",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.1909439,
      longitude: -105.7391592,
    },
    sameAs: [
      STORE.socialLinks.facebook,
      STORE.socialLinks.skipthedishes,
      STORE.socialLinks.tripadvisor,
      STORE.socialLinks.yelp,
      STORE.socialLinks.restaurantguru,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
