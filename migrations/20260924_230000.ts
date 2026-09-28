import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_program_committees_status" AS ENUM('ACTIVE', 'INACTIVE');
  CREATE TYPE "enum_payload_participants_registration_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
  CREATE TYPE "enum_payload_attendances_status" AS ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

  CREATE TABLE "payload_program_committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"program_id" integer NOT NULL,
  	"user_id" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"status" "enum_payload_program_committees_status" NOT NULL DEFAULT 'ACTIVE',
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "pcom_program_user_uq" ON "payload_program_committees" USING btree ("program_id", "user_id");
  CREATE INDEX "pcom_program_idx" ON "payload_program_committees" USING btree ("program_id");
  CREATE INDEX "pcom_user_idx" ON "payload_program_committees" USING btree ("user_id");

  ALTER TABLE "payload_program_committees" ADD CONSTRAINT "pcom_program_fk" FOREIGN KEY ("program_id") REFERENCES "public"."payload_programs"("id") ON DELETE cascade ON UPDATE no action;

  CREATE TABLE "payload_participants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"program_id" integer NOT NULL,
  	"user_id" varchar NOT NULL,
  	"registration_date" timestamp(3) NOT NULL,
  	"registration_status" "enum_payload_participants_registration_status" NOT NULL DEFAULT 'PENDING',
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "ppart_program_user_uq" ON "payload_participants" USING btree ("program_id", "user_id");
  CREATE INDEX "ppart_program_idx" ON "payload_participants" USING btree ("program_id");
  CREATE INDEX "ppart_user_idx" ON "payload_participants" USING btree ("user_id");

  ALTER TABLE "payload_participants" ADD CONSTRAINT "ppart_program_fk" FOREIGN KEY ("program_id") REFERENCES "public"."payload_programs"("id") ON DELETE cascade ON UPDATE no action;

  CREATE TABLE "payload_attendances" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"participant_id" integer NOT NULL,
  	"check_in" timestamp(3),
  	"check_out" timestamp(3),
  	"status" "enum_payload_attendances_status" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX "patt_participant_idx" ON "payload_attendances" USING btree ("participant_id");

  ALTER TABLE "payload_attendances" ADD CONSTRAINT "patt_participant_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."payload_participants"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_program_committees_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_participants_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_attendances_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pcom_fk" FOREIGN KEY ("payload_program_committees_id") REFERENCES "public"."payload_program_committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_ppart_fk" FOREIGN KEY ("payload_participants_id") REFERENCES "public"."payload_participants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_patt_fk" FOREIGN KEY ("payload_attendances_id") REFERENCES "public"."payload_attendances"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_patt_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_ppart_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pcom_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_attendances_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_participants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_program_committees_id";
  DROP TABLE "payload_attendances" CASCADE;
  DROP TABLE "payload_participants" CASCADE;
  DROP TABLE "payload_program_committees" CASCADE;
  DROP TYPE "enum_payload_attendances_status";
  DROP TYPE "enum_payload_participants_registration_status";
  DROP TYPE "enum_payload_program_committees_status";
`);
}