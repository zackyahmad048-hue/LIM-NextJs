import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "payload_agenda_books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"location" varchar,
  	"participants" varchar,
  	"notes" varchar,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX "pab_date_idx" ON "payload_agenda_books" USING btree ("date");
  CREATE INDEX "pab_deleted_idx" ON "payload_agenda_books" USING btree ("deleted_at");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_agenda_books_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_agenda_fk" FOREIGN KEY ("payload_agenda_books_id") REFERENCES "public"."payload_agenda_books"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_agenda_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_agenda_books_id";
  DROP TABLE "payload_agenda_books" CASCADE;
`);
}