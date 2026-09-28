import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "enum_payload_dispositions_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

  CREATE TABLE "payload_dispositions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"incoming_mail_id" integer NOT NULL,
  	"assigned_to_id" varchar NOT NULL,
  	"instruction" varchar NOT NULL,
  	"priority" varchar NOT NULL DEFAULT 'NORMAL',
  	"status" "enum_payload_dispositions_status" NOT NULL DEFAULT 'PENDING',
  	"due_date" timestamp(3),
  	"notes" varchar,
  	"deleted_at" timestamp(3),
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE INDEX "disp_imail_idx" ON "payload_dispositions" USING btree ("incoming_mail_id");
  CREATE INDEX "disp_assignee_idx" ON "payload_dispositions" USING btree ("assigned_to_id");
  CREATE INDEX "disp_status_idx" ON "payload_dispositions" USING btree ("status");

  ALTER TABLE "payload_dispositions" ADD CONSTRAINT "disp_imail_fk" FOREIGN KEY ("incoming_mail_id") REFERENCES "public"."payload_incoming_mails"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_dispositions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_disp_fk" FOREIGN KEY ("payload_dispositions_id") REFERENCES "public"."payload_dispositions"("id") ON DELETE cascade ON UPDATE no action;
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "pldr_disp_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_dispositions_id";
  DROP TABLE "payload_dispositions" CASCADE;
  DROP TYPE "enum_payload_dispositions_status";
`);
}