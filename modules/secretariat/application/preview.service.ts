import {
  createCanvas,
  DOMMatrix,
  Path2D,
  type Canvas,
  type SKRSContext2D,
} from "@napi-rs/canvas";

globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
globalThis.Path2D = Path2D as unknown as typeof globalThis.Path2D;

/**
 * Sisa modul ini hanya untuk editor QR di admin. Perenderan pratinjau
 * berwatermark untuk halaman publik dicabut oleh ADR-014, karena kode
 * verifikasi tercetak di setiap lembar surat yang beredar.
 */
export interface CanvasAndContext {
  canvas: Canvas;
  context: SKRSContext2D;
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
    canvasAndContext.canvas = null as unknown as Canvas;
    canvasAndContext.context = null as unknown as SKRSContext2D;
  }
}
