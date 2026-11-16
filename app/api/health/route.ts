import { getDatabase } from "@/lib/neon/server";

export async function GET() {
  const rows = await getDatabase()`SELECT 1::int AS ok`;
  return Response.json({ message: `Postgres query succeeded (SELECT ${rows[0].ok}).` });
}
