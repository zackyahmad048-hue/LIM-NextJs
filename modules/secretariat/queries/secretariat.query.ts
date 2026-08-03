import { secretariatRepository as repo } from "../infrastructure/repository";

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

export async function getIncomingMailsByStatus() {
  return repo.countIncomingMailsByStatus();
}

export async function getOutgoingMailsByStatus() {
  return repo.countOutgoingMailsByStatus();
}
