import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_settings_numbering_periods" ADD COLUMN "_uuid" varchar;
  ALTER TABLE "payload_settings_numbering_level_codes" ADD COLUMN "_uuid" varchar;
  ALTER TABLE "payload_settings_hero_stat_cards" ADD COLUMN "_uuid" varchar;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_settings_numbering_periods" DROP COLUMN "_uuid";
  ALTER TABLE "payload_settings_numbering_level_codes" DROP COLUMN "_uuid";
  ALTER TABLE "payload_settings_hero_stat_cards" DROP COLUMN "_uuid";`);
}