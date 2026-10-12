import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { OutgoingMailEntity } from "../domain/entities";
import type { OutgoingMailRepository } from "../domain/repository";

export const outgoingMailRepository: OutgoingMailRepository = {
  async findManyOutgoingMails({ search, status, page, limit }) {
    const where: Prisma.OutgoingMailWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { recipient: { contains: search } },
      ];
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.outgoingMail.findMany({
        where,
        orderBy: { mailDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.outgoingMail.count({ where }),
    ]);

    return { items: items as unknown as OutgoingMailEntity[], total };
  },

  async findOutgoingMailById(id) {
    const item = await prisma.outgoingMail.findFirst({
      where: { id, deletedAt: null },
    });
    return item as OutgoingMailEntity | null;
  },

  async findOutgoingMailByNumber(registrationNumber) {
    const item = await prisma.outgoingMail.findUnique({
      where: { registrationNumber },
    });
    return item as OutgoingMailEntity | null;
  },

  async findOutgoingMailByVerificationCode(code) {
    const item = await prisma.outgoingMail.findFirst({
      where: {
        deletedAt: null,
        OR: [{ verificationCode: code }, { fullNumber: code }],
      },
    });
    return item as OutgoingMailEntity | null;
  },

  async createOutgoingMail(data) {
    const item = await prisma.outgoingMail.create({ data: data as any });
    return item as OutgoingMailEntity;
  },

  async updateOutgoingMail(id, data) {
    const item = await prisma.outgoingMail.update({
      where: { id },
      data: data as any,
    });
    return item as OutgoingMailEntity;
  },

  async softDeleteOutgoingMail(id) {
    await prisma.outgoingMail.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findArchivedOutgoingMails({ search, limit = 100 }) {
    const where: Prisma.OutgoingMailWhereInput = {
      status: "ARCHIVED",
      deletedAt: null,
    };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { fullNumber: { contains: search } },
        { recipient: { contains: search } },
      ];

    const items = await prisma.outgoingMail.findMany({
      where,
      orderBy: { archivedAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },

  async findRecentOutgoingMails(limit) {
    const items = await prisma.outgoingMail.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },

  async countOutgoingMailsByStatus() {
    const [draft, sent, archived] = await Promise.all([
      prisma.outgoingMail.count({
        where: { status: "DRAFT", deletedAt: null },
      }),
      prisma.outgoingMail.count({ where: { status: "SENT", deletedAt: null } }),
      prisma.outgoingMail.count({
        where: { status: "ARCHIVED", deletedAt: null },
      }),
    ]);

    return { draft, sent, archived };
  },

  async countOutgoingMailsByMonth(year) {
    const rows = await prisma.$queryRaw<
      Array<{ month: number; count: number }>
    >`SELECT EXTRACT(MONTH FROM "createdAt")::int AS month, COUNT(*)::int AS count
       FROM outgoing_mail
       WHERE "createdAt" >= ${new Date(`${year}-01-01`)}::date
         AND "createdAt" < ${new Date(`${year + 1}-01-01`)}::date
         AND "deletedAt" IS NULL
       GROUP BY 1
       ORDER BY 1`;
    return rows;
  },

  async countOutgoingMailsByMonthRange(from, to) {
    const rows = await prisma.$queryRaw<
      Array<{ year: number; month: number; count: number }>
    >`SELECT EXTRACT(YEAR FROM "createdAt")::int AS year,
              EXTRACT(MONTH FROM "createdAt")::int AS month,
              COUNT(*)::int AS count
       FROM outgoing_mail
       WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
         AND "deletedAt" IS NULL
       GROUP BY 1, 2
       ORDER BY 1, 2`;
    return rows;
  },
};
