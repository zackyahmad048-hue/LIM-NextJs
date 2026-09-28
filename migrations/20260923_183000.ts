import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_pages_key" AS ENUM('homepage.about', 'page:profil', 'page:tentang', 'page:visi-misi', 'page:falak', 'page:kontak', 'page:tim-wajib-khidmah');

  CREATE TABLE "payload_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_payload_pages_key" NOT NULL,
  	"content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_settings_hero_stat_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );

  ALTER TABLE "payload_settings" DROP COLUMN "hero_config";
  ALTER TABLE "payload_settings" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_highlight" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_tagline" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_image" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_cta_label" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_cta_href" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_secondary_label" varchar;
  ALTER TABLE "payload_settings" ADD COLUMN "hero_secondary_href" varchar;

  ALTER TABLE "payload_settings_hero_stat_cards" ADD CONSTRAINT "payload_settings_hero_stat_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_settings"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "payload_pages_key_idx" ON "payload_pages" USING btree ("key");
  CREATE INDEX "payload_pages_updated_at_idx" ON "payload_pages" USING btree ("updated_at");
  CREATE INDEX "payload_pages_created_at_idx" ON "payload_pages" USING btree ("created_at");
  CREATE INDEX "payload_settings_hero_stat_cards_order_idx" ON "payload_settings_hero_stat_cards" USING btree ("_order");
  CREATE INDEX "payload_settings_hero_stat_cards_parent_id_idx" ON "payload_settings_hero_stat_cards" USING btree ("_parent_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload_pages" CASCADE;
  DROP TABLE "payload_settings_hero_stat_cards" CASCADE;
  DROP TYPE "public"."enum_payload_pages_key";
  ALTER TABLE "payload_settings" ADD COLUMN "hero_config" jsonb;
  ALTER TABLE "payload_settings" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_title";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_highlight";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_tagline";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_description";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_image";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_cta_label";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_cta_href";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_secondary_label";
  ALTER TABLE "payload_settings" DROP COLUMN "hero_secondary_href";`);
}
