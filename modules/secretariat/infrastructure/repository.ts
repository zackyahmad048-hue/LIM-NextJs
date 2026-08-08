import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  IncomingMailEntity,
  OutgoingMailEntity,
  DispositionEntity,
  AdministrativeDocumentEntity,
  AgendaBookEntity,
  DocumentArchiveEntity,
} from "../domain/entities";
import type { SecretariatRepository } from "../domain/repository";

export const prismaSecretariatRepository: SecretariatRepository = {
  // Incoming Mail
  async findManyIncomingMails({ search, status, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { sender: { contains: search } },
      ];
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.incomingMail.findMany({
        where: where as any,
        orderBy: { receivedDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.incomingMail.count({ where: where as any }),
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
    const where: Record<string, unknown> = {
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
      where: where as any,
      orderBy: { archivedAt: "desc" },
      take: limit,
    });
    return items as unknown as IncomingMailEntity[];
  },

  // Outgoing Mail
  async findManyOutgoingMails({ search, status, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { recipient: { contains: search } },
      ];
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.outgoingMail.findMany({
        where: where as any,
        orderBy: { mailDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.outgoingMail.count({ where: where as any }),
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
      where: { verificationCode: code, deletedAt: null },
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
    const where: Record<string, unknown> = {
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
      where: where as any,
      orderBy: { archivedAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },

  // Disposition
  async findManyDispositions({
    incomingMailId,
    assignedToId,
    status,
    page,
    limit,
  }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (incomingMailId) where.incomingMailId = incomingMailId;
    if (assignedToId) where.assignedToId = assignedToId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.disposition.findMany({
        where: where as any,
        include: {
          incomingMail: { select: { registrationNumber: true, subject: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.disposition.count({ where: where as any }),
    ]);

    return { items: items as any, total };
  },

  async findDispositionById(id) {
    const item = await prisma.disposition.findFirst({
      where: { id, deletedAt: null },
    });
    return item as DispositionEntity | null;
  },

  async createDisposition(data) {
    const item = await prisma.disposition.create({ data: data as any });
    return item as DispositionEntity;
  },

  async updateDisposition(id, data) {
    const item = await prisma.disposition.update({
      where: { id },
      data: data as any,
    });
    return item as DispositionEntity;
  },

  async deleteDisposition(id) {
    await prisma.disposition.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  // Administrative Document
  async findManyAdministrativeDocuments({
    search,
    status,
    documentType,
    page,
    limit,
  }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search)
      where.OR = [
        { title: { contains: search } },
        { documentNumber: { contains: search } },
      ];
    if (status) where.status = status;
    if (documentType) where.documentType = documentType;

    const [items, total] = await Promise.all([
      prisma.administrativeDocument.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.administrativeDocument.count({ where: where as any }),
    ]);

    return { items: items as unknown as AdministrativeDocumentEntity[], total };
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
      } as any,
    });
    return item as AdministrativeDocumentEntity;
  },

  async updateAdministrativeDocument(id, data) {
    const item = await prisma.administrativeDocument.update({
      where: { id },
      data: data as any,
    });
    return item as AdministrativeDocumentEntity;
  },

  async softDeleteAdministrativeDocument(id) {
    await prisma.administrativeDocument.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  // Agenda Book (read-only)
  async findManyAgendaBooks({ search, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search)
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];

    const [items, total] = await Promise.all([
      prisma.agendaBook.findMany({
        where: where as any,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agendaBook.count({ where: where as any }),
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
    const item = await prisma.agendaBook.create({ data: data as any });
    return item as AgendaBookEntity;
  },

  async updateAgendaBook(id, data) {
    const item = await prisma.agendaBook.update({
      where: { id },
      data: data as any,
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

  // Document Archive (read-only)
  async findManyDocumentArchives({ search, documentType, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search)
      where.OR = [
        { title: { contains: search } },
        { archiveNumber: { contains: search } },
      ];
    if (documentType) where.documentType = documentType;

    const [items, total] = await Promise.all([
      prisma.documentArchive.findMany({
        where: where as any,
        orderBy: { archivedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.documentArchive.count({ where: where as any }),
    ]);

    return { items: items as unknown as DocumentArchiveEntity[], total };
  },

  async findDocumentArchiveById(id) {
    const item = await prisma.documentArchive.findFirst({
      where: { id, deletedAt: null },
    });
    return item as DocumentArchiveEntity | null;
  },

  // Dashboard
  async getDashboardStats() {
    const [
      totalIncomingMails,
      totalOutgoingMails,
      pendingDispositions,
      totalAdministrativeDocuments,
      totalAgenda,
    ] = await Promise.all([
      prisma.incomingMail.count({ where: { deletedAt: null } }),
      prisma.outgoingMail.count({ where: { deletedAt: null } }),
      prisma.disposition.count({ where: { status: "PENDING", deletedAt: null } }),
      prisma.administrativeDocument.count({ where: { deletedAt: null } }),
      prisma.agendaBook.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalIncomingMails,
      totalOutgoingMails,
      pendingDispositions,
      totalAdministrativeDocuments,
      totalAgenda,
    };
  },

  async findRecentOutgoingMails(limit) {
    const items = await prisma.outgoingMail.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },

  async findRecentIncomingMails(limit) {
    const items = await prisma.incomingMail.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items as unknown as IncomingMailEntity[];
  },

  async findUpcomingAgendas({ from, limit }) {
    const items = await prisma.agendaBook.findMany({
      where: { deletedAt: null, date: { gte: from } },
      orderBy: { date: "asc" },
      take: limit,
    });
    return items as unknown as AgendaBookEntity[];
  },

  async countIncomingMailsByStatus() {
    const [received, processed, archived] = await Promise.all([
      prisma.incomingMail.count({
        where: { status: "RECEIVED", deletedAt: null },
      }),
      prisma.incomingMail.count({
        where: { status: "PROCESSED", deletedAt: null },
      }),
      prisma.incomingMail.count({
        where: { status: "ARCHIVED", deletedAt: null },
      }),
    ]);

    return { received, processed, archived };
  },

  async countOutgoingMailsByStatus() {
    const [
      draft,
      submitted,
      reviewed,
      approved,
      rejected,
      signed,
      sent,
      archived,
    ] = await Promise.all([
      prisma.outgoingMail.count({
        where: { status: "DRAFT", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "SUBMITTED", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "REVIEWED", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "APPROVED", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "REJECTED", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "SIGNED", deletedAt: null },
      }),
      prisma.outgoingMail.count({ where: { status: "SENT", deletedAt: null } }),
      prisma.outgoingMail.count({
        where: { status: "ARCHIVED", deletedAt: null },
      }),
    ]);

    return {
      draft,
      submitted,
      reviewed,
      approved,
      rejected,
      signed,
      sent,
      archived,
    };
  },

  async getSuratMenyuratStats() {
    const [
      outgoingTotal,
      incomingTotal,
      archivedTotal,
      pendingCount,
      latestIssued,
    ] = await Promise.all([
      prisma.outgoingMail.count({ where: { deletedAt: null } }),
      prisma.incomingMail.count({ where: { deletedAt: null } }),
      prisma.outgoingMail.count({
        where: { status: "ARCHIVED", deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: {
          status: { in: ["DRAFT", "SUBMITTED", "REVIEWED"] },
          deletedAt: null,
        },
      }),
      prisma.outgoingMail.findFirst({
        where: { fullNumber: { not: null }, deletedAt: null },
        orderBy: { approvedAt: "desc" },
      }),
    ]);

    return {
      outgoingTotal,
      incomingTotal,
      archivedTotal,
      pendingCount,
      latestIssued: latestIssued as OutgoingMailEntity | null,
    };
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
};

export const secretariatRepository: SecretariatRepository = prismaSecretariatRepository;
