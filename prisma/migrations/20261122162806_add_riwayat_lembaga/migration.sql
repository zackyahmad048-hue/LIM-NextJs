-- CreateEnum
CREATE TYPE "StatusRiwayatPermohonan" AS ENUM ('DIAJUKAN', 'DIPENUHI', 'TIDAK_DIPENUHI', 'REKOMENDASI');

-- CreateEnum
CREATE TYPE "SumberRiwayat" AS ENUM ('EXCEL_LEGACY', 'SISTEM');

-- AlterTable
ALTER TABLE "Lembaga" ADD COLUMN     "isBlacklist" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDzuriyyah" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jenisLembaga" TEXT,
ADD COLUMN     "pimpinanAlumniTahun" TEXT;

-- CreateTable
CREATE TABLE "TahunAjaran" (
    "id" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "tahunMulai" INTEGER NOT NULL,
    "tahunSelesai" INTEGER NOT NULL,
    "namaAngkatan" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPermohonan" (
    "id" TEXT NOT NULL,
    "lembagaId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "jumlahDiminta" INTEGER,
    "jumlahDisetujui" INTEGER,
    "status" "StatusRiwayatPermohonan" NOT NULL DEFAULT 'DIAJUKAN',
    "catatanLembaga" TEXT,
    "catatanGb" TEXT,
    "sumber" "SumberRiwayat" NOT NULL DEFAULT 'SISTEM',
    "permohonanId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiwayatPermohonan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatGuruBantu" (
    "id" TEXT NOT NULL,
    "riwayatId" TEXT NOT NULL,
    "namaGuruBantu" TEXT NOT NULL,
    "guruBantuId" TEXT,
    "penugasanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatGuruBantu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_tahun_key" ON "TahunAjaran"("tahun");

-- CreateIndex
CREATE INDEX "TahunAjaran_isActive_idx" ON "TahunAjaran"("isActive");

-- CreateIndex
CREATE INDEX "RiwayatPermohonan_lembagaId_idx" ON "RiwayatPermohonan"("lembagaId");

-- CreateIndex
CREATE INDEX "RiwayatPermohonan_tahunAjaranId_idx" ON "RiwayatPermohonan"("tahunAjaranId");

-- CreateIndex
CREATE INDEX "RiwayatPermohonan_status_idx" ON "RiwayatPermohonan"("status");

-- CreateIndex
CREATE INDEX "RiwayatPermohonan_permohonanId_idx" ON "RiwayatPermohonan"("permohonanId");

-- CreateIndex
CREATE INDEX "RiwayatPermohonan_createdById_idx" ON "RiwayatPermohonan"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "RiwayatPermohonan_lembagaId_tahunAjaranId_key" ON "RiwayatPermohonan"("lembagaId", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "RiwayatGuruBantu_penugasanId_key" ON "RiwayatGuruBantu"("penugasanId");

-- CreateIndex
CREATE INDEX "RiwayatGuruBantu_riwayatId_idx" ON "RiwayatGuruBantu"("riwayatId");

-- CreateIndex
CREATE INDEX "RiwayatGuruBantu_guruBantuId_idx" ON "RiwayatGuruBantu"("guruBantuId");

-- AddForeignKey
ALTER TABLE "RiwayatPermohonan" ADD CONSTRAINT "RiwayatPermohonan_lembagaId_fkey" FOREIGN KEY ("lembagaId") REFERENCES "Lembaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPermohonan" ADD CONSTRAINT "RiwayatPermohonan_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPermohonan" ADD CONSTRAINT "RiwayatPermohonan_permohonanId_fkey" FOREIGN KEY ("permohonanId") REFERENCES "PermohonanGuruBantu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPermohonan" ADD CONSTRAINT "RiwayatPermohonan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatGuruBantu" ADD CONSTRAINT "RiwayatGuruBantu_riwayatId_fkey" FOREIGN KEY ("riwayatId") REFERENCES "RiwayatPermohonan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatGuruBantu" ADD CONSTRAINT "RiwayatGuruBantu_guruBantuId_fkey" FOREIGN KEY ("guruBantuId") REFERENCES "GuruBantuProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatGuruBantu" ADD CONSTRAINT "RiwayatGuruBantu_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "Penugasan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
