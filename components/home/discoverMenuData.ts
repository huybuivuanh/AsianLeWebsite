/** Home page "Our menu" favourites. Static copy — the full menu lives in Firestore. */
export type MenuHighlight = {
  name: string;
  category: "Appetizer" | "Soup" | "Main course";
  description: string;
  image: string;
};

export const HIGHLIGHTS: MenuHighlight[] = [
  {
    name: "Vietnamese Spring Rolls",
    category: "Appetizer",
    description:
      "Crispy rolls filled with seasoned pork and vegetables, with our house fish-sauce dipping vinaigrette.",
    image: "/home/discover/Spring Rolls.png",
  },
  {
    name: "Vietnamese Salad Rolls",
    category: "Appetizer",
    description:
      "Rice-paper rolls with rice noodles, crisp lettuce and shrimp, with creamy peanut sauce.",
    image: "/home/discover/Salad Rolls.jpg",
  },
  {
    name: "Boneless Dry Ribs",
    category: "Appetizer",
    description: "Tender pork bites, lightly breaded and deep-fried until golden and crisp.",
    image: "/home/discover/Dry Ribs.jpg",
  },
  {
    name: "Deluxe Wonton Soup",
    category: "Soup",
    description: "A comforting broth with tender wontons, shrimp, pork and garden vegetables.",
    image: "/home/discover/Wonton Soup.png",
  },
  {
    name: "Vermicelli Combo",
    category: "Main course",
    description:
      "Rice vermicelli topped with chicken, beef, pork and shrimp, plus a spring roll, fish sauce and crushed peanuts.",
    image: "/home/discover/Vermicelli Combo.jpg",
  },
  {
    name: "Special Bird Nest",
    category: "Main course",
    description: "Crispy egg noodles topped with a savory mix of chicken, beef, pork and shrimp.",
    image: "/home/discover/Special Bnest.jpg",
  },
  {
    name: "Butter Garlic Fried Shrimps",
    category: "Main course",
    description: "Lightly battered shrimp, fried crisp and tossed in rich butter-garlic sauce.",
    image: "/home/discover/Butter Shrimps.jpg",
  },
  {
    name: "Singapore Noodles",
    category: "Main course",
    description:
      "Stir-fried noodles with curry seasoning, vegetables, bean sprouts, chicken, beef, pork and shrimp.",
    image: "/home/discover/Singapore Noodles.jpg",
  },
];
