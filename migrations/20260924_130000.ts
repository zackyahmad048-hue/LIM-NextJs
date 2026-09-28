import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_payload_units_level" AS ENUM('PP', 'PW', 'PC');

  CREATE TABLE "payload_units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"level" "enum_payload_units_level" NOT NULL,
  	"parent_id" integer,
  	"sort_order" integer DEFAULT 0 NOT NULL,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_units" ADD CONSTRAINT "pu_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_units"("id") ON DELETE set null ON UPDATE no action;

  CREATE UNIQUE INDEX "pu_code_idx" ON "payload_units" USING btree ("code");
  CREATE INDEX "pu_parent_idx" ON "payload_units" USING btree ("parent_id");
  CREATE INDEX "pu_level_idx" ON "payload_units" USING btree ("level");
  CREATE INDEX "pu_deleted_idx" ON "payload_units" USING btree ("deleted_at");
  CREATE INDEX "pu_sort_idx" ON "payload_units" USING btree ("sort_order");

  CREATE TABLE "payload_officers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"unit_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"is_leader" boolean DEFAULT false NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_officers" ADD CONSTRAINT "pof_unit_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."payload_units"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "pof_unit_idx" ON "payload_officers" USING btree ("unit_id");
  CREATE INDEX "pof_deleted_idx" ON "payload_officers" USING btree ("deleted_at");
  CREATE INDEX "pof_leader_idx" ON "payload_officers" USING btree ("is_leader");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "payload_officers" CASCADE;
  DROP TABLE "payload_units" CASCADE;
  DROP TYPE "public"."enum_payload_units_level";`);
}