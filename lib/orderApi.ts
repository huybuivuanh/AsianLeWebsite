import type { TakeOutFulfillmentKind } from "@/types/enum";

/**
 * Request/response shapes of this site's API routes — the one contract shared by the
 * route handlers (app/api/**) and the browser code that calls them. Every error
 * response is `ApiError` with a non-2xx status.
 */

export type ApiError = { error: string };

/** Pickup as sent over the wire: "YYYY-MM-DD" + "HH:mm" for scheduled. The saved Order
 * stores a real `scheduledAt` Date instead, worked out on the server. */
export type FulfillmentWire =
  | { kind: TakeOutFulfillmentKind.Immediate }
  | { kind: TakeOutFulfillmentKind.Scheduled; date: string; time: string };

export type CartOptionRequest = { optionId: string; quantity: number };

export type CartLineRequest = {
  menuItemId: string;
  quantity: number;
  options: CartOptionRequest[];
  instructions?: string;
};

// --- POST /api/orders ---

export type PlaceOrderRequest = {
  lines: CartLineRequest[];
  fulfillment: FulfillmentWire;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  /** Sign-in token from the rewards project, to link a member for points. */
  rewardsIdToken?: string;
  /** $5-off steps (100 points each) the member wants to use. */
  redeemSteps?: number;
};

export type PlaceOrderResponse = {
  orderId: string;
  orderNumber: string;
  taxBreakDown: OrderTaxBreakDown;
  fulfillment: FulfillmentWire;
};

// --- POST /api/cart/availability ---

export type CartAvailabilityRequest = {
  lines: Pick<CartLineRequest, "menuItemId" | "options">[];
};

export type LineAvailabilityResult = {
  itemAvailable: boolean;
  unavailableOptionIds: string[];
  /** Per-unit price INCLUDING selected options (same as CartLine.price) — null when the
   * item itself is missing, since a price means nothing then. */
  currentPrice: number | null;
};

export type CartAvailabilityResponse = { results: LineAvailabilityResult[] };

// --- POST /api/rewards/points ---

export type RewardsPointsRequest = { rewardsIdToken: string };

export type RewardsPointsResponse = {
  balance: number;
  /** Points already promised on the member's other open online orders. */
  pending: number;
  available: number;
};
