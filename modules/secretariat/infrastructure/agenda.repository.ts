import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { AgendaBookEntity } from "../domain/entities";
import type { AgendaBookRepository } from "../domain/repository";

export const agendaBookRepository: AgendaBookRepository = {
  async findManyAgendaBooks({ search, page, limit }) {
    const where: Prisma.AgendaBookWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];

    const [items, total] = await Promise.all([
      prisma.agendaBook.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agendaBook.count({ where }),
    ]);

    return { items: items as unknown as AgendaBookEntity[], total };
  },

  async findAgendaBookById(id) {
    const item = await prisma.agendaBook.findFirst({
      where: { id, deletedAt: null },
    });
    return item as AgendaBookEntity | null;
  },

  async createAgendaBook(data) {
    const item = await prisma.agendaBook.create({ data });
    return item as AgendaBookEntity;
  },

  async updateAgendaBook(id, data) {
    const item = await prisma.agendaBook.update({
      where: { id },
      data,
    });
    return item as AgendaBookEntity;
  },

  async softDeleteAgendaBook(id) {
    await prisma.agendaBook.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findAgendasInRange({ from, to }) {
    const items = await prisma.agendaBook.findMany({
      where: { deletedAt: null, date: { gte: from, lte: to } },
      orderBy: { date: "asc" },
    });
    return items as unknown as AgendaBookEntity[];
  },

  async findUpcomingAgendas({ from, limit }) {
    const items = await prisma.agendaBook.findMany({
      where: { deletedAt: null, date: { gte: from } },
      orderBy: { date: "asc" },
      take: limit,
    });
    return items as unknown as AgendaBookEntity[];
  },
};
