-- CreateEnum
CREATE TYPE "LetterAction" AS ENUM ('DIBUAT', 'DIEDIT', 'DIAJUKAN_REVIEW', 'DISETUJUI', 'DITOLAK', 'DIKIRIM', 'DIARSIPKAN', 'DIHAPUS');

-- DropIndex
DROP INDEX "JadwalShalat_tanggal_key";

-- AlterTable
ALTER TABLE "ApprovalJurnal" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ArticleCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "requestId" TEXT;
ALTER TABLE "AuditLog" ALTER COLUMN "metadata" TYPE JSONB USING CASE
  WHEN "metadata" IS NULL THEN NULL
  ELSE "metadata"::jsonb
END;

-- AlterTable
ALTER TABLE "Bidang" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DaerahBinaan" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "DelegasiSafari" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "EvaluasiInduk" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "EvaluasiKasus" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "FalakConfig" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GuruBantuProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Jabatan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "JurnalHarianSafari" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "KontenDakwah" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "LaporanBulananBinaan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LaporanHarianKoordinator" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LaporanHarianPengajar" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LaporanMingguan" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "LaporanSidak" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Lembaga" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Letter" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "LetterLog" ADD COLUMN     "requestId" TEXT;
ALTER TABLE "LetterLog" ALTER COLUMN "action" TYPE "LetterAction" USING (
  CASE "action"::text
    WHEN 'DIKETIK' THEN 'DIBUAT'
    WHEN 'REVIEW' THEN 'DIAJUKAN_REVIEW'
    WHEN 'APPROVED' THEN 'DISETUJUI'
    WHEN 'SENT' THEN 'DIKIRIM'
    WHEN 'ARCHIVED' THEN 'DIARSIPKAN'
    ELSE 'DIBUAT'
  END
)::"LetterAction";

-- AlterTable
ALTER TABLE "LetterNumberCounter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LetterPeriod" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrganizationalAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PendaftaranEvent" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Penugasan" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "PenugasanPesantren" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "PenugasanStruktural" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PeriodeKhidmat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PermohonanGuruBantu" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "PilihanMateriSekolah" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RiwayatAkademik" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RiwayatGuruBantu" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SekolahMitra" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "TahunAjaran" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TitikSafari" ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "UmpanBalikPeserta" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UmpanBalikPusat" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UnitOrganisasi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "failedVerificationCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor"("secret");

-- CreateIndex
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "DaerahBinaan_unitId_idx" ON "DaerahBinaan"("unitId");

-- CreateIndex
CREATE INDEX "DelegasiSafari_unitId_idx" ON "DelegasiSafari"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "DelegasiSafari_titikId_userId_key" ON "DelegasiSafari"("titikId", "userId");

-- CreateIndex
CREATE INDEX "EvaluasiInduk_unitId_idx" ON "EvaluasiInduk"("unitId");

-- CreateIndex
CREATE INDEX "EvaluasiKasus_unitId_idx" ON "EvaluasiKasus"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "JadwalShalat_configId_tanggal_key" ON "JadwalShalat"("configId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "JurnalHarianSafari_delegasiId_tanggal_key" ON "JurnalHarianSafari"("delegasiId", "tanggal");

-- CreateIndex
CREATE INDEX "KontenDakwah_unitId_idx" ON "KontenDakwah"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanBulananBinaan_daerahBinaanId_tahun_bulan_key" ON "LaporanBulananBinaan"("daerahBinaanId", "tahun", "bulan");

-- CreateIndex
CREATE INDEX "LaporanMingguan_unitId_idx" ON "LaporanMingguan"("unitId");

-- CreateIndex
CREATE INDEX "LaporanMingguan_createdById_idx" ON "LaporanMingguan"("createdById");

-- CreateIndex
CREATE INDEX "LaporanMingguan_updatedById_idx" ON "LaporanMingguan"("updatedById");

-- CreateIndex
CREATE INDEX "Lembaga_unitId_idx" ON "Lembaga"("unitId");

-- CreateIndex
CREATE INDEX "Lembaga_createdById_idx" ON "Lembaga"("createdById");

-- CreateIndex
CREATE INDEX "Lembaga_updatedById_idx" ON "Lembaga"("updatedById");

-- CreateIndex
CREATE INDEX "Letter_unitId_idx" ON "Letter"("unitId");

-- CreateIndex
CREATE INDEX "Penugasan_unitId_idx" ON "Penugasan"("unitId");

-- CreateIndex
CREATE INDEX "Penugasan_createdById_idx" ON "Penugasan"("createdById");

-- CreateIndex
CREATE INDEX "PenugasanPesantren_unitId_idx" ON "PenugasanPesantren"("unitId");

-- CreateIndex
CREATE INDEX "PermohonanGuruBantu_unitId_idx" ON "PermohonanGuruBantu"("unitId");

-- CreateIndex
CREATE INDEX "SekolahMitra_unitId_idx" ON "SekolahMitra"("unitId");

-- CreateIndex
CREATE INDEX "TitikSafari_unitId_idx" ON "TitikSafari"("unitId");

-- CreateIndex
CREATE INDEX "UnitOrganisasi_parentId_idx" ON "UnitOrganisasi"("parentId");

-- AddForeignKey
ALTER TABLE "UnitOrganisasi" ADD CONSTRAINT "UnitOrganisasi_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembaga" ADD CONSTRAINT "Lembaga_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembaga" ADD CONSTRAINT "Lembaga_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembaga" ADD CONSTRAINT "Lembaga_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMingguan" ADD CONSTRAINT "LaporanMingguan_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMingguan" ADD CONSTRAINT "LaporanMingguan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMingguan" ADD CONSTRAINT "LaporanMingguan_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiKasus" ADD CONSTRAINT "EvaluasiKasus_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiInduk" ADD CONSTRAINT "EvaluasiInduk_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermohonanGuruBantu" ADD CONSTRAINT "PermohonanGuruBantu_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitikSafari" ADD CONSTRAINT "TitikSafari_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegasiSafari" ADD CONSTRAINT "DelegasiSafari_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SekolahMitra" ADD CONSTRAINT "SekolahMitra_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanPesantren" ADD CONSTRAINT "PenugasanPesantren_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontenDakwah" ADD CONSTRAINT "KontenDakwah_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaerahBinaan" ADD CONSTRAINT "DaerahBinaan_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Partial indexes (not expressible in Prisma 6 schema)
CREATE UNIQUE INDEX "FalakConfig_one_active_idx" ON "FalakConfig" ("isActive") WHERE "isActive" = true;
CREATE INDEX "User_deletedAt_null_idx" ON "User" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX "Penugasan_deletedAt_null_idx" ON "Penugasan" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX "Letter_deletedAt_null_idx" ON "Letter" ("deletedAt") WHERE "deletedAt" IS NULL;
