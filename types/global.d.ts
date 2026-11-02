import type {
  DayOfWeek,
  DiscountType,
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

  /** Weekly per-day availability window for a MenuItem/ItemOption. A missing day key
   * means unavailable that day; an explicit `{}` (no day keys at all) means unavailable
   * every day — distinct from `undefined` on the item/option, which means unrestricted.
   * Matches the admin app's contract exactly, see its instruction.md. */
  interface Availability {
    mon?: TimeRange;
    tue?: TimeRange;
    wed?: TimeRange;
    thu?: TimeRange;
    fri?: TimeRange;
    sat?: TimeRange;
    sun?: TimeRange;
  }

  interface OptionGroupId {
    optionGroupId: string;
    order: number;
  }

  interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: ImageItem;
    options?: string[];
    optionGroupIds?: OptionGroupId[];
    categoryIds?: string[];
    kitchenType?: KitchenType;
    availability?: Availability;
    soldOutUntil?: Date;
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
    availability?: Availability;
    soldOutUntil?: Date;
    createdAt: Date;
  }

  interface DayHours {
    isOpen: boolean;
    open: string;
    close: string;
  }

  /** Open/close times for each weekday — store (online ordering) hours and reservation
   * hours both use this shape. */
  interface WeeklyHours {
    mon: DayHours;
    tue: DayHours;
    wed: DayHours;
    thu: DayHours;
    fri: DayHours;
    sat: DayHours;
    sun: DayHours;
  }

  interface Holiday {
    id: string;
    from: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD — if absent, single day
  }

  interface StoreSettings {
    pausedUntil: Date | null;
    timezone: string;
    waitTime: number;
    /** E.164, e.g. "+13065551234" — who the confirm-call Cloud Function calls. */
    restaurantPhoneNumber: string;
    hours: WeeklyHours;
    /** When tables can be booked online, per weekday (set in the website-admin app).
     * `close` is the LAST bookable time, e.g. 13:00–20:00. Missing in Firestore → every
     * day closed for reservations. Holidays and the pause switch apply too. */
    reservationHours: WeeklyHours;
    holidays: Holiday[];
  }

  // --- Orders (written by this site, read by the separate admin app — see that repo's
  // orders-schema.md for the full contract). Field names/enum values mirror the
  // AsianLePOS app's Order model (a different Firebase project — no shared data, just a
  // consistent vocabulary), with a few extensions specific to an unauthenticated
  // online-ordering flow: `orderNumber`, `customerEmail`, and `menuItemId` traceability
  // back to menuItems. ---

  interface OrderItemOption {
    name: string;
    price: number;
    quantity: number;
  }

  interface OrderItem {
    menuItemId: string;
    name: string;
    price: number; // per-unit price INCLUDING selected options
    quantity: number;
    options?: OrderItemOption[];
    instructions?: string;
    kitchenType: KitchenType;
  }

  /** Same shape as the POS's Discount (the receipt printer reads it). Online orders only
   * get an Amount discount, from rewards points. Taxes are on `taxableSubtotal`. */
  interface OrderDiscount {
    discountType: DiscountType;
    discountValue: number;
    discountAmount: number;
    taxableSubtotal: number;
  }

  interface OrderTaxBreakDown {
    subTotal: number;
    discount?: OrderDiscount;
    pst: number;
    gst: number;
    total: number;
  }

  type OrderFulfillment =
    | { kind: TakeOutFulfillmentKind.Immediate; readyTimeMinutes?: number }
    | { kind: TakeOutFulfillmentKind.Scheduled; scheduledAt: Date };

  /** Rewards member linked at checkout (asian-le-rewards project). Same field and names as
   * the POS's `order.loyalty`; the admin app adds the earn/reverse results when it calls the
   * rewards functions on Complete / Cancel. */
  interface OrderLoyalty {
    memberId: string;
    memberName: string;
    pointsEarned?: number;
    collectedAt?: Date;
    /** Points the customer chose to use at checkout (taxBreakDown.discount is the money
     * off). Not taken yet — the Orders app takes them on Complete and sets pointsRedeemed /
     * redeemedAmount (same names as the POS). */
    pointsToRedeem?: number;
    pointsRedeemed?: number;
    redeemedAmount?: number;
    reversedAt?: Date;
    pointsReversed?: number;
    reversePending?: boolean;
  }

  interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    fulfillment: OrderFulfillment;
    customerName: string;
    phoneNumber: string;
    customerEmail: string;
    orderItems: OrderItem[];
    taxBreakDown: OrderTaxBreakDown;
    loyalty?: OrderLoyalty;
    paid: boolean;
    printed: boolean;
    createdAt: Date;
    /** Written only by the confirmOrderCall Cloud Function (functions/), never by this app. */
    confirmationCallStatus?: "placed" | "failed";
    confirmationCallPlacedAt?: Date;
  }
}

export {};
