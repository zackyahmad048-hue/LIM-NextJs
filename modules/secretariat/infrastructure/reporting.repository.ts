import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { OutgoingMailEntity } from "../domain/entities";
import type { SecretariatReportingRepository } from "../domain/repository";

/**
 * Operasi yang menyentuh lebih dari satu agregat: statistik, dasbor, dan tren.
 * Tiket 07 memindahkannya ke lapisan baca.
 */
export const reportingRepository: SecretariatReportingRepository = {
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
      prisma.disposition.count({
        where: { status: "PENDING", deletedAt: null },
      }),
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
        where: { status: "DRAFT", deletedAt: null },
      }),
      prisma.outgoingMail.findFirst({
        where: { fullNumber: { not: null }, deletedAt: null },
        orderBy: { createdAt: "desc" },
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

  async findDashboardDispositions(limit) {
    const items = await prisma.disposition.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] },
        deletedAt: null,
      },
      include: {
        incomingMail: { select: { registrationNumber: true, subject: true } },
      },
      orderBy: { dueDate: "asc" },
      take: limit,
    });

    const userIds = [
      ...new Set(items.map((item) => item.assignedToId).filter(Boolean)),
    ];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });
    const userNames = new Map(users.map((user) => [user.id, user.name]));

    const now = new Date();
    return items
      .map((item) => ({
        ...item,
        assignedTo: userNames.has(item.assignedToId)
          ? { id: item.assignedToId, name: userNames.get(item.assignedToId)! }
          : null,
        overdue: item.dueDate !== null && item.dueDate < now,
      }))
      .sort(
        (a, b) =>
          Number(b.overdue) - Number(a.overdue) ||
          (a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) -
            (b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
  },

  async countDashboardActionItems() {
    const [
      pendingDispositions,
      draftOutgoing,
      receivedIncoming,
      submittedDocuments,
    ] = await Promise.all([
      prisma.disposition.count({
        where: { status: { in: ["PENDING", "IN_PROGRESS"] }, deletedAt: null },
      }),
      prisma.outgoingMail.count({
        where: { status: "DRAFT", deletedAt: null },
      }),
      prisma.incomingMail.count({
        where: { status: "RECEIVED", deletedAt: null },
      }),
      prisma.administrativeDocument.count({
        where: { status: "SUBMITTED", deletedAt: null },
      }),
    ]);

    return {
      pendingDispositions,
      draftOutgoing,
      receivedIncoming,
      submittedDocuments,
    };
  },

  async countMissingAttachments() {
    const [outgoing, incoming, documents] = await Promise.all([
      prisma.outgoingMail.count({
        where: { attachmentUrl: null, deletedAt: null },
      }),
      prisma.incomingMail.count({
        where: { attachmentUrl: null, deletedAt: null },
      }),
      prisma.administrativeDocument.count({
        where: { attachmentUrl: null, deletedAt: null },
      }),
    ]);
    return { outgoing, incoming, documents };
  },
};
