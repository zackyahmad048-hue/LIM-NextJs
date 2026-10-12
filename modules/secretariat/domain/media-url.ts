/**
 * Mengambil id media dari URL `/api/media/<id>` — murni (tanpa akses
 * data), aman dipakai dari komponen tampilan.
 */
export function extractFileIdFromMediaUrl(url: string): string | null {
  const match = url.match(/\/api\/media\/([^?]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
