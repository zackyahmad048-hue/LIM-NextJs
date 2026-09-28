import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Enums (lembaga)
  CREATE TYPE enum_payload_wajib_khidmah_lembagas_pengasuh_status AS ENUM ('ALUMNI_LIRBOYO', 'BUKAN_ALUMNI', 'WALI_SANTRI', 'LAINNYA');
  CREATE TYPE enum_payload_wajib_khidmah_lembagas_penanggung_jawab_status AS ENUM ('ALUMNI_LIRBOYO', 'BUKAN_ALUMNI', 'WALI_SANTRI', 'LAINNYA');
  CREATE TYPE enum_payload_wajib_khidmah_lembagas_lokasi_madrasah AS ENUM ('DALAM_PESANTREN', 'LUAR_PESANTREN');
  CREATE TYPE enum_payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan AS ENUM ('TPQ', 'MADRASAH_DINIYAH', 'MI', 'MTS', 'MA', 'SD_PESANTREN', 'SMP_PESANTREN', 'SMA_PESANTREN', 'KMI', 'PDF', 'LAINNYA');

  -- Enums (member)
  CREATE TYPE enum_payload_wajib_khidmah_members_status AS ENUM ('AKTIF', 'GUGUR', 'BEBAS_TUGAS', 'QODLO');

  -- Main table: wajib khidmah lembagas
  CREATE TABLE "payload_wajib_khidmah_lembagas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama_lembaga_pendidikan" varchar NOT NULL,
  	"rt_rw" varchar,
  	"desa_kelurahan" varchar,
  	"kecamatan" varchar,
  	"kabupaten_kota" varchar,
  	"provinsi" varchar,
  	"telepon_lembaga" varchar,
  	"media_sosial_lembaga" varchar,
  	"pengasuh_nama" varchar,
  	"pengasuh_status" enum_payload_wajib_khidmah_lembagas_pengasuh_status,
  	"pengasuh_status_lainnya" varchar,
  	"pengasuh_alumni_angkatan" varchar,
  	"pengasuh_telepon" varchar,
  	"pengasuh_foto_file_id" varchar,
  	"penanggung_jawab_nama" varchar,
  	"penanggung_jawab_status" enum_payload_wajib_khidmah_lembagas_penanggung_jawab_status,
  	"penanggung_jawab_status_lainnya" varchar,
  	"penanggung_jawab_alumni_angkatan" varchar,
  	"penanggung_jawab_telepon" varchar,
  	"penanggung_jawab_foto_file_id" varchar,
  	"lokasi_madrasah" enum_payload_wajib_khidmah_lembagas_lokasi_madrasah,
  	"jenis_satuan_pendidikan_lainnya" varchar,
  	"kitab_bermakna_lainnya" varchar,
  	"bahasa_pengantar_lainnya" varchar,
  	"jumlah_pengurus_putra" integer,
  	"jumlah_pengurus_putri" integer,
  	"jumlah_santri_putra" integer,
  	"jumlah_santri_putri" integer,
  	"jumlah_guru_bantu_dimohon" integer NOT NULL,
  	"tugas_guru_bantu" varchar,
  	"kitab_diajarkan_guru_bantu" varchar,
  	"catatan_calon_guru_bantu" varchar,
  	"dokumen_permohonan_file_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  -- jenisSatuanPendidikan select hasMany (child table: _order, _parent_id, id varchar, value enum)
  CREATE TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" enum_payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan
  );
  ALTER TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" ADD CONSTRAINT "wkhl_jsp_pfk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "wkhl_jsp_o" ON "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" USING btree ("_order");
  CREATE INDEX "wkhl_jsp_p" ON "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" USING btree ("_parent_id");

  -- kitabBermakna array (block {kitab})
  CREATE TABLE "payload_wajib_khidmah_lembagas_kitab_bermakna" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kitab" varchar
  );
  ALTER TABLE "payload_wajib_khidmah_lembagas_kitab_bermakna" ADD CONSTRAINT "wkhl_kb_pfk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "wkhl_kb_o" ON "payload_wajib_khidmah_lembagas_kitab_bermakna" USING btree ("_order");
  CREATE INDEX "wkhl_kb_p" ON "payload_wajib_khidmah_lembagas_kitab_bermakna" USING btree ("_parent_id");

  -- bahasaPengantar array (block {bahasa})
  CREATE TABLE "payload_wajib_khidmah_lembagas_bahasa_pengantar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"bahasa" varchar
  );
  ALTER TABLE "payload_wajib_khidmah_lembagas_bahasa_pengantar" ADD CONSTRAINT "wkhl_bp_pfk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "wkhl_bp_o" ON "payload_wajib_khidmah_lembagas_bahasa_pengantar" USING btree ("_order");
  CREATE INDEX "wkhl_bp_p" ON "payload_wajib_khidmah_lembagas_bahasa_pengantar" USING btree ("_parent_id");

  -- Main table: wajib khidmah members
  CREATE TABLE "payload_wajib_khidmah_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"asal_daerah" varchar,
  	"alamat_lembaga" varchar,
  	"pos_wajib_khidmah" varchar,
  	"tugas_khidmah" varchar,
  	"status" enum_payload_wajib_khidmah_members_status DEFAULT 'AKTIF' NOT NULL,
  	"keterangan" varchar,
  	"catatan" varchar,
  	"absensi" varchar,
  	"lembaga_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  ALTER TABLE "payload_wajib_khidmah_members" ADD CONSTRAINT "wkhm_lembaga_fk" FOREIGN KEY ("lembaga_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "wkhm_status_idx" ON "payload_wajib_khidmah_members" USING btree ("status");

  -- tempatWajibKhidmah array (block {tempat})
  CREATE TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tempat" varchar
  );
  ALTER TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" ADD CONSTRAINT "wkhm_twk_pfk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_wajib_khidmah_members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "wkhm_twk_o" ON "payload_wajib_khidmah_members_tempat_wajib_khidmah" USING btree ("_order");
  CREATE INDEX "wkhm_twk_p" ON "payload_wajib_khidmah_members_tempat_wajib_khidmah" USING btree ("_parent_id");

  -- payload_locked_documents_rels columns + FKs
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_wajib_khidmah_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_wajib_khidmah_lembagas_id" integer;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_wkhm_fk" FOREIGN KEY ("payload_wajib_khidmah_members_id") REFERENCES "public"."payload_wajib_khidmah_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_wkhl_fk" FOREIGN KEY ("payload_wajib_khidmah_lembagas_id") REFERENCES "public"."payload_wajib_khidmah_lembagas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_wkhm_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_wkhl_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_wajib_khidmah_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_wajib_khidmah_lembagas_id";
  DROP TABLE "payload_wajib_khidmah_members_tempat_wajib_khidmah" CASCADE;
  DROP TABLE "payload_wajib_khidmah_members" CASCADE;
  DROP TABLE "payload_wajib_khidmah_lembagas_bahasa_pengantar" CASCADE;
  DROP TABLE "payload_wajib_khidmah_lembagas_kitab_bermakna" CASCADE;
  DROP TABLE "payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan" CASCADE;
  DROP TABLE "payload_wajib_khidmah_lembagas" CASCADE;
  DROP TYPE enum_payload_wajib_khidmah_members_status;
  DROP TYPE enum_payload_wajib_khidmah_lembagas_jenis_satuan_pendidikan;
  DROP TYPE enum_payload_wajib_khidmah_lembagas_lokasi_madrasah;
  DROP TYPE enum_payload_wajib_khidmah_lembagas_penanggung_jawab_status;
  DROP TYPE enum_payload_wajib_khidmah_lembagas_pengasuh_status;
  `);
}
