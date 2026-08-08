import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
  DocumentType,
} from "@/generated/client";
import type {
  IncomingMailEntity,
  OutgoingMailEntity,
  DispositionEntity,
  AdministrativeDocumentEntity,
  AgendaBookEntity,
  DocumentArchiveEntity,
} from "./entities";

export interface SecretariatRepository {
  // Incoming Mail
  findManyIncomingMails(params: {
    search?: string;
    status?: IncomingMailStatus;
    page: number;
    limit: number;
  }): Promise<{ items: IncomingMailEntity[]; total: number }>;

  findIncomingMailById(id: string): Promise<IncomingMailEntity | null>;

  findIncomingMailByNumber(
    registrationNumber: string,
  ): Promise<IncomingMailEntity | null>;

  createIncomingMail(
    data: Omit<
      IncomingMailEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt" | "archivedAt"
    >,
  ): Promise<IncomingMailEntity>;

  updateIncomingMail(
    id: string,
    data: Partial<
      Omit<IncomingMailEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<IncomingMailEntity>;

  softDeleteIncomingMail(id: string): Promise<void>;

  findArchivedIncomingMails(params: {
    search?: string;
    limit?: number;
  }): Promise<IncomingMailEntity[]>;

  // Outgoing Mail
  findManyOutgoingMails(params: {
    search?: string;
    status?: OutgoingMailStatus;
    page: number;
    limit: number;
  }): Promise<{ items: OutgoingMailEntity[]; total: number }>;

  findOutgoingMailById(id: string): Promise<OutgoingMailEntity | null>;

  findOutgoingMailByNumber(
    registrationNumber: string,
  ): Promise<OutgoingMailEntity | null>;

  findOutgoingMailByVerificationCode(
    code: string,
  ): Promise<OutgoingMailEntity | null>;

  createOutgoingMail(
    data: Omit<
      OutgoingMailEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ): Promise<OutgoingMailEntity>;

  updateOutgoingMail(
    id: string,
    data: Partial<
      Omit<OutgoingMailEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<OutgoingMailEntity>;

  softDeleteOutgoingMail(id: string): Promise<void>;

  findArchivedOutgoingMails(params: {
    search?: string;
    limit?: number;
  }): Promise<OutgoingMailEntity[]>;

  // Disposition
  findManyDispositions(params: {
    incomingMailId?: string;
    assignedToId?: string;
    status?: DispositionStatus;
    page: number;
    limit: number;
  }): Promise<{
    items: (DispositionEntity & {
      incomingMail: { registrationNumber: string; subject: string };
    })[];
    total: number;
  }>;

  findDispositionById(id: string): Promise<DispositionEntity | null>;

  createDisposition(
    data: Omit<DispositionEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<DispositionEntity>;

  updateDisposition(
    id: string,
    data: Partial<
      Omit<DispositionEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<DispositionEntity>;

  deleteDisposition(id: string): Promise<void>;

  // Administrative Document
  findManyAdministrativeDocuments(params: {
    search?: string;
    status?: AdministrativeDocumentStatus;
    documentType?: DocumentType;
    page: number;
    limit: number;
  }): Promise<{ items: AdministrativeDocumentEntity[]; total: number }>;

  findAdministrativeDocumentById(
    id: string,
  ): Promise<AdministrativeDocumentEntity | null>;

  findAdministrativeDocumentByNumber(
    documentNumber: string,
  ): Promise<AdministrativeDocumentEntity | null>;

  createAdministrativeDocument(
    data: Omit<
      AdministrativeDocumentEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt" | "archivedAt"
    >,
  ): Promise<AdministrativeDocumentEntity>;

  updateAdministrativeDocument(
    id: string,
    data: Partial<
      Omit<
        AdministrativeDocumentEntity,
        "id" | "createdAt" | "updatedAt" | "deletedAt"
      >
    >,
  ): Promise<AdministrativeDocumentEntity>;

  softDeleteAdministrativeDocument(id: string): Promise<void>;

  // Agenda Book
  findManyAgendaBooks(params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: AgendaBookEntity[]; total: number }>;

  findAgendaBookById(id: string): Promise<AgendaBookEntity | null>;

  createAgendaBook(
    data: Omit<AgendaBookEntity, "id" | "createdAt" | "deletedAt">,
  ): Promise<AgendaBookEntity>;

  updateAgendaBook(
    id: string,
    data: Partial<
      Omit<AgendaBookEntity, "id" | "createdAt" | "deletedAt">
    >,
  ): Promise<AgendaBookEntity>;

  softDeleteAgendaBook(id: string): Promise<void>;

  findAgendasInRange(params: {
    from: Date;
    to: Date;
  }): Promise<AgendaBookEntity[]>;

  // Document Archive (read-only)
  findManyDocumentArchives(params: {
    search?: string;
    documentType?: DocumentType;
    page: number;
    limit: number;
  }): Promise<{ items: DocumentArchiveEntity[]; total: number }>;

  findDocumentArchiveById(id: string): Promise<DocumentArchiveEntity | null>;

  // Dashboard
  getDashboardStats(): Promise<{
    totalIncomingMails: number;
    totalOutgoingMails: number;
    pendingDispositions: number;
    totalAdministrativeDocuments: number;
    totalAgenda: number;
  }>;

  findRecentOutgoingMails(limit: number): Promise<OutgoingMailEntity[]>;

  findRecentIncomingMails(limit: number): Promise<IncomingMailEntity[]>;

  findUpcomingAgendas(params: {
    from: Date;
    limit: number;
  }): Promise<AgendaBookEntity[]>;

  countIncomingMailsByStatus(): Promise<{
    received: number;
    processed: number;
    archived: number;
  }>;

  countOutgoingMailsByStatus(): Promise<{
    draft: number;
    sent: number;
    archived: number;
  }>;

  getSuratMenyuratStats(): Promise<{
    outgoingTotal: number;
    incomingTotal: number;
    archivedTotal: number;
    pendingCount: number;
    latestIssued: OutgoingMailEntity | null;
  }>;

  countIncomingMailsByMonth(year: number): Promise<Array<{ month: number; count: number }>>;

  countOutgoingMailsByMonth(year: number): Promise<Array<{ month: number; count: number }>>;
}
