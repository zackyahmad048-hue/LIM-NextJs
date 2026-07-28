import { prisma } from "@/modules/shared/infrastructure/prisma";

export async function getIncomingMails(params: { search?: string; status?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (params.search) where.OR = [{ subject: { contains: params.search } }, { registrationNumber: { contains: params.search } }, { sender: { contains: params.search } }];
  if (params.status) where.status = params.status;

  const [items, total] = await Promise.all([
    prisma.incomingMail.findMany({
      where: where as any,
      orderBy: { receivedDate: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.incomingMail.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getIncomingMailById(id: string) {
  return prisma.incomingMail.findFirst({
    where: { id, deletedAt: null },
  }) as unknown as any;
}

export async function getOutgoingMails(params: { search?: string; status?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (params.search) where.OR = [{ subject: { contains: params.search } }, { registrationNumber: { contains: params.search } }, { recipient: { contains: params.search } }];
  if (params.status) where.status = params.status;

  const [items, total] = await Promise.all([
    prisma.outgoingMail.findMany({
      where: where as any,
      orderBy: { mailDate: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.outgoingMail.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getOutgoingMailById(id: string) {
  return prisma.outgoingMail.findFirst({
    where: { id, deletedAt: null },
  }) as unknown as any;
}

export async function getDispositions(params: { incomingMailId?: string; assignedToId?: string; status?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (params.incomingMailId) where.incomingMailId = params.incomingMailId;
  if (params.assignedToId) where.assignedToId = params.assignedToId;
  if (params.status) where.status = params.status;

  const [items, total] = await Promise.all([
    prisma.disposition.findMany({
      where: where as any,
      include: { incomingMail: { select: { registrationNumber: true, subject: true } } },
      orderBy: { createdAt: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.disposition.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getDispositionById(id: string) {
  return prisma.disposition.findUnique({
    where: { id },
    include: { incomingMail: { select: { registrationNumber: true, subject: true } } },
  }) as unknown as any;
}

export async function getAdministrativeDocuments(params: { search?: string; status?: string; documentType?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = { deletedAt: null };
  if (params.search) where.OR = [{ title: { contains: params.search } }, { documentNumber: { contains: params.search } }];
  if (params.status) where.status = params.status;
  if (params.documentType) where.documentType = params.documentType;

  const [items, total] = await Promise.all([
    prisma.administrativeDocument.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.administrativeDocument.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getAdministrativeDocumentById(id: string) {
  return prisma.administrativeDocument.findFirst({
    where: { id, deletedAt: null },
  }) as unknown as any;
}

export async function getAgendaBooks(params: { search?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (params.search) where.OR = [{ title: { contains: params.search } }, { description: { contains: params.search } }];

  const [items, total] = await Promise.all([
    prisma.agendaBook.findMany({
      where: where as any,
      orderBy: { date: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.agendaBook.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getAgendaBookById(id: string) {
  return prisma.agendaBook.findUnique({
    where: { id },
  }) as unknown as any;
}

export async function getDocumentArchives(params: { search?: string; documentType?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (params.search) where.OR = [{ title: { contains: params.search } }, { archiveNumber: { contains: params.search } }];
  if (params.documentType) where.documentType = params.documentType;

  const [items, total] = await Promise.all([
    prisma.documentArchive.findMany({
      where: where as any,
      orderBy: { archivedAt: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
    }),
    prisma.documentArchive.count({ where: where as any }),
  ]);

  return { items: items as any[], total: total as number };
}

export async function getDocumentArchiveById(id: string) {
  return prisma.documentArchive.findUnique({
    where: { id },
  }) as unknown as any;
}

export async function getSecretariatStats() {
  const [totalIncomingMails, totalOutgoingMails, pendingDispositions, totalAdministrativeDocuments] =
    await Promise.all([
      prisma.incomingMail.count({ where: { deletedAt: null } }),
      prisma.outgoingMail.count({ where: { deletedAt: null } }),
      prisma.disposition.count({ where: { status: "PENDING" } }),
      prisma.administrativeDocument.count({ where: { deletedAt: null } }),
    ]);

  return { totalIncomingMails, totalOutgoingMails, pendingDispositions, totalAdministrativeDocuments };
}

export async function getIncomingMailsByStatus() {
  const [received, processed, archived] = await Promise.all([
    prisma.incomingMail.count({ where: { status: "RECEIVED", deletedAt: null } }),
    prisma.incomingMail.count({ where: { status: "PROCESSED", deletedAt: null } }),
    prisma.incomingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
  ]);

  return { received, processed, archived };
}

export async function getOutgoingMailsByStatus() {
  const [draft, approved, sent, archived] = await Promise.all([
    prisma.outgoingMail.count({ where: { status: "DRAFT", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "APPROVED", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "SENT", deletedAt: null } }),
    prisma.outgoingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
  ]);

  return { draft, approved, sent, archived };
}
