-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH', 'CONTENT_MANAGER', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC', 'PANITIA_SAFARI_DAERAH', 'DELEGASI_SAFARI_DAERAH', 'PENGAJAR_PESANTREN_RAMADAN', 'GURU_BANTU', 'LEMBAGA_EKSTERNAL', 'PONDOK_INTERNAL');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PERSONAL', 'ORGANIZATIONAL');

-- CreateEnum
CREATE TYPE "StatusPenugasan" AS ENUM ('DIAJUKAN', 'DIAKTIFKAN', 'SELESAI', 'DICABUT', 'DIPERPANJANG');

-- CreateEnum
CREATE TYPE "StatusHonor" AS ENUM ('SUDAH_SESUAI', 'BELUM', 'SEBAGIAN', 'TIDAK_BERLAKU');

-- CreateEnum
CREATE TYPE "FanIlmu" AS ENUM ('NAHWU', 'SHOROF', 'FIQIH', 'HADITS', 'TAUHID', 'TAFSIR', 'AKHLAQ', 'QURAN_HADITS', 'LAINNYA');

-- CreateEnum
CREATE TYPE "TingkatKeparahan" AS ENUM ('RINGAN', 'SEDANG', 'BERAT');

-- CreateEnum
CREATE TYPE "StatusMediasi" AS ENUM ('MENUNGGU_PUSAT', 'MEDIASI_CABANG', 'EVALUASI_INDUK', 'SELESAI', 'DICABUT');

-- CreateEnum
CREATE TYPE "StatusPeran" AS ENUM ('ALUMNI_LIRBOYO', 'BUKAN_ALUMNI', 'WALI_SANTRI', 'LAINNYA');

-- CreateEnum
CREATE TYPE "LokasiMadrasah" AS ENUM ('DALAM_PESANTREN', 'LUAR_PESANTREN');

-- CreateEnum
CREATE TYPE "JenisPendidikan" AS ENUM ('TPQ', 'MADRASAH_DINIYAH', 'MI', 'MTS', 'MA', 'SD_PESANTREN', 'SMP_PESANTREN', 'SMA_PESANTREN', 'KMI', 'PDF', 'LAINNYA');

-- CreateEnum
CREATE TYPE "BahasaKitab" AS ENUM ('JAWA', 'MADURA', 'SUNDA', 'LAINNYA');

-- CreateEnum
CREATE TYPE "BahasaPengantar" AS ENUM ('INDONESIA', 'LAINNYA');

