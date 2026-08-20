// Saskatchewan restaurant meal tax rates, confirmed with the business owner.
// Matches AsianLePOS's domain/order/orderCalculations.ts naming (calculateTaxBreakdown,
// OrderTaxBreakDown field names/order) — different Firebase project, just a consistent vocabulary.
export const GST_RATE = 0.05;
export const PST_RATE = 0.06;

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateTaxBreakdown(subTotal: number): OrderTaxBreakDown {
  const roundedSubTotal = roundToCents(subTotal);
  const pst = roundToCents(roundedSubTotal * PST_RATE);
  const gst = roundToCents(roundedSubTotal * GST_RATE);
  const total = roundToCents(roundedSubTotal + pst + gst);
  return { subTotal: roundedSubTotal, pst, gst, total };
}
