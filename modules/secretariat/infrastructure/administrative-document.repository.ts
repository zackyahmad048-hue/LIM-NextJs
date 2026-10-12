import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { AdministrativeDocumentEntity } from "../domain/entities";
import type { AdministrativeDocumentRepository } from "../domain/repository";

export const administrativeDocumentRepository: AdministrativeDocumentRepository =
  {
    async findManyAdministrativeDocuments({
      search,
      status,
      documentType,
      page,
      limit,
    }) {
      const where: Prisma.AdministrativeDocumentWhereInput = {
        deletedAt: null,
      };
      if (search)
        where.OR = [
          { title: { contains: search } },
          { documentNumber: { contains: search } },
        ];
      if (status) where.status = status;
      if (documentType) where.documentType = documentType;

      const [items, total] = await Promise.all([
        prisma.administrativeDocument.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.administrativeDocument.count({ where }),
      ]);

      return {
        items: items as unknown as AdministrativeDocumentEntity[],
        total,
      };
    },

    async findAdministrativeDocumentById(id) {
      const item = await prisma.administrativeDocument.findFirst({
        where: { id, deletedAt: null },
      });
      return item as AdministrativeDocumentEntity | null;
    },

    async findAdministrativeDocumentByNumber(documentNumber) {
      const item = await prisma.administrativeDocument.findUnique({
        where: { documentNumber },
      });
      return item as AdministrativeDocumentEntity | null;
    },

    async createAdministrativeDocument(data) {
      const item = await prisma.administrativeDocument.create({
        data: {
          ...data,
          archivedAt: data.status === "ARCHIVED" ? new Date() : null,
        },
      });
      return item as AdministrativeDocumentEntity;
    },

    async updateAdministrativeDocument(id, data) {
      const item = await prisma.administrativeDocument.update({
        where: { id },
        data,
      });
      return item as AdministrativeDocumentEntity;
    },

    async softDeleteAdministrativeDocument(id) {
      await prisma.administrativeDocument.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
  };
