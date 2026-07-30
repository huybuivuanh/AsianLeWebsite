export type DiscoverMenuItem = {
  name: string;
  description: string;
  image: string;
};

export const MENU_INTRO =
  "Whether you’re stopping in for lunch or sharing dinner with friends, explore a menu full of comforting favorites and fresh flavors—crafted to satisfy every craving.";

export const APPETIZERS: DiscoverMenuItem[] = [
  {
    name: "Vietnamese Spring Rolls",
    description:
      "Crispy rolls filled with seasoned pork and vegetables, served with our house fish-sauce dipping vinaigrette.",
    image: "/home/discover/Spring Rolls.png",
  },
  {
    name: "Vietnamese Salad Rolls",
    description:
      "Fresh rice-paper rolls filled with rice noodles, crisp lettuce, and shrimp, served with our creamy peanut dipping sauce.",
    image: "/home/discover/Salad Rolls.jpg",
  },
  {
    name: "Boneless Dry Ribs",
    description:
      "Tender pork bites, lightly breaded and deep-fried until golden and crisp.",
    image: "/home/discover/Dry Ribs.jpg",
  },
  {
    name: "Deep Fried Shrimps",
    description:
      "Lightly battered shrimp, fried to a crisp and served with sweet & sour sauce.",
    image: "/home/discover/Shrimps.jpg",
  },
  {
    name: "Chicken Balls",
    description: "Crispy chicken balls served with classic sweet & sour sauce.",
    image: "/home/discover/Chicken Balls.jpg",
  },
  {
    name: "Deluxe Wonton Soup",
    description:
      "A comforting, savory broth with tender wontons, shrimp, pork, and garden vegetables.",
    image: "/home/discover/Wonton Soup.png",
  },
];

export const MAIN_COURSES: DiscoverMenuItem[] = [
  {
    name: "Vermicelli Combo",
    description:
      "Rice vermicelli with lettuce, cucumber, and bean sprouts, topped with a mix of chicken, beef, pork, shrimp, plus a spring roll. Finished with fish sauce and crushed peanuts.",
    image: "/home/discover/Vermicelli Combo.jpg",
  },
  {
    name: "Special Bird Nest",
    description:
      "Crispy egg noodles topped with a savory mix of chicken, beef, pork, and shrimp.",
    image: "/home/discover/Special Bnest.jpg",
  },
  {
    name: "Dinner For One",
    description:
      "A satisfying combo of an egg roll or spring roll, chicken fried rice, and boneless dry ribs.",
    image: "/home/discover/DN1B.png",
  },
  {
    name: "Butter Garlic Fried Shrimps",
    description:
      "Lightly battered shrimp, fried crisp and tossed in rich butter-garlic sauce.",
    image: "/home/discover/Butter Shrimps.jpg",
  },
  {
    name: "Chicken Fried Rice",
    description:
      "Our signature fried rice, wok-tossed with eggs, carrots, and tender chicken.",
    image: "/home/discover/Fried Rice.png",
  },
  {
    name: "Singapore Noodles",
    description:
      "Stir-fried noodles tossed with curry seasoning, mixed vegetables, bean sprouts, and a combination of chicken, beef, pork, and shrimp.",
    image: "/home/discover/Singapore Noodles.jpg",
  },
];
