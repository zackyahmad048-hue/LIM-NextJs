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
import { SheetsSecretariatRepository } from "./repository.sheets";

export const prismaSecretariatRepository: SecretariatRepository = {
  // Incoming Mail
  async findManyIncomingMails({ search, status, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.OR = [{ subject: { contains: search } }, { registrationNumber: { contains: search } }, { sender: { contains: search } }];
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
    const item = await prisma.incomingMail.findFirst({ where: { id, deletedAt: null } });
    return item as IncomingMailEntity | null;
  },

  async findIncomingMailByNumber(registrationNumber) {
    const item = await prisma.incomingMail.findUnique({ where: { registrationNumber } });
    return item as IncomingMailEntity | null;
  },

  async createIncomingMail(data) {
    const item = await prisma.incomingMail.create({ data: data as any });
    return item as IncomingMailEntity;
  },

  async updateIncomingMail(id, data) {
    const item = await prisma.incomingMail.update({ where: { id }, data: data as any });
    return item as IncomingMailEntity;
  },

  async softDeleteIncomingMail(id) {
    await prisma.incomingMail.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // Outgoing Mail
  async findManyOutgoingMails({ search, status, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.OR = [{ subject: { contains: search } }, { registrationNumber: { contains: search } }, { recipient: { contains: search } }];
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
    const item = await prisma.outgoingMail.findFirst({ where: { id, deletedAt: null } });
    return item as OutgoingMailEntity | null;
  },

  async findOutgoingMailByNumber(registrationNumber) {
    const item = await prisma.outgoingMail.findUnique({ where: { registrationNumber } });
    return item as OutgoingMailEntity | null;
  },

  async createOutgoingMail(data) {
    const item = await prisma.outgoingMail.create({ data: data as any });
    return item as OutgoingMailEntity;
  },

  async updateOutgoingMail(id, data) {
    const item = await prisma.outgoingMail.update({ where: { id }, data: data as any });
    return item as OutgoingMailEntity;
  },

  async softDeleteOutgoingMail(id) {
    await prisma.outgoingMail.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // Disposition
  async findManyDispositions({ incomingMailId, assignedToId, status, page, limit }) {
    const where: Record<string, unknown> = {};
    if (incomingMailId) where.incomingMailId = incomingMailId;
    if (assignedToId) where.assignedToId = assignedToId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.disposition.findMany({
        where: where as any,
        include: { incomingMail: { select: { registrationNumber: true, subject: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.disposition.count({ where: where as any }),
    ]);

    return { items: items as any, total };
  },

  async findDispositionById(id) {
    const item = await prisma.disposition.findUnique({ where: { id } });
    return item as DispositionEntity | null;
  },

  async createDisposition(data) {
    const item = await prisma.disposition.create({ data: data as any });
    return item as DispositionEntity;
  },

  async updateDisposition(id, data) {
    const item = await prisma.disposition.update({ where: { id }, data: data as any });
    return item as DispositionEntity;
  },

  async deleteDisposition(id) {
    await prisma.disposition.delete({ where: { id } });
  },

  // Administrative Document
  async findManyAdministrativeDocuments({ search, status, documentType, page, limit }) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (search) where.OR = [{ title: { contains: search } }, { documentNumber: { contains: search } }];
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
    const item = await prisma.administrativeDocument.findFirst({ where: { id, deletedAt: null } });
    return item as AdministrativeDocumentEntity | null;
  },

  async findAdministrativeDocumentByNumber(documentNumber) {
    const item = await prisma.administrativeDocument.findUnique({ where: { documentNumber } });
    return item as AdministrativeDocumentEntity | null;
  },

  async createAdministrativeDocument(data) {
    const item = await prisma.administrativeDocument.create({ data: data as any });
    return item as AdministrativeDocumentEntity;
  },

  async updateAdministrativeDocument(id, data) {
    const item = await prisma.administrativeDocument.update({ where: { id }, data: data as any });
    return item as AdministrativeDocumentEntity;
  },

  async softDeleteAdministrativeDocument(id) {
    await prisma.administrativeDocument.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // Agenda Book (read-only)
  async findManyAgendaBooks({ search, page, limit }) {
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];

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
    const item = await prisma.agendaBook.findUnique({ where: { id } });
    return item as AgendaBookEntity | null;
  },

  // Document Archive (read-only)
  async findManyDocumentArchives({ search, documentType, page, limit }) {
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ title: { contains: search } }, { archiveNumber: { contains: search } }];
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
    const item = await prisma.documentArchive.findUnique({ where: { id } });
    return item as DocumentArchiveEntity | null;
  },

  // Dashboard
  async getDashboardStats() {
    const [totalIncomingMails, totalOutgoingMails, pendingDispositions, totalAdministrativeDocuments] =
      await Promise.all([
        prisma.incomingMail.count({ where: { deletedAt: null } }),
        prisma.outgoingMail.count({ where: { deletedAt: null } }),
        prisma.disposition.count({ where: { status: "PENDING" } }),
        prisma.administrativeDocument.count({ where: { deletedAt: null } }),
      ]);

    return { totalIncomingMails, totalOutgoingMails, pendingDispositions, totalAdministrativeDocuments };
  },

  async countIncomingMailsByStatus() {
    const [received, processed, archived] = await Promise.all([
      prisma.incomingMail.count({ where: { status: "RECEIVED", deletedAt: null } }),
      prisma.incomingMail.count({ where: { status: "PROCESSED", deletedAt: null } }),
      prisma.incomingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
    ]);

    return { received, processed, archived };
  },

  async countOutgoingMailsByStatus() {
    const [draft, approved, sent, archived] = await Promise.all([
      prisma.outgoingMail.count({ where: { status: "DRAFT", deletedAt: null } }),
      prisma.outgoingMail.count({ where: { status: "APPROVED", deletedAt: null } }),
      prisma.outgoingMail.count({ where: { status: "SENT", deletedAt: null } }),
      prisma.outgoingMail.count({ where: { status: "ARCHIVED", deletedAt: null } }),
    ]);

    return { draft, approved, sent, archived };
  },
};

const useSheets = process.env.DATA_SOURCE === "sheets";

export const secretariatRepository: SecretariatRepository = useSheets
  ? new SheetsSecretariatRepository()
  : prismaSecretariatRepository;
