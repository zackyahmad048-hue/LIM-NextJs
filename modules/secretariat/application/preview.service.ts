import * as fs from "node:fs";
import * as path from "node:path";

import {
  createCanvas,
  DOMMatrix,
  Path2D,
  loadImage,
} from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
globalThis.Path2D = Path2D as unknown as typeof globalThis.Path2D;

const WATERMARK_TEXT = "SALINAN DIGITAL";
const PDF_SCALE = 1.5;
const MAX_PDF_PAGE_WIDTH = 1600;
const MAX_IMAGE_WIDTH = 1200;

function resolveDataUrl(relativeDir: string): string | undefined {
  const dir = path.join(process.cwd(), "node_modules", "pdfjs-dist", relativeDir);
  return fs.existsSync(dir) ? `${dir}/` : undefined;
}

const cMapUrl = resolveDataUrl("cmaps");
const standardFontDataUrl = resolveDataUrl("standard_fonts");

export interface CanvasAndContext {
  canvas: any;
  context: any;
}

/**
 * CanvasFactory berbasis @napi-rs/canvas agar pdf.js dapat merender
 * tanpa DOM di runtime Node.js (Vercel serverless).
 */
export class NodeCanvasFactory {
  create(width: number, height: number): CanvasAndContext {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  reset(canvasAndContext: CanvasAndContext, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: CanvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

function drawWatermark(context: any, width: number, height: number) {
  context.save();
  context.globalAlpha = 0.09;
  context.fillStyle = "#111827";
  context.translate(width / 2, height / 2);
  context.rotate(-Math.PI / 4);
  const fontSize = Math.max(28, Math.round(width / 16));
  context.font = `bold ${fontSize}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(WATERMARK_TEXT, 0, 0);
  context.restore();
}

/**
 * Merender PDF menjadi satu gambar PNG (halaman-halaman disusun vertikal)
 * dengan tanda air "SALINAN DIGITAL". File asli tidak pernah dikembalikan.
 */
export async function renderPdfPreview(buffer: Buffer): Promise<Buffer> {
  const canvasFactory = new NodeCanvasFactory();
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    canvasFactory,
    cMapUrl,
    cMapPacked: true,
    standardFontDataUrl,
  });

  let doc: any = null;
  const rendered: CanvasAndContext[] = [];
  try {
    doc = await loadingTask.promise;
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(
        PDF_SCALE,
        MAX_PDF_PAGE_WIDTH / Math.max(1, baseViewport.width),
      );
      const viewport = page.getViewport({ scale });

      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height,
      );
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, viewport.width, viewport.height);

      await page.render({
        canvasContext: context,
        viewport,
        canvasFactory,
      }).promise;

      drawWatermark(context, viewport.width, viewport.height);
      rendered.push({ canvas, context });
      page.cleanup();
    }
  } finally {
    await doc?.destroy();
  }

  const totalHeight = rendered.reduce(
    (sum, { canvas }) => sum + canvas.height,
    0,
  );
  const maxWidth = Math.max(
    1,
    ...rendered.map(({ canvas }) => canvas.width),
  );
  const strip = createCanvas(maxWidth, totalHeight);
  const stripContext = strip.getContext("2d");
  stripContext.fillStyle = "#ffffff";
  stripContext.fillRect(0, 0, maxWidth, totalHeight);

  let offsetY = 0;
  for (const { canvas, context } of rendered) {
    stripContext.drawImage(canvas, 0, offsetY, canvas.width, canvas.height);
    offsetY += canvas.height;
    canvas.width = 0;
    canvas.height = 0;
    context.clearRect(0, 0, 1, 1);
  }

  const png = strip.toBuffer("image/png");
  strip.width = 0;
  strip.height = 0;
  return Buffer.from(png);
}

/**
 * Merender ulang gambar (legacy lampiran) menjadi PNG dengan tanda air,
 * dibatasi lebarnya agar tidak dapat diunduh dalam resolusi penuh.
 */
export async function renderImagePreview(buffer: Buffer): Promise<Buffer> {
  const source = await loadImage(buffer);
  const scale = Math.min(1, MAX_IMAGE_WIDTH / Math.max(1, source.width));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
  drawWatermark(context, width, height);

  const png = canvas.toBuffer("image/png");
  canvas.width = 0;
  canvas.height = 0;
  return Buffer.from(png);
}
