import QRCode from "qrcode";

const QR_WIDTH = 256;

/**
 * Warna QR verifikasi sesuai ketentuan visual organisasi:
 * RGB(5, 107, 176) = #056BB0.
 */
const QR_DARK_COLOR = "#056BB0";
const QR_LIGHT_COLOR = "#FFFFFF";

/**
 * Merender teks menjadi gambar QR PNG. Mendukung teks multi-baris
 * (misal identitas penanda tangan: nama + jabatan).
 */
export async function renderQrPng(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, {
    type: "png",
    width: QR_WIDTH,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: QR_DARK_COLOR, light: QR_LIGHT_COLOR },
  });
}

export function getLetterVerificationUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/verifikasi/surat/${encodeURIComponent(code)}`;
}
