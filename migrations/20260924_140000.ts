import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_bidangs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_units_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_officers_id" integer;

  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pages_fk" FOREIGN KEY ("payload_pages_id") REFERENCES "public"."payload_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_bidangs_fk" FOREIGN KEY ("payload_bidangs_id") REFERENCES "public"."payload_bidangs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_units_fk" FOREIGN KEY ("payload_units_id") REFERENCES "public"."payload_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_officers_fk" FOREIGN KEY ("payload_officers_id") REFERENCES "public"."payload_officers"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pages_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_bidangs_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_units_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_officers_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_bidangs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_units_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_officers_id";
`);
}