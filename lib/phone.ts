import type { User } from "@supabase/supabase-js";

const FAKE_EMAIL_DOMAIN = "sotiemchobe.internal";
const VN_MOBILE_RE = /^\+84(3|5|7|8|9)\d{8}$/;

/**
 * Normalizes common Vietnamese phone input formats (0912345678,
 * 84912345678, +84 912 345 678, with spaces/dashes) to canonical E.164
 * (+84xxxxxxxxx). Returns null if the input isn't a valid VN mobile number.
 */
export function normalizePhoneVN(input: string): string | null {
  const stripped = input.trim().replace(/[^\d+]/g, "");

  let e164: string;
  if (stripped.startsWith("+84")) {
    e164 = stripped;
  } else if (stripped.startsWith("84")) {
    e164 = `+${stripped}`;
  } else if (stripped.startsWith("0")) {
    e164 = `+84${stripped.slice(1)}`;
  } else {
    return null;
  }

  return VN_MOBILE_RE.test(e164) ? e164 : null;
}

/** Deterministic mapping: same phone always maps to the same fake email. */
export function phoneToFakeEmail(e164Phone: string): string {
  return `${e164Phone.replace("+", "")}@${FAKE_EMAIL_DOMAIN}`;
}

export function isInternalFakeEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith(`@${FAKE_EMAIL_DOMAIN}`);
}

/** Never show the internal fake email — show the real phone for phone accounts. */
export function getDisplayIdentity(user: User): string {
  if (user.user_metadata?.auth_method === "phone" && user.user_metadata?.phone) {
    return user.user_metadata.phone as string;
  }
  return user.email ?? "";
}
