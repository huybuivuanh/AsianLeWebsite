/**
 * Single source of truth for Asian Le Restaurant store details.
 * Used by Contact Us, Home (Our Location, Open Hours), and Footer.
 */

export const STORE = {
  name: "Asian Le Restaurant",

  address: {
    line1: "Unit #3, 1400 6 Ave E",
    city: "Prince Albert, SK S6V 2K2",
  },

  phone: "(306) 764-7799",
  email: "info@asianle.ca",

  hours: [
    { days: "Monday – Saturday", time: "11:00 AM – 8:00 PM" },
    { days: "Sunday", time: "11:00 AM – 7:00 PM" },
  ],

  googleMapsLink:
    "https://www.google.com/maps?cid=11746207782635991944&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAEYASAB&hl=en&gl=CA&source=embed",

  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2389.9769899489197!2d-105.7397006232774!3d53.2003288722473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53017a65b9325e77%3A0xa302e9be85f27388!2sAsian%20Le!5e0!3m2!1sen!2sca!4v1773018326281!5m2!1sen!2sca",

  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=100027589556980",
    skipthedishes: "https://www.skipthedishes.com/asian-le-1400-6",
    tripadvisor:
      "https://www.tripadvisor.com/Restaurant_Review-g155041-d4881805-Reviews-Asian_Le-Prince_Albert_Saskatchewan.html",
    restaurantguru: "https://restaurantguru.com/Asian-Le-Prince-Albert",
  },
} as const;

export type StoreHours = { days: string; time: string }[];

export const menuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "item-1",
    description: "item-1 description",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    createdAt: new Date(),
  },
  {
    id: "item-2",
    name: "item-2",
    description: "item-2 description",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    createdAt: new Date(),
  },
  {
    id: "item-3",
    name: "item-3",
    description: "item-3 description",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    createdAt: new Date(),
  },
  {
    id: "item-4",
    name: "item-4",
    description: "item-4 description",
    price: 10.0,
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    createdAt: new Date(),
  },
];

export const foodCategories: FoodCategory[] = [
  {
    id: "category-1",
    name: "category-1",
    description: "category-1 description",
    itemIds: ["item-1", "item-2", "item-3", "item-4"],
    order: 1,
    createdAt: new Date(),
  },
  {
    id: "category-2",
    name: "category-2",
    description: "category-2 description",
    itemIds: ["item-1", "item-2", "item-3", "item-4"],
    order: 2,
    createdAt: new Date(),
  },
  {
    id: "category-3",
    name: "category-3",
    description: "category-3 description",
    itemIds: ["item-1", "item-2", "item-3", "item-4"],
    order: 3,
    createdAt: new Date(),
  },
];
