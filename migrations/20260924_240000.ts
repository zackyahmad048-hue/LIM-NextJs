import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "payload_program_documentations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"program_id" integer NOT NULL,
  	"media_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX "pdoc_program_idx" ON "payload_program_documentations" USING btree ("program_id");
  CREATE INDEX "pdoc_media_idx" ON "payload_program_documentations" USING btree ("media_id");

  ALTER TABLE "payload_program_documentations" ADD CONSTRAINT "pdoc_program_fk" FOREIGN KEY ("program_id") REFERENCES "public"."payload_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_program_documentations" ADD CONSTRAINT "pdoc_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."payload_media"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_program_documentations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_pdoc_fk" FOREIGN KEY ("payload_program_documentations_id") REFERENCES "public"."payload_program_documentations"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_pdoc_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_program_documentations_id";
  DROP TABLE "payload_program_documentations" CASCADE;
`);
}