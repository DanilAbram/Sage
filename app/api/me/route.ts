import { currentUser, publicUser } from "@/lib/auth";

export async function GET() {
  return Response.json({ user: publicUser(await currentUser()) });
}
