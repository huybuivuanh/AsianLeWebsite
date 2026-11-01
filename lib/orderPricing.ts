// Saskatchewan restaurant meal tax rates, confirmed with the business owner.
// Matches AsianLePOS's domain/order/orderCalculations.ts naming (calculateTaxBreakdown,
// OrderTaxBreakDown field names/order) — different Firebase project, just a consistent vocabulary.
import { DiscountType } from "@/types/enum";

export const GST_RATE = 0.05;
export const PST_RATE = 0.06;

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Taxes and total. An optional dollar discount (rewards points) comes off before tax, in
 * the POS's shape (`discount.taxableSubtotal`), and never takes the order below $0.
 */
export function calculateTaxBreakdown(subTotal: number, discountDollars = 0): OrderTaxBreakDown {
  const roundedSubTotal = roundToCents(subTotal);
  const discountAmount = roundToCents(Math.min(roundedSubTotal, Math.max(0, discountDollars)));
  const taxableSubtotal = roundToCents(roundedSubTotal - discountAmount);
  const pst = roundToCents(taxableSubtotal * PST_RATE);
  const gst = roundToCents(taxableSubtotal * GST_RATE);
  const total = roundToCents(taxableSubtotal + pst + gst);
  const base = { subTotal: roundedSubTotal, pst, gst, total };
  if (discountAmount <= 0) return base;
  return {
    ...base,
    discount: {
      discountType: DiscountType.Amount,
      discountValue: discountAmount,
      discountAmount,
      taxableSubtotal,
    },
  };
}

/** Pre-tax amount after any discount — what rewards points are earned on. */
export function taxableSubtotalOf(taxBreakDown: OrderTaxBreakDown): number {
  return taxBreakDown.discount?.taxableSubtotal ?? taxBreakDown.subTotal;
}
