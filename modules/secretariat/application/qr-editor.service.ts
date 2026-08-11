import * as fs from "node:fs";
import * as path from "node:path";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { NodeCanvasFactory } from "./preview.service";

const QR_EDITOR_SCALE = 1.5;
const MAX_EDITOR_PAGE_WIDTH = 1200;

function resolveDataUrl(relativeDir: string): string | undefined {
  const dir = path.join(process.cwd(), "node_modules", "pdfjs-dist", relativeDir);
  return fs.existsSync(dir) ? `${dir}/` : undefined;
}

const cMapUrl = resolveDataUrl("cmaps");
const standardFontDataUrl = resolveDataUrl("standard_fonts");

export interface EditorPdfPage {
  page: number;
  /** Ukuran halaman dalam point PDF (72 point = 1 inch). */
  widthPt: number;
  heightPt: number;
  /** Ukuran render dalam piksel. */
  width: number;
  height: number;
  png: Buffer;
}

/**
 * Merender setiap halaman PDF menjadi PNG tersendiri (tanpa tanda air)
 * untuk editor posisi QR. Posisi disimpan dalam mm dengan titik asal
 * pojok kiri-bawah halaman, sesuai koordinat pdf-lib.
 */
export async function renderPdfPagesForEditor(
  buffer: Buffer,
): Promise<EditorPdfPage[]> {
  const canvasFactory = new NodeCanvasFactory();
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    canvasFactory,
    cMapUrl,
    cMapPacked: true,
    standardFontDataUrl,
  });

  let doc: any = null;
  const pages: EditorPdfPage[] = [];
  try {
    doc = await loadingTask.promise;
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(
        QR_EDITOR_SCALE,
        MAX_EDITOR_PAGE_WIDTH / Math.max(1, baseViewport.width),
      );
      const viewport = page.getViewport({ scale });

      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height,
      );
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, viewport.width, viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;

      pages.push({
        page: pageNumber,
        widthPt: baseViewport.width,
        heightPt: baseViewport.height,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        png: Buffer.from(canvas.toBuffer("image/png")),
      });

      canvas.width = 0;
      canvas.height = 0;
      context.clearRect(0, 0, 1, 1);
      page.cleanup();
    }
  } finally {
    await doc?.destroy();
  }

  return pages;
}
