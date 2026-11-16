import "server-only";

import { neon } from "@neondatabase/serverless";
import { createRealtime } from "@neon/realtime/server";

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL must be set.");
  return neon(databaseUrl);
}

export function getRealtime() {
  const secret = process.env.NEON_REALTIME_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  if (!secret || !databaseUrl) {
    throw new Error("NEON_REALTIME_SECRET and DATABASE_URL must be set.");
  }
  const database = new URL(databaseUrl).pathname.slice(1);
  if (!database) throw new Error("DATABASE_URL must include a database name.");
  return createRealtime({ secret, db: decodeURIComponent(database) });
}
