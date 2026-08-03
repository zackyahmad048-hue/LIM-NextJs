import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
} from "@/generated/client";
import type { SecretariatRepository } from "../domain/repository";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { googleConfig } from "@/modules/shared/infrastructure/google/config";
import { createDocumentFromTemplate } from "@/modules/shared/infrastructure/google/google-doc";
import {
  EntityNotFoundError,
  DuplicateNumberError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";

function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

const VALID_INCOMING_MAIL_TRANSITIONS: Record<
  IncomingMailStatus,
  IncomingMailStatus[]
> = {
  RECEIVED: ["PROCESSED"],
  PROCESSED: ["ARCHIVED"],
  ARCHIVED: [],
};

const VALID_OUTGOING_MAIL_TRANSITIONS: Record<
  OutgoingMailStatus,
  OutgoingMailStatus[]
> = {
  DRAFT: ["APPROVED"],
  APPROVED: ["SENT"],
  SENT: ["ARCHIVED"],
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
    return repo.createIncomingMail({ ...data, status: "RECEIVED" });
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

  async getOutgoingMailById(id: string) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);
    return mail;
  },

  async createOutgoingMail(
    data: Omit<
      Parameters<SecretariatRepository["createOutgoingMail"]>[0],
      "status" | "approvedById" | "approvedAt" | "googleDocId" | "googleDocUrl"
    >,
  ) {
    const existing = await repo.findOutgoingMailByNumber(
      data.registrationNumber,
    );
    if (existing) throw new DuplicateNumberError(data.registrationNumber);
    return repo.createOutgoingMail({
      ...data,
      status: "DRAFT",
      approvedById: null,
      approvedAt: null,
      googleDocId: null,
      googleDocUrl: null,
    });
  },

  async updateOutgoingMail(
    id: string,
    data: Parameters<SecretariatRepository["updateOutgoingMail"]>[1],
  ) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);

    if (
      data.registrationNumber &&
      data.registrationNumber !== mail.registrationNumber
    ) {
      const existing = await repo.findOutgoingMailByNumber(
        data.registrationNumber,
      );
      if (existing) throw new DuplicateNumberError(data.registrationNumber);
    }

    return repo.updateOutgoingMail(id, data);
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

    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "APPROVED") {
      updateData.approvedAt = new Date();
    }

    return repo.updateOutgoingMail(id, updateData);
  },

  async generateOutgoingMailDocument(id: string) {
    const mail = await repo.findOutgoingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Keluar", id);

    const templateId = googleConfig.templateSuratKeluarId;
    if (!templateId) {
      throw new Error(
        "GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID belum dikonfigurasi.",
      );
    }

    const doc = await createDocumentFromTemplate(
      templateId,
      {
        nomorSurat: mail.documentNumber || mail.registrationNumber,
        tanggalSurat: formatTanggal(mail.mailDate),
        perihal: mail.subject,
        penerima: mail.recipient || "",
        isi: mail.content || "",
        pengirim: mail.senderName || "",
      },
      `Surat Keluar - ${mail.registrationNumber}`,
    );

    return repo.updateOutgoingMail(id, {
      googleDocId: doc.id,
      googleDocUrl: doc.url,
    });
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
      | "status"
      | "submittedById"
      | "submittedAt"
      | "approvedById"
      | "approvedAt"
      | "googleDocId"
      | "googleDocUrl"
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
      googleDocId: null,
      googleDocUrl: null,
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
    }

    return repo.updateAdministrativeDocument(id, updateData);
  },

  async generateAdministrativeDocument(id: string) {
    const doc = await repo.findAdministrativeDocumentById(id);
    if (!doc) throw new EntityNotFoundError("Dokumen Administrasi", id);

    const templateId = googleConfig.templateDokAdminId;
    if (!templateId) {
      throw new Error("GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID belum dikonfigurasi.");
    }

    const generated = await createDocumentFromTemplate(
      templateId,
      {
        nomorDokumen: doc.documentNumber,
        judul: doc.title,
        isi: doc.content || "",
        deskripsi: doc.description || "",
      },
      `Dokumen - ${doc.documentNumber}`,
    );

    return repo.updateAdministrativeDocument(id, {
      googleDocId: generated.id,
      googleDocUrl: generated.url,
    });
  },

  // Agenda Book (read-only)
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
