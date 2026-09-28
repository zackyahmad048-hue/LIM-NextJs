import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_document_archives_document_type" AS ENUM('UNDANGAN', 'PERMOHONAN', 'PEMBERITAHUAN', 'INSTRUKSI', 'KETERANGAN', 'KEPUTUSAN', 'TERIMA_KASIH', 'LAINNYA');

  CREATE TABLE "payload_document_archives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"archive_number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"document_type" "enum_payload_document_archives_document_type" NOT NULL,
  	"category" varchar,
  	"retention_year" integer,
  	"archived_at" timestamp(3) NOT NULL,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE UNIQUE INDEX "pdarc_archnum_idx" ON "payload_document_archives" USING btree ("archive_number");
  CREATE INDEX "pdarc_doctype_idx" ON "payload_document_archives" USING btree ("document_type");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_document_archives_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_darc_fk" FOREIGN KEY ("payload_document_archives_id") REFERENCES "public"."payload_document_archives"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_darc_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_document_archives_id";
  DROP TABLE "payload_document_archives" CASCADE;
  DROP TYPE "enum_payload_document_archives_document_type";
`);
}