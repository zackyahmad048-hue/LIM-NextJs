import { prisma } from "@/modules/shared/infrastructure/prisma";
import { SecretariatError } from "../domain/secretariat.errors";
import {
  LEADERSHIP_PERIOD_START_YEAR,
  formatLetterNumber,
  toRomanMonth,
} from "./letter-number.rules";
import type { LetterNumber } from "./letter-number.rules";

export {
  LEADERSHIP_PERIOD_START_YEAR,
  LETTER_LEVEL_CODES,
  LETTER_LEVEL_LABELS,
  ROMAN_MONTHS,
  toRomanMonth,
  padSequence,
  formatLetterNumber,
  parseLetterNumber,
} from "./letter-number.rules";
export type {
  LetterLevelCode,
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
 * Menerbitkan nomor surat untuk surat keluar saat disetujui.
 * Urutan global untuk semua kategori, dihitung per periode kepengurusan,
 * dan dijamin unik melalui transaksi + constraint (periodYear, sequence).
 */
export async function assignLetterNumber(
  mailId: string,
  params: { levelCode: string; categoryCode: string; mailDate: Date },
): Promise<LetterNumber> {
  const year = params.mailDate.getFullYear();
  const periodYear = LEADERSHIP_PERIOD_START_YEAR;
  const romanMonth = toRomanMonth(params.mailDate);
  const levelCode = params.levelCode || "PP";
  const categoryCode = params.categoryCode || "A";

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
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

        const latest = await tx.outgoingMail.findFirst({
          where: {
            periodYear,
            sequence: { not: null },
            deletedAt: null,
          },
          orderBy: { sequence: "desc" },
          select: { sequence: true },
        });

        const sequence = (latest?.sequence ?? 0) + 1;
        const fullNumber = formatLetterNumber({
          sequence,
          levelCode,
          categoryCode,
          romanMonth,
          year,
        });

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

        return { sequence, levelCode, categoryCode, romanMonth, year, fullNumber };
      });
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
