import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { NumberingPeriod } from "../application/letter-number.rules";

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

export const NUMBERING_SETTING_KEYS = {
  formatTemplate: "secretariat.numbering.formatTemplate",
  sequenceDigits: "secretariat.numbering.sequenceDigits",
  periods: "secretariat.numbering.periods",
  levelCodes: "secretariat.numbering.levelCodes",
  nextSequence: "secretariat.numbering.nextSequence",
} as const;

const DEFAULT_LEVEL_CODES: LevelCodeOption[] = [
  { code: "PP", label: "Pengurus Pusat" },
  { code: "PP.I", label: "Bidang I" },
  { code: "PP.II", label: "Bidang II" },
  { code: "PP.III", label: "Bidang III" },
  { code: "PP.IV", label: "Bidang IV" },
  { code: "PP.V", label: "Bidang V" },
  { code: "PP.VI", label: "Bidang VI" },
  { code: "PP.VII", label: "Bidang VII" },
  { code: "PP.VIII", label: "Bidang VIII" },
  { code: "PP.IX", label: "Bidang IX" },
];

export const DEFAULT_NUMBERING_CONFIG: LetterNumberingConfig = {
  formatTemplate: "{seq}/{level}/{category}/{bulan}/{tahun}",
  sequenceDigits: 3,
  periods: [{ startYear: 2024, endYear: 2029 }],
  levelCodes: DEFAULT_LEVEL_CODES,
  nextSequence: {},
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getLetterNumberingConfig(): Promise<LetterNumberingConfig> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: Object.values(NUMBERING_SETTING_KEYS) } },
  });
  const values = new Map(rows.map((row) => [row.key, row.value]));

  const read = (key: string, fallback: string): string =>
    values.get(key) ?? fallback;

  return {
    formatTemplate: read(
      NUMBERING_SETTING_KEYS.formatTemplate,
      DEFAULT_NUMBERING_CONFIG.formatTemplate,
    ),
    sequenceDigits:
      Number(read(NUMBERING_SETTING_KEYS.sequenceDigits, "3")) || 3,
    periods: parseJson(
      read(NUMBERING_SETTING_KEYS.periods, "null"),
      DEFAULT_NUMBERING_CONFIG.periods,
    ),
    levelCodes: parseJson(
      read(NUMBERING_SETTING_KEYS.levelCodes, "null"),
      DEFAULT_NUMBERING_CONFIG.levelCodes,
    ),
    nextSequence: parseJson(
      read(NUMBERING_SETTING_KEYS.nextSequence, "{}"),
      {},
    ),
  };
}

type SettingType = "STRING" | "NUMBER" | "BOOLEAN" | "JSON";

async function upsertSetting(
  key: string,
  value: string,
  type: SettingType,
  description: string,
) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value, type, description },
    update: { value, type, description },
  });
}

export interface UpdateNumberingSettingsInput {
  formatTemplate?: string;
  sequenceDigits?: number;
  periods?: NumberingPeriod[];
  levelCodes?: LevelCodeOption[];
  nextSequence?: Record<string, number>;
}

export async function saveNumberingSettings(
  input: UpdateNumberingSettingsInput,
): Promise<void> {
  if (input.formatTemplate !== undefined) {
    await upsertSetting(
      NUMBERING_SETTING_KEYS.formatTemplate,
      input.formatTemplate.trim(),
      "STRING",
      "Template format nomor surat keluar (placeholder: {seq}, {level}, {category}, {bulan}, {tahun}).",
    );
  }
  if (input.sequenceDigits !== undefined) {
    await upsertSetting(
      NUMBERING_SETTING_KEYS.sequenceDigits,
      String(input.sequenceDigits),
      "NUMBER",
      "Jumlah digit nomor urut (padding, mis. 3 => 001).",
    );
  }
  if (input.periods !== undefined) {
    await upsertSetting(
      NUMBERING_SETTING_KEYS.periods,
      JSON.stringify(input.periods),
      "JSON",
      "Daftar periode kepengurusan (rentang tahun).",
    );
  }
  if (input.levelCodes !== undefined) {
    await upsertSetting(
      NUMBERING_SETTING_KEYS.levelCodes,
      JSON.stringify(input.levelCodes),
      "JSON",
      "Kode tingkat kepengurusan untuk penomoran surat.",
    );
  }
  if (input.nextSequence !== undefined) {
    await upsertSetting(
      NUMBERING_SETTING_KEYS.nextSequence,
      JSON.stringify(input.nextSequence),
      "JSON",
      "Override nomor urut berikutnya per periode ({\"periodYear\": n}).",
    );
  }
}
