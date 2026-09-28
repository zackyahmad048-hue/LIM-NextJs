import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_administrative_documents_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ARCHIVED');
  CREATE TYPE "enum_payload_administrative_documents_document_type" AS ENUM('UNDANGAN', 'PERMOHONAN', 'PEMBERITAHUAN', 'INSTRUKSI', 'KETERANGAN', 'KEPUTUSAN', 'TERIMA_KASIH', 'LAINNYA');

  CREATE TABLE "payload_administrative_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"document_number" varchar NOT NULL,
  	"document_type" "enum_payload_administrative_documents_document_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"content" varchar,
  	"attachment_url" varchar,
  	"status" "enum_payload_administrative_documents_status" NOT NULL DEFAULT 'DRAFT',
  	"submitted_by_id" varchar,
  	"submitted_at" timestamp(3),
  	"approved_by_id" varchar,
  	"approved_at" timestamp(3),
  	"archived_at" timestamp(3),
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "padocn_docnum_idx" ON "payload_administrative_documents" USING btree ("document_number");
  CREATE INDEX "padocn_status_idx" ON "payload_administrative_documents" USING btree ("status");
  CREATE INDEX "padocn_doctype_idx" ON "payload_administrative_documents" USING btree ("document_type");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_administrative_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_adoc_fk" FOREIGN KEY ("payload_administrative_documents_id") REFERENCES "public"."payload_administrative_documents"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_adoc_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_administrative_documents_id";
  DROP TABLE "payload_administrative_documents" CASCADE;
  DROP TYPE "enum_payload_administrative_documents_status";
  DROP TYPE "enum_payload_administrative_documents_document_type";
`);
}