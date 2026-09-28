import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" DROP CONSTRAINT IF EXISTS "wkhl_jsp_pfk";
  ALTER TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" DROP CONSTRAINT IF EXISTS "wkhm_twk_pfk";
  ALTER TABLE "payload_organization_structure_regional_boards" DROP CONSTRAINT IF EXISTS "posc_rb_parent_fk";
  ALTER TABLE "payload_organization_structure_regional_boards_members" DROP CONSTRAINT IF EXISTS "posc_rbm_parent_fk";
  ALTER TABLE "payload_organization_structure_branch_boards" DROP CONSTRAINT IF EXISTS "posc_bb_parent_fk";
  ALTER TABLE "payload_organization_structure_branch_boards_members" DROP CONSTRAINT IF EXISTS "posc_bbm_parent_fk";

  ALTER TYPE "enum_payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME TO "enum_jsp";

  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" RENAME TO "jsp";
  ALTER TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" RENAME TO "twk";
  ALTER TABLE "payload_organization_structure_regional_boards" RENAME TO "rb";
  ALTER TABLE "payload_organization_structure_regional_boards_members" RENAME TO "rb_members";
  ALTER TABLE "payload_organization_structure_branch_boards" RENAME TO "bb";
  ALTER TABLE "payload_organization_structure_branch_boards_members" RENAME TO "bb_members";

  ALTER INDEX IF EXISTS "wkhl_jsp_o" RENAME TO "jsp_order_idx";
  ALTER INDEX IF EXISTS "wkhl_jsp_p" RENAME TO "jsp_parent_idx";
  ALTER INDEX IF EXISTS "wkhm_twk_o" RENAME TO "twk_order_idx";
  ALTER INDEX IF EXISTS "wkhm_twk_p" RENAME TO "twk_parent_id_idx";
  ALTER INDEX IF EXISTS "posc_rb_order_idx" RENAME TO "rb_order_idx";
  ALTER INDEX IF EXISTS "posc_rb_parent_idx" RENAME TO "rb_parent_id_idx";
  ALTER INDEX IF EXISTS "posc_rbm_order_idx" RENAME TO "rb_members_order_idx";
  ALTER INDEX IF EXISTS "posc_rbm_parent_idx" RENAME TO "rb_members_parent_id_idx";
  ALTER INDEX IF EXISTS "posc_bb_order_idx" RENAME TO "bb_order_idx";
  ALTER INDEX IF EXISTS "posc_bb_parent_idx" RENAME TO "bb_parent_id_idx";
  ALTER INDEX IF EXISTS "posc_bbm_order_idx" RENAME TO "bb_members_order_idx";
  ALTER INDEX IF EXISTS "posc_bbm_parent_idx" RENAME TO "bb_members_parent_id_idx";

  DO $$ BEGIN
    ALTER TABLE "jsp" ADD CONSTRAINT "jsp_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "twk" ADD CONSTRAINT "twk_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "rb" ADD CONSTRAINT "rb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "rb_members" ADD CONSTRAINT "rb_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rb"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "bb" ADD CONSTRAINT "bb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "bb_members" ADD CONSTRAINT "bb_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bb"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "bb_members" DROP CONSTRAINT IF EXISTS "bb_members_parent_id_fk";
  ALTER TABLE "bb" DROP CONSTRAINT IF EXISTS "bb_parent_id_fk";
  ALTER TABLE "rb_members" DROP CONSTRAINT IF EXISTS "rb_members_parent_id_fk";
  ALTER TABLE "rb" DROP CONSTRAINT IF EXISTS "rb_parent_id_fk";
  ALTER TABLE "twk" DROP CONSTRAINT IF EXISTS "twk_parent_id_fk";
  ALTER TABLE "jsp" DROP CONSTRAINT IF EXISTS "jsp_parent_fk";

  ALTER INDEX IF EXISTS "jsp_order_idx" RENAME TO "wkhl_jsp_o";
  ALTER INDEX IF EXISTS "jsp_parent_idx" RENAME TO "wkhl_jsp_p";
  ALTER INDEX IF EXISTS "twk_order_idx" RENAME TO "wkhm_twk_o";
  ALTER INDEX IF EXISTS "twk_parent_id_idx" RENAME TO "wkhm_twk_p";
  ALTER INDEX IF EXISTS "rb_order_idx" RENAME TO "posc_rb_order_idx";
  ALTER INDEX IF EXISTS "rb_parent_id_idx" RENAME TO "posc_rb_parent_idx";
  ALTER INDEX IF EXISTS "rb_members_order_idx" RENAME TO "posc_rbm_order_idx";
  ALTER INDEX IF EXISTS "rb_members_parent_id_idx" RENAME TO "posc_rbm_parent_idx";
  ALTER INDEX IF EXISTS "bb_order_idx" RENAME TO "posc_bb_order_idx";
  ALTER INDEX IF EXISTS "bb_parent_id_idx" RENAME TO "posc_bb_parent_idx";
  ALTER INDEX IF EXISTS "bb_members_order_idx" RENAME TO "posc_bbm_order_idx";
  ALTER INDEX IF EXISTS "bb_members_parent_id_idx" RENAME TO "posc_bbm_parent_idx";

  ALTER TABLE "bb_members" RENAME TO "payload_organization_structure_branch_boards_members";
  ALTER TABLE "bb" RENAME TO "payload_organization_structure_branch_boards";
  ALTER TABLE "rb_members" RENAME TO "payload_organization_structure_regional_boards_members";
  ALTER TABLE "rb" RENAME TO "payload_organization_structure_regional_boards";
  ALTER TABLE "twk" RENAME TO "payload_wajib_khidmah_members_tempat_wajib_khidmah";
  ALTER TABLE "jsp" RENAME TO "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan";

  ALTER TYPE "enum_jsp" RENAME TO "enum_payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan";

  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" ADD CONSTRAINT "wkhl_jsp_pfk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" ADD CONSTRAINT "wkhm_twk_pfk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_organization_structure_regional_boards" ADD CONSTRAINT "posc_rb_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_organization_structure_regional_boards_members" ADD CONSTRAINT "posc_rbm_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure_regional_boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_organization_structure_branch_boards" ADD CONSTRAINT "posc_bb_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_organization_structure_branch_boards_members" ADD CONSTRAINT "posc_bbm_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_organization_structure_branch_boards"("id") ON DELETE cascade ON UPDATE no action;
  `);
}