-- CreateEnum
CREATE TYPE "WajibKhidmahStatus" AS ENUM ('AKTIF', 'GUGUR', 'BEBAS_TUGAS', 'QODLO');

-- AlterTable
-- Preserve data: rename existing columns before dropping or adding new ones.
ALTER TABLE "wajib_khidmah_members" RENAME COLUMN "alamat" TO "asalDaerah";
ALTER TABLE "wajib_khidmah_members" DROP COLUMN "kelas";
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "absensi" TEXT;
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "alamatLembaga" TEXT;
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "catatan" TEXT;
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "keterangan" TEXT;
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "status" "WajibKhidmahStatus" NOT NULL DEFAULT 'AKTIF';
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "tugasKhidmah" TEXT;

-- CreateIndex
CREATE INDEX "wajib_khidmah_members_status_idx" ON "wajib_khidmah_members"("status");
