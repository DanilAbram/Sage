import Stripe from "stripe";
import { linkCheckout, syncSubscription, stripeClient } from "@/lib/billing";

// Stripe calls this when a subscription changes (renewal, cancel, failed payment...).
// Needs STRIPE_WEBHOOK_SECRET. Locally: `stripe listen --forward-to localhost:3100/api/stripe/webhook`.
export async function POST(request: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  if (!stripe || !secret || !sig) return Response.json({ error: "not_configured" }, { status: 503 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), sig, secret);
  } catch {
    return Response.json({ error: "bad_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = Number(s.client_reference_id);
      if (userId && s.mode === "subscription") await linkCheckout(stripe, userId, s);
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.paused" ||
      event.type === "customer.subscription.resumed"
    ) {
      // re-read the subscription from Stripe instead of trusting this (possibly stale) event payload
      await syncSubscription(stripe, (event.data.object as Stripe.Subscription).id);
    }
  } catch (e) {
    console.error("webhook handler error", e);
    return Response.json({ error: "handler" }, { status: 500 });
  }
  return Response.json({ received: true });
}
