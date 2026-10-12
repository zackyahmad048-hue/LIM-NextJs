import type { NumberingPeriod } from "./letter-number.rules";

/**
 * Tipe konfigurasi penomoran surat keluar — murni, tanpa akses data,
 * sehingga aman dipakai dari komponen tampilan.
 */

export interface LevelCodeOption {
  code: string;
  label: string;
}

export interface LetterNumberingConfig {
  formatTemplate: string;
  sequenceDigits: number;
  periods: NumberingPeriod[];
  levelCodes: LevelCodeOption[];
  /** Override nomor urut berikutnya per periodYear. */
  nextSequence: Record<string, number>;
}

export interface UpdateNumberingSettingsInput {
  formatTemplate?: string;
  sequenceDigits?: number;
  periods?: NumberingPeriod[];
  levelCodes?: LevelCodeOption[];
  nextSequence?: Record<string, number>;
}
