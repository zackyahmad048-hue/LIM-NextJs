import { PDFDocument } from "pdf-lib";

import type { QrPagePositionMm, QrPositionMm } from "../domain/entities";

const PT_PER_MM = 72 / 25.4;

/** Ukuran QR yang ditempel ke PDF (dalam mm). */
export const QR_SIZE_MM = 25;
export const QR_SIZE_PT = QR_SIZE_MM * PT_PER_MM;

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

export interface QrImageInput {
  png: Buffer;
  position: QrPagePositionMm | null;
}

export interface SignedPdfQrs {
  ketua: QrImageInput | null;
  sekretaris: QrImageInput | null;
  verifikasi: { png: Buffer; position: QrPositionMm | null };
}

function mmToPt(mm: number): number {
  return Math.round(mm * PT_PER_MM * 100) / 100;
}

/**
 * Mengomposisi QR (Ketua, Sekretaris, Verifikasi) ke atas PDF sumber.
 * Ketua/Sekretaris ditempel pada halaman masing-masing; QR verifikasi
 * ditempel di semua halaman pada posisi yang sama.
 */
export async function composeSignedPdf(
  sourcePdf: Buffer,
  qrs: SignedPdfQrs,
): Promise<Buffer> {
  const doc = await PDFDocument.load(sourcePdf);

  const verifikasiImage = await doc.embedPng(qrs.verifikasi.png);
  const verifikasiPosition =
    qrs.verifikasi.position ?? DEFAULT_VERIFIKASI_POSITION;

  const ketuaImage = qrs.ketua ? await doc.embedPng(qrs.ketua.png) : null;
  const ketuaPosition =
    qrs.ketua?.position ?? DEFAULT_KETUA_POSITION;

  const sekretarisImage = qrs.sekretaris
    ? await doc.embedPng(qrs.sekretaris.png)
    : null;
  const sekretarisPosition =
    qrs.sekretaris?.position ?? DEFAULT_SEKRETARIS_POSITION;

  const pages = doc.getPages();
  pages.forEach((page, index) => {
    const pageNumber = index + 1;

    page.drawImage(verifikasiImage, {
      x: mmToPt(verifikasiPosition.x),
      y: mmToPt(verifikasiPosition.y),
      width: QR_SIZE_PT,
      height: QR_SIZE_PT,
    });

    if (ketuaImage && ketuaPosition.page === pageNumber) {
      page.drawImage(ketuaImage, {
        x: mmToPt(ketuaPosition.x),
        y: mmToPt(ketuaPosition.y),
        width: QR_SIZE_PT,
        height: QR_SIZE_PT,
      });
    }

    if (sekretarisImage && sekretarisPosition.page === pageNumber) {
      page.drawImage(sekretarisImage, {
        x: mmToPt(sekretarisPosition.x),
        y: mmToPt(sekretarisPosition.y),
        width: QR_SIZE_PT,
        height: QR_SIZE_PT,
      });
    }
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

export { PT_PER_MM };