-- CreateEnum
CREATE TYPE "KategoriLembaga" AS ENUM ('EKSTERNAL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "SubKategoriInternal" AS ENUM ('PONDOK_INDUK', 'PONDOK_UNIT', 'PONDOK_CABANG_NON_ZONASI', 'PONDOK_CABANG_ZONASI', 'MHM', 'MAHAD_ALY');

-- CreateEnum
CREATE TYPE "StatusLembaga" AS ENUM ('CALON', 'MITRA_AKTIF', 'NON_AKTIF');

-- CreateEnum
CREATE TYPE "LetterType" AS ENUM ('MASUK', 'KELUAR');

-- CreateEnum
CREATE TYPE "LetterStatus" AS ENUM ('DIKETIK', 'REVIEW', 'APPROVED', 'SENT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MetodeHisab" AS ENUM ('TASHILUL_AMTSILAH', 'KEMENAG_RI', 'NU', 'MUHAMMADIYAH');

-- CreateEnum
CREATE TYPE "StatusAwalBulan" AS ENUM ('HISAB_LIRBOYO', 'MENUNGGU_PEMERINTAH', 'RUKYAH', 'DIKONFIRMASI');

-- CreateEnum
CREATE TYPE "StatusDelegasiSafari" AS ENUM ('AKTIF', 'GUGUR', 'SELESAI', 'IZIN');

-- CreateEnum
CREATE TYPE "StatusApprovalJurnal" AS ENUM ('MENUNGGU', 'DISETUJUI_PANITIA_DAERAH', 'DISETUJUI_PW_PC', 'DISETUJUI_KADES', 'LENGKAP');

-- CreateEnum
CREATE TYPE "JenjangSekolah" AS ENUM ('SD', 'SMP', 'SMA', 'PERGURUAN_TINGGI');

-- CreateEnum
CREATE TYPE "KondisiKelas" AS ENUM ('TENANG', 'RAMAI_TAPI_KONDUSIF', 'DISKUSI_BERJALAN_BAIK', 'BANYAK_YANG_MENGANTUK', 'TIDAK_KONDUSIF');

-- CreateEnum
CREATE TYPE "StatusPenugasanPesantren" AS ENUM ('DITETAPKAN', 'BERJALAN', 'SELESAI', 'EVALUASI_BURUK');

-- CreateEnum
CREATE TYPE "JenisKonten" AS ENUM ('WEBINAR', 'PODCAST', 'KONTEN_MEDIASOS', 'KULTUM_DIGITAL', 'TANYA_JAWAB_ONLINE');

-- CreateEnum
CREATE TYPE "StatusKonten" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StatusPendaftaranEvent" AS ENUM ('TERDAFTAR', 'HADIR', 'TIDAK_HADIR');

-- CreateEnum
CREATE TYPE "StatusDaerahBinaan" AS ENUM ('DIAJUKAN', 'AKTIF', 'LULUS_GRADUASI', 'NON_AKTIF');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'GURU_BANTU',
    "accountType" "AccountType" NOT NULL DEFAULT 'PERSONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodeKhidmat" (
    "id" TEXT NOT NULL,
    "namaPeriode" TEXT NOT NULL,
    "tahunMulai" INTEGER NOT NULL,
    "tahunSelesai" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PeriodeKhidmat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitOrganisasi" (
    "id" TEXT NOT NULL,
    "namaUnit" TEXT NOT NULL,
    "levelCode" TEXT NOT NULL,
    "wilayah" TEXT,
    "deskripsi" TEXT,

    CONSTRAINT "UnitOrganisasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bidang" (
    "id" TEXT NOT NULL,
    "namaBidang" TEXT NOT NULL,
    "kodeBidang" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,

    CONSTRAINT "Bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jabatan" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "bidangId" TEXT,
    "namaJabatan" TEXT NOT NULL,
    "urutanTampilan" INTEGER NOT NULL,

    CONSTRAINT "Jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenugasanStruktural" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jabatanId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalSelesai" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PenugasanStruktural_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationalAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "OrganizationalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuruBantuProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "asalPondok" TEXT NOT NULL,
    "noRekening" TEXT,
    "catatanDosen" TEXT,

    CONSTRAINT "GuruBantuProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatAkademik" (
    "id" TEXT NOT NULL,
    "guruBantuId" TEXT NOT NULL,
    "jenjang" TEXT NOT NULL,
    "lembagaAsal" TEXT NOT NULL,
    "tahunLulus" INTEGER NOT NULL,
    "jurusanFokus" TEXT,

    CONSTRAINT "RiwayatAkademik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lembaga" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "namaLembaga" TEXT NOT NULL,
    "namaPimpinan" TEXT NOT NULL,
    "alamatLengkap" TEXT NOT NULL,
    "koordinat" TEXT,
    "kategori" "KategoriLembaga" NOT NULL,
    "subKategori" "SubKategoriInternal",
    "status" "StatusLembaga" NOT NULL DEFAULT 'CALON',
    "provinsi" TEXT,
    "kabupaten" TEXT,
    "catatanKhusus" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lembaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penugasan" (
    "id" TEXT NOT NULL,
    "guruBantuId" TEXT NOT NULL,
    "lembagaId" TEXT NOT NULL,
    "dosenPenanggungId" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "status" "StatusPenugasan" NOT NULL DEFAULT 'DIAJUKAN',
    "targetJamaahMingguan" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Penugasan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanMingguan" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "pelaporId" TEXT NOT NULL,
    "rolePelapor" "Role" NOT NULL,
    "namaPengisi" TEXT NOT NULL,
    "jabatanPengisi" TEXT NOT NULL,
    "periodeMinggu" INTEGER NOT NULL,
    "periodeTahun" INTEGER NOT NULL,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlahHariHadir" INTEGER NOT NULL,
    "keteranganAbsensi" TEXT,
    "jumlahJamaahDilakukan" INTEGER NOT NULL,
    "aktivitasMingguan" TEXT NOT NULL,
    "kendala" TEXT,
    "statusHonor" "StatusHonor" NOT NULL,
    "isForwardedToInduk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanMingguan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailKitab" (
    "id" TEXT NOT NULL,
    "laporanMingguanId" TEXT NOT NULL,
    "fan" "FanIlmu" NOT NULL,
    "namaKitab" TEXT NOT NULL,
    "frekuensiPertemuan" INTEGER NOT NULL,

    CONSTRAINT "DetailKitab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluasiKasus" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "judulMasalah" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tingkatKeparahan" "TingkatKeparahan" NOT NULL,
    "statusMediasi" "StatusMediasi" NOT NULL DEFAULT 'MENUNGGU_PUSAT',
    "mediatorId" TEXT,
    "catatanMediasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluasiKasus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluasiInduk" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "lembagaId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "initiatedById" TEXT NOT NULL,
    "catatanEvaluasi" TEXT NOT NULL,
    "rekomendasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluasiInduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermohonanGuruBantu" (
    "id" TEXT NOT NULL,
    "lembagaId" TEXT,
    "namaLembagaPendidikan" TEXT NOT NULL,
    "rtRw" TEXT NOT NULL,
    "desaKelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupatenKota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "noTeleponLembaga" TEXT NOT NULL,
    "mediaSosial" TEXT,
    "namaPengasuh" TEXT NOT NULL,
    "statusPengasuh" "StatusPeran" NOT NULL,
    "alumniTahunPengasuh" TEXT,
    "statusPengasuhLainnya" TEXT,
    "noHpPengasuh" TEXT NOT NULL,
    "fotoPengasuhUrl" TEXT NOT NULL,
    "namaPJ" TEXT NOT NULL,
    "statusPJ" "StatusPeran" NOT NULL,
    "alumniTahunPJ" TEXT,
    "statusPJLainnya" TEXT,
    "noHpPJ" TEXT NOT NULL,
    "fotoPJUrl" TEXT NOT NULL,
    "lokasiMadrasah" "LokasiMadrasah" NOT NULL,
    "jenisPendidikan" "JenisPendidikan"[],
    "bahasaKitab" "BahasaKitab"[],
    "bahasaPengantar" "BahasaPengantar"[],
    "jumlahPengurusPutra" INTEGER NOT NULL,
    "jumlahPengurusPutri" INTEGER NOT NULL,
    "jumlahSantriPutra" INTEGER NOT NULL,
    "jumlahSantriPutri" INTEGER NOT NULL,
    "jumlahGuruDiminta" INTEGER NOT NULL,
    "tugasDiamanatkan" TEXT NOT NULL,
    "kitabAkanDiajarkan" TEXT NOT NULL,
    "catatanCalonGuru" TEXT NOT NULL,
    "filePdfUrl" TEXT NOT NULL,
    "statusPermohonan" "StatusPenugasan" NOT NULL DEFAULT 'DIAJUKAN',
    "diajukanOlehId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermohonanGuruBantu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterPeriod" (
    "id" TEXT NOT NULL,
    "periodId" TEXT,
    "namaPeriode" TEXT NOT NULL,
    "tahunMulai" INTEGER NOT NULL,
    "tahunSelesai" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LetterPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterNumberCounter" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "levelCode" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "currentSeq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LetterNumberCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "type" "LetterType" NOT NULL,
    "nomorSurat" TEXT,
    "tanggalSurat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pengirim" TEXT NOT NULL,
    "penerima" TEXT,
    "perihal" TEXT NOT NULL,
    "isiSurat" TEXT NOT NULL,
    "fileUrl" TEXT,
    "qrCodeUrl" TEXT,
    "verificationSlug" TEXT,
    "status" "LetterStatus" NOT NULL DEFAULT 'DIKETIK',
    "createdById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "periodId" TEXT,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LetterLog" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "action" "LetterStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LetterLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FalakConfig" (
    "id" TEXT NOT NULL,
    "namaLokasi" TEXT NOT NULL DEFAULT 'Markaz Lirboyo Kota Kediri',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT -7.818758,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 111.993158,
    "ketinggian" DOUBLE PRECISION NOT NULL DEFAULT 76.0,
    "metodeHisab" "MetodeHisab" NOT NULL DEFAULT 'TASHILUL_AMTSILAH',
    "kriteriaMABIMS" BOOLEAN NOT NULL DEFAULT true,
    "tinggiHilalMin" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "elongasiMin" DOUBLE PRECISION NOT NULL DEFAULT 6.4,
    "koreksiSubuh" INTEGER NOT NULL DEFAULT 0,
    "koreksiMaghrib" INTEGER NOT NULL DEFAULT 2,
    "modeWaktu" TEXT NOT NULL DEFAULT 'standar',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FalakConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalShalat" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "subuh" TEXT NOT NULL,
    "terbit" TEXT NOT NULL,
    "dzuhur" TEXT NOT NULL,
    "ashar" TEXT NOT NULL,
    "maghrib" TEXT NOT NULL,
    "isya" TEXT NOT NULL,
    "deklinasiMatahari" DOUBLE PRECISION,
    "equationOfTime" DOUBLE PRECISION,
    "sudutWaktuSubuh" DOUBLE PRECISION,
    "sudutWaktuIsya" DOUBLE PRECISION,
    "isManualOverride" BOOLEAN NOT NULL DEFAULT false,
    "catatanOverride" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "configId" TEXT NOT NULL,

    CONSTRAINT "JadwalShalat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenetapanAwalBulan" (
    "id" TEXT NOT NULL,
    "tahunHijriah" INTEGER NOT NULL,
    "bulanHijriah" INTEGER NOT NULL,
    "namaBulan" TEXT NOT NULL,
    "tanggalMasehi" TIMESTAMP(3) NOT NULL,
    "hariPasaran" TEXT NOT NULL,
    "tanggalIjtimak" TIMESTAMP(3),
    "pukulIjtimak" TEXT,
    "terbenamMatahari" TEXT,
    "tinggiHilalHakiki" TEXT,
    "tinggiHilalMari" TEXT,
    "elongasi" TEXT,
    "lamaHilal" TEXT,
    "status" "StatusAwalBulan" NOT NULL DEFAULT 'HISAB_LIRBOYO',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenetapanAwalBulan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitikSafari" (
    "id" TEXT NOT NULL,
    "namaTitik" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "picNama" TEXT,
    "picNoHp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TitikSafari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelegasiSafari" (
    "id" TEXT NOT NULL,
    "titikId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "asalPondok" TEXT,
    "status" "StatusDelegasiSafari" NOT NULL DEFAULT 'AKTIF',
    "alasanGugur" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DelegasiSafari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalHarianSafari" (
    "id" TEXT NOT NULL,
    "delegasiId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "jumlahJamaah" INTEGER,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JurnalHarianSafari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalJurnal" (
    "id" TEXT NOT NULL,
    "delegasiId" TEXT NOT NULL,
    "approverRole" TEXT NOT NULL,
    "approverName" TEXT NOT NULL,
    "approverJabatan" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "tanggalApproval" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalJurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanSidak" (
    "id" TEXT NOT NULL,
    "delegasiId" TEXT NOT NULL,
    "penilaiId" TEXT NOT NULL,
    "tanggalSidak" TIMESTAMP(3) NOT NULL,
    "kondisiKegiatan" TEXT NOT NULL,
    "kondisiDelegasi" TEXT NOT NULL,
    "kendala" TEXT,
    "rekomendasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanSidak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SekolahMitra" (
    "id" TEXT NOT NULL,
    "namaSekolah" TEXT NOT NULL,
    "jenjang" "JenjangSekolah" NOT NULL,
    "alamat" TEXT NOT NULL,
    "picNama" TEXT NOT NULL,
    "picNoHp" TEXT NOT NULL,
    "picJabatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SekolahMitra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankMateri" (
    "id" TEXT NOT NULL,
    "judulMateri" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "targetJenjang" "JenjangSekolah" NOT NULL,
    "durasiMenit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankMateri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilihanMateriSekolah" (
    "id" TEXT NOT NULL,
    "sekolahId" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,

    CONSTRAINT "PilihanMateriSekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenugasanPesantren" (
    "id" TEXT NOT NULL,
    "sekolahId" TEXT NOT NULL,
    "pengajarId" TEXT NOT NULL,
    "koordinatorId" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" "StatusPenugasanPesantren" NOT NULL DEFAULT 'DITETAPKAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenugasanPesantren_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanHarianPengajar" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT NOT NULL,
    "jumlahSiswaL" INTEGER NOT NULL,
    "jumlahSiswaP" INTEGER NOT NULL,
    "materiId" TEXT NOT NULL,
    "pertanyaanPeserta" TEXT,
    "kondisiKelas" "KondisiKelas" NOT NULL,
    "praktikDilakukan" BOOLEAN NOT NULL DEFAULT false,
    "catatanTambahan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanHarianPengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanHarianKoordinator" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "pengajarHadir" BOOLEAN NOT NULL,
    "kesiapanSarana" TEXT,
    "catatanUmum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanHarianKoordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UmpanBalikPusat" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "penilaiId" TEXT NOT NULL,
    "tanggalKunjungan" TIMESTAMP(3) NOT NULL,
    "kondisiSarana" TEXT NOT NULL,
    "relevansiMateri" TEXT NOT NULL,
    "kesesuaianKesepakatan" TEXT NOT NULL,
    "rekomendasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UmpanBalikPusat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UmpanBalikPeserta" (
    "id" TEXT NOT NULL,
    "penugasanId" TEXT NOT NULL,
    "jumlahResponden" INTEGER NOT NULL,
    "ratingKepuasan" DOUBLE PRECISION NOT NULL,
    "komentarPositif" TEXT,
    "komentarPerbaikan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UmpanBalikPeserta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontenDakwah" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "jenisKonten" "JenisKonten" NOT NULL,
    "status" "StatusKonten" NOT NULL DEFAULT 'DRAFT',
    "thumbnailUrl" TEXT,
    "linkVideo" TEXT,
    "linkPendaftaran" TEXT,
    "tanggalEvent" TIMESTAMP(3),
    "waktuMulai" TIMESTAMP(3),
    "waktuSelesai" TIMESTAMP(3),
    "linkMeeting" TEXT,
    "kuotaPeserta" INTEGER,
    "jumlahPeserta" INTEGER,
    "jumlahInteraksi" INTEGER,
    "ringkasanFeedback" TEXT,
    "pengunggahId" TEXT NOT NULL,
    "disetujuiOlehId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KontenDakwah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendaftaranEvent" (
    "id" TEXT NOT NULL,
    "kontenId" TEXT NOT NULL,
    "namaPeserta" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "asalInstansi" TEXT,
    "statusPendaftaran" "StatusPendaftaranEvent" NOT NULL DEFAULT 'TERDAFTAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendaftaranEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaerahBinaan" (
    "id" TEXT NOT NULL,
    "namaLokasi" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "deskripsiKondisi" TEXT NOT NULL,
    "sumberLokasi" TEXT,
    "status" "StatusDaerahBinaan" NOT NULL DEFAULT 'DIAJUKAN',
    "picLokalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DaerahBinaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanBulananBinaan" (
    "id" TEXT NOT NULL,
    "daerahBinaanId" TEXT NOT NULL,
    "pelaporId" TEXT NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kegiatanDilakukan" TEXT NOT NULL,
    "jumlahPesertaEstimasi" INTEGER,
    "dampakNaratif" TEXT NOT NULL,
    "tantanganHambatan" TEXT,
    "rencanaBulanDepan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanBulananBinaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apikey" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT,
    "start" TEXT,
    "referenceId" TEXT NOT NULL,
    "prefix" TEXT,
    "key" TEXT NOT NULL,
    "refillInterval" INTEGER,
    "refillAmount" INTEGER,
    "lastRefillAt" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "rateLimitEnabled" BOOLEAN NOT NULL DEFAULT true,
    "rateLimitTimeWindow" INTEGER,
    "rateLimitMax" INTEGER,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "remaining" INTEGER,
    "lastRequest" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "permissions" TEXT,
    "metadata" TEXT,

    CONSTRAINT "apikey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_token_idx" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "PeriodeKhidmat_isActive_idx" ON "PeriodeKhidmat"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOrganisasi_levelCode_key" ON "UnitOrganisasi"("levelCode");

-- CreateIndex
CREATE INDEX "UnitOrganisasi_levelCode_idx" ON "UnitOrganisasi"("levelCode");

-- CreateIndex
CREATE UNIQUE INDEX "Bidang_kodeBidang_key" ON "Bidang"("kodeBidang");

-- CreateIndex
CREATE INDEX "Bidang_kodeBidang_idx" ON "Bidang"("kodeBidang");

-- CreateIndex
CREATE INDEX "Jabatan_unitId_idx" ON "Jabatan"("unitId");

-- CreateIndex
CREATE INDEX "Jabatan_bidangId_idx" ON "Jabatan"("bidangId");

-- CreateIndex
CREATE INDEX "PenugasanStruktural_userId_idx" ON "PenugasanStruktural"("userId");

-- CreateIndex
CREATE INDEX "PenugasanStruktural_jabatanId_idx" ON "PenugasanStruktural"("jabatanId");

-- CreateIndex
CREATE INDEX "PenugasanStruktural_periodeId_idx" ON "PenugasanStruktural"("periodeId");

-- CreateIndex
CREATE UNIQUE INDEX "PenugasanStruktural_userId_jabatanId_periodeId_key" ON "PenugasanStruktural"("userId", "jabatanId", "periodeId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationalAccount_userId_key" ON "OrganizationalAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationalAccount_unitId_key" ON "OrganizationalAccount"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "GuruBantuProfile_userId_key" ON "GuruBantuProfile"("userId");

-- CreateIndex
CREATE INDEX "GuruBantuProfile_userId_idx" ON "GuruBantuProfile"("userId");

-- CreateIndex
CREATE INDEX "RiwayatAkademik_guruBantuId_idx" ON "RiwayatAkademik"("guruBantuId");

-- CreateIndex
CREATE UNIQUE INDEX "Lembaga_userId_key" ON "Lembaga"("userId");

-- CreateIndex
CREATE INDEX "Lembaga_userId_idx" ON "Lembaga"("userId");

-- CreateIndex
CREATE INDEX "Lembaga_kategori_idx" ON "Lembaga"("kategori");

-- CreateIndex
CREATE INDEX "Lembaga_status_idx" ON "Lembaga"("status");

-- CreateIndex
CREATE INDEX "Lembaga_parentId_idx" ON "Lembaga"("parentId");

-- CreateIndex
CREATE INDEX "Penugasan_guruBantuId_idx" ON "Penugasan"("guruBantuId");

-- CreateIndex
CREATE INDEX "Penugasan_lembagaId_idx" ON "Penugasan"("lembagaId");

-- CreateIndex
CREATE INDEX "Penugasan_status_idx" ON "Penugasan"("status");

-- CreateIndex
CREATE INDEX "Penugasan_dosenPenanggungId_idx" ON "Penugasan"("dosenPenanggungId");

-- CreateIndex
CREATE INDEX "Penugasan_updatedById_idx" ON "Penugasan"("updatedById");

-- CreateIndex
CREATE INDEX "LaporanMingguan_penugasanId_idx" ON "LaporanMingguan"("penugasanId");

-- CreateIndex
CREATE INDEX "LaporanMingguan_pelaporId_idx" ON "LaporanMingguan"("pelaporId");

-- CreateIndex
CREATE INDEX "LaporanMingguan_periodeTahun_periodeMinggu_idx" ON "LaporanMingguan"("periodeTahun", "periodeMinggu");

-- CreateIndex
CREATE INDEX "DetailKitab_laporanMingguanId_idx" ON "DetailKitab"("laporanMingguanId");

-- CreateIndex
CREATE INDEX "EvaluasiKasus_penugasanId_idx" ON "EvaluasiKasus"("penugasanId");

-- CreateIndex
CREATE INDEX "EvaluasiKasus_statusMediasi_idx" ON "EvaluasiKasus"("statusMediasi");

-- CreateIndex
CREATE INDEX "EvaluasiKasus_mediatorId_idx" ON "EvaluasiKasus"("mediatorId");

-- CreateIndex
CREATE INDEX "EvaluasiInduk_penugasanId_idx" ON "EvaluasiInduk"("penugasanId");

-- CreateIndex
CREATE INDEX "EvaluasiInduk_lembagaId_idx" ON "EvaluasiInduk"("lembagaId");

-- CreateIndex
CREATE INDEX "EvaluasiInduk_evaluatorId_idx" ON "EvaluasiInduk"("evaluatorId");

-- CreateIndex
CREATE INDEX "EvaluasiInduk_initiatedById_idx" ON "EvaluasiInduk"("initiatedById");

-- CreateIndex
CREATE INDEX "PermohonanGuruBantu_lembagaId_idx" ON "PermohonanGuruBantu"("lembagaId");

-- CreateIndex
CREATE INDEX "PermohonanGuruBantu_statusPermohonan_idx" ON "PermohonanGuruBantu"("statusPermohonan");

-- CreateIndex
CREATE INDEX "PermohonanGuruBantu_diajukanOlehId_idx" ON "PermohonanGuruBantu"("diajukanOlehId");

-- CreateIndex
CREATE INDEX "LetterPeriod_isActive_idx" ON "LetterPeriod"("isActive");

-- CreateIndex
CREATE INDEX "LetterPeriod_periodId_idx" ON "LetterPeriod"("periodId");

-- CreateIndex
CREATE INDEX "LetterNumberCounter_periodId_idx" ON "LetterNumberCounter"("periodId");

-- CreateIndex
CREATE UNIQUE INDEX "LetterNumberCounter_periodId_levelCode_categoryCode_key" ON "LetterNumberCounter"("periodId", "levelCode", "categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Letter_verificationSlug_key" ON "Letter"("verificationSlug");

-- CreateIndex
CREATE INDEX "Letter_type_idx" ON "Letter"("type");

-- CreateIndex
CREATE INDEX "Letter_status_idx" ON "Letter"("status");

-- CreateIndex
CREATE INDEX "Letter_nomorSurat_idx" ON "Letter"("nomorSurat");

-- CreateIndex
CREATE INDEX "Letter_verificationSlug_idx" ON "Letter"("verificationSlug");

-- CreateIndex
CREATE INDEX "Letter_createdById_idx" ON "Letter"("createdById");

-- CreateIndex
CREATE INDEX "Letter_reviewedById_idx" ON "Letter"("reviewedById");

-- CreateIndex
CREATE INDEX "Letter_approvedById_idx" ON "Letter"("approvedById");

-- CreateIndex
CREATE INDEX "Letter_periodId_idx" ON "Letter"("periodId");

-- CreateIndex
CREATE INDEX "Letter_deletedAt_createdAt_idx" ON "Letter"("deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "LetterLog_letterId_idx" ON "LetterLog"("letterId");

-- CreateIndex
CREATE INDEX "LetterLog_userId_idx" ON "LetterLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");

-- CreateIndex
CREATE INDEX "ArticleCategory_slug_idx" ON "ArticleCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

-- CreateIndex
CREATE INDEX "Article_status_createdAt_idx" ON "Article"("status", "createdAt");

-- CreateIndex
CREATE INDEX "FalakConfig_isActive_idx" ON "FalakConfig"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "JadwalShalat_tanggal_key" ON "JadwalShalat"("tanggal");

-- CreateIndex
CREATE INDEX "JadwalShalat_tanggal_idx" ON "JadwalShalat"("tanggal");

-- CreateIndex
CREATE INDEX "JadwalShalat_configId_idx" ON "JadwalShalat"("configId");

-- CreateIndex
CREATE INDEX "PenetapanAwalBulan_tahunHijriah_bulanHijriah_idx" ON "PenetapanAwalBulan"("tahunHijriah", "bulanHijriah");

-- CreateIndex
CREATE UNIQUE INDEX "PenetapanAwalBulan_tahunHijriah_bulanHijriah_key" ON "PenetapanAwalBulan"("tahunHijriah", "bulanHijriah");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "TitikSafari_provinsi_kabupaten_idx" ON "TitikSafari"("provinsi", "kabupaten");

-- CreateIndex
CREATE INDEX "DelegasiSafari_titikId_idx" ON "DelegasiSafari"("titikId");

-- CreateIndex
CREATE INDEX "DelegasiSafari_userId_idx" ON "DelegasiSafari"("userId");

-- CreateIndex
CREATE INDEX "DelegasiSafari_status_idx" ON "DelegasiSafari"("status");

-- CreateIndex
CREATE INDEX "JurnalHarianSafari_delegasiId_idx" ON "JurnalHarianSafari"("delegasiId");

-- CreateIndex
CREATE INDEX "JurnalHarianSafari_tanggal_idx" ON "JurnalHarianSafari"("tanggal");

-- CreateIndex
CREATE INDEX "ApprovalJurnal_delegasiId_idx" ON "ApprovalJurnal"("delegasiId");

-- CreateIndex
CREATE INDEX "ApprovalJurnal_approverRole_idx" ON "ApprovalJurnal"("approverRole");

-- CreateIndex
CREATE INDEX "LaporanSidak_delegasiId_idx" ON "LaporanSidak"("delegasiId");

-- CreateIndex
CREATE INDEX "LaporanSidak_penilaiId_idx" ON "LaporanSidak"("penilaiId");

-- CreateIndex
CREATE INDEX "SekolahMitra_jenjang_idx" ON "SekolahMitra"("jenjang");

-- CreateIndex
CREATE INDEX "BankMateri_targetJenjang_idx" ON "BankMateri"("targetJenjang");

-- CreateIndex
CREATE INDEX "PilihanMateriSekolah_sekolahId_idx" ON "PilihanMateriSekolah"("sekolahId");

-- CreateIndex
CREATE INDEX "PilihanMateriSekolah_materiId_idx" ON "PilihanMateriSekolah"("materiId");

-- CreateIndex
CREATE UNIQUE INDEX "PilihanMateriSekolah_sekolahId_materiId_key" ON "PilihanMateriSekolah"("sekolahId", "materiId");

-- CreateIndex
CREATE INDEX "PenugasanPesantren_sekolahId_idx" ON "PenugasanPesantren"("sekolahId");

-- CreateIndex
CREATE INDEX "PenugasanPesantren_pengajarId_idx" ON "PenugasanPesantren"("pengajarId");

-- CreateIndex
CREATE INDEX "PenugasanPesantren_koordinatorId_idx" ON "PenugasanPesantren"("koordinatorId");

-- CreateIndex
CREATE INDEX "PenugasanPesantren_status_idx" ON "PenugasanPesantren"("status");

-- CreateIndex
CREATE INDEX "LaporanHarianPengajar_penugasanId_idx" ON "LaporanHarianPengajar"("penugasanId");

-- CreateIndex
CREATE INDEX "LaporanHarianPengajar_tanggal_idx" ON "LaporanHarianPengajar"("tanggal");

-- CreateIndex
CREATE INDEX "LaporanHarianPengajar_materiId_idx" ON "LaporanHarianPengajar"("materiId");

-- CreateIndex
CREATE INDEX "LaporanHarianKoordinator_penugasanId_idx" ON "LaporanHarianKoordinator"("penugasanId");

-- CreateIndex
CREATE INDEX "LaporanHarianKoordinator_tanggal_idx" ON "LaporanHarianKoordinator"("tanggal");

-- CreateIndex
CREATE INDEX "UmpanBalikPusat_penugasanId_idx" ON "UmpanBalikPusat"("penugasanId");

-- CreateIndex
CREATE INDEX "UmpanBalikPusat_penilaiId_idx" ON "UmpanBalikPusat"("penilaiId");

-- CreateIndex
CREATE INDEX "UmpanBalikPeserta_penugasanId_idx" ON "UmpanBalikPeserta"("penugasanId");

-- CreateIndex
CREATE UNIQUE INDEX "KontenDakwah_slug_key" ON "KontenDakwah"("slug");

-- CreateIndex
CREATE INDEX "KontenDakwah_jenisKonten_idx" ON "KontenDakwah"("jenisKonten");

-- CreateIndex
CREATE INDEX "KontenDakwah_status_idx" ON "KontenDakwah"("status");

-- CreateIndex
CREATE INDEX "KontenDakwah_slug_idx" ON "KontenDakwah"("slug");

-- CreateIndex
CREATE INDEX "KontenDakwah_pengunggahId_idx" ON "KontenDakwah"("pengunggahId");

-- CreateIndex
CREATE INDEX "KontenDakwah_disetujuiOlehId_idx" ON "KontenDakwah"("disetujuiOlehId");

-- CreateIndex
CREATE INDEX "PendaftaranEvent_kontenId_idx" ON "PendaftaranEvent"("kontenId");

-- CreateIndex
CREATE INDEX "PendaftaranEvent_email_idx" ON "PendaftaranEvent"("email");

-- CreateIndex
CREATE INDEX "DaerahBinaan_provinsi_kabupaten_idx" ON "DaerahBinaan"("provinsi", "kabupaten");

-- CreateIndex
CREATE INDEX "DaerahBinaan_status_idx" ON "DaerahBinaan"("status");

-- CreateIndex
CREATE INDEX "DaerahBinaan_picLokalId_idx" ON "DaerahBinaan"("picLokalId");

-- CreateIndex
CREATE INDEX "LaporanBulananBinaan_daerahBinaanId_idx" ON "LaporanBulananBinaan"("daerahBinaanId");

-- CreateIndex
CREATE INDEX "LaporanBulananBinaan_pelaporId_idx" ON "LaporanBulananBinaan"("pelaporId");

-- CreateIndex
CREATE INDEX "LaporanBulananBinaan_tahun_bulan_idx" ON "LaporanBulananBinaan"("tahun", "bulan");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "apikey_configId_idx" ON "apikey"("configId");

-- CreateIndex
CREATE INDEX "apikey_referenceId_idx" ON "apikey"("referenceId");

-- CreateIndex
CREATE INDEX "apikey_key_idx" ON "apikey"("key");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jabatan" ADD CONSTRAINT "Jabatan_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jabatan" ADD CONSTRAINT "Jabatan_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanStruktural" ADD CONSTRAINT "PenugasanStruktural_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanStruktural" ADD CONSTRAINT "PenugasanStruktural_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanStruktural" ADD CONSTRAINT "PenugasanStruktural_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "PeriodeKhidmat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationalAccount" ADD CONSTRAINT "OrganizationalAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationalAccount" ADD CONSTRAINT "OrganizationalAccount_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "UnitOrganisasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuruBantuProfile" ADD CONSTRAINT "GuruBantuProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatAkademik" ADD CONSTRAINT "RiwayatAkademik_guruBantuId_fkey" FOREIGN KEY ("guruBantuId") REFERENCES "GuruBantuProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembaga" ADD CONSTRAINT "Lembaga_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Lembaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lembaga" ADD CONSTRAINT "Lembaga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_guruBantuId_fkey" FOREIGN KEY ("guruBantuId") REFERENCES "GuruBantuProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_lembagaId_fkey" FOREIGN KEY ("lembagaId") REFERENCES "Lembaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_dosenPenanggungId_fkey" FOREIGN KEY ("dosenPenanggungId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penugasan" ADD CONSTRAINT "Penugasan_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMingguan" ADD CONSTRAINT "LaporanMingguan_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "Penugasan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMingguan" ADD CONSTRAINT "LaporanMingguan_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailKitab" ADD CONSTRAINT "DetailKitab_laporanMingguanId_fkey" FOREIGN KEY ("laporanMingguanId") REFERENCES "LaporanMingguan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiKasus" ADD CONSTRAINT "EvaluasiKasus_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "Penugasan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiKasus" ADD CONSTRAINT "EvaluasiKasus_mediatorId_fkey" FOREIGN KEY ("mediatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiInduk" ADD CONSTRAINT "EvaluasiInduk_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "Penugasan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiInduk" ADD CONSTRAINT "EvaluasiInduk_lembagaId_fkey" FOREIGN KEY ("lembagaId") REFERENCES "Lembaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiInduk" ADD CONSTRAINT "EvaluasiInduk_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluasiInduk" ADD CONSTRAINT "EvaluasiInduk_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermohonanGuruBantu" ADD CONSTRAINT "PermohonanGuruBantu_lembagaId_fkey" FOREIGN KEY ("lembagaId") REFERENCES "Lembaga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermohonanGuruBantu" ADD CONSTRAINT "PermohonanGuruBantu_diajukanOlehId_fkey" FOREIGN KEY ("diajukanOlehId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterPeriod" ADD CONSTRAINT "LetterPeriod_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "PeriodeKhidmat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterNumberCounter" ADD CONSTRAINT "LetterNumberCounter_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "LetterPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "LetterPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterLog" ADD CONSTRAINT "LetterLog_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LetterLog" ADD CONSTRAINT "LetterLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalShalat" ADD CONSTRAINT "JadwalShalat_configId_fkey" FOREIGN KEY ("configId") REFERENCES "FalakConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegasiSafari" ADD CONSTRAINT "DelegasiSafari_titikId_fkey" FOREIGN KEY ("titikId") REFERENCES "TitikSafari"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegasiSafari" ADD CONSTRAINT "DelegasiSafari_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalHarianSafari" ADD CONSTRAINT "JurnalHarianSafari_delegasiId_fkey" FOREIGN KEY ("delegasiId") REFERENCES "DelegasiSafari"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalJurnal" ADD CONSTRAINT "ApprovalJurnal_delegasiId_fkey" FOREIGN KEY ("delegasiId") REFERENCES "DelegasiSafari"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSidak" ADD CONSTRAINT "LaporanSidak_delegasiId_fkey" FOREIGN KEY ("delegasiId") REFERENCES "DelegasiSafari"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSidak" ADD CONSTRAINT "LaporanSidak_penilaiId_fkey" FOREIGN KEY ("penilaiId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanMateriSekolah" ADD CONSTRAINT "PilihanMateriSekolah_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "SekolahMitra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanMateriSekolah" ADD CONSTRAINT "PilihanMateriSekolah_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "BankMateri"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanPesantren" ADD CONSTRAINT "PenugasanPesantren_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "SekolahMitra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanPesantren" ADD CONSTRAINT "PenugasanPesantren_pengajarId_fkey" FOREIGN KEY ("pengajarId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenugasanPesantren" ADD CONSTRAINT "PenugasanPesantren_koordinatorId_fkey" FOREIGN KEY ("koordinatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianPengajar" ADD CONSTRAINT "LaporanHarianPengajar_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "PenugasanPesantren"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianPengajar" ADD CONSTRAINT "LaporanHarianPengajar_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "BankMateri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanHarianKoordinator" ADD CONSTRAINT "LaporanHarianKoordinator_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "PenugasanPesantren"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UmpanBalikPusat" ADD CONSTRAINT "UmpanBalikPusat_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "PenugasanPesantren"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UmpanBalikPusat" ADD CONSTRAINT "UmpanBalikPusat_penilaiId_fkey" FOREIGN KEY ("penilaiId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UmpanBalikPeserta" ADD CONSTRAINT "UmpanBalikPeserta_penugasanId_fkey" FOREIGN KEY ("penugasanId") REFERENCES "PenugasanPesantren"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontenDakwah" ADD CONSTRAINT "KontenDakwah_pengunggahId_fkey" FOREIGN KEY ("pengunggahId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontenDakwah" ADD CONSTRAINT "KontenDakwah_disetujuiOlehId_fkey" FOREIGN KEY ("disetujuiOlehId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendaftaranEvent" ADD CONSTRAINT "PendaftaranEvent_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "KontenDakwah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaerahBinaan" ADD CONSTRAINT "DaerahBinaan_picLokalId_fkey" FOREIGN KEY ("picLokalId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanBulananBinaan" ADD CONSTRAINT "LaporanBulananBinaan_daerahBinaanId_fkey" FOREIGN KEY ("daerahBinaanId") REFERENCES "DaerahBinaan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanBulananBinaan" ADD CONSTRAINT "LaporanBulananBinaan_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

