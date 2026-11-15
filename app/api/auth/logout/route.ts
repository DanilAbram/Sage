import { endSession } from "@/lib/auth";
import { badRequestOrigin } from "@/lib/guard";

export async function POST(request: Request) {
  const bad = badRequestOrigin(request);
  if (bad) return bad;
  await endSession();
  return Response.json({ ok: true });
}
