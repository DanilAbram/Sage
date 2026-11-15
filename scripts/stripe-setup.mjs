// One-time Stripe setup for Sage (TEST mode only).
//   node --env-file=.env.local scripts/stripe-setup.mjs
// Creates (or reuses) the "Sage Full Report" product with a monthly and a yearly price, makes sure the
// customer billing portal is configured, and writes STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY into .env.local.
// It never prints the secret key. Prices must match PRICE in lib/i18n.ts.
import Stripe from "stripe";
import { readFileSync, writeFileSync } from "node:fs";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!key) {
  console.error("STRIPE_SECRET_KEY is missing in .env.local.");
  process.exit(1);
}
if (!/^(sk|rk)_test_/.test(key)) {
  console.error("This script only runs with a TEST key (sk_test_…). Switch Stripe to Test mode and copy that key.");
  process.exit(1);
}
const stripe = new Stripe(key);

const PRICES = [
  { lookup: "sage_monthly", amount: 499, interval: "month", env: "STRIPE_PRICE_MONTHLY", label: "Monthly" },
  { lookup: "sage_yearly", amount: 2999, interval: "year", env: "STRIPE_PRICE_YEARLY", label: "Yearly" },
];

// product: reuse the one this script made before
const existing = await stripe.products.search({ query: "metadata['app']:'sage' AND active:'true'" });
const product =
  existing.data[0] ??
  (await stripe.products.create({
    name: "Sage Full Report",
    description: "Five careers per search, a typical day, the study route, a 4-week plan, and saved history.",
    metadata: { app: "sage" },
  }));
console.log(`Product: ${product.name} (${product.id})`);

const ids = {};
for (const p of PRICES) {
  const found = await stripe.prices.list({ lookup_keys: [p.lookup], active: true, limit: 1 });
  let price = found.data[0];
  const ok = price && price.unit_amount === p.amount && price.currency === "usd" && price.recurring?.interval === p.interval;
  if (!ok) {
    price = await stripe.prices.create({
      product: product.id,
      currency: "usd",
      unit_amount: p.amount,
      recurring: { interval: p.interval },
      lookup_key: p.lookup,
      transfer_lookup_key: true,
      nickname: `Sage ${p.label}`,
    });
  }
  ids[p.env] = price.id;
  console.log(`${p.label}: $${(p.amount / 100).toFixed(2)}/${p.interval} → ${price.id}`);
}

// billing portal: needed for "Manage subscription" (cancel, change card, invoices)
const portals = await stripe.billingPortal.configurations.list({ is_default: true, limit: 1 });
if (!portals.data.length) {
  await stripe.billingPortal.configurations.create({
    business_profile: { headline: "Manage your Sage subscription" },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: "at_period_end" },
    },
  });
  console.log("Billing portal: configured");
} else {
  console.log("Billing portal: already configured");
}

// write the price IDs into .env.local (replace existing lines, or add them)
let env = readFileSync(".env.local", "utf8");
for (const [name, value] of Object.entries(ids)) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  env = re.test(env) ? env.replace(re, line) : `${env.replace(/\n?$/, "\n")}${line}\n`;
}
writeFileSync(".env.local", env);
console.log("Saved the price IDs to .env.local. Restart the dev server to use them.");
