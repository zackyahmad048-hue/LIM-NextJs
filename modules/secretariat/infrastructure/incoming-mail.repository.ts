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

  async countIncomingMailsByStatus() {
    const [received, archived] = await Promise.all([
      prisma.incomingMail.count({
        where: { status: "RECEIVED", deletedAt: null },
      }),
      prisma.incomingMail.count({
        where: { status: "ARCHIVED", deletedAt: null },
      }),
    ]);

    return { received, archived };
  },

  async countIncomingMailsByMonth(year) {
    const rows = await prisma.$queryRaw<
      Array<{ month: number; count: number }>
    >`SELECT EXTRACT(MONTH FROM "receivedDate")::int AS month, COUNT(*)::int AS count
       FROM incoming_mail
       WHERE "receivedDate" >= ${new Date(`${year}-01-01`)}::date
         AND "receivedDate" < ${new Date(`${year + 1}-01-01`)}::date
         AND "deletedAt" IS NULL
       GROUP BY 1
       ORDER BY 1`;
    return rows;
  },

  async countIncomingMailsByMonthRange(from, to) {
    const rows = await prisma.$queryRaw<
      Array<{ year: number; month: number; count: number }>
    >`SELECT EXTRACT(YEAR FROM "receivedDate")::int AS year,
              EXTRACT(MONTH FROM "receivedDate")::int AS month,
              COUNT(*)::int AS count
       FROM incoming_mail
       WHERE "receivedDate" >= ${from} AND "receivedDate" < ${to}
         AND "deletedAt" IS NULL
       GROUP BY 1, 2
       ORDER BY 1, 2`;
    return rows;
  },
};
