import { getRealtime } from "@/lib/neon/server";
import { rawSql } from "@neon/realtime/server";

export async function POST() {
  const url = process.env.NEON_REALTIME_URL;
  if (!url) throw new Error("NEON_REALTIME_URL must be set.");
  const query = await getRealtime().seal({ query: rawSql<{ ok: number }>("SELECT 1::int AS ok") });
  return Response.json({ query, url }, { headers: { "Cache-Control": "no-store" } });
}
