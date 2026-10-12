import type { QrPagePositionMm, QrPositionMm } from "./entities";

/**
 * Tata letak QR surat — murni, tanpa akses data, sehingga aman dipakai
 * dari komponen tampilan maupun lapisan aplikasi.
 */

/** Ukuran QR yang ditempel ke PDF (dalam mm). */
export const QR_SIZE_MM = 25;

/** Default posisi QR Ketua — diambil dari example-surat.pdf (page 1). */
export const DEFAULT_KETUA_POSITION: QrPagePositionMm = {
  page: 1,
  x: 31,
  y: 60,
};

/** Default posisi QR Sekretaris — diambil dari example-surat.pdf (page 1). */
export const DEFAULT_SEKRETARIS_POSITION: QrPagePositionMm = {
  page: 1,
  x: 109,
  y: 60,
};

/** Default posisi QR Verifikasi — pojok kanan-bawah semua halaman. */
export const DEFAULT_VERIFIKASI_POSITION: QrPositionMm = { x: 175, y: 12 };

/** Hasil deteksi tiga simbol fiducial pada surat. */
export interface FiducialDetection {
  ketua: QrPagePositionMm | null;
  sekretaris: QrPagePositionMm | null;
  verifikasi: QrPositionMm | null;
}
