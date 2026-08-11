import { prisma } from "@/modules/shared/infrastructure/prisma";
import { SecretariatError } from "../domain/secretariat.errors";
import {
  formatLetterNumber,
  resolvePeriodYear,
  toRomanMonth,
} from "./letter-number.rules";
import {
  getLetterNumberingConfig,
  saveNumberingSettings,
} from "../infrastructure/letter-numbering.config";
import type { LetterNumber } from "./letter-number.rules";

export {
  NUMBERING_PLACEHOLDERS,
  ROMAN_MONTHS,
  toRomanMonth,
  padSequence,
  formatLetterNumber,
  validateNumberingTemplate,
  resolvePeriodYear,
  parseLetterNumber,
} from "./letter-number.rules";
export type {
  NumberingPeriod,
  LetterNumber,
  LetterNumberParts,
} from "./letter-number.rules";

export class LetterNumberAlreadyIssuedError extends SecretariatError {
  constructor() {
    super("Surat ini sudah memiliki nomor resmi.");
    this.name = "LetterNumberAlreadyIssuedError";
  }
}

/**
 * Menerbitkan nomor surat untuk surat keluar saat ditandai terkirim.
 * Urutan global untuk semua kategori, dihitung per periode kepengurusan
 * (periode ditentukan dari pengaturan), dijamin unik melalui transaksi +
 * constraint (periodYear, sequence). Format nomor mengikuti pengaturan
 * penomoran (template + digit urutan + override nomor berikutnya).
 */
export async function assignLetterNumber(
  mailId: string,
  params: { levelCode: string | null; categoryCode: string | null; mailDate: Date },
): Promise<LetterNumber> {
  const config = await getLetterNumberingConfig();

  const year = params.mailDate.getFullYear();
  const periodYear = resolvePeriodYear(year, config.periods);
  if (periodYear === null) {
    throw new SecretariatError(
      `Tahun surat ${year} tidak berada dalam periode kepengurusan yang terdaftar. Hubungi super admin untuk menambah periode.`,
    );
  }

  const romanMonth = toRomanMonth(params.mailDate);
  const levelCode = params.levelCode || "PP";
  const categoryCode = params.categoryCode || "A";
  const nextSequenceOverride = config.nextSequence[periodYear] ?? 0;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const mail = await tx.outgoingMail.findUnique({
          where: { id: mailId },
          select: { fullNumber: true, deletedAt: true },
        });
        if (!mail || mail.deletedAt) {
          throw new SecretariatError("Surat keluar tidak ditemukan.");
        }
        if (mail.fullNumber) {
          throw new LetterNumberAlreadyIssuedError();
        }

        // Nomor surat tidak boleh dipakai ulang, termasuk yang sudah
        // dihapus (soft delete) — constraint unique (periodYear, sequence)
        // tetap berlaku untuk semua baris.
        const latest = await tx.outgoingMail.findFirst({
          where: {
            periodYear,
            sequence: { not: null },
          },
          orderBy: { sequence: "desc" },
          select: { sequence: true },
        });

        const sequence = Math.max(
          (latest?.sequence ?? 0) + 1,
          nextSequenceOverride,
        );
        const fullNumber = formatLetterNumber(
          {
            sequence,
            levelCode,
            categoryCode,
            romanMonth,
            year,
          },
          {
            template: config.formatTemplate,
            sequenceDigits: config.sequenceDigits,
          },
        );

        await tx.outgoingMail.update({
          where: { id: mailId },
          data: {
            sequence,
            levelCode,
            categoryCode,
            romanMonth,
            periodYear,
            fullNumber,
          },
        });

        return {
          sequence,
          levelCode,
          categoryCode,
          romanMonth,
          year,
          fullNumber,
        };
      });

      // Override "nomor urut berikutnya" sudah terpakai — bersihkan.
      if (
        nextSequenceOverride > 0 &&
        result.sequence >= nextSequenceOverride
      ) {
        await clearNextSequenceOverride(periodYear);
      }

      return result;
    } catch (error) {
      const isUniqueConflict =
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "P2002";
      if (isUniqueConflict && attempt < 2) continue;
      throw error;
    }
  }

  throw new SecretariatError("Nomor surat gagal diterbitkan.");
}

async function clearNextSequenceOverride(periodYear: number) {
  try {
    const config = await getLetterNumberingConfig();
    const nextSequence = { ...config.nextSequence };
    delete nextSequence[periodYear];
    await saveNumberingSettings({ nextSequence });
  } catch {
    // Best-effort — override yang tidak terpakai tidak mengganggu urutan.
  }
}
