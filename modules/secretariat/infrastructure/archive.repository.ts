import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { DocumentArchiveEntity } from "../domain/entities";
import type { DocumentArchiveRepository } from "../domain/repository";

export const documentArchiveRepository: DocumentArchiveRepository = {
  async findManyDocumentArchives({ search, documentType, page, limit }) {
    const where: Prisma.DocumentArchiveWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { title: { contains: search } },
        { archiveNumber: { contains: search } },
      ];
    if (documentType) where.documentType = documentType;

    const [items, total] = await Promise.all([
      prisma.documentArchive.findMany({
        where,
        orderBy: { archivedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.documentArchive.count({ where }),
    ]);

    return { items: items as unknown as DocumentArchiveEntity[], total };
  },

  async findDocumentArchiveById(id) {
    const item = await prisma.documentArchive.findFirst({
      where: { id, deletedAt: null },
    });
    return item as DocumentArchiveEntity | null;
  },
};
