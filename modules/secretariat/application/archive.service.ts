import type { DocumentType } from "@/generated/client";

import { secretariatRepository as repo } from "../infrastructure/repository";
import { EntityNotFoundError } from "../domain/secretariat.errors";

/**
 * Agregat Arsip Dokumen — baca saja. Entitas `DocumentArchive` tidak dipakai
 * halaman mana pun; dipertahankan sesuai keputusan restruktur.
 */
export const archiveService = {
  async listDocumentArchives(params: {
    search?: string;
    documentType?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyDocumentArchives({
      search: params.search,
      documentType: params.documentType as DocumentType,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getDocumentArchiveById(id: string) {
    const archive = await repo.findDocumentArchiveById(id);
    if (!archive) throw new EntityNotFoundError("Arsip Dokumen", id);
    return archive;
  },
};
