-- Surat Masuk dua status (ADR-012): baris dengan nilai lama dipindahkan lebih
-- dulu, baru nilai PROCESSED dibuang dari enum. Tanpa UPDATE ini, ALTER TYPE
-- gagal bila masih ada baris berstatus PROCESSED.
UPDATE "public"."incoming_mail" SET "status" = 'ARCHIVED' WHERE "status" = 'PROCESSED';

-- AlterEnum
BEGIN;
CREATE TYPE "IncomingMailStatus_new" AS ENUM ('RECEIVED', 'ARCHIVED');
ALTER TABLE "public"."incoming_mail" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "incoming_mail" ALTER COLUMN "status" TYPE "IncomingMailStatus_new" USING ("status"::text::"IncomingMailStatus_new");
ALTER TYPE "IncomingMailStatus" RENAME TO "IncomingMailStatus_old";
ALTER TYPE "IncomingMailStatus_new" RENAME TO "IncomingMailStatus";
DROP TYPE "public"."IncomingMailStatus_old";
ALTER TABLE "incoming_mail" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;
