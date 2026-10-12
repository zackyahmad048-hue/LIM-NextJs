import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
  DocumentType,
} from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type { OutgoingMailEntity } from "../domain/entities";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { getLetterNumberingConfig as getLetterNumberingConfigSetting } from "../infrastructure/letter-numbering.config";
import { secretariatService } from "../application/service";
import { getDriveConnection } from "@/modules/shared/infrastructure/storage/google-drive.storage";

export async function getIncomingMails(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyIncomingMails({
    search: params.search,
    status: params.status as IncomingMailStatus,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getIncomingMailById(id: string) {
  return repo.findIncomingMailById(id);
}

export async function getOutgoingMails(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyOutgoingMails({
    search: params.search,
    status: params.status as OutgoingMailStatus,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getOutgoingMailById(id: string) {
  return repo.findOutgoingMailById(id);
}

export async function getLetterNumberingConfig() {
  return getLetterNumberingConfigSetting();
}

export async function getDispositions(params: {
  incomingMailId?: string;
  assignedToId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyDispositions({
    incomingMailId: params.incomingMailId,
    assignedToId: params.assignedToId,
    status: params.status as DispositionStatus,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getDispositionById(id: string) {
  const disposition = await repo.findDispositionById(id);
  if (!disposition) return null;

  const incomingMail = await repo.findIncomingMailById(
    disposition.incomingMailId,
  );
  return {
    ...disposition,
    incomingMail: {
      registrationNumber: incomingMail?.registrationNumber ?? "",
      subject: incomingMail?.subject ?? "",
    },
  };
}

export async function getAdministrativeDocuments(params: {
  search?: string;
  status?: string;
  documentType?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyAdministrativeDocuments({
    search: params.search,
    status: params.status as AdministrativeDocumentStatus,
    documentType: params.documentType as DocumentType,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getArchiveData(params: { search?: string }) {
  const [outgoing, incoming, documents] = await Promise.all([
    secretariatService.listArchivedOutgoingMails({
      search: params.search,
      limit: 100,
    }),
    secretariatService.listArchivedIncomingMails({
      search: params.search,
      limit: 100,
    }),
    secretariatService.listAdministrativeDocuments({
      search: params.search,
      status: "ARCHIVED",
      page: 1,
      limit: 100,
    }),
  ]);

  return {
    outgoing,
    incoming,
    documents: documents.items,
  };
}

export async function getAdministrativeDocumentById(id: string) {
  return repo.findAdministrativeDocumentById(id);
}

export async function getAgendaBooks(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyAgendaBooks({
    search: params.search,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getAgendaBookById(id: string) {
  return repo.findAgendaBookById(id);
}



export async function getSecretariatStats() {
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
}

export async function getSuratMenyuratStats() {
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
    prisma.outgoingMail.count({ where: { status: "DRAFT", deletedAt: null } }),
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
}


export async function getSecretariatDashboardData(limit = 5) {
  const now = new Date();
  const [stats, recentOutgoing, recentIncoming, upcomingAgendas] =
    await Promise.all([
      getSecretariatStats(),
      secretariatService.listRecentOutgoingMails(limit),
      secretariatService.listRecentIncomingMails(limit),
      secretariatService.listUpcomingAgendas({ from: now, limit }),
    ]);

  return { stats, recentOutgoing, recentIncoming, upcomingAgendas };
}




export async function getOutgoingMailByVerificationCode(code: string) {
  return repo.findOutgoingMailByVerificationCode(code);
}

export async function getMediaByFileId(fileId: string) {
  return prisma.media.findUnique({ where: { fileId } });
}

export async function getDashboardActionQueue(limit = 8) {
  const [items, counts] = await Promise.all([
    prisma.disposition.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] },
        deletedAt: null,
      },
      include: {
        incomingMail: { select: { registrationNumber: true, subject: true } },
      },
      orderBy: { dueDate: "asc" },
      take: limit,
    }),
    Promise.all([
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
    ]),
  ]);

  const userIds = [
    ...new Set(items.map((item) => item.assignedToId).filter(Boolean)),
  ];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });
  const userNames = new Map(users.map((user) => [user.id, user.name]));

  const now = new Date();
  const dispositions = items
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

  const [
    pendingDispositions,
    draftOutgoing,
    receivedIncoming,
    submittedDocuments,
  ] = counts;

  return {
    dispositions,
    counts: {
      pendingDispositions,
      draftOutgoing,
      receivedIncoming,
      submittedDocuments,
    },
  };
}

export async function getDashboardTrend(months = 12) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [incomingRows, outgoingRows] = await Promise.all([
    prisma.$queryRaw<Array<{ year: number; month: number; count: number }>>`
      SELECT EXTRACT(YEAR FROM "receivedDate")::int AS year,
             EXTRACT(MONTH FROM "receivedDate")::int AS month,
             COUNT(*)::int AS count
      FROM incoming_mail
      WHERE "receivedDate" >= ${start} AND "receivedDate" < ${end}
        AND "deletedAt" IS NULL
      GROUP BY 1, 2
      ORDER BY 1, 2`,
    prisma.$queryRaw<Array<{ year: number; month: number; count: number }>>`
      SELECT EXTRACT(YEAR FROM "createdAt")::int AS year,
             EXTRACT(MONTH FROM "createdAt")::int AS month,
             COUNT(*)::int AS count
      FROM outgoing_mail
      WHERE "createdAt" >= ${start} AND "createdAt" < ${end}
        AND "deletedAt" IS NULL
      GROUP BY 1, 2
      ORDER BY 1, 2`,
  ]);

  const labelFormatter = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "2-digit",
  });

  const series: Array<{
    label: string;
    incoming: number;
    outgoing: number;
  }> = [];
  for (let index = 0; index < months; index++) {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    series.push({
      label: labelFormatter.format(date),
      incoming:
        incomingRows.find((row) => `${row.year}-${row.month - 1}` === key)
          ?.count ?? 0,
      outgoing:
        outgoingRows.find((row) => `${row.year}-${row.month - 1}` === key)
          ?.count ?? 0,
    });
  }

  const thisMonth = series[series.length - 1];
  const previousMonth = series[series.length - 2];

  return {
    series,
    thisMonth: {
      incoming: thisMonth?.incoming ?? 0,
      outgoing: thisMonth?.outgoing ?? 0,
    },
    previousMonth: {
      incoming: previousMonth?.incoming ?? 0,
      outgoing: previousMonth?.outgoing ?? 0,
    },
  };
}

export async function getDashboardHealth() {
  const [drive, outgoing, incoming, documents] = await Promise.all([
    getDriveConnection(),
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

  return {
    driveEmail: drive?.email ?? null,
    missingAttachments: { outgoing, incoming, documents },
  };
}
