import { createCanvas, loadImage } from "@napi-rs/canvas";

import type { QrPagePositionMm, QrPositionMm } from "../domain/entities";
import { QR_SIZE_MM } from "./pdf-sign.service";
import { renderPdfPagesForEditor } from "./qr-editor.service";

const MM_PER_PT = 25.4 / 72;

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/** Simbol fiducial Ketua — kotak solid magenta. */
export const FIDUCIAL_KETUA_COLOR: RgbColor = { r: 255, g: 0, b: 255 };

/** Simbol fiducial Sekretaris — kotak solid cyan. */
export const FIDUCIAL_SEKRETARIS_COLOR: RgbColor = { r: 0, g: 255, b: 255 };

/** Simbol fiducial Verifikasi — kotak solid orange. */
export const FIDUCIAL_VERIFIKASI_COLOR: RgbColor = { r: 255, g: 140, b: 0 };

/** Ukuran kotak simbol yang ditempel di template (mm). */
export const FIDUCIAL_SIZE_MM = 8;

/** Toleransi jarak warna RGB (0–255) untuk pencocokan simbol. */
const COLOR_TOLERANCE = 48;

/** Langkah sampling piksel agar pemindaian cepat. */
const SCAN_STRIDE = 2;

/** Minimal piksel cocok agar dianggap simbol (menyaring noise). */
const MIN_MATCH_PIXELS = 40;

function matchesColor(
  r: number,
  g: number,
  b: number,
  target: RgbColor,
): boolean {
  return (
    Math.abs(r - target.r) <= COLOR_TOLERANCE &&
    Math.abs(g - target.g) <= COLOR_TOLERANCE &&
    Math.abs(b - target.b) <= COLOR_TOLERANCE
  );
}

/**
 * Mencari centroid (piksel) klaster piksel berwarna target pada data RGBA.
 * Mengembalikan null bila jumlah piksel cocok di bawah ambang minimum.
 */
export function detectFiducialCentroidPx(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  target: RgbColor,
  stride: number = SCAN_STRIDE,
): { x: number; y: number } | null {
  let count = 0;
  let sumX = 0;
  let sumY = 0;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const i = (y * width + x) * 4;
      if (matchesColor(data[i], data[i + 1], data[i + 2], target)) {
        count += 1;
        sumX += x;
        sumY += y;
      }
    }
  }

  if (count < MIN_MATCH_PIXELS) return null;

  return { x: sumX / count, y: sumY / count };
}

/**
 * Mendeteksi posisi simbol fiducial pada satu halaman (PNG render).
 * Posisi dikonversi ke mm dari kiri-bawah halaman.
 */
export async function detectFiducialOnPage(
  png: Buffer,
  widthMm: number,
  heightMm: number,
  target: RgbColor,
): Promise<QrPositionMm | null> {
  const image = await loadImage(png);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const centroid = detectFiducialCentroidPx(
    imageData.data,
    canvas.width,
    canvas.height,
    target,
  );
  if (!centroid) return null;

  return {
    x: (centroid.x / canvas.width) * widthMm,
    y: ((canvas.height - centroid.y) / canvas.height) * heightMm,
  };
}

/**
 * Mengonversi posisi centroid simbol (dari deteksi) menjadi koordinat
 * pojok kiri-bawah QR agar QR menutupi simbol **di tengah**. Komposisi QR
 * (`pdf-lib drawImage`) menempatkan gambar dari pojok kiri-bawah, sedangkan
 * deteksi mengembalikan pusat simbol — keduanya digeser setengah ukuran QR.
 * Nilai dijaga ≥ 0 agar QR tidak keluar halaman.
 */
export function centerFiducialQr(pos: QrPositionMm): QrPositionMm {
  const half = QR_SIZE_MM / 2;
  return {
    x: Math.max(0, pos.x - half),
    y: Math.max(0, pos.y - half),
  };
}

export function centerFiducialPageQr(
  pos: QrPagePositionMm,
): QrPagePositionMm {
  const { x, y } = centerFiducialQr(pos);
  return { page: pos.page, x, y };
}

export interface FiducialDetection {
  ketua: QrPagePositionMm | null;
  sekretaris: QrPagePositionMm | null;
  verifikasi: QrPositionMm | null;
}

/**
 * Merender seluruh halaman PDF dan mendeteksi posisi tiga simbol fiducial
 * (Ketua, Sekretaris, Verifikasi). Halaman tanpa simbol dikembalikan null.
 * Verifikasi ditempel di semua halaman pada posisi yang sama, sehingga
 * diambil dari halaman pertama yang mengandung simbolnya.
 */
export async function findFiducialPositions(
  buffer: Buffer,
): Promise<FiducialDetection> {
  const pages = await renderPdfPagesForEditor(buffer);

  let ketua: QrPagePositionMm | null = null;
  let sekretaris: QrPagePositionMm | null = null;
  let verifikasi: QrPositionMm | null = null;

  for (const page of pages) {
    const widthMm = page.widthPt * MM_PER_PT;
    const heightMm = page.heightPt * MM_PER_PT;

    if (!ketua) {
      const pos = await detectFiducialOnPage(
        page.png,
        widthMm,
        heightMm,
        FIDUCIAL_KETUA_COLOR,
      );
      if (pos) ketua = centerFiducialPageQr({ page: page.page, ...pos });
    }

    if (!sekretaris) {
      const pos = await detectFiducialOnPage(
        page.png,
        widthMm,
        heightMm,
        FIDUCIAL_SEKRETARIS_COLOR,
      );
      if (pos) {
        sekretaris = centerFiducialPageQr({ page: page.page, ...pos });
      }
    }

    if (!verifikasi) {
      const pos = await detectFiducialOnPage(
        page.png,
        widthMm,
        heightMm,
        FIDUCIAL_VERIFIKASI_COLOR,
      );
      if (pos) verifikasi = centerFiducialQr(pos);
    }
  }

  return { ketua, sekretaris, verifikasi };
}
