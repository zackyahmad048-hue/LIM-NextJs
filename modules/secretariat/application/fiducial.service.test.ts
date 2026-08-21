import { createCanvas } from "@napi-rs/canvas";
import { describe, expect, it } from "vitest";

import {
  FIDUCIAL_KETUA_COLOR,
  FIDUCIAL_SEKRETARIS_COLOR,
  FIDUCIAL_VERIFIKASI_COLOR,
  centerFiducialPageQr,
  centerFiducialQr,
  detectFiducialCentroidPx,
  detectFiducialOnPage,
} from "./fiducial.service";
import { QR_SIZE_MM } from "./pdf-sign.service";

/** Membangun PNG berisi kotak solid berwarna target pada koordinat piksel. */
function makePngWithSquare(
  width: number,
  height: number,
  squareX: number,
  squareY: number,
  size: number,
  color: { r: number; g: number; b: number },
): Buffer {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
  ctx.fillRect(squareX, squareY, size, size);
  return Buffer.from(canvas.toBuffer("image/png"));
}

describe("detectFiducialCentroidPx", () => {
  it("menemukan centroid kotak magenta", () => {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = "#FF00FF";
    // Kotak 20x20 di tengah => centroid (50, 50)
    ctx.fillRect(40, 40, 20, 20);

    const data = ctx.getImageData(0, 0, 100, 100).data;
    const centroid = detectFiducialCentroidPx(data, 100, 100, FIDUCIAL_KETUA_COLOR);
    expect(centroid).not.toBeNull();
    // Sampling stride 2 hanya memuat piksel genap dalam kotak 40..59 => centroid 49.
    expect(centroid!.x).toBeCloseTo(49, 0);
    expect(centroid!.y).toBeCloseTo(49, 0);
  });

  it("mengembalikan null untuk halaman tanpa simbol", () => {
    const canvas = createCanvas(50, 50);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 50, 50);

    const data = ctx.getImageData(0, 0, 50, 50).data;
    expect(detectFiducialCentroidPx(data, 50, 50, FIDUCIAL_KETUA_COLOR)).toBeNull();
  });

  it("tidak membingungkan warna simbol yang berbeda", () => {
    const canvas = createCanvas(60, 60);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 60, 60);
    // Hanya kotak cyan (Sekretaris), bukan magenta (Ketua).
    ctx.fillStyle = "#00FFFF";
    ctx.fillRect(20, 20, 20, 20);

    const data = ctx.getImageData(0, 0, 60, 60).data;
    expect(
      detectFiducialCentroidPx(data, 60, 60, FIDUCIAL_KETUA_COLOR),
    ).toBeNull();
    expect(
      detectFiducialCentroidPx(data, 60, 60, FIDUCIAL_SEKRETARIS_COLOR),
    ).not.toBeNull();
  });
});

describe("detectFiducialOnPage", () => {
  it("mengonversi centroid ke mm dari kiri-bawah", async () => {
    // Halaman 200x200 piksel mewakili 200x200 mm (1 px = 1 mm).
    // Kotak magenta di pojok kiri-bawah (x 10..30, y 160..180 dari atas).
    const png = makePngWithSquare(200, 200, 10, 160, 20, FIDUCIAL_KETUA_COLOR);
    const pos = await detectFiducialOnPage(
      png,
      200,
      200,
      FIDUCIAL_KETUA_COLOR,
    );
    expect(pos).not.toBeNull();
    // Kotak x 10..29, y-atas 160..179; sampling genap => centroid (19, 169).
    // mm x = 19; mm y dari bawah = 200 - 169 = 31.
    expect(pos!.x).toBeCloseTo(19, 0);
    expect(pos!.y).toBeCloseTo(31, 0);
  });

  it("mengembalikan null bila tidak ada simbol", async () => {
    const png = makePngWithSquare(100, 100, 0, 0, 0, {
      r: 0,
      g: 0,
      b: 0,
    });
    const pos = await detectFiducialOnPage(
      png,
      100,
      100,
      FIDUCIAL_VERIFIKASI_COLOR,
    );
    expect(pos).toBeNull();
  });
});

describe("centerFiducialQr", () => {
  it("menggeser posisi agar QR menutupi centroid di tengah", () => {
    // Centroid simbol di (100, 80) mm. QR 25mm → pojok kiri-bawah harus
    // digeser -12.5mm agar centroid jatuh di tengah QR.
    const centered = centerFiducialQr({ x: 100, y: 80 });
    expect(centered.x).toBeCloseTo(100 - QR_SIZE_MM / 2);
    expect(centered.y).toBeCloseTo(80 - QR_SIZE_MM / 2);
  });

  it("tidak menghasilkan koordinat negatif untuk simbol dekat tepi", () => {
    const centered = centerFiducialQr({ x: 5, y: 3 });
    expect(centered.x).toBe(0);
    expect(centered.y).toBe(0);
  });

  it("mempertahankan halaman untuk posisi per halaman", () => {
    const centered = centerFiducialPageQr({ page: 2, x: 50, y: 40 });
    expect(centered.page).toBe(2);
    expect(centered.x).toBeCloseTo(50 - QR_SIZE_MM / 2);
    expect(centered.y).toBeCloseTo(40 - QR_SIZE_MM / 2);
  });
});
