import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
  DocumentType,
} from "@/generated/client";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
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

export async function getDocumentArchives(params: {
  search?: string;
  documentType?: string;
  page?: number;
  limit?: number;
}) {
  return repo.findManyDocumentArchives({
    search: params.search,
    documentType: params.documentType as DocumentType,
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
  const payload = await getPayloadClient();
  const [agendas, scheduleRes] = await Promise.all([
    secretariatService.listAgendasInRange(params),
    payload.find({
      collection: "program-schedules",
      where: {
        and: [
          { deletedAt: { exists: false } },
          { startTime: { greater_than_equal: params.from.toISOString() } },
          { endTime: { less_than_equal: params.to.toISOString() } },
        ],
      },
      sort: "startTime",
      limit: 1000,
      depth: 1,
    }),
  ]);

  const schedules = scheduleRes.docs.map((doc) => {
    const program =
      doc.program !== null && typeof doc.program === "object"
        ? doc.program
        : null;
    return {
      id: String(doc.id),
      title: doc.title,
      startTime: new Date(doc.startTime),
      endTime: new Date(doc.endTime),
      description: doc.description ?? null,
      program: program ? { name: program.name } : null,
    };
  });

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
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "media",
    where: { fileId: { equals: fileId } },
    limit: 1,
    depth: 0,
  });
  return res.docs[0] ?? null;
}

export async function getDashboardActionQueue(limit = 8) {
  const [dispositions, counts] = await Promise.all([
    repo.findDashboardDispositions(limit),
    repo.countDashboardActionItems(),
  ]);

  return { dispositions, counts };
}

export async function getDashboardTrend(months = 12) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [incomingRows, outgoingRows] = await Promise.all([
    repo.countIncomingMailsByMonthRange(start, end),
    repo.countOutgoingMailsByMonthRange(start, end),
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
  const [drive, missingAttachments] = await Promise.all([
    getDriveConnection(),
    repo.countMissingAttachments(),
  ]);

  return {
    driveEmail: drive?.email ?? null,
    missingAttachments,
  };
}
