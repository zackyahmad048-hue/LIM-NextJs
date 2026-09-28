import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME COLUMN "_order" TO "order";
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME COLUMN "_parent_id" TO "parent_id";
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME COLUMN "order" TO "_order";
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME COLUMN "parent_id" TO "_parent_id";
  `);
}
