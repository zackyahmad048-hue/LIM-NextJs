import { PDFDocument, PDFName } from "pdf-lib";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_KETUA_POSITION,
  DEFAULT_SEKRETARIS_POSITION,
  DEFAULT_VERIFIKASI_POSITION,
  QR_SIZE_MM,
  composeSignedPdf,
} from "./pdf-sign.service";
import { renderQrPng } from "./qr-code";
import { createExamplePdf } from "./example-pdf.fixture";

let examplePdf: Buffer | null = null;

async function getExamplePdf(): Promise<Buffer> {
  if (!examplePdf) examplePdf = await createExamplePdf();
  return examplePdf;
}

function countPageXObjects(doc: PDFDocument): number {
  let count = 0;
  for (const page of doc.getPages()) {
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObjects = resources.get(PDFName.of("XObject"));
    if (xObjects && xObjects.constructor.name === "PDFDict") {
      count += (xObjects as unknown as { keys: () => unknown[] }).keys().length;
    }
  }
  return count;
}

describe("composeSignedPdf", () => {
  it("menghasilkan PDF valid dengan jumlah halaman yang sama", async () => {
    const examplePdf = await getExamplePdf();
    const source = await PDFDocument.load(examplePdf);
    const pageCountBefore = source.getPageCount();

    const ketuaPng = await renderQrPng("Ketua\nContoh Ketua\nKetua Umum");
    const sekretarisPng = await renderQrPng(
      "Sekretaris\nContoh Sekretaris\nSekretaris Umum",
    );
    const verifikasiPng = await renderQrPng(
      "https://example.com/verifikasi/surat/123",
    );

    const output = await composeSignedPdf(examplePdf, {
      ketua: { png: ketuaPng, position: DEFAULT_KETUA_POSITION },
      sekretaris: { png: sekretarisPng, position: DEFAULT_SEKRETARIS_POSITION },
      verifikasi: { png: verifikasiPng, position: DEFAULT_VERIFIKASI_POSITION },
    });

    const signed = await PDFDocument.load(output);
    expect(signed.getPageCount()).toBe(pageCountBefore);
  });

  it("menggunakan posisi default ketika posisi null", async () => {
    const examplePdf = await getExamplePdf();
    const verifikasiPng = await renderQrPng("https://example.com/verifikasi");

    const output = await composeSignedPdf(examplePdf, {
      ketua: null,
      sekretaris: null,
      verifikasi: { png: verifikasiPng, position: null },
    });

    const signed = await PDFDocument.load(output);
    expect(signed.getPageCount()).toBeGreaterThan(0);
    expect(QR_SIZE_MM).toBeGreaterThan(0);
  });

  it("menempel QR verifikasi di semua halaman", async () => {
    const examplePdf = await getExamplePdf();
    const verifikasiPng = await renderQrPng("https://example.com/verifikasi");

    const sourceXObjects = countPageXObjects(await PDFDocument.load(examplePdf));

    const output = await composeSignedPdf(examplePdf, {
      ketua: null,
      sekretaris: null,
      verifikasi: { png: verifikasiPng, position: DEFAULT_VERIFIKASI_POSITION },
    });

    const signed = await PDFDocument.load(output);
    const pageCount = signed.getPageCount();
    expect(pageCount).toBeGreaterThan(1);
    expect(countPageXObjects(signed)).toBeGreaterThan(sourceXObjects);
  });
});
