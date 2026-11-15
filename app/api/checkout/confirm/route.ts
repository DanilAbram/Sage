import { currentUser, publicUser } from "@/lib/auth";
import { linkCheckout, stripeClient } from "@/lib/billing";
import { badRequestOrigin } from "@/lib/guard";

// Called when the user returns from Stripe. Asks Stripe directly, so access works even before the webhook arrives.
export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;
  const user = await currentUser();
  if (!user) return Response.json({ error: "login" }, { status: 401 });
  const stripe = stripeClient();
  if (!stripe) return Response.json({ error: "not_configured" }, { status: 503 });

  let id = "";
  try {
    id = String((await request.json())?.sessionId ?? "");
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return Response.json({ error: "bad_request" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    // only accept completed subscription sessions that belong to this signed-in user
    if (session.client_reference_id !== String(user.id)) return Response.json({ error: "forbidden" }, { status: 403 });
    if (session.mode !== "subscription" || session.status !== "complete") {
      return Response.json({ error: "incomplete", user: publicUser(user) }, { status: 409 });
    }
    await linkCheckout(stripe, user.id, session);
    return Response.json({ user: publicUser(await currentUser()) });
  } catch (e) {
    console.error("confirm error", e);
    return Response.json({ error: "stripe" }, { status: 502 });
  }
}
