import { currentUser, isSubscribed } from "@/lib/auth";
import { cleanCareer, type Career } from "@/lib/careers";
import { db } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!isSubscribed(user)) return Response.json({ error: "subscribe" }, { status: 403 });
  const rows = db()
    .prepare("SELECT id, text, result, created_at FROM searches WHERE user_id=? ORDER BY id DESC LIMIT 20")
    .all(user!.id) as { id: number; text: string; result: string; created_at: number }[];
  const items = rows.map((r) => {
    let careers: Career[] = [];
    try {
      careers = (JSON.parse(r.result) as unknown[]).map(cleanCareer).filter((c): c is Career => !!c);
    } catch {}
    return { id: r.id, text: r.text, careers, at: r.created_at };
  });
  return Response.json({ items });
}
