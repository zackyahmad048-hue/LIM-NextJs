import type {
  WajibKhidmahLokasiMadrasah,
  WajibKhidmahSatuanPendidikan,
  WajibKhidmahStatusPemohon,
} from "@/generated/client";

export type {
  WajibKhidmahLokasiMadrasah,
  WajibKhidmahSatuanPendidikan,
  WajibKhidmahStatusPemohon,
};

export const STATUS_PEMOHON = [
  "ALUMNI_LIRBOYO",
  "BUKAN_ALUMNI",
  "WALI_SANTRI",
  "LAINNYA",
] as const satisfies readonly WajibKhidmahStatusPemohon[];

export const STATUS_PEMOHON_LABELS: Record<WajibKhidmahStatusPemohon, string> =
  {
    ALUMNI_LIRBOYO: "Alumni Lirboyo",
    BUKAN_ALUMNI: "Bukan Alumni Lirboyo",
    WALI_SANTRI: "Wali Santri Lirboyo",
    LAINNYA: "Yang Lain",
  };

export const LOKASI_MADRASAH = [
  "DALAM_PESANTREN",
  "LUAR_PESANTREN",
] as const satisfies readonly WajibKhidmahLokasiMadrasah[];

export const LOKASI_MADRASAH_LABELS: Record<
  WajibKhidmahLokasiMadrasah,
  string
> = {
  DALAM_PESANTREN: "Dalam Pesantren",
  LUAR_PESANTREN: "Di Luar Pesantren",
};

export const SATUAN_PENDIDIKAN = [
  "TPQ",
  "MADRASAH_DINIYAH",
  "MI",
  "MTS",
  "MA",
  "SD_PESANTREN",
  "SMP_PESANTREN",
  "SMA_PESANTREN",
  "KMI",
  "PDF",
  "LAINNYA",
] as const satisfies readonly WajibKhidmahSatuanPendidikan[];

export const SATUAN_PENDIDIKAN_LABELS: Record<
  WajibKhidmahSatuanPendidikan,
  string
> = {
  TPQ: "TPQ",
  MADRASAH_DINIYAH: "Madrasah Diniyah",
  MI: "Madrasah Ibtidaiyah (MI)",
  MTS: "Madrasah Tsanawiyah (MTs)",
  MA: "Madrasah Aliyah (MA)",
  SD_PESANTREN: "SD Pesantren",
  SMP_PESANTREN: "SMP Pesantren",
  SMA_PESANTREN: "SMA Pesantren",
  KMI: "KMI (Kulliyatul Muta'allimin al Islamiyah)",
  PDF: "Pendidikan Diniyah Formal (PDF)",
  LAINNYA: "Lainnya",
};

export const KITAB_BERMAKNA_OPTIONS = [
  "Jawa",
  "Madura",
  "Sunda",
  "Lainnya",
] as const;

export type KitabBermaknaOption = (typeof KITAB_BERMAKNA_OPTIONS)[number];

export const BAHASA_PENGANTAR_OPTIONS = ["Indonesia", "Lainnya"] as const;

export type BahasaPengantarOption = (typeof BAHASA_PENGANTAR_OPTIONS)[number];

export const GURU_BANTU_DIMOHON_OPTIONS = [1, 2] as const;

export type GuruBantuDimohon = (typeof GURU_BANTU_DIMOHON_OPTIONS)[number];

export interface PemohonDetail {
  nama: string | null;
  status: WajibKhidmahStatusPemohon | null;
  statusLainnya: string | null;
  alumniAngkatan: string | null;
  telepon: string | null;
  fotoFileId: string | null;
}

export interface WajibKhidmahLembagaEntity {
  id: string;
  namaLembagaPendidikan: string;
  rtRw: string | null;
  desaKelurahan: string | null;
  kecamatan: string | null;
  kabupatenKota: string | null;
  provinsi: string | null;
  teleponLembaga: string | null;
  mediaSosialLembaga: string | null;

  pengasuhNama: string | null;
  pengasuhStatus: WajibKhidmahStatusPemohon | null;
  pengasuhStatusLainnya: string | null;
  pengasuhAlumniAngkatan: string | null;
  pengasuhTelepon: string | null;
  pengasuhFotoFileId: string | null;

  penanggungJawabNama: string | null;
  penanggungJawabStatus: WajibKhidmahStatusPemohon | null;
  penanggungJawabStatusLainnya: string | null;
  penanggungJawabAlumniAngkatan: string | null;
  penanggungJawabTelepon: string | null;
  penanggungJawabFotoFileId: string | null;

  lokasiMadrasah: WajibKhidmahLokasiMadrasah | null;
  jenisSatuanPendidikan: WajibKhidmahSatuanPendidikan[];
  jenisSatuanPendidikanLainnya: string | null;
  kitabBermakna: string[];
  kitabBermaknaLainnya: string | null;
  bahasaPengantar: string[];
  bahasaPengantarLainnya: string | null;
  jumlahPengurusPutra: number | null;
  jumlahPengurusPutri: number | null;
  jumlahSantriPutra: number | null;
  jumlahSantriPutri: number | null;

  jumlahGuruBantuDimohon: number;
  tugasGuruBantu: string | null;
  kitabDiajarkanGuruBantu: string | null;
  catatanCalonGuruBantu: string | null;
  dokumenPermohonanFileId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface WajibKhidmahLembagaCreateInput {
  namaLembagaPendidikan: string;
  rtRw?: string | null;
  desaKelurahan?: string | null;
  kecamatan?: string | null;
  kabupatenKota?: string | null;
  provinsi?: string | null;
  teleponLembaga?: string | null;
  mediaSosialLembaga?: string | null;

  pengasuhNama?: string | null;
  pengasuhStatus?: WajibKhidmahStatusPemohon | null;
  pengasuhStatusLainnya?: string | null;
  pengasuhAlumniAngkatan?: string | null;
  pengasuhTelepon?: string | null;
  pengasuhFotoFileId?: string | null;

  penanggungJawabNama?: string | null;
  penanggungJawabStatus?: WajibKhidmahStatusPemohon | null;
  penanggungJawabStatusLainnya?: string | null;
  penanggungJawabAlumniAngkatan?: string | null;
  penanggungJawabTelepon?: string | null;
  penanggungJawabFotoFileId?: string | null;

  lokasiMadrasah?: WajibKhidmahLokasiMadrasah | null;
  jenisSatuanPendidikan?: WajibKhidmahSatuanPendidikan[];
  jenisSatuanPendidikanLainnya?: string | null;
  kitabBermakna?: string[];
  kitabBermaknaLainnya?: string | null;
  bahasaPengantar?: string[];
  bahasaPengantarLainnya?: string | null;
  jumlahPengurusPutra?: number | null;
  jumlahPengurusPutri?: number | null;
  jumlahSantriPutra?: number | null;
  jumlahSantriPutri?: number | null;

  jumlahGuruBantuDimohon: number;
  tugasGuruBantu?: string | null;
  kitabDiajarkanGuruBantu?: string | null;
  catatanCalonGuruBantu?: string | null;
  dokumenPermohonanFileId?: string | null;
}
