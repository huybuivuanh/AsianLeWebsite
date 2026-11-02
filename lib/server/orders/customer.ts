import "server-only";

// Customer contact details, shared by the order-writing routes (/api/orders, /api/reservations).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CustomerInfo = { customerName: string; phoneNumber: string; customerEmail: string };

type CustomerInput = { customerName?: unknown; phoneNumber?: unknown; customerEmail?: unknown };

/** Trims and validates name/phone/email — returns an error message, or the clean values. */
export function parseCustomerInfo(body: CustomerInput): CustomerInfo | { error: string } {
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
  if (!customerName) return { error: "Name is required" };
  if (!phoneNumber) return { error: "Phone number is required" };

  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  if (!customerEmail) return { error: "Email is required" };
  if (!EMAIL_RE.test(customerEmail)) return { error: "Invalid email address" };

  return { customerName, phoneNumber, customerEmail };
}
