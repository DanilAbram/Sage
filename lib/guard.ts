// Shared checks for state-changing (POST) routes: JSON body only, and same-origin when the browser says where
// the request came from. Blocks cross-site form posts (e.g. login CSRF with a text/plain form).
export function badRequestOrigin(request: Request): Response | null {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "bad_request" }, { status: 415 });
  }
  const origin = request.headers.get("origin");
  if (origin) {
    const allowed = new Set([new URL(request.url).origin]);
    if (process.env.NEXT_PUBLIC_SITE_URL) allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    if (!allowed.has(origin)) return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}

/** Base URL for links we hand to Stripe. Prefer a fixed site URL over the request's Host header. */
export function siteOrigin(request: Request) {
  const fixed =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return fixed ? new URL(fixed).origin : new URL(request.url).origin;
}
