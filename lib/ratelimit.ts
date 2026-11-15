import { one, run } from "./db";

// Rate limiter stored in the database, so it holds across every server instance (Vercel runs many).
// If the database is unreachable it fails open, so a database hiccup never locks visitors out.
const MAX_WINDOW = 3600_000;

export async function rateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  try {
    // now and then, clear every old hit; otherwise only this key's
    if (Math.random() < 0.02) await run("DELETE FROM rate_hits WHERE at < ?", now - MAX_WINDOW);
    else await run("DELETE FROM rate_hits WHERE key = ? AND at < ?", key, now - windowMs);
    await run("INSERT INTO rate_hits(key, at) VALUES(?, ?)", key, now);
    const row = await one<{ n: number | string }>("SELECT COUNT(*) AS n FROM rate_hits WHERE key = ? AND at >= ?", key, now - windowMs);
    return Number(row?.n ?? 0) > max;
  } catch (e) {
    console.error("rate limit check failed", e);
    return false;
  }
}

/**
 * Client IP for rate limiting. The LEFT-most x-forwarded-for entry is whatever the client sent, so it is
 * spoofable; the RIGHT-most entry is the one added by the proxy closest to us. If your host sets a trusted
 * single-IP header (e.g. "x-real-ip"), name it in TRUSTED_IP_HEADER.
 */
export function clientIp(request: Request) {
  const trusted = process.env.TRUSTED_IP_HEADER;
  if (trusted) {
    const v = request.headers.get(trusted)?.trim();
    if (v) return v;
  }
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "local";
}
