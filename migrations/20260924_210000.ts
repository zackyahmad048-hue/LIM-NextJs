import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_media_storage_provider" AS ENUM('BLOB', 'GOOGLE_DRIVE');

  ALTER TABLE "payload_media" ADD COLUMN "file_id" varchar NOT NULL;
  ALTER TABLE "payload_media" ADD COLUMN "folder" varchar NOT NULL;
  ALTER TABLE "payload_media" ADD COLUMN "storage_provider" "enum_payload_media_storage_provider" NOT NULL DEFAULT 'BLOB';
  ALTER TABLE "payload_media" ADD COLUMN "storage_key" varchar;
  ALTER TABLE "payload_media" ADD COLUMN "uploaded_by_id" varchar;
  ALTER TABLE "payload_media" ADD COLUMN "deleted_at" timestamp(3);
  ALTER TABLE "payload_media" ALTER COLUMN "access" SET DEFAULT 'private';

  CREATE UNIQUE INDEX "pmed_fileid_idx" ON "payload_media" USING btree ("file_id");
  CREATE INDEX "pmed_folder_idx" ON "payload_media" USING btree ("folder");

  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pmed_fk" FOREIGN KEY ("payload_media_id") REFERENCES "public"."payload_media"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pmed_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_media_id";
  ALTER TABLE "payload_media" ALTER COLUMN "access" SET DEFAULT 'public';
  DROP INDEX "pmed_folder_idx";
  DROP INDEX "pmed_fileid_idx";
  ALTER TABLE "payload_media" DROP COLUMN "deleted_at";
  ALTER TABLE "payload_media" DROP COLUMN "uploaded_by_id";
  ALTER TABLE "payload_media" DROP COLUMN "storage_key";
  ALTER TABLE "payload_media" DROP COLUMN "storage_provider";
  ALTER TABLE "payload_media" DROP COLUMN "folder";
  ALTER TABLE "payload_media" DROP COLUMN "file_id";
  DROP TYPE "enum_payload_media_storage_provider";
`);
}