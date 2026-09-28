import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({
  db,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE enum_payload_falak_prayer_times_calculation_method AS ENUM ('KEMENAG', 'MUHAMMADIYAH', 'UMMAH_AL_QURA', 'EGYPTIAN', 'ISNA', 'MWL');
  CREATE TYPE enum_payload_falak_hijri_calendars_method AS ENUM ('HISAB', 'RUKYAT', 'IMKANUR_RUKYAT', 'WUJUDUL_HILAL');
  CREATE TYPE enum_payload_falak_rukyats_result AS ENUM ('VISIBLE', 'NOT_VISIBLE', 'CLOUDY', 'UNKNOWN');
  CREATE TYPE enum_payload_falak_rukyats_status AS ENUM ('DRAFT', 'VERIFIED', 'CONFIRMED', 'ARCHIVED');
  CREATE TYPE enum_payload_falak_eclipses_eclipse_type AS ENUM ('SOLAR', 'LUNAR');

  CREATE TABLE "payload_falak_prayer_times" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"location_name" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"timezone" varchar NOT NULL,
  	"calculation_method" enum_payload_falak_prayer_times_calculation_method NOT NULL,
  	"prayer_date" timestamp(3) with time zone NOT NULL,
  	"fajr" timestamp(3) with time zone NOT NULL,
  	"sunrise" timestamp(3) with time zone NOT NULL,
  	"dhuhr" timestamp(3) with time zone NOT NULL,
  	"asr" timestamp(3) with time zone NOT NULL,
  	"maghrib" timestamp(3) with time zone NOT NULL,
  	"isha" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "fpt_pd_idx" ON "payload_falak_prayer_times" USING btree ("prayer_date");
  CREATE INDEX "fpt_coord_idx" ON "payload_falak_prayer_times" USING btree ("latitude", "longitude");

  CREATE TABLE "payload_falak_qiblas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"direction" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "fqb_coord_idx" ON "payload_falak_qiblas" USING btree ("latitude", "longitude");

  CREATE TABLE "payload_falak_hijri_calendars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gregorian_date" timestamp(3) with time zone NOT NULL,
  	"hijri_year" integer NOT NULL,
  	"hijri_month" integer NOT NULL,
  	"hijri_day" integer NOT NULL,
  	"method" enum_payload_falak_hijri_calendars_method NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "fhc_gd_idx" ON "payload_falak_hijri_calendars" USING btree ("gregorian_date");
  CREATE UNIQUE INDEX "fhc_gd_m_uq" ON "payload_falak_hijri_calendars" USING btree ("gregorian_date", "method");

  CREATE TABLE "payload_falak_hisabs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"calculation_date" timestamp(3) with time zone NOT NULL,
  	"location_name" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"parameters" jsonb NOT NULL,
  	"result" jsonb NOT NULL,
  	"calculated_by_id" varchar,
  	"deleted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "fhs_cd_idx" ON "payload_falak_hisabs" USING btree ("calculation_date");

  CREATE TABLE "payload_falak_rukyats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"observation_date" timestamp(3) with time zone NOT NULL,
  	"location_name" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"observer_id" varchar NOT NULL,
  	"weather" varchar NOT NULL,
  	"result" enum_payload_falak_rukyats_result NOT NULL,
  	"notes" varchar,
  	"status" enum_payload_falak_rukyats_status DEFAULT 'DRAFT' NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "frk_od_idx" ON "payload_falak_rukyats" USING btree ("observation_date");
  CREATE INDEX "frk_st_idx" ON "payload_falak_rukyats" USING btree ("status");

  CREATE TABLE "payload_falak_eclipses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eclipse_type" enum_payload_falak_eclipses_eclipse_type NOT NULL,
  	"eclipse_date" timestamp(3) with time zone NOT NULL,
  	"visibility" varchar,
  	"details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX "fecl_ed_idx" ON "payload_falak_eclipses" USING btree ("eclipse_date");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_prayer_times_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_qiblas_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_hijri_calendars_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_hisabs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_rukyats_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_falak_eclipses_id" integer;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_fpt_fk" FOREIGN KEY ("payload_falak_prayer_times_id") REFERENCES "public"."payload_falak_prayer_times"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_fqb_fk" FOREIGN KEY ("payload_falak_qiblas_id") REFERENCES "public"."payload_falak_qiblas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_fhc_fk" FOREIGN KEY ("payload_falak_hijri_calendars_id") REFERENCES "public"."payload_falak_hijri_calendars"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_fhs_fk" FOREIGN KEY ("payload_falak_hisabs_id") REFERENCES "public"."payload_falak_hisabs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_frk_fk" FOREIGN KEY ("payload_falak_rukyats_id") REFERENCES "public"."payload_falak_rukyats"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "pldr_fecl_fk" FOREIGN KEY ("payload_falak_eclipses_id") REFERENCES "public"."payload_falak_eclipses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_fpt_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_fqb_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_fhc_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_fhs_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_frk_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "pldr_fecl_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_prayer_times_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_qiblas_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_hijri_calendars_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_hisabs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_rukyats_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_falak_eclipses_id";
  DROP TABLE "payload_falak_prayer_times" CASCADE;
  DROP TABLE "payload_falak_qiblas" CASCADE;
  DROP TABLE "payload_falak_hijri_calendars" CASCADE;
  DROP TABLE "payload_falak_hisabs" CASCADE;
  DROP TABLE "payload_falak_rukyats" CASCADE;
  DROP TABLE "payload_falak_eclipses" CASCADE;
  DROP TYPE enum_payload_falak_eclipses_eclipse_type;
  DROP TYPE enum_payload_falak_rukyats_status;
  DROP TYPE enum_payload_falak_rukyats_result;
  DROP TYPE enum_payload_falak_hijri_calendars_method;
  DROP TYPE enum_payload_falak_prayer_times_calculation_method;
  `);
}
