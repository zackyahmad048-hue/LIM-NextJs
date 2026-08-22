type DateLike = Date | string | null | undefined;

function toDate(date: DateLike): Date | null {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Tanggal tampilan berformat Indonesia.
 * Default: "22 Agu 2026". `long: true` untuk "22 Agustus 2026".
 * Null/invalid mengembalikan `fallback` (default string kosong).
 */
export function formatDateId(
  date: DateLike,
  opts?: { long?: boolean; fallback?: string },
): string {
  const d = toDate(date);
  if (!d) return opts?.fallback ?? "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: opts?.long ? "long" : "short",
    year: "numeric",
  }).format(d);
}

/**
 * Nilai untuk `<input type="date">` (ISO yyyy-mm-dd).
 * Bagian tanggal diambil dari kalender Asia/Jakarta (WIB), bukan UTC,
 * sehingga timestamp 00:00–06:59 WIB tidak mundur satu hari.
 * Null/invalid mengembalikan string kosong.
 */
export function formatDateInput(date: DateLike): string {
  const d = toDate(date);
  if (!d) return "";
  // Locale en-CA menghasilkan format yyyy-mm-dd
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
