import { SecretariatError } from "../domain/secretariat.errors";
import { validateNumberingTemplate } from "./letter-number.rules";
import {
  getLetterNumberingConfig,
  saveNumberingSettings,
  type LetterNumberingConfig,
  type LevelCodeOption,
  type UpdateNumberingSettingsInput,
} from "../infrastructure/letter-numbering.config";
import type { NumberingPeriod } from "./letter-number.rules";

export interface NumberingSettingsInput {
  formatTemplate?: string;
  sequenceDigits?: number;
  periods?: NumberingPeriod[];
  levelCodes?: LevelCodeOption[];
}

/**
 * Layanan pengaturan penomoran surat keluar (khusus super admin).
 * Melakukan validasi sebelum menyimpan ke penyimpanan pengaturan.
 */
export const letterNumberingService = {
  async getConfig(): Promise<LetterNumberingConfig> {
    return getLetterNumberingConfig();
  },

  async updateSettings(input: NumberingSettingsInput): Promise<void> {
    if (input.formatTemplate !== undefined) {
      const error = validateNumberingTemplate(input.formatTemplate);
      if (error) throw new SecretariatError(error);
    }

    if (input.sequenceDigits !== undefined) {
      if (
        !Number.isInteger(input.sequenceDigits) ||
        input.sequenceDigits < 2 ||
        input.sequenceDigits > 6
      ) {
        throw new SecretariatError(
          "Jumlah digit urutan harus bilangan bulat antara 2 dan 6.",
        );
      }
    }

    if (input.periods !== undefined) {
      const error = validatePeriods(input.periods);
      if (error) throw new SecretariatError(error);
    }

    if (input.levelCodes !== undefined) {
      const error = validateLevelCodes(input.levelCodes);
      if (error) throw new SecretariatError(error);
    }

    const payload: UpdateNumberingSettingsInput = {};
    if (input.formatTemplate !== undefined)
      payload.formatTemplate = input.formatTemplate;
    if (input.sequenceDigits !== undefined)
      payload.sequenceDigits = input.sequenceDigits;
    if (input.periods !== undefined) payload.periods = input.periods;
    if (input.levelCodes !== undefined) payload.levelCodes = input.levelCodes;

    await saveNumberingSettings(payload);
  },

  /**
   * Atur nomor urut berikutnya untuk periode tertentu (koreksi manual).
   */
  async setNextSequence(periodYear: number, sequence: number): Promise<void> {
    if (!Number.isInteger(sequence) || sequence < 1) {
      throw new SecretariatError(
        "Nomor urut berikutnya harus bilangan bulat positif.",
      );
    }
    const config = await getLetterNumberingConfig();
    const periods = config.periods;
    if (!periods.some((period) => period.startYear === periodYear)) {
      throw new SecretariatError(
        `Periode ${periodYear} tidak terdaftar. Tambahkan periode terlebih dahulu.`,
      );
    }
    const nextSequence = { ...config.nextSequence, [periodYear]: sequence };
    await saveNumberingSettings({ nextSequence });
  },
};

function validatePeriods(periods: NumberingPeriod[]): string | null {
  if (!Array.isArray(periods) || periods.length === 0) {
    return "Minimal satu periode kepengurusan harus terdaftar.";
  }
  for (const period of periods) {
    if (
      !Number.isInteger(period.startYear) ||
      !Number.isInteger(period.endYear) ||
      period.startYear < 1900 ||
      period.endYear < period.startYear
    ) {
      return "Rentang periode tidak valid (endYear harus >= startYear).";
    }
  }
  const sorted = [...periods].sort((a, b) => a.startYear - b.startYear);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startYear <= sorted[i - 1].endYear) {
      return "Periode kepengurusan saling tumpang tindih.";
    }
  }
  return null;
}

function validateLevelCodes(levelCodes: LevelCodeOption[]): string | null {
  if (!Array.isArray(levelCodes) || levelCodes.length === 0) {
    return "Minimal satu kode tingkat harus terdaftar.";
  }
  const seen = new Set<string>();
  for (const level of levelCodes) {
    const code = level.code?.trim();
    const label = level.label?.trim();
    if (!code || !label) {
      return "Kode tingkat dan label wajib diisi.";
    }
    if (seen.has(code)) {
      return `Kode tingkat duplikat: ${code}.`;
    }
    seen.add(code);
  }
  return null;
}
