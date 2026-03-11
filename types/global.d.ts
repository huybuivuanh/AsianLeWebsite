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
    timeRange: TimeRange;
    items: DailySpecialItem[];
    createdAt: Date;
  }

  interface TimeRange {
    startTime: Date;
    endTime: Date;
  }
}

export {};
