import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_programs_status" AS ENUM('DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ON_GOING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

  CREATE TABLE "payload_programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"type" varchar NOT NULL,
  	"description" varchar,
  	"organizer_id" varchar,
  	"person_in_charge_id" varchar,
  	"status" "enum_payload_programs_status" NOT NULL DEFAULT 'DRAFT',
  	"registration_open" timestamp(3),
  	"registration_close" timestamp(3),
  	"start_date" timestamp(3) NOT NULL,
  	"end_date" timestamp(3) NOT NULL,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "pprog_code_idx" ON "payload_programs" USING btree ("code");
  CREATE INDEX "pprog_status_idx" ON "payload_programs" USING btree ("status");
  CREATE INDEX "pprog_start_idx" ON "payload_programs" USING btree ("start_date");

  CREATE TABLE "payload_program_schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"program_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"venue_id" varchar,
  	"start_time" timestamp(3) NOT NULL,
  	"end_time" timestamp(3) NOT NULL,
  	"description" varchar,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX "pschd_program_idx" ON "payload_program_schedules" USING btree ("program_id");

  ALTER TABLE "payload_program_schedules" ADD CONSTRAINT "pschd_program_fk" FOREIGN KEY ("program_id") REFERENCES "public"."payload_programs"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_programs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_program_schedules_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pprog_fk" FOREIGN KEY ("payload_programs_id") REFERENCES "public"."payload_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pschd_fk" FOREIGN KEY ("payload_program_schedules_id") REFERENCES "public"."payload_program_schedules"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pschd_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pprog_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_program_schedules_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_programs_id";
  DROP TABLE "payload_program_schedules" CASCADE;
  DROP TABLE "payload_programs" CASCADE;
  DROP TYPE "enum_payload_programs_status";
`);
}