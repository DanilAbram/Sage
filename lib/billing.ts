import Stripe from "stripe";
import { one, run } from "./db";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

const idOf = (x: string | { id: string } | null | undefined) => (typeof x === "string" ? x : x?.id ?? null);
const LIVE = new Set(["active", "trialing"]);

/**
 * Store a subscription's CURRENT state (always fetched fresh from Stripe, so out-of-order webhooks can't
 * roll it back). A different subscription only replaces the stored one if the stored one is no longer live,
 * so an old subscription's "canceled" event can't lock out a user who is paying on a newer one.
 */
export async function syncSubscription(stripe: Stripe, subscriptionId: string) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const customer = idOf(sub.customer);
  if (!customer) return;
  const row = await one<{ id: number; sub_id: string | null; sub_status: string | null }>(
    "SELECT id, sub_id, sub_status FROM users WHERE stripe_customer=?",
    customer,
  );
  if (!row) return;
  const storedIsOther = row.sub_id && row.sub_id !== sub.id;
  if (storedIsOther && LIVE.has(row.sub_status ?? "") && !LIVE.has(sub.status)) return;
  await run("UPDATE users SET sub_id=?, sub_status=? WHERE id=?", sub.id, sub.status, row.id);
}

/** After checkout: link the Stripe customer to our user, then store the subscription's current state. */
export async function linkCheckout(stripe: Stripe, userId: number, session: Stripe.Checkout.Session) {
  const customer = idOf(session.customer);
  const subscription = idOf(session.subscription);
  if (!customer) return;
  await run("UPDATE users SET stripe_customer=? WHERE id=?", customer, userId);
  if (subscription) await syncSubscription(stripe, subscription);
}
