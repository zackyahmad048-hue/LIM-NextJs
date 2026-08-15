import { describe, expect, it } from "vitest";

import { createExamplePdf } from "./example-pdf.fixture";
import { renderPdfPagesForEditor } from "./qr-editor.service";

describe("renderPdfPagesForEditor", () => {
  it("merender halaman PDF sample tanpa error", async () => {
    const buffer = await createExamplePdf();
    const pages = await renderPdfPagesForEditor(buffer);
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.widthPt).toBeGreaterThan(0);
      expect(page.heightPt).toBeGreaterThan(0);
      expect(page.png.length).toBeGreaterThan(0);
    }
  });
});
