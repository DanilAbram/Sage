import { currentUser } from "@/lib/auth";
import { stripeClient } from "@/lib/billing";
import { badRequestOrigin, siteOrigin } from "@/lib/guard";

// Opens Stripe's billing portal so the user can cancel, fix a failed card, or see invoices.
export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;
  const user = await currentUser();
  if (!user) return Response.json({ error: "login" }, { status: 401 });
  const stripe = stripeClient();
  if (!stripe || !user.stripeCustomer) return Response.json({ error: "not_configured" }, { status: 503 });
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomer,
      return_url: siteOrigin(request) + "/",
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("portal error", e);
    return Response.json({ error: "stripe" }, { status: 502 });
  }
}
