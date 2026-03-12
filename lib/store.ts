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
    { days: "Holidays", time: "Closed" },
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

export const DAILY_SPECIALS: DailySpecial[] = [];

// export const DAILY_SPECIALS: DailySpecial[] = [
//   {
//     id: "monday",
//     dayOfWeek: 1,
//     timeRange: {
//       startTime: new Date(1970, 0, 1, 11, 0),
//       endTime: new Date(1970, 0, 1, 14, 0),
//     },
//     createdAt: new Date(),
//     items: [
//       {
//         id: "#1",
//         name: "#1 - Stir Fried Chicken Vermicelli With One Spring Roll",
//         price: 10.95,
//         image: {
//           name: "Stir Fried Chicken Vermicelli",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#2",
//         name: "#2 - Medium Deluxe Wonton Soup",
//         price: 8.95,
//         image: {
//           name: "Wonton Soup",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#3",
//         name: "#3 - Combo: Egg Roll or Spring roll, Chicken Fried Rice, Mixed Vegetables and a choice of:",
//         options: [
//           "Chicken Balls",
//           "Boneless Dry Ribs",
//           "Ginger Chicken(Sauce on the side)",
//         ],
//         price: 10.95,
//         image: {
//           name: "Combo plate",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   },
//   {
//     id: "tuesday",
//     dayOfWeek: 2,
//     timeRange: {
//       startTime: new Date(1970, 0, 1, 11, 0),
//       endTime: new Date(1970, 0, 1, 14, 0),
//     },
//     createdAt: new Date(),
//     items: [
//       {
//         id: "#1",
//         name: "#1 - Stir Fried Chicken Vermicelli With One Spring Roll",
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#2",
//         name: "#2 - Medium Deluxe Wonton Soup",
//         price: 8.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#3",
//         name: "#3 - Combo: Egg Roll or Spring roll, Chicken Fried Rice, Mixed Vegetables and a choice of:",
//         options: [
//           "Chicken Balls",
//           "Boneless Dry Ribs",
//           "Ginger Chicken(Sauce on the side)",
//         ],
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   },
//   {
//     id: "wednesday",
//     dayOfWeek: 3,
//     timeRange: {
//       startTime: new Date(1970, 0, 1, 11, 0),
//       endTime: new Date(1970, 0, 1, 14, 0),
//     },
//     createdAt: new Date(),
//     items: [
//       {
//         id: "#1",
//         name: "#1 - Stir Fried Chicken Vermicelli With One Spring Roll",
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#2",
//         name: "#2 - Medium Deluxe Wonton Soup",
//         price: 8.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#3",
//         name: "#3 - Combo: Egg Roll or Spring roll, Chicken Fried Rice, Mixed Vegetables and a choice of:",
//         options: [
//           "Chicken Balls",
//           "Boneless Dry Ribs",
//           "Ginger Chicken(Sauce on the side)",
//         ],
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   },
//   {
//     id: "thursday",
//     dayOfWeek: 4,
//     timeRange: {
//       startTime: new Date(1970, 0, 1, 11, 0),
//       endTime: new Date(1970, 0, 1, 14, 0),
//     },
//     createdAt: new Date(),
//     items: [
//       {
//         id: "#1",
//         name: "#1 - Stir Fried Chicken Vermicelli With One Spring Roll",
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#2",
//         name: "#2 - Medium Deluxe Wonton Soup",
//         price: 8.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#3",
//         name: "#3 - Combo: Egg Roll or Spring roll, Chicken Fried Rice, Mixed Vegetables and a choice of:",
//         options: [
//           "Chicken Balls",
//           "Boneless Dry Ribs",
//           "Ginger Chicken(Sauce on the side)",
//         ],
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   },
//   {
//     id: "friday",
//     dayOfWeek: 5,
//     timeRange: {
//       startTime: new Date(1970, 0, 1, 11, 0),
//       endTime: new Date(1970, 0, 1, 14, 0),
//     },
//     createdAt: new Date(),
//     items: [
//       {
//         id: "#1",
//         name: "#1 - Stir Fried Chicken Vermicelli With One Spring Roll",
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#2",
//         name: "#2 - Medium Deluxe Wonton Soup",
//         price: 8.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//       {
//         id: "#3",
//         name: "#3 - Combo: Egg Roll or Spring roll, Chicken Fried Rice, Mixed Vegetables and a choice of:",
//         options: [
//           "Chicken Balls",
//           "Boneless Dry Ribs",
//           "Ginger Chicken(Sauce on the side)",
//         ],
//         price: 10.95,
//         image: {
//           name: "",
//           url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   },
// ];
