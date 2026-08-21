import { describe, expect, it } from "vitest";

import { createExamplePdf } from "./example-pdf.fixture";
import { getLetterVerificationUrl, renderQrPng } from "./qr-code";
import { composeSignedPdf } from "./pdf-sign.service";
import { buildSignerQrText } from "./signing.service";

const examplePdfPromise = createExamplePdf();

describe("QR generation pipeline", () => {
  it("mengirim URL verifikasi valid tanpa gagal", async () => {
    const code = "001/PP/UNDANGAN/VIII/2026";
    const url = getLetterVerificationUrl(code);
    const png = await renderQrPng(url);
    expect(png.length).toBeGreaterThan(0);
  });

  it("membuat QR penanda tangan multi-baris", async () => {
    const png = await renderQrPng(
      buildSignerQrText("Ketua", "Ahmad", "Ketua Umum"),
    );
    expect(png.length).toBeGreaterThan(0);
  });

  it("mengomposisi QR ke lampiran tanpa error", async () => {
    const examplePdf = await examplePdfPromise;
    const verifikasiPng = await renderQrPng(
      "http://localhost:3000/verifikasi/surat/001/PP/UNDANGAN/VIII/2026",
    );
    const ketuaPng = await renderQrPng("Ketua\nAhmad\nKetua Umum");
    const out = await composeSignedPdf(examplePdf, {
      ketua: { png: ketuaPng, position: { page: 1, x: 31, y: 60 } },
      sekretaris: null,
      verifikasi: { png: verifikasiPng, position: { x: 175, y: 12 } },
    });
    expect(out.length).toBeGreaterThan(0);
  });
});
