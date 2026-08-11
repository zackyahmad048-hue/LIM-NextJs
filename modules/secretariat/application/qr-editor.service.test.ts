import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { renderPdfPagesForEditor } from "./qr-editor.service";

describe("renderPdfPagesForEditor", () => {
  it("merender halaman example-surat.pdf tanpa error", async () => {
    const buffer = readFileSync(join(process.cwd(), "example-surat.pdf"));
    const pages = await renderPdfPagesForEditor(buffer);
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.widthPt).toBeGreaterThan(0);
      expect(page.heightPt).toBeGreaterThan(0);
      expect(page.png.length).toBeGreaterThan(0);
    }
  });
});
