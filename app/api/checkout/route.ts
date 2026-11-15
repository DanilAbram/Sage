import { currentUser, isSubscribed } from "@/lib/auth";
import { stripeClient } from "@/lib/billing";
import { badRequestOrigin, siteOrigin } from "@/lib/guard";

// Starts a Stripe Checkout subscription for the signed-in user. The 7-day free trial is only for people who
// have never subscribed before. Needs STRIPE_SECRET_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY.
export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;
  const user = await currentUser();
  if (!user) return Response.json({ error: "login" }, { status: 401 });
  if (isSubscribed(user)) return Response.json({ error: "already" }, { status: 409 });
  // a subscription that still exists but has a payment problem is fixed in the billing portal, not re-bought
  if (user.subStatus === "past_due" || user.subStatus === "unpaid" || user.subStatus === "incomplete") {
    return Response.json({ error: "use_portal" }, { status: 409 });
  }

  let plan = "";
  try {
    plan = String((await request.json())?.plan ?? "");
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const price = plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : plan === "monthly" ? process.env.STRIPE_PRICE_MONTHLY : undefined;
  const stripe = stripeClient();
  if (!stripe || !price) return Response.json({ error: "not_configured" }, { status: 503 });

  try {
    const origin = siteOrigin(request);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      ...(user.subId ? {} : { subscription_data: { trial_period_days: 7 } }),
      client_reference_id: String(user.id),
      ...(user.stripeCustomer ? { customer: user.stripeCustomer } : { customer_email: user.email }),
      custom_text: {
        submit: {
          message: user.subId
            ? "You can cancel any time from Manage subscription in your Sage account."
            : "7 days free, then the plan price. Cancel before the trial ends from Manage subscription and you pay nothing.",
        },
      },
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("checkout error", e);
    return Response.json({ error: "stripe" }, { status: 502 });
  }
}
