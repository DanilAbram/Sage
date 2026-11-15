import crypto from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { one, run } from "./db";

const COOKIE = "sage_session";
const DAYS = 30;
const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export type User = {
  id: number;
  email: string;
  stripeCustomer: string | null;
  subId: string | null;
  subStatus: string | null;
};

export const isSubscribed = (u: User | null) => !!u && (u.subStatus === "active" || u.subStatus === "trialing");

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// Used when the email is unknown, so a login takes the same time whether or not the account exists.
const DUMMY_HASH = `${"00".repeat(16)}:${"00".repeat(64)}`;

export async function verifyPassword(password: string, stored: string | null) {
  const [s, h] = (stored ?? DUMMY_HASH).split(":");
  if (!s || !h) return false;
  const expected = Buffer.from(h, "hex");
  const actual = await scrypt(password, Buffer.from(s, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected) && stored !== null;
}

const sha = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export async function startSession(userId: number) {
  const jar = await cookies();
  // rotate: drop any session this browser already had, and clean up expired rows
  const old = jar.get(COOKIE)?.value;
  if (old) await run("DELETE FROM sessions WHERE token_hash=?", sha(old));
  await run("DELETE FROM sessions WHERE expires_at < ?", Date.now());

  const token = crypto.randomBytes(32).toString("base64url");
  const expires = Date.now() + DAYS * 86400_000;
  await run("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)", sha(token), userId, expires);
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await run("DELETE FROM sessions WHERE token_hash=?", sha(token));
  jar.delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = await one<{ id: number; email: string; stripe_customer: string | null; sub_id: string | null; sub_status: string | null }>(
    `SELECT u.id, u.email, u.stripe_customer, u.sub_id, u.sub_status
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
    sha(token),
    Date.now(),
  );
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    stripeCustomer: row.stripe_customer,
    subId: row.sub_id,
    subStatus: row.sub_status,
  };
}

export function publicUser(u: User | null) {
  return u
    ? {
        email: u.email,
        subscribed: isSubscribed(u),
        status: u.subStatus,
        // can open Stripe's portal (e.g. to fix a failed card while past_due)
        hasBilling: !!u.stripeCustomer,
        // has had a subscription before, so no second free trial
        trialUsed: !!u.subId,
      }
    : null;
}
