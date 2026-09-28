import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" DROP COLUMN "id";
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" DROP COLUMN "id";
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" ADD COLUMN "id" varchar PRIMARY KEY NOT NULL;
  `);
}
