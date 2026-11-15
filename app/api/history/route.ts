import { currentUser, isSubscribed } from "@/lib/auth";
import { cleanCareer, type Career } from "@/lib/careers";
import { all } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!isSubscribed(user)) return Response.json({ error: "subscribe" }, { status: 403 });
  const rows = await all<{ id: number; text: string; result: string; created_at: number }>(
    "SELECT id, text, result, created_at FROM searches WHERE user_id=? ORDER BY id DESC LIMIT 20",
    user!.id,
  );
  const items = rows.map((r) => {
    let careers: Career[] = [];
    try {
      careers = (JSON.parse(r.result) as unknown[]).map(cleanCareer).filter((c): c is Career => !!c);
    } catch {}
    return { id: r.id, text: r.text, careers, at: r.created_at };
  });
  return Response.json({ items });
}
