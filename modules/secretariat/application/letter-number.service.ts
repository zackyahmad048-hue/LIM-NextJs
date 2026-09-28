import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
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
      const payload = await getPayloadClient();
      const idNum = Number(mailId);
      if (!Number.isInteger(idNum)) {
        throw new SecretariatError("Surat keluar tidak ditemukan.");
      }

      const found = await payload.find({
        collection: "outgoing-mails",
        where: { id: { equals: idNum } },
        limit: 1,
        depth: 0,
      });
      const mail = found.docs[0];
      if (!mail || mail.deletedAt) {
        throw new SecretariatError("Surat keluar tidak ditemukan.");
      }
      if (mail.fullNumber) {
        throw new LetterNumberAlreadyIssuedError();
      }

      // Nomor surat tidak boleh dipakai ulang, termasuk yang sudah
      // dihapus (soft delete) — constraint unique (periodYear, sequence)
      // tetap berlaku untuk semua baris.
      const latestRes = await payload.find({
        collection: "outgoing-mails",
        where: {
          and: [
            { periodYear: { equals: periodYear } },
            { sequence: { greater_than: 0 } },
          ],
        },
        sort: "-sequence",
        limit: 1,
        depth: 0,
      });
      const latest = latestRes.docs[0];

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

      await payload.update({
        collection: "outgoing-mails",
        id: idNum,
        data: {
          sequence,
          levelCode,
          categoryCode,
          romanMonth,
          periodYear,
          fullNumber,
        },
      });

      const result = {
        sequence,
        levelCode,
        categoryCode,
        romanMonth,
        year,
        fullNumber,
      };

      // Override "nomor urut berikutnya" sudah terpakai — bersihkan.
      if (
        nextSequenceOverride > 0 &&
        result.sequence >= nextSequenceOverride
      ) {
        await clearNextSequenceOverride(periodYear);
      }

      return result;
    } catch (error) {
      const isUniqueConflict = isSequenceConflict(error);
      if (isUniqueConflict && attempt < 2) continue;
      throw error;
    }
  }

  throw new SecretariatError("Nomor surat gagal diterbitkan.");
}

function isSequenceConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as {
    code?: unknown;
    message?: unknown;
    cause?: { code?: unknown; message?: unknown };
  };
  if (e.code === "P2002") return true;
  const cause = e.cause;
  if (cause && typeof cause === "object" && cause.code === "23505") {
    return true;
  }
  const text = `${String(e.message ?? "")} ${String(cause?.message ?? "")}`;
  return /duplicate key|unique constraint/i.test(text);
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
