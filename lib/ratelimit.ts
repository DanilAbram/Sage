// Simple in-memory rate limiter (per server process; resets on restart).
// Swap for a shared store (e.g. Redis) if you run several servers.
const hits = new Map<string, number[]>();
let lastSweep = Date.now();
const SWEEP_EVERY = 10 * 60_000;
const MAX_WINDOW = 3600_000;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_EVERY) return;
  lastSweep = now;
  for (const [key, times] of hits) {
    if (!times.length || now - times[times.length - 1] > MAX_WINDOW) hits.delete(key);
  }
}

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
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
