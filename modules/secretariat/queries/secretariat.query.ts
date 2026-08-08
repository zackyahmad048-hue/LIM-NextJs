import { prisma } from "@/modules/shared/infrastructure/prisma";
import { secretariatRepository as repo } from "../infrastructure/repository";
import { secretariatService } from "../application/service";

export async function getIncomingMails(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyIncomingMails({
    search: params.search,
    status: params.status as any,
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
    status: params.status as any,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getOutgoingMailById(id: string) {
  return repo.findOutgoingMailById(id);
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
    status: params.status as any,
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
    status: params.status as any,
    documentType: params.documentType as any,
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

export async function getDocumentArchives(params: {
  search?: string;
  documentType?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyDocumentArchives({
    search: params.search,
    documentType: params.documentType as any,
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
}

export async function getDocumentArchiveById(id: string) {
  return repo.findDocumentArchiveById(id);
}

export async function getSecretariatStats() {
  return repo.getDashboardStats();
}

export async function getSuratMenyuratStats() {
  return repo.getSuratMenyuratStats();
}

export async function getCalendarEvents(params: { from: Date; to: Date }) {
  const [agendas, schedules] = await Promise.all([
    secretariatService.listAgendasInRange(params),
    prisma.programSchedule.findMany({
      where: {
        deletedAt: null,
        startTime: { gte: params.from },
        endTime: { lte: params.to },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        description: true,
        program: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return {
    agendas,
    schedules,
  };
}

export async function getSecretariatDashboardData(limit = 5) {
  const now = new Date();
  const [stats, recentOutgoing, recentIncoming, upcomingAgendas] =
    await Promise.all([
      repo.getDashboardStats(),
      secretariatService.listRecentOutgoingMails(limit),
      secretariatService.listRecentIncomingMails(limit),
      secretariatService.listUpcomingAgendas({ from: now, limit }),
    ]);

  return { stats, recentOutgoing, recentIncoming, upcomingAgendas };
}

export async function getSecretariatReportData(year: number) {
  const [incomingByStatus, outgoingByStatus, incomingByMonth, outgoingByMonth] =
    await Promise.all([
      repo.countIncomingMailsByStatus(),
      repo.countOutgoingMailsByStatus(),
      secretariatService.countIncomingMailsByMonth(year),
      secretariatService.countOutgoingMailsByMonth(year),
    ]);

  return {
    incomingByStatus,
    outgoingByStatus,
    incomingByMonth,
    outgoingByMonth,
  };
}

export async function getIncomingMailsByStatus() {
  return repo.countIncomingMailsByStatus();
}

export async function getOutgoingMailsByStatus() {
  return repo.countOutgoingMailsByStatus();
}

export async function getOutgoingMailByVerificationCode(code: string) {
  return repo.findOutgoingMailByVerificationCode(code);
}

export async function getMediaByFileId(fileId: string) {
  return prisma.media.findUnique({ where: { fileId } });
}
