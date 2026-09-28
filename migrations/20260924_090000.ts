import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_settings" ADD COLUMN "numbering_format_template" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "numbering_sequence_digits" numeric;
  ALTER TABLE "payload_settings" ADD COLUMN "numbering_next_sequence" jsonb;

  CREATE TABLE "payload_settings_numbering_periods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_year" numeric,
  	"end_year" numeric
  );

  CREATE TABLE "payload_settings_numbering_level_codes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"label" varchar
  );

  ALTER TABLE "payload_settings_numbering_periods" ADD CONSTRAINT "payload_settings_numbering_periods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_settings_numbering_level_codes" ADD CONSTRAINT "payload_settings_numbering_level_codes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_settings"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "payload_settings_numbering_periods_order_idx" ON "payload_settings_numbering_periods" USING btree ("_order");
  CREATE INDEX "payload_settings_numbering_periods_parent_id_idx" ON "payload_settings_numbering_periods" USING btree ("_parent_id");
  CREATE INDEX "payload_settings_numbering_level_codes_order_idx" ON "payload_settings_numbering_level_codes" USING btree ("_order");
  CREATE INDEX "payload_settings_numbering_level_codes_parent_id_idx" ON "payload_settings_numbering_level_codes" USING btree ("_parent_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "payload_settings_numbering_periods" CASCADE;
  DROP TABLE "payload_settings_numbering_level_codes" CASCADE;
  ALTER TABLE "payload_settings" DROP COLUMN "numbering_format_template";
  ALTER TABLE "payload_settings" DROP COLUMN "numbering_sequence_digits";
  ALTER TABLE "payload_settings" DROP COLUMN "numbering_next_sequence";`);
}