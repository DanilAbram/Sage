import { db } from "@/lib/db";
import { verifyPassword, startSession, publicUser, currentUser } from "@/lib/auth";
import { clientIp, rateLimited } from "@/lib/ratelimit";
import { badRequestOrigin } from "@/lib/guard";

export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;

  let email = "", password = "";
  try {
    const b = await request.json();
    email = String(b?.email ?? "").trim().toLowerCase().slice(0, 200);
    password = String(b?.password ?? "").slice(0, 200);
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // per network AND per account, so changing IPs doesn't allow guessing one account's password
  const ipLimited = rateLimited("login-ip:" + clientIp(request), 20, 900_000);
  const acctLimited = rateLimited("login-acct:" + email, 10, 900_000);
  if (ipLimited || acctLimited) return Response.json({ error: "limit" }, { status: 429 });

  const row = db().prepare("SELECT id, pass FROM users WHERE email=?").get(email) as { id: number; pass: string } | undefined;
  // always runs the hash check (against a dummy when the email is unknown) so timing doesn't reveal accounts
  const ok = await verifyPassword(password, row?.pass ?? null);
  if (!row || !ok) return Response.json({ error: "invalid" }, { status: 401 });
  await startSession(row.id);
  return Response.json({ user: publicUser(await currentUser()) });
}
