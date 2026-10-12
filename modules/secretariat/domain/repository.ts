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

/**
 * Antarmuka penyimpanan per agregat. Tiap agregat mendeklarasikan operasinya
 * sendiri, sehingga mengimplementasikan satu agregat tidak berarti
 * mengimplementasikan seluruh modul.
 */
export interface IncomingMailRepository {
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

  findRecentIncomingMails(limit: number): Promise<IncomingMailEntity[]>;

  countIncomingMailsByStatus(): Promise<{
    received: number;
    archived: number;
  }>;

  countIncomingMailsByMonth(
    year: number,
  ): Promise<Array<{ month: number; count: number }>>;

  countIncomingMailsByMonthRange(
    from: Date,
    to: Date,
  ): Promise<Array<{ year: number; month: number; count: number }>>;
}

export interface OutgoingMailRepository {
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

  findRecentOutgoingMails(limit: number): Promise<OutgoingMailEntity[]>;

  countOutgoingMailsByStatus(): Promise<{
    draft: number;
    sent: number;
    archived: number;
  }>;

  countOutgoingMailsByMonth(
    year: number,
  ): Promise<Array<{ month: number; count: number }>>;

  countOutgoingMailsByMonthRange(
    from: Date,
    to: Date,
  ): Promise<Array<{ year: number; month: number; count: number }>>;
}

export interface DispositionRepository {
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
}

export interface AdministrativeDocumentRepository {
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
}

export interface AgendaBookRepository {
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
    data: Partial<Omit<AgendaBookEntity, "id" | "createdAt" | "deletedAt">>,
  ): Promise<AgendaBookEntity>;

  softDeleteAgendaBook(id: string): Promise<void>;

  findAgendasInRange(params: {
    from: Date;
    to: Date;
  }): Promise<AgendaBookEntity[]>;

  findUpcomingAgendas(params: {
    from: Date;
    limit: number;
  }): Promise<AgendaBookEntity[]>;
}

export interface DocumentArchiveRepository {
  findManyDocumentArchives(params: {
    search?: string;
    documentType?: DocumentType;
    page: number;
    limit: number;
  }): Promise<{ items: DocumentArchiveEntity[]; total: number }>;

  findDocumentArchiveById(id: string): Promise<DocumentArchiveEntity | null>;
}

/**
 * Operasi yang menyentuh lebih dari satu agregat: statistik, dasbor, dan
 * tren. Tiket 07 memindahkannya ke lapisan baca.
 */
export interface SecretariatReportingRepository {
  getDashboardStats(): Promise<{
    totalIncomingMails: number;
    totalOutgoingMails: number;
    pendingDispositions: number;
    totalAdministrativeDocuments: number;
    totalAgenda: number;
  }>;

  getSuratMenyuratStats(): Promise<{
    outgoingTotal: number;
    incomingTotal: number;
    archivedTotal: number;
    pendingCount: number;
    latestIssued: OutgoingMailEntity | null;
  }>;

  findDashboardDispositions(limit: number): Promise<
    Array<
      DispositionEntity & {
        incomingMail: { registrationNumber: string; subject: string };
        assignedTo: { id: string; name: string } | null;
        overdue: boolean;
      }
    >
  >;

  countDashboardActionItems(): Promise<{
    pendingDispositions: number;
    draftOutgoing: number;
    receivedIncoming: number;
    submittedDocuments: number;
  }>;

  countMissingAttachments(): Promise<{
    outgoing: number;
    incoming: number;
    documents: number;
  }>;
}

/** Seluruh operasi penyimpanan modul secretariat (irisan antarmuka per agregat). */
export type SecretariatRepository = IncomingMailRepository &
  OutgoingMailRepository &
  DispositionRepository &
  AdministrativeDocumentRepository &
  AgendaBookRepository &
  DocumentArchiveRepository &
  SecretariatReportingRepository;
