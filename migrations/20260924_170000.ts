import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_outgoing_mails_status" AS ENUM('DRAFT', 'SENT', 'ARCHIVED');
  CREATE TYPE "enum_payload_outgoing_mails_document_type" AS ENUM('UNDANGAN', 'PERMOHONAN', 'PEMBERITAHUAN', 'INSTRUKSI', 'KETERANGAN', 'KEPUTUSAN', 'TERIMA_KASIH', 'LAINNYA');

  CREATE TABLE "payload_outgoing_mails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_number" varchar NOT NULL,
  	"recipient" varchar,
  	"subject" varchar NOT NULL,
  	"sender_name" varchar,
  	"mail_date" timestamp(3) NOT NULL,
  	"status" "enum_payload_outgoing_mails_status" NOT NULL DEFAULT 'DRAFT',
  	"document_type" "enum_payload_outgoing_mails_document_type",
  	"category_code" varchar,
  	"content" varchar,
  	"sent_at" timestamp(3),
  	"archived_at" timestamp(3),
  	"sequence" integer,
  	"level_code" varchar,
  	"roman_month" varchar,
  	"period_year" integer,
  	"full_number" varchar,
  	"verification_code" varchar,
  	"qr_file_id" varchar,
  	"attachment_url" varchar,
  	"ketua_name" varchar,
  	"ketua_position" varchar,
  	"sekretaris_name" varchar,
  	"sekretaris_position" varchar,
  	"qr_ketua_position" jsonb,
  	"qr_sekretaris_position" jsonb,
  	"qr_verifikasi_position" jsonb,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "pom_regnum_idx" ON "payload_outgoing_mails" USING btree ("registration_number");
  CREATE UNIQUE INDEX "pom_fullnum_idx" ON "payload_outgoing_mails" USING btree ("full_number");
  CREATE UNIQUE INDEX "pom_vercode_idx" ON "payload_outgoing_mails" USING btree ("verification_code");
  CREATE UNIQUE INDEX "pom_period_seq_idx" ON "payload_outgoing_mails" USING btree ("period_year", "sequence");
  CREATE INDEX "pom_status_idx" ON "payload_outgoing_mails" USING btree ("status");
  CREATE INDEX "pom_mdate_idx" ON "payload_outgoing_mails" USING btree ("mail_date");
  CREATE INDEX "pom_created_idx" ON "payload_outgoing_mails" USING btree ("created_at");
  CREATE INDEX "pom_archived_idx" ON "payload_outgoing_mails" USING btree ("archived_at");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_outgoing_mails_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_omail_fk" FOREIGN KEY ("payload_outgoing_mails_id") REFERENCES "public"."payload_outgoing_mails"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_omail_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_outgoing_mails_id";
  DROP TABLE "payload_outgoing_mails" CASCADE;
  DROP TYPE "enum_payload_outgoing_mails_status";
  DROP TYPE "enum_payload_outgoing_mails_document_type";
`);
}