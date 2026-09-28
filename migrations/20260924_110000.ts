import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "payload_bidangs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_bidangs_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );

  ALTER TABLE "payload_bidangs_points" ADD CONSTRAINT "payload_bidangs_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_bidangs"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "payload_bidangs_slug_idx" ON "payload_bidangs" USING btree ("slug");
  CREATE INDEX "payload_bidangs_updated_at_idx" ON "payload_bidangs" USING btree ("updated_at");
  CREATE INDEX "payload_bidangs_created_at_idx" ON "payload_bidangs" USING btree ("created_at");
  CREATE INDEX "payload_bidangs_points_order_idx" ON "payload_bidangs_points" USING btree ("_order");
  CREATE INDEX "payload_bidangs_points_parent_id_idx" ON "payload_bidangs_points" USING btree ("_parent_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "payload_bidangs_points" CASCADE;
  DROP TABLE "payload_bidangs" CASCADE;`);
}