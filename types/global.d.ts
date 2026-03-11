declare global {
  interface FoodCategory {
    id: string;
    name: string;
    description?: string;
    itemIds?: string[];
    order: number;
    createdAt: Date;
  }

  interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryIds?: string[];
    createdAt: Date;
  }

  interface DailySpecialItem extends MenuItem {
    options?: string[];
  }

  interface DailySpecial {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    items: DailySpecialItem[];
    createdAt: Date;
  }
}

export {};
