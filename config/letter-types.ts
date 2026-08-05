export interface LetterType {
  key: string;
  label: string;
  description: string;
}

export const LETTER_TYPES: LetterType[] = [
  {
    key: "SURAT_KEPUTUSAN",
    label: "Surat Keputusan",
    description: "Penetapan resmi pimpinan tentang suatu hal.",
  },
  {
    key: "UNDANGAN",
    label: "Undangan",
    description: "Ajakan menghadiri rapat atau pertemuan.",
  },
  {
    key: "PERMOHONAN",
    label: "Permohonan",
    description: "Permintaan izin, kerja sama, atau bantuan.",
  },
  {
    key: "PEMBERITAHUAN",
    label: "Pemberitahuan",
    description: "Informasi resmi kepada anggota atau pihak lain.",
  },
  {
    key: "INSTRUKSI",
    label: "Instruksi",
    description: "Perintah pelaksanaan tugas dari pimpinan.",
  },
  {
    key: "PENGANTAR",
    label: "Pengantar",
    description: "Surat penghantar pengiriman berkas atau dokumen.",
  },
  {
    key: "JAWABAN_PERMOHONAN",
    label: "Jawaban Permohonan",
    description: "Tanggapan resmi atas permohonan yang masuk.",
  },
  {
    key: "SURAT_TUGAS",
    label: "Surat Tugas / Mandat Tugas",
    description: "Penugasan resmi kepada muballigh atau petugas.",
  },
  {
    key: "SURAT_KUASA",
    label: "Surat Kuasa",
    description: "Pelimpahan wewenang kepada pihak tertentu.",
  },
  {
    key: "REKOMENDASI",
    label: "Rekomendasi",
    description: "Dukungan tertulis atas seseorang atau suatu hal.",
  },
  {
    key: "SURAT_PERNYATAAN",
    label: "Surat Pernyataan",
    description: "Pernyataan tertulis yang mengikat pihak penerbit.",
  },
  {
    key: "SURAT_PERINGATAN",
    label: "Surat Peringatan",
    description: "Peringatan resmi atas pelanggaran atau kelalaian.",
  },
  {
    key: "PENGUMUMAN",
    label: "Pengumuman",
    description: "Pemberitahuan untuk khalayak umum.",
  },
  {
    key: "SURAT_PERJANJIAN",
    label: "Surat Perjanjian",
    description: "Kesepakatan tertulis antara dua pihak.",
  },
  {
    key: "SURAT_EDARAN",
    label: "Surat Edaran",
    description: "Pemberitahuan berjenjang ke seluruh anggota.",
  },
];

export const LETTER_TYPE_KEYS = LETTER_TYPES.map((type) => type.key);

export function getLetterTypeLabel(key: string): string {
  return LETTER_TYPES.find((type) => type.key === key)?.label ?? key;
}
