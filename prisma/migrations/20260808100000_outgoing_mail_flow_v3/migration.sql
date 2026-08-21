-- Redesign alur surat keluar: no-review flow.
-- 1) Mapping data lama ke status baru
-- 2) Swap enum OutgoingMailStatus ke DRAFT/SENT/ARCHIVED
-- 3) Drop kolom mati alur persetujuan
-- 4) Seed pengaturan penomoran

-- 1) Map data lama
UPDATE "outgoing_mail" SET "status" = 'DRAFT' WHERE "status" IN ('SUBMITTED', 'REVIEWED', 'REJECTED');
UPDATE "outgoing_mail" SET "status" = 'SENT' WHERE "status" IN ('APPROVED', 'SIGNED');

-- 2) Swap enum
ALTER TYPE "OutgoingMailStatus" RENAME TO "OutgoingMailStatus_old";
CREATE TYPE "OutgoingMailStatus" AS ENUM ('DRAFT', 'SENT', 'ARCHIVED');
ALTER TABLE "outgoing_mail" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "outgoing_mail" ALTER COLUMN "status" TYPE "OutgoingMailStatus" USING ("status"::text)::"OutgoingMailStatus";
ALTER TABLE "outgoing_mail" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
DROP TYPE "OutgoingMailStatus_old";

-- 3) Drop kolom mati
ALTER TABLE "outgoing_mail"
  DROP COLUMN IF EXISTS "submittedById",
  DROP COLUMN IF EXISTS "submittedAt",
  DROP COLUMN IF EXISTS "reviewedById",
  DROP COLUMN IF EXISTS "reviewedAt",
  DROP COLUMN IF EXISTS "approvedById",
  DROP COLUMN IF EXISTS "approvedAt",
  DROP COLUMN IF EXISTS "signedById",
  DROP COLUMN IF EXISTS "signedAt";

-- 4) Seed pengaturan penomoran
INSERT INTO "settings" ("id", "key", "value", "type", "description", "createdAt", "updatedAt") VALUES
  (gen_random_uuid()::text, 'secretariat.numbering.formatTemplate', '{seq}/{level}/{category}/{bulan}/{tahun}', 'STRING', 'Template format nomor surat keluar (placeholder: {seq}, {level}, {category}, {bulan}, {tahun}).', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'secretariat.numbering.sequenceDigits', '3', 'NUMBER', 'Jumlah digit nomor urut (padding, mis. 3 => 001).', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'secretariat.numbering.periods', '[{"startYear":2024,"endYear":2029}]', 'JSON', 'Daftar periode kepengurusan (rentang tahun).', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'secretariat.numbering.levelCodes', '[{"code":"PP","label":"Pengurus Pusat"},{"code":"PP.I","label":"Bidang I"},{"code":"PP.II","label":"Bidang II"},{"code":"PP.III","label":"Bidang III"},{"code":"PP.IV","label":"Bidang IV"},{"code":"PP.V","label":"Bidang V"},{"code":"PP.VI","label":"Bidang VI"},{"code":"PP.VII","label":"Bidang VII"},{"code":"PP.VIII","label":"Bidang VIII"},{"code":"PP.IX","label":"Bidang IX"}]', 'JSON', 'Kode tingkat kepengurusan untuk penomoran surat.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'secretariat.numbering.nextSequence', '{}', 'JSON', 'Override nomor urut berikutnya per periode ({"periodYear": n}).', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
