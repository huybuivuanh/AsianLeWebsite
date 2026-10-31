// Shared by the order-writing API routes (/api/orders, /api/reservations).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hashes the Firestore doc id into a 6-digit number, purely for a short,
// easy-to-call-out pickup code — not a uniqueness guarantee.
export function orderNumberFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1_000_000;
  }
  return hash.toString().padStart(6, "0");
}

type CustomerInput = { customerName?: unknown; phoneNumber?: unknown; customerEmail?: unknown };

/** Trims and validates name/phone/email — returns an error message, or the clean values. */
export function parseCustomerInfo(
  body: CustomerInput,
):
  | { error: string }
  | { customerName: string; phoneNumber: string; customerEmail: string } {
  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";
  if (!customerName) return { error: "Name is required" };
  if (!phoneNumber) return { error: "Phone number is required" };

  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  if (!customerEmail) return { error: "Email is required" };
  if (!EMAIL_RE.test(customerEmail)) return { error: "Invalid email address" };

  return { customerName, phoneNumber, customerEmail };
}
