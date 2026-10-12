import type { DocumentType } from "@/generated/client";

import type { DocumentArchiveRepository } from "../domain/repository";
import { secretariatRepository } from "../infrastructure/repository";
import { EntityNotFoundError } from "../domain/secretariat.errors";

/** Penyimpanan agregat Arsip Dokumen — hanya operasi agregat ini. */
const repo: DocumentArchiveRepository = secretariatRepository;

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
