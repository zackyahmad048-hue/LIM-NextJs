import type { OutgoingMailStatus } from "@/generated/client";

import type { OutgoingMailRepository } from "../domain/repository";
import { secretariatRepository } from "../infrastructure/repository";
import { assignLetterNumber } from "./letter-number.service";
import { signOutgoingMail } from "./signing.service";
import {
  DuplicateNumberError,
  EntityNotFoundError,
  ForbiddenActionError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import {
  VALID_OUTGOING_MAIL_TRANSITIONS,
  canTransition,
} from "./status-transition";

/** Penyimpanan agregat Surat Keluar — hanya operasi agregat ini. */
const repo: OutgoingMailRepository = secretariatRepository;

/** Perilaku agregat Surat Keluar, termasuk penomoran dan penandatanganan. */
export const outgoingMailService = {
  async listOutgoingMails(params: {
    search?: string;
    status?: OutgoingMailStatus;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyOutgoingMails({
      search: params.search,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async listArchivedOutgoingMails(params: { search?: string; limit?: number }) {
    return repo.findArchivedOutgoingMails({
      search: params.search,
      limit: params.limit,
    });
  },

  async getOutgoingMailById(id: string) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);
    return mail;
  },

  async createOutgoingMail(
    data: Omit<
      Parameters<OutgoingMailRepository["createOutgoingMail"]>[0],
      | "status"
      | "registrationNumber"
      | "sentAt"
      | "archivedAt"
      | "sequence"
      | "levelCode"
      | "categoryCode"
      | "romanMonth"
      | "periodYear"
      | "fullNumber"
      | "verificationCode"
      | "qrFileId"
    > & { levelCode: string; categoryCode: string },
  ) {
    const registrationNumber = `DRAFT-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const created = await repo.createOutgoingMail({
      ...data,
      registrationNumber,
      levelCode: data.levelCode,
      categoryCode: data.categoryCode,
      status: "DRAFT",
      sentAt: null,
      archivedAt: null,
      sequence: null,
      romanMonth: null,
      periodYear: null,
      fullNumber: null,
      verificationCode: null,
      qrFileId: null,
    });

    return created;
  },

  async updateOutgoingMail(
    id: string,
    data: Parameters<OutgoingMailRepository["updateOutgoingMail"]>[1],
  ) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);

    if (mail.status === "ARCHIVED") {
      throw new ForbiddenActionError(
        "Surat yang sudah diarsipkan tidak dapat diubah.",
      );
    }

    if (
      data.registrationNumber &&
      data.registrationNumber !== mail.registrationNumber
    ) {
      const existing = await repo.findOutgoingMailByNumber(
        data.registrationNumber,
      );
      if (existing) throw new DuplicateNumberError(data.registrationNumber);
    }

    const updated = await repo.updateOutgoingMail(id, data);

    // Surat yang sudah terkirim — jika level/kategori berubah, nomor diterbitkan ulang.
    const levelChanged =
      data.levelCode && data.levelCode !== mail.levelCode;
    const categoryChanged =
      data.categoryCode && data.categoryCode !== mail.categoryCode;
    if (mail.status === "SENT" && (levelChanged || categoryChanged)) {
      const number = await assignLetterNumber(id, {
        levelCode: data.levelCode ?? mail.levelCode,
        categoryCode: data.categoryCode ?? mail.categoryCode,
        mailDate: data.mailDate ?? mail.mailDate,
      });

      const signed = await signOutgoingMail({
        ...mail,
        fullNumber: number.fullNumber,
      });

      return repo.updateOutgoingMail(id, {
        fullNumber: number.fullNumber,
        verificationCode: signed.verificationCode,
        qrFileId: signed.qrFileId,
        attachmentUrl: signed.attachmentUrl ?? mail.attachmentUrl,
      });
    }

    return updated;
  },

  async deleteOutgoingMail(id: string) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);
    await repo.softDeleteOutgoingMail(id);
  },

  async transitionOutgoingMailStatus(
    id: string,
    newStatus: OutgoingMailStatus,
  ) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);

    if (
      !canTransition(VALID_OUTGOING_MAIL_TRANSITIONS, mail.status, newStatus)
    ) {
      throw new InvalidStatusTransitionError(mail.status, newStatus);
    }

    const updateData: Partial<
      Parameters<OutgoingMailRepository["updateOutgoingMail"]>[1]
    > = { status: newStatus };

    if (newStatus === "SENT") {
      updateData.sentAt = new Date();

      // Nomor resmi + QR verifikasi diterbitkan otomatis saat surat ditandai terkirim.
      if (!mail.fullNumber) {
        const number = await assignLetterNumber(mail.id, {
          levelCode: mail.levelCode,
          categoryCode: mail.categoryCode,
          mailDate: mail.mailDate,
        });

        const signed = await signOutgoingMail({
          ...mail,
          fullNumber: number.fullNumber,
        });

        updateData.fullNumber = number.fullNumber;
        updateData.verificationCode = signed.verificationCode;
        updateData.qrFileId = signed.qrFileId;
        updateData.attachmentUrl = signed.attachmentUrl ?? mail.attachmentUrl;
      }
    } else if (newStatus === "DRAFT") {
      // Membatalkan "terkirim" kembali ke draft.
      updateData.sentAt = null;
    } else if (newStatus === "ARCHIVED") {
      updateData.archivedAt = new Date();
    }

    const updated = await repo.updateOutgoingMail(id, updateData);

    return updated;
  },

  async listRecentOutgoingMails(limit: number) {
    return repo.findRecentOutgoingMails(limit);
  },
};
