-- CreateEnum
CREATE TYPE "WajibKhidmahStatusPemohon" AS ENUM ('ALUMNI_LIRBOYO', 'BUKAN_ALUMNI', 'WALI_SANTRI', 'LAINNYA');

-- CreateEnum
CREATE TYPE "WajibKhidmahLokasiMadrasah" AS ENUM ('DALAM_PESANTREN', 'LUAR_PESANTREN');

-- CreateEnum
CREATE TYPE "WajibKhidmahSatuanPendidikan" AS ENUM ('TPQ', 'MADRASAH_DINIYAH', 'MI', 'MTS', 'MA', 'SD_PESANTREN', 'SMP_PESANTREN', 'SMA_PESANTREN', 'KMI', 'PDF', 'LAINNYA');

-- AlterTable
ALTER TABLE "wajib_khidmah_members" ADD COLUMN     "lembagaId" TEXT;

-- CreateTable
CREATE TABLE "wajib_khidmah_lembaga" (
    "id" TEXT NOT NULL,
    "namaLembagaPendidikan" TEXT NOT NULL,
    "rtRw" TEXT,
    "desaKelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupatenKota" TEXT,
    "provinsi" TEXT,
    "teleponLembaga" TEXT,
    "mediaSosialLembaga" TEXT,
    "pengasuhNama" TEXT,
    "pengasuhStatus" "WajibKhidmahStatusPemohon",
    "pengasuhStatusLainnya" TEXT,
    "pengasuhAlumniAngkatan" TEXT,
    "pengasuhTelepon" TEXT,
    "pengasuhFotoFileId" TEXT,
    "penanggungJawabNama" TEXT,
    "penanggungJawabStatus" "WajibKhidmahStatusPemohon",
    "penanggungJawabStatusLainnya" TEXT,
    "penanggungJawabAlumniAngkatan" TEXT,
    "penanggungJawabTelepon" TEXT,
    "penanggungJawabFotoFileId" TEXT,
    "lokasiMadrasah" "WajibKhidmahLokasiMadrasah",
    "jenisSatuanPendidikan" "WajibKhidmahSatuanPendidikan",
    "jenisSatuanPendidikanLainnya" TEXT,
    "kitabBermakna" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kitabBermaknaLainnya" TEXT,
    "bahasaPengantar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bahasaPengantarLainnya" TEXT,
    "jumlahPengurusPutra" INTEGER,
    "jumlahPengurusPutri" INTEGER,
    "jumlahSantriPutra" INTEGER,
    "jumlahSantriPutri" INTEGER,
    "jumlahGuruBantuDimohon" INTEGER NOT NULL,
    "tugasGuruBantu" TEXT,
    "kitabDiajarkanGuruBantu" TEXT,
    "catatanCalonGuruBantu" TEXT,
    "dokumenPermohonanFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wajib_khidmah_lembaga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wajib_khidmah_members_lembagaId_idx" ON "wajib_khidmah_members"("lembagaId");

-- AddForeignKey
ALTER TABLE "wajib_khidmah_members" ADD CONSTRAINT "wajib_khidmah_members_lembagaId_fkey" FOREIGN KEY ("lembagaId") REFERENCES "wajib_khidmah_lembaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
