import { connection } from "next/server";
import { getDatabase } from "@/lib/neon/server";

export async function GET() {
  await connection();
  const sql = getDatabase();
  try {
    const rows = await sql`SELECT 1::int AS ok`;
    return Response.json({ ok: true, message: `Postgres query succeeded (SELECT ${rows[0].ok}).` });
  } catch (error) {
    console.error("[api/health]", error);
    return Response.json({ ok: false, error: "Database tidak dapat dihubungi." }, { status: 503 });
  }
}
