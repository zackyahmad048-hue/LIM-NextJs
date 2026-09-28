import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { Setting } from "@/payload-types";
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

interface PayloadNumberingGroup {
  formatTemplate?: string | null;
  sequenceDigits?: number | null;
  periods?: { startYear: number; endYear: number }[] | null;
  levelCodes?: LevelCodeOption[] | null;
  nextSequence?: Record<string, number> | null;
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

function isNumberingSet(
  numbering: PayloadNumberingGroup | undefined,
): numbering is PayloadNumberingGroup {
  if (!numbering) return false;
  return Boolean(
    numbering.formatTemplate ||
      numbering.sequenceDigits ||
      (numbering.periods && numbering.periods.length > 0) ||
      (numbering.levelCodes && numbering.levelCodes.length > 0) ||
      numbering.nextSequence,
  );
}

function payloadToConfig(numbering: PayloadNumberingGroup): LetterNumberingConfig {
  return {
    formatTemplate:
      numbering.formatTemplate?.trim() || DEFAULT_NUMBERING_CONFIG.formatTemplate,
    sequenceDigits:
      Number(numbering.sequenceDigits) || DEFAULT_NUMBERING_CONFIG.sequenceDigits,
    periods:
      numbering.periods && numbering.periods.length > 0
        ? numbering.periods.map((p) => ({
            startYear: Number(p.startYear),
            endYear: Number(p.endYear),
          }))
        : DEFAULT_NUMBERING_CONFIG.periods,
    levelCodes:
      numbering.levelCodes && numbering.levelCodes.length > 0
        ? numbering.levelCodes.map((l) => ({ code: l.code, label: l.label }))
        : DEFAULT_NUMBERING_CONFIG.levelCodes,
    nextSequence: numbering.nextSequence ?? {},
  };
}

async function legacyConfig(): Promise<LetterNumberingConfig> {
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

export async function getLetterNumberingConfig(): Promise<LetterNumberingConfig> {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "settings", depth: 0 });
  const numbering = (settings as { numbering?: PayloadNumberingGroup }).numbering;

  if (isNumberingSet(numbering)) {
    return payloadToConfig(numbering);
  }

  return legacyConfig();
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
  const numbering: NonNullable<Setting["numbering"]> = {};
  if (input.formatTemplate !== undefined)
    numbering.formatTemplate = input.formatTemplate.trim();
  if (input.sequenceDigits !== undefined)
    numbering.sequenceDigits = input.sequenceDigits;
  if (input.periods !== undefined)
    numbering.periods = input.periods.map((p) => ({
      startYear: p.startYear,
      endYear: p.endYear,
    }));
  if (input.levelCodes !== undefined)
    numbering.levelCodes = input.levelCodes.map((l) => ({
      code: l.code,
      label: l.label,
    }));
  if (input.nextSequence !== undefined)
    numbering.nextSequence = input.nextSequence;
  if (Object.keys(numbering).length === 0) return;

  const payload = await getPayloadClient();
  await payload.updateGlobal({ slug: "settings", data: { numbering } });
}
