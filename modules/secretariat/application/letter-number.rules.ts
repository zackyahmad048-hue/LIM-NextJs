/**
 * Aturan penomoran surat organisasi — murni (tanpa akses data), aman
 * dipakai dari client. Rujukan: docs/number-letter.md.
 */

/**
 * Periode kepengurusan tetap 2024–2029 (docs/01-domains/05-organization).
 * Nomor urut dihitung per periode kepengurusan dan reset saat pergantian
 * pengurus (bukan per tahun).
 */
export const LEADERSHIP_PERIOD_START_YEAR = 2024;

/**
 * Kode tingkat kepengurusan yang aktif untuk saat ini: Pengurus Pusat (PP)
 * dan sembilan Bidang PP (PP.I–PP.IX). Kode PW/PC menyusul setelah
 * modul Pendataan berdiri.
 */
export const LETTER_LEVEL_CODES = [
  "PP",
  "PP.I",
  "PP.II",
  "PP.III",
  "PP.IV",
  "PP.V",
  "PP.VI",
  "PP.VII",
  "PP.VIII",
  "PP.IX",
] as const;

export type LetterLevelCode = (typeof LETTER_LEVEL_CODES)[number];

export const LETTER_LEVEL_LABELS: Record<string, string> = {
  PP: "Pengurus Pusat",
  "PP.I": "Bidang I",
  "PP.II": "Bidang II",
  "PP.III": "Bidang III",
  "PP.IV": "Bidang IV",
  "PP.V": "Bidang V",
  "PP.VI": "Bidang VI",
  "PP.VII": "Bidang VII",
  "PP.VIII": "Bidang VIII",
  "PP.IX": "Bidang IX",
};

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

export function padSequence(sequence: number): string {
  return String(sequence).padStart(3, "0");
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

export function formatLetterNumber(parts: LetterNumberParts): string {
  return [
    padSequence(parts.sequence),
    parts.levelCode,
    parts.categoryCode,
    parts.romanMonth,
    parts.year,
  ].join("/");
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
