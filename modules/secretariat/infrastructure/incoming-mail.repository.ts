import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { IncomingMailEntity } from "../domain/entities";
import type { IncomingMailRepository } from "../domain/repository";

export const incomingMailRepository: IncomingMailRepository = {
  async findManyIncomingMails({ search, status, page, limit }) {
    const where: Prisma.IncomingMailWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { sender: { contains: search } },
      ];
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.incomingMail.findMany({
        where,
        orderBy: { receivedDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.incomingMail.count({ where }),
    ]);

    return { items: items as unknown as IncomingMailEntity[], total };
  },

  async findIncomingMailById(id) {
    const item = await prisma.incomingMail.findFirst({
      where: { id, deletedAt: null },
    });
    return item as IncomingMailEntity | null;
  },

  async findIncomingMailByNumber(registrationNumber) {
    const item = await prisma.incomingMail.findUnique({
      where: { registrationNumber },
    });
    return item as IncomingMailEntity | null;
  },

  async createIncomingMail(data) {
    const item = await prisma.incomingMail.create({
      data: {
        ...data,
        archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      } as any,
    });
    return item as IncomingMailEntity;
  },

  async updateIncomingMail(id, data) {
    const item = await prisma.incomingMail.update({
      where: { id },
      data: data as any,
    });
    return item as IncomingMailEntity;
  },

  async softDeleteIncomingMail(id) {
    await prisma.incomingMail.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findArchivedIncomingMails({ search, limit = 100 }) {
    const where: Prisma.IncomingMailWhereInput = {
      status: "ARCHIVED",
      deletedAt: null,
    };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { sender: { contains: search } },
      ];

    const items = await prisma.incomingMail.findMany({
      where,
      orderBy: { archivedAt: "desc" },
      take: limit,
    });
    return items as unknown as IncomingMailEntity[];
  },

  async findRecentIncomingMails(limit) {
    const items = await prisma.incomingMail.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items as unknown as IncomingMailEntity[];
  },
};
