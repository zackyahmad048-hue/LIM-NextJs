/**
 * Aturan penomoran surat organisasi — murni (tanpa akses data), aman
 * dipakai dari client. Rujukan: docs/number-letter.md.
 *
 * Format nomor, digit urutan, dan periode kepengurusan kini konfigurable
 * melalui pengaturan penomoran (lihat letter-numbering.config.ts).
 */

export interface NumberingPeriod {
  startYear: number;
  endYear: number;
}

/**
 * Placeholder yang dikenali di dalam template format nomor.
 * Contoh template: `{seq}/{level}/{category}/{bulan}/{tahun}`.
 */
export const NUMBERING_PLACEHOLDERS = [
  "seq",
  "level",
  "category",
  "bulan",
  "tahun",
] as const;

export type NumberingPlaceholder = (typeof NUMBERING_PLACEHOLDERS)[number];

export const ROMAN_MONTHS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export function toRomanMonth(date: Date): string {
  return ROMAN_MONTHS[date.getMonth()] ?? "I";
}

export function padSequence(sequence: number, digits = 3): string {
  return String(sequence).padStart(digits, "0");
}

export interface LetterNumberParts {
  sequence: number;
  levelCode: string;
  categoryCode: string;
  romanMonth: string;
  year: number;
}

export interface LetterNumber {
  sequence: number;
  levelCode: string;
  categoryCode: string;
  romanMonth: string;
  year: number;
  fullNumber: string;
}

export interface NumberFormatOptions {
  template: string;
  sequenceDigits: number;
}

export function formatLetterNumber(
  parts: LetterNumberParts,
  options: NumberFormatOptions,
): string {
  const values: Record<string, string> = {
    seq: padSequence(parts.sequence, options.sequenceDigits),
    level: parts.levelCode,
    category: parts.categoryCode,
    bulan: parts.romanMonth,
    tahun: String(parts.year),
  };

  return options.template.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match,
  );
}

/**
 * Validasi template format nomor. Mengembalikan pesan error atau null jika valid.
 * Template wajib memuat {seq} dan tidak boleh memuat placeholder tak dikenal.
 */
export function validateNumberingTemplate(template: string): string | null {
  const trimmed = template.trim();
  if (!trimmed) return "Template format nomor wajib diisi.";

  const matches = Array.from(trimmed.matchAll(/\{(\w+)\}/g), (m) => m[1]);
  if (matches.length === 0) {
    return "Template harus memuat setidaknya {seq}.";
  }
  for (const key of matches) {
    if (!(NUMBERING_PLACEHOLDERS as readonly string[]).includes(key)) {
      return `Placeholder tidak dikenal: {${key}}.`;
    }
  }
  if (!matches.includes("seq")) {
    return "Template harus memuat {seq}.";
  }
  return null;
}

/**
 * Menentukan periodYear (tahun awal periode) dari tahun surat.
 * Mengembalikan null bila tahun tidak berada dalam periode terdaftar.
 */
export function resolvePeriodYear(
  year: number,
  periods: NumberingPeriod[],
): number | null {
  const sorted = [...periods].sort((a, b) => a.startYear - b.startYear);
  for (const period of sorted) {
    if (year >= period.startYear && year <= period.endYear) {
      return period.startYear;
    }
  }
  return null;
}

export function parseLetterNumber(
  fullNumber: string,
): LetterNumberParts | null {
  const [sequence, levelCode, categoryCode, romanMonth, year] =
    fullNumber.split("/");
  const seq = Number(sequence);
  const yr = Number(year);
  if (!sequence || !levelCode || !categoryCode || !romanMonth || !yr) {
    return null;
  }
  return { sequence: seq, levelCode, categoryCode, romanMonth, year: yr };
}
