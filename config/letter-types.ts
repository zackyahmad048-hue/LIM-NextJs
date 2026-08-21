export interface LetterType {
  key: string;
  label: string;
  description: string;
}

/**
 * Kategori surat sesuai aturan organisasi (docs/number-letter.md).
 * Kode A–T menjadi segmen ketiga pada nomor surat (…/PP/A/VII/2026).
 */
export const LETTER_TYPES: LetterType[] = [
  {
    key: "A",
    label: "Surat Keputusan",
    description: "Penetapan resmi pimpinan tentang suatu hal.",
  },
  {
    key: "B",
    label: "Undangan",
    description: "Ajakan menghadiri rapat atau pertemuan.",
  },
  {
    key: "C",
    label: "Permohonan",
    description: "Permintaan izin, kerja sama, atau bantuan.",
  },
  {
    key: "D",
    label: "Pemberitahuan",
    description: "Informasi resmi kepada anggota atau pihak lain.",
  },
  {
    key: "E",
    label: "Instruksi",
    description: "Perintah pelaksanaan tugas dari pimpinan.",
  },
  {
    key: "F",
    label: "Pengantar",
    description: "Surat penghantar pengiriman berkas atau dokumen.",
  },
  {
    key: "G",
    label: "Jawaban Permohonan",
    description: "Tanggapan resmi atas permohonan yang masuk.",
  },
  {
    key: "H",
    label: "Surat Tugas",
    description: "Penugasan resmi kepada muballigh atau petugas.",
  },
  {
    key: "I",
    label: "Surat Kuasa",
    description: "Pelimpahan wewenang kepada pihak tertentu.",
  },
  {
    key: "J",
    label: "Rekomendasi",
    description: "Dukungan tertulis atas seseorang atau suatu hal.",
  },
  {
    key: "K",
    label: "Surat Pernyataan",
    description: "Pernyataan tertulis yang mengikat pihak penerbit.",
  },
  {
    key: "L",
    label: "Surat Peringatan",
    description: "Peringatan resmi atas pelanggaran atau kelalaian.",
  },
  {
    key: "M",
    label: "Pengumuman",
    description: "Pemberitahuan untuk khalayak umum.",
  },
  {
    key: "N",
    label: "Surat Perjanjian",
    description: "Kesepakatan tertulis antara dua pihak.",
  },
  {
    key: "O",
    label: "Surat Edaran",
    description: "Pemberitahuan berjenjang ke seluruh anggota.",
  },
  {
    key: "P",
    label: "Berita Acara",
    description: "Catatan resmi jalannya suatu kegiatan atau kejadian.",
  },
  {
    key: "Q",
    label: "Nota Dinas",
    description: "Komunikasi resmi antarbagian dalam organisasi.",
  },
  {
    key: "R",
    label: "Surat Keterangan",
    description: "Keterangan resmi tentang suatu hal atau seseorang.",
  },
  {
    key: "S",
    label: "Laporan",
    description: "Penyampaian hasil kegiatan atau pertanggungjawaban.",
  },
  {
    key: "T",
    label: "Notulen Rapat",
    description: "Catatan hasil rapat atau musyawarah.",
  },
];

export const LETTER_TYPE_KEYS = LETTER_TYPES.map((type) => type.key);

export function getLetterTypeLabel(key: string): string {
  return LETTER_TYPES.find((type) => type.key === key)?.label ?? key;
}

export function getLetterTypeDescription(key: string): string {
  return (
    LETTER_TYPES.find((type) => type.key === key)?.description ?? ""
  );
}

/**
 * Pemetaan kategori A–T ke enum DocumentType lama agar data
 * tetap kompatibel. Kategori yang tidak punya padanan memakai LAINNYA.
 */
const CATEGORY_TO_DOCUMENT_TYPE: Record<
  string,
  | "UNDANGAN"
  | "PERMOHONAN"
  | "PEMBERITAHUAN"
  | "INSTRUKSI"
  | "KETERANGAN"
  | "KEPUTUSAN"
  | "TERIMA_KASIH"
  | "LAINNYA"
> = {
  A: "KEPUTUSAN",
  B: "UNDANGAN",
  C: "PERMOHONAN",
  D: "PEMBERITAHUAN",
  E: "INSTRUKSI",
};

type DocumentTypeValue =
  | "UNDANGAN"
  | "PERMOHONAN"
  | "PEMBERITAHUAN"
  | "INSTRUKSI"
  | "KETERANGAN"
  | "KEPUTUSAN"
  | "TERIMA_KASIH"
  | "LAINNYA";

export function letterCategoryToDocumentType(
  categoryCode: string,
): DocumentTypeValue {
  return CATEGORY_TO_DOCUMENT_TYPE[categoryCode] ?? "LAINNYA";
}
