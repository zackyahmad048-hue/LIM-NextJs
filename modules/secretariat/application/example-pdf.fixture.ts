import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Menghasilkan PDF sample multi-halaman untuk keperluan test (pengganti
 * file example-surat.pdf yang tidak di-commit ke repositori).
 */
export async function createExamplePdf(pageCount = 2): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const width = 595.28; // A4
  const height = 841.89;

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    const page = doc.addPage([width, height]);
    page.drawText(`Contoh Surat - Halaman ${pageNumber}`, {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(
      "Ini adalah dokumen contoh untuk keperluan pengujian penempatan QR.",
      { x: 50, y: height - 80, size: 10, font, color: rgb(0.2, 0.2, 0.2) },
    );
  }

  return Buffer.from(await doc.save());
}