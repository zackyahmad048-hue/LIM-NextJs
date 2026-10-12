/**
 * Tautan publik verifikasi surat — murni (tanpa akses data), aman
 * dipakai dari komponen tampilan.
 */
export function getLetterVerificationUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/verifikasi/surat/${encodeURIComponent(code)}`;
}
