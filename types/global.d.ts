import type {
  DayOfWeek,
  KitchenType,
  OrderStatus,
  TakeOutFulfillmentKind,
} from "@/types/enum";

declare global {
  interface FoodCategory {
    id: string;
    name: string;
    description?: string;
    itemIds?: string[];
    order: number;
    createdAt: Date;
  }

  interface ImageItem {
    id?: string;
    name: string;
    url: string;
  }

  interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: ImageItem;
    options?: string[];
    categoryIds?: string[];
    createdAt: Date;
  }
  interface DailySpecialItem {
    id: string;
    name: string;
    price: number;
    options?: string[];
    dayOfWeekIds?: string[];
    createdAt: Date;
  }
  interface DailySpecial {
    id: string;
    dayOfWeek: DayOfWeek;
    timeRange: TimeRange;
    itemIds?: string[];
    createdAt: Date;
  }
  interface TimeRange {
    startTime: string;
    endTime: string;
  }
  interface StoreHour {
    id: string;
    days: string;
    time: string;
    order: number;
  }

  // --- Ordering data model (demoCategories / demoMenuItems), see ecommerce.md ---

  interface MenuItemAvailability {
    start: string;
    end: string;
  }

  interface OptionGroupId {
    optionGroupId: string;
    order: number;
  }

  interface DemoCategory {
    id: string;
    name: string;
    description?: string;
    itemIds?: string[];
    order: number;
    createdAt: Date;
  }

  interface DemoMenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: ImageItem;
    optionGroupIds?: OptionGroupId[];
    categoryIds?: string[];
    kitchenType: KitchenType;
    availability?: MenuItemAvailability;
    soldOutUntil?: Date;
    createdAt: Date;
  }

  interface OptionGroup {
    id: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    multipleOptionQuantity: boolean;
    optionIds?: string[];
    itemIds?: string[];
    defaultOptionId?: string;
    createdAt: Date;
  }

  interface ItemOption {
    id: string;
    name: string;
    price: number;
    groupIds?: string[];
    availability?: MenuItemAvailability;
    soldOutUntil?: Date;
    createdAt: Date;
  }

  interface MenuVersion {
    version: number;
    lastUpdated: Date | null;
  }

  interface DayHours {
    isOpen: boolean;
    open: string;
    close: string;
  }

  interface Holiday {
    id: string;
    from: string;
    to?: string;
  }

  interface StoreSettings {
    pausedUntil: Date | null;
    timezone: string;
    waitTime: number;
    hours: {
      mon: DayHours;
      tue: DayHours;
      wed: DayHours;
      thu: DayHours;
      fri: DayHours;
      sat: DayHours;
      sun: DayHours;
    };
    holidays: Holiday[];
  }

  // --- Orders (written by this site, read by the separate admin app — see orders-schema.md).
  // Field names/enum values mirror the AsianLePOS app's Order model (a different Firebase
  // project — no shared data, just a consistent vocabulary), with a few extensions specific
  // to an unauthenticated online-ordering flow: `orderNumber`, `customerEmail`, and
  // `menuItemId` traceability back to demoMenuItems. ---

  interface OrderItemOption {
    name: string;
    price: number;
    quantity: number;
  }

  interface OrderItem {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    options?: OrderItemOption[];
    instructions?: string;
    kitchenType: KitchenType;
  }

  interface TaxBreakDown {
    subTotal: number;
    pst: number;
    gst: number;
    total: number;
  }

  type TakeOutFulfillment =
    | { kind: TakeOutFulfillmentKind.Immediate; readyTimeMinutes?: number }
    | { kind: TakeOutFulfillmentKind.Scheduled; scheduledAt: Date };

  interface Order {
    id?: string;
    orderNumber: string; // extension — short pickup code, POS has no analog (staff see the ticket directly)
    status: OrderStatus;
    fulfillment: TakeOutFulfillment;
    customerName: string;
    phoneNumber: string;
    customerEmail: string;
    orderItems: OrderItem[];
    printed: boolean;
    paid: boolean;
    taxBreakDown: TaxBreakDown;
    createdAt: Date;
  }
}

export {};
