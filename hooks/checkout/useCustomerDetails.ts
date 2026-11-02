import { useState } from "react";
import { extractTenDigitPhoneFromPaste } from "@/lib/utils";

/**
 * Name / phone / email at checkout. When a rewards member signs in, fills them in from
 * their profile (blank profile fields are skipped) — once per sign-in, so the customer's
 * later edits, and live points updates to the member doc, don't overwrite anything.
 */
export function useCustomerDetails(member: RewardsMember | null) {
  const [name, setName] = useState("");
  /** 10 digits, no country code. */
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Done while rendering (not in an effect) so the filled-in values show on the same render.
  const memberId = member?.id ?? null;
  const [filledForMemberId, setFilledForMemberId] = useState<string | null>(null);
  if (memberId !== filledForMemberId) {
    setFilledForMemberId(memberId);
    if (member) {
      if (member.name) setName(member.name);
      const memberPhone = extractTenDigitPhoneFromPaste(member.phone);
      if (memberPhone) setPhone(memberPhone);
      if (member.email) setEmail(member.email);
    }
  }

  return { name, setName, phone, setPhone, email, setEmail };
}
