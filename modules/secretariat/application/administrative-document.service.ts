import type {
  AdministrativeDocumentStatus,
  DocumentType,
} from "@/generated/client";

import type { AdministrativeDocumentRepository } from "../domain/repository";
import { secretariatRepository } from "../infrastructure/repository";
import {
  DuplicateNumberError,
  EntityNotFoundError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import {
  VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS,
  canTransition,
} from "./status-transition";

/** Penyimpanan agregat Dokumen Administrasi — hanya operasi agregat ini. */
const repo: AdministrativeDocumentRepository = secretariatRepository;

/** Perilaku agregat Dokumen Administrasi dan alur persetujuannya. */
export const administrativeDocumentService = {
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
      documentType: params.documentType as DocumentType,
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
      Parameters<AdministrativeDocumentRepository["createAdministrativeDocument"]>[0],
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
    data: Parameters<AdministrativeDocumentRepository["updateAdministrativeDocument"]>[1],
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
};
