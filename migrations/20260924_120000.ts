import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Main global table
  CREATE TABLE "payload_organization_structure" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organization_name" varchar,
  	"organization_short_name" varchar,
  	"organization_logo" varchar,
  	"organization_address" varchar,
  	"organization_phone" varchar,
  	"organization_email" varchar,
  	"organization_website" varchar,
  	"google_sheet_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  -- centralBoard array (parent id serial → _parent_id integer OK)
  CREATE TABLE "payload_organization_structure_central_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"image" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL
  );
  ALTER TABLE "payload_organization_structure_central_board" ADD CONSTRAINT "posc_cb_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_cb_order_idx" ON "payload_organization_structure_central_board" USING btree ("_order");
  CREATE INDEX "posc_cb_parent_idx" ON "payload_organization_structure_central_board" USING btree ("_parent_id");

  -- regionalBoards array (parent id serial → _parent_id integer OK)
  CREATE TABLE "payload_organization_structure_regional_boards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"province" varchar NOT NULL,
  	"name" varchar NOT NULL
  );
  ALTER TABLE "payload_organization_structure_regional_boards" ADD CONSTRAINT "posc_rb_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_rb_order_idx" ON "payload_organization_structure_regional_boards" USING btree ("_order");
  CREATE INDEX "posc_rb_parent_idx" ON "payload_organization_structure_regional_boards" USING btree ("_parent_id");

  -- regionalBoards.members nested array (parent id varchar → _parent_id varchar!)
  CREATE TABLE "payload_organization_structure_regional_boards_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"image" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL
  );
  ALTER TABLE "payload_organization_structure_regional_boards_members" ADD CONSTRAINT "posc_rbm_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure_regional_boards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_rbm_order_idx" ON "payload_organization_structure_regional_boards_members" USING btree ("_order");
  CREATE INDEX "posc_rbm_parent_idx" ON "payload_organization_structure_regional_boards_members" USING btree ("_parent_id");

  -- branchBoards array (parent id serial → _parent_id integer OK)
  CREATE TABLE "payload_organization_structure_branch_boards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"province" varchar NOT NULL,
  	"regency" varchar NOT NULL,
  	"name" varchar NOT NULL
  );
  ALTER TABLE "payload_organization_structure_branch_boards" ADD CONSTRAINT "posc_bb_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_bb_order_idx" ON "payload_organization_structure_branch_boards" USING btree ("_order");
  CREATE INDEX "posc_bb_parent_idx" ON "payload_organization_structure_branch_boards" USING btree ("_parent_id");

  -- branchBoards.members nested array (parent id varchar → _parent_id varchar!)
  CREATE TABLE "payload_organization_structure_branch_boards_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"image" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL
  );
  ALTER TABLE "payload_organization_structure_branch_boards_members" ADD CONSTRAINT "posc_bbm_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure_branch_boards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_bbm_order_idx" ON "payload_organization_structure_branch_boards_members" USING btree ("_order");
  CREATE INDEX "posc_bbm_parent_idx" ON "payload_organization_structure_branch_boards_members" USING btree ("_parent_id");

  -- members array (parent id serial → _parent_id integer OK)
  CREATE TABLE "payload_organization_structure_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"image" varchar,
  	"sort_order" integer DEFAULT 0 NOT NULL
  );
  ALTER TABLE "payload_organization_structure_members" ADD CONSTRAINT "posc_m_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posc_m_order_idx" ON "payload_organization_structure_members" USING btree ("_order");
  CREATE INDEX "posc_m_parent_idx" ON "payload_organization_structure_members" USING btree ("_parent_id");
`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "payload_organization_structure_members" CASCADE;
  DROP TABLE "payload_organization_structure_branch_boards_members" CASCADE;
  DROP TABLE "payload_organization_structure_branch_boards" CASCADE;
  DROP TABLE "payload_organization_structure_regional_boards_members" CASCADE;
  DROP TABLE "payload_organization_structure_regional_boards" CASCADE;
  DROP TABLE "payload_organization_structure_central_board" CASCADE;
  DROP TABLE "payload_organization_structure" CASCADE;
`);
}