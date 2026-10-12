import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { DispositionEntity } from "../domain/entities";
import type { DispositionRepository } from "../domain/repository";

export const dispositionRepository: DispositionRepository = {
  async findManyDispositions({
    incomingMailId,
    assignedToId,
    status,
    page,
    limit,
  }) {
    const where: Prisma.DispositionWhereInput = { deletedAt: null };
    if (incomingMailId) where.incomingMailId = incomingMailId;
    if (assignedToId) where.assignedToId = assignedToId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.disposition.findMany({
        where,
        include: {
          incomingMail: { select: { registrationNumber: true, subject: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.disposition.count({ where }),
    ]);

    return { items, total };
  },

  async findDispositionById(id) {
    const item = await prisma.disposition.findFirst({
      where: { id, deletedAt: null },
    });
    return item as DispositionEntity | null;
  },

  async createDisposition(data) {
    const item = await prisma.disposition.create({ data });
    return item as DispositionEntity;
  },

  async updateDisposition(id, data) {
    const item = await prisma.disposition.update({
      where: { id },
      data,
    });
    return item as DispositionEntity;
  },

  async deleteDisposition(id) {
    await prisma.disposition.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
