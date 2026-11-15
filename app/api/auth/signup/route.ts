import { isUniqueViolation, one } from "@/lib/db";
import { hashPassword, startSession, publicUser, currentUser } from "@/lib/auth";
import { clientIp, rateLimited } from "@/lib/ratelimit";
import { badRequestOrigin } from "@/lib/guard";

export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;
  if (await rateLimited("signup:" + clientIp(request), 10, 3600_000)) return Response.json({ error: "limit" }, { status: 429 });

  let email = "", password = "";
  try {
    const b = await request.json();
    email = String(b?.email ?? "").trim().toLowerCase();
    password = String(b?.password ?? "");
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return Response.json({ error: "email" }, { status: 400 });
  if (password.length < 8 || password.length > 200) return Response.json({ error: "password" }, { status: 400 });

  let userId: number;
  try {
    const r = await one<{ id: number }>(
      "INSERT INTO users(email,pass,created_at) VALUES(?,?,?) RETURNING id",
      email,
      await hashPassword(password),
      Date.now(),
    );
    userId = Number(r?.id);
  } catch (e) {
    if (isUniqueViolation(e)) return Response.json({ error: "exists" }, { status: 409 });
    console.error("signup error", e);
    return Response.json({ error: "server" }, { status: 500 });
  }
  try {
    await startSession(userId);
  } catch (e) {
    // account exists; the user can sign in normally
    console.error("signup session error", e);
    return Response.json({ error: "server" }, { status: 500 });
  }
  return Response.json({ user: publicUser(await currentUser()) });
}
