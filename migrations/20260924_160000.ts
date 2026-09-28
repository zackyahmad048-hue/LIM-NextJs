import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_incoming_mails_status" AS ENUM('RECEIVED', 'PROCESSED', 'ARCHIVED');

  CREATE TABLE "payload_incoming_mails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_number" varchar NOT NULL,
  	"sender" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"sender_address" varchar,
  	"received_date" timestamp(3) NOT NULL,
  	"status" "enum_payload_incoming_mails_status" NOT NULL DEFAULT 'RECEIVED',
  	"classification" varchar,
  	"category" varchar,
  	"notes" varchar,
  	"attachment_url" varchar,
  	"archived_at" timestamp(3),
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "pim_regnum_idx" ON "payload_incoming_mails" USING btree ("registration_number");
  CREATE INDEX "pim_status_idx" ON "payload_incoming_mails" USING btree ("status");
  CREATE INDEX "pim_rdate_idx" ON "payload_incoming_mails" USING btree ("received_date");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_incoming_mails_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_imail_fk" FOREIGN KEY ("payload_incoming_mails_id") REFERENCES "public"."payload_incoming_mails"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_imail_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_incoming_mails_id";
  DROP TABLE "payload_incoming_mails" CASCADE;
  DROP TYPE "enum_payload_incoming_mails_status";
`);
}