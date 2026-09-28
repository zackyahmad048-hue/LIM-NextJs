import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "payload_google_drive_connections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"refresh_token" varchar NOT NULL,
  	"drive_folder_id" varchar,
  	"drive_folder_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_google_drive_connections_id" integer;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_gdc_fk" FOREIGN KEY ("payload_google_drive_connections_id") REFERENCES "public"."payload_google_drive_connections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_gdc_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_google_drive_connections_id";
  DROP TABLE "payload_google_drive_connections" CASCADE;
  `);
}
