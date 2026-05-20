import { createHmac, timingSafeEqual } from "node:crypto";
import type { HandlerEvent } from "@netlify/functions";

const COOKIE_NAME = "portfolio_owner";
const HMAC_PAYLOAD = "portfolio-owner-v1";

export function expectedOwnerToken(ownerSecret: string): string {
  return createHmac("sha256", ownerSecret).update(HMAC_PAYLOAD).digest("hex");
}

export function parseOwnerCookie(
  cookieHeader: string | undefined,
  ownerSecret: string | undefined,
): boolean {
  if (!cookieHeader || !ownerSecret) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match?.[1]) return false;
  const got = match[1].trim();
  const expected = expectedOwnerToken(ownerSecret);
  try {
    const a = Buffer.from(got, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** True if valid HttpOnly owner cookie or `Authorization: Bearer <secret>`. */
export function isOwnerRequest(event: HandlerEvent): boolean {
  const secret = process.env.PORTFOLIO_OWNER_SECRET;
  if (!secret) return false;

  const auth = event.headers.authorization?.trim();
  if (auth === `Bearer ${secret}`) return true;

  return parseOwnerCookie(event.headers.cookie, secret);
}

export function ownerSetCookieHeader(ownerSecret: string): string {
  const token = expectedOwnerToken(ownerSecret);
  const maxAge = 60 * 60 * 24 * 365;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
