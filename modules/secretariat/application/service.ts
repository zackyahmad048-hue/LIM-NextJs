import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
} from "@/generated/client";
import type { SecretariatRepository } from "../domain/repository";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { assignLetterNumber } from "./letter-number.service";
import { signOutgoingMail } from "./signing.service";
import {
  EntityNotFoundError,
  DuplicateNumberError,
  InvalidStatusTransitionError,
  ForbiddenActionError,
} from "../domain/secretariat.errors";

const VALID_INCOMING_MAIL_TRANSITIONS: Record<
  IncomingMailStatus,
  IncomingMailStatus[]
> = {
  RECEIVED: [],
  PROCESSED: [],
  ARCHIVED: [],
};

const VALID_OUTGOING_MAIL_TRANSITIONS: Record<
  OutgoingMailStatus,
  OutgoingMailStatus[]
> = {
  DRAFT: ["SENT", "ARCHIVED"],
  SENT: ["DRAFT", "ARCHIVED"],
  ARCHIVED: [],
};

const VALID_DISPOSITION_TRANSITIONS: Record<
  DispositionStatus,
  DispositionStatus[]
> = {
  PENDING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

const VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS: Record<
  AdministrativeDocumentStatus,
  AdministrativeDocumentStatus[]
> = {
  DRAFT: ["SUBMITTED", "REJECTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  APPROVED: ["ARCHIVED"],
  REJECTED: ["DRAFT"],
  ARCHIVED: [],
};

function canTransition<T extends string>(
  validTransitions: Record<T, T[]>,
  from: T,
  to: T,
): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}

export const secretariatService = {
  // Incoming Mail
  async listIncomingMails(params: {
    search?: string;
    status?: IncomingMailStatus;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyIncomingMails({
      search: params.search,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getIncomingMailById(id: string) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);
    return mail;
  },

  async createIncomingMail(
    data: Omit<
      Parameters<SecretariatRepository["createIncomingMail"]>[0],
      "status"
    >,
  ) {
    const existing = await repo.findIncomingMailByNumber(
      data.registrationNumber,
    );
    if (existing) throw new DuplicateNumberError(data.registrationNumber);
    return repo.createIncomingMail({
      ...data,
      status: "ARCHIVED",
    });
  },

  async updateIncomingMail(
    id: string,
    data: Parameters<SecretariatRepository["updateIncomingMail"]>[1],
  ) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);

    if (
      data.registrationNumber &&
      data.registrationNumber !== mail.registrationNumber
    ) {
      const existing = await repo.findIncomingMailByNumber(
        data.registrationNumber,
      );
      if (existing) throw new DuplicateNumberError(data.registrationNumber);
    }

    return repo.updateIncomingMail(id, data);
  },

  async deleteIncomingMail(id: string) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);
    await repo.softDeleteIncomingMail(id);
  },

  async transitionIncomingMailStatus(
    id: string,
    newStatus: IncomingMailStatus,
  ) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);

    if (
      !canTransition(VALID_INCOMING_MAIL_TRANSITIONS, mail.status, newStatus)
    ) {
      throw new InvalidStatusTransitionError(mail.status, newStatus);
    }

    return repo.updateIncomingMail(id, { status: newStatus });
  },

  // Outgoing Mail
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

  async listArchivedIncomingMails(params: { search?: string; limit?: number }) {
    return repo.findArchivedIncomingMails({
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
      Parameters<SecretariatRepository["createOutgoingMail"]>[0],
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
    data: Parameters<SecretariatRepository["updateOutgoingMail"]>[1],
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
      Parameters<SecretariatRepository["updateOutgoingMail"]>[1]
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

  // Disposition
  async listDispositions(params: {
    incomingMailId?: string;
    assignedToId?: string;
    status?: DispositionStatus;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyDispositions({
      incomingMailId: params.incomingMailId,
      assignedToId: params.assignedToId,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getDispositionById(id: string) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    return disposition;
  },

  async createDisposition(
    data: Omit<
      Parameters<SecretariatRepository["createDisposition"]>[0],
      "status"
    >,
  ) {
    const mail = await repo.findIncomingMailById(data.incomingMailId);
    if (!mail)
      throw new EntityNotFoundError("Surat Masuk", data.incomingMailId);
    return repo.createDisposition({ ...data, status: "PENDING" });
  },

  async updateDisposition(
    id: string,
    data: Parameters<SecretariatRepository["updateDisposition"]>[1],
  ) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    return repo.updateDisposition(id, data);
  },

  async deleteDisposition(id: string) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    await repo.deleteDisposition(id);
  },

  async transitionDispositionStatus(id: string, newStatus: DispositionStatus) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);

    if (
      !canTransition(
        VALID_DISPOSITION_TRANSITIONS,
        disposition.status,
        newStatus,
      )
    ) {
      throw new InvalidStatusTransitionError(disposition.status, newStatus);
    }

    return repo.updateDisposition(id, { status: newStatus });
  },

  // Administrative Document
  async listAdministrativeDocuments(params: {
    search?: string;
    status?: AdministrativeDocumentStatus;
    documentType?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyAdministrativeDocuments({
      search: params.search,
      status: params.status,
      documentType: params.documentType as any,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getAdministrativeDocumentById(id: string) {
    const doc = await repo.findAdministrativeDocumentById(id);
    if (!doc) throw new EntityNotFoundError("Dokumen Administrasi", id);
    return doc;
  },

  async createAdministrativeDocument(
    data: Omit<
      Parameters<SecretariatRepository["createAdministrativeDocument"]>[0],
      "status" | "submittedById" | "submittedAt" | "approvedById" | "approvedAt"
    >,
  ) {
    const existing = await repo.findAdministrativeDocumentByNumber(
      data.documentNumber,
    );
    if (existing) throw new DuplicateNumberError(data.documentNumber);
    return repo.createAdministrativeDocument({
      ...data,
      status: "DRAFT",
      submittedById: null,
      submittedAt: null,
      approvedById: null,
      approvedAt: null,
    });
  },

  async updateAdministrativeDocument(
    id: string,
    data: Parameters<SecretariatRepository["updateAdministrativeDocument"]>[1],
  ) {
    const doc = await repo.findAdministrativeDocumentById(id);
    if (!doc) throw new EntityNotFoundError("Dokumen Administrasi", id);

    if (data.documentNumber && data.documentNumber !== doc.documentNumber) {
      const existing = await repo.findAdministrativeDocumentByNumber(
        data.documentNumber,
      );
      if (existing) throw new DuplicateNumberError(data.documentNumber);
    }

    return repo.updateAdministrativeDocument(id, data);
  },

  async deleteAdministrativeDocument(id: string) {
    const doc = await repo.findAdministrativeDocumentById(id);
    if (!doc) throw new EntityNotFoundError("Dokumen Administrasi", id);
    await repo.softDeleteAdministrativeDocument(id);
  },

  async transitionAdministrativeDocumentStatus(
    id: string,
    newStatus: AdministrativeDocumentStatus,
  ) {
    const doc = await repo.findAdministrativeDocumentById(id);
    if (!doc) throw new EntityNotFoundError("Dokumen Administrasi", id);

    if (
      !canTransition(
        VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS,
        doc.status,
        newStatus,
      )
    ) {
      throw new InvalidStatusTransitionError(doc.status, newStatus);
    }

    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "SUBMITTED") {
      updateData.submittedAt = new Date();
    } else if (newStatus === "APPROVED") {
      updateData.approvedAt = new Date();
    } else if (newStatus === "ARCHIVED") {
      updateData.archivedAt = new Date();
    } else if (newStatus === "REJECTED" || newStatus === "DRAFT") {
      updateData.approvedAt = null;
      updateData.approvedById = null;
    }

    return repo.updateAdministrativeDocument(id, updateData);
  },

  // Agenda Book
  async listAgendaBooks(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyAgendaBooks({
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getAgendaBookById(id: string) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    return agenda;
  },

  async createAgendaBook(
    data: Parameters<SecretariatRepository["createAgendaBook"]>[0],
  ) {
    return repo.createAgendaBook({ ...data, date: new Date(data.date) });
  },

  async updateAgendaBook(
    id: string,
    data: Parameters<SecretariatRepository["updateAgendaBook"]>[1],
  ) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    const payload: Record<string, unknown> = { ...data };
    if (payload.date) payload.date = new Date(payload.date as string);
    return repo.updateAgendaBook(id, payload as any);
  },

  async deleteAgendaBook(id: string) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    await repo.softDeleteAgendaBook(id);
  },

  async listAgendasInRange(params: { from: Date; to: Date }) {
    return repo.findAgendasInRange(params);
  },

  async listRecentOutgoingMails(limit: number) {
    return repo.findRecentOutgoingMails(limit);
  },

  async listRecentIncomingMails(limit: number) {
    return repo.findRecentIncomingMails(limit);
  },

  async listUpcomingAgendas(params: { from: Date; limit: number }) {
    return repo.findUpcomingAgendas(params);
  },

  async countIncomingMailsByMonth(year: number) {
    return repo.countIncomingMailsByMonth(year);
  },

  async countOutgoingMailsByMonth(year: number) {
    return repo.countOutgoingMailsByMonth(year);
  },

  // Document Archive (read-only)
  async listDocumentArchives(params: {
    search?: string;
    documentType?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyDocumentArchives({
      search: params.search,
      documentType: params.documentType as any,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getDocumentArchiveById(id: string) {
    const archive = await repo.findDocumentArchiveById(id);
    if (!archive) throw new EntityNotFoundError("Arsip Dokumen", id);
    return archive;
  },

  // Dashboard
  async getDashboardStats() {
    return repo.getDashboardStats();
  },
};
