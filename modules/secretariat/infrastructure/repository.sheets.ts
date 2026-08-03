import { randomUUID } from "crypto";

import {
  googleConfig,
  GoogleApiError,
  SheetsBaseRepository,
  readRows,
  type SheetSchema,
} from "@/modules/shared/infrastructure/google";
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
} from "../domain/entities";
import type { SecretariatRepository } from "../domain/repository";

function pendataanSpreadsheetId(): string {
  const id = googleConfig.spreadsheetPendataanId;
  if (!id) {
    throw new GoogleApiError(
      "UNAUTHENTICATED",
      "GOOGLE_SPREADSHEET_PENDATAAN_ID belum dikonfigurasi.",
    );
  }
  return id;
}

function includesQuery(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

const INCOMING_MAIL_HEADERS = [
  "id",
  "registrationNumber",
  "sender",
  "subject",
  "senderAddress",
  "receivedDate",
  "status",
  "classification",
  "category",
  "notes",
  "attachmentUrl",
  "createdAt",
  "updatedAt",
  "deletedAt",
];

const OUTGOING_MAIL_HEADERS = [
  "id",
  "registrationNumber",
  "recipient",
  "subject",
  "senderName",
  "mailDate",
  "status",
  "documentNumber",
  "documentType",
  "content",
  "approvedById",
  "approvedAt",
  "attachmentUrl",
  "googleDocId",
  "googleDocUrl",
  "createdAt",
  "updatedAt",
  "deletedAt",
];

const DISPOSITION_HEADERS = [
  "id",
  "incomingMailId",
  "assignedToId",
  "instruction",
  "priority",
  "status",
  "dueDate",
  "notes",
  "createdAt",
  "updatedAt",
  "deletedAt",
];

const ADMINISTRATIVE_DOCUMENT_HEADERS = [
  "id",
  "documentNumber",
  "documentType",
  "title",
  "description",
  "content",
  "status",
  "submittedById",
  "submittedAt",
  "approvedById",
  "approvedAt",
  "googleDocId",
  "googleDocUrl",
  "createdAt",
  "updatedAt",
  "deletedAt",
];

const AGENDA_BOOK_HEADERS = [
  "id",
  "date",
  "title",
  "description",
  "location",
  "participants",
  "notes",
  "createdAt",
];

const DOCUMENT_ARCHIVE_HEADERS = [
  "id",
  "archiveNumber",
  "title",
  "documentType",
  "category",
  "retentionYear",
  "archivedAt",
  "createdAt",
];

export class SheetsSecretariatRepository
  extends SheetsBaseRepository
  implements SecretariatRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: pendataanSpreadsheetId(),
    tab: "SuratMasuk",
    headers: INCOMING_MAIL_HEADERS,
  };

  private readonly schemas: Record<string, SheetSchema> = {
    incomingMail: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "SuratMasuk",
      headers: INCOMING_MAIL_HEADERS,
    },
    outgoingMail: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "SuratKeluar",
      headers: OUTGOING_MAIL_HEADERS,
    },
    disposition: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "Disposisi",
      headers: DISPOSITION_HEADERS,
    },
    administrativeDocument: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "DokumenAdministrasi",
      headers: ADMINISTRATIVE_DOCUMENT_HEADERS,
    },
    agendaBook: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "Agenda",
      headers: AGENDA_BOOK_HEADERS,
    },
    documentArchive: {
      spreadsheetId: this.schema.spreadsheetId,
      tab: "ArsipDokumen",
      headers: DOCUMENT_ARCHIVE_HEADERS,
    },
  };

  private toIncomingMail(row: Record<string, string>): IncomingMailEntity {
    return {
      id: row.id,
      registrationNumber: row.registrationNumber ?? "",
      sender: row.sender ?? "",
      subject: row.subject ?? "",
      senderAddress: this.toNullableString(row.senderAddress),
      receivedDate: this.toDate(row.receivedDate, new Date()),
      status: (row.status || "RECEIVED") as IncomingMailStatus,
      classification: this.toNullableString(row.classification),
      category: this.toNullableString(row.category),
      notes: this.toNullableString(row.notes),
      attachmentUrl: this.toNullableString(row.attachmentUrl),
      createdAt: this.toDate(row.createdAt, new Date()),
      updatedAt: this.toDate(row.updatedAt, new Date()),
      deletedAt: this.toNullableDate(row.deletedAt),
    };
  }

  private toOutgoingMail(row: Record<string, string>): OutgoingMailEntity {
    return {
      id: row.id,
      registrationNumber: row.registrationNumber ?? "",
      recipient: this.toNullableString(row.recipient),
      subject: row.subject ?? "",
      senderName: this.toNullableString(row.senderName),
      mailDate: this.toDate(row.mailDate, new Date()),
      status: (row.status || "DRAFT") as OutgoingMailStatus,
      documentNumber: this.toNullableString(row.documentNumber),
      documentType: row.documentType
        ? (row.documentType as DocumentType)
        : null,
      content: this.toNullableString(row.content),
      approvedById: this.toNullableString(row.approvedById),
      approvedAt: this.toNullableDate(row.approvedAt),
      attachmentUrl: this.toNullableString(row.attachmentUrl),
      googleDocId: this.toNullableString(row.googleDocId),
      googleDocUrl: this.toNullableString(row.googleDocUrl),
      createdAt: this.toDate(row.createdAt, new Date()),
      updatedAt: this.toDate(row.updatedAt, new Date()),
      deletedAt: this.toNullableDate(row.deletedAt),
    };
  }

  private toDisposition(row: Record<string, string>): DispositionEntity {
    return {
      id: row.id,
      incomingMailId: row.incomingMailId ?? "",
      assignedToId: row.assignedToId ?? "",
      instruction: row.instruction ?? "",
      priority: row.priority || "NORMAL",
      status: (row.status || "PENDING") as DispositionStatus,
      dueDate: this.toNullableDate(row.dueDate),
      notes: this.toNullableString(row.notes),
      createdAt: this.toDate(row.createdAt, new Date()),
      updatedAt: this.toDate(row.updatedAt, new Date()),
    };
  }

  private toAdministrativeDocument(
    row: Record<string, string>,
  ): AdministrativeDocumentEntity {
    return {
      id: row.id,
      documentNumber: row.documentNumber ?? "",
      documentType: row.documentType as DocumentType,
      title: row.title ?? "",
      description: this.toNullableString(row.description),
      content: this.toNullableString(row.content),
      status: (row.status || "DRAFT") as AdministrativeDocumentStatus,
      submittedById: this.toNullableString(row.submittedById),
      submittedAt: this.toNullableDate(row.submittedAt),
      approvedById: this.toNullableString(row.approvedById),
      approvedAt: this.toNullableDate(row.approvedAt),
      googleDocId: this.toNullableString(row.googleDocId),
      googleDocUrl: this.toNullableString(row.googleDocUrl),
      createdAt: this.toDate(row.createdAt, new Date()),
      updatedAt: this.toDate(row.updatedAt, new Date()),
      deletedAt: this.toNullableDate(row.deletedAt),
    };
  }

  private toAgendaBook(row: Record<string, string>): AgendaBookEntity {
    return {
      id: row.id,
      date: this.toDate(row.date, new Date()),
      title: row.title ?? "",
      description: this.toNullableString(row.description),
      location: this.toNullableString(row.location),
      participants: this.toNullableString(row.participants),
      notes: this.toNullableString(row.notes),
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  private toDocumentArchive(
    row: Record<string, string>,
  ): DocumentArchiveEntity {
    return {
      id: row.id,
      archiveNumber: row.archiveNumber ?? "",
      title: row.title ?? "",
      documentType: row.documentType as DocumentType,
      category: this.toNullableString(row.category),
      retentionYear: this.toNullableNumber(row.retentionYear),
      archivedAt: this.toDate(row.archivedAt, new Date()),
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  private entityToRow(entity: Record<string, unknown>): Record<string, string> {
    const row: Record<string, string> = {};
    for (const [key, value] of Object.entries(entity)) {
      if (value === null || value === undefined) {
        row[key] = "";
      } else if (value instanceof Date) {
        row[key] = value.toISOString();
      } else {
        row[key] = String(value);
      }
    }
    return row;
  }

  // Incoming Mail
  async findManyIncomingMails({
    search,
    status,
    page,
    limit,
  }: {
    search?: string;
    status?: IncomingMailStatus;
    page: number;
    limit: number;
  }) {
    let rows = (await readRows(this.schemas.incomingMail)).filter(
      (row) => !row.deletedAt,
    );
    if (search) {
      rows = rows.filter(
        (row) =>
          includesQuery(row.subject, search) ||
          includesQuery(row.registrationNumber, search) ||
          includesQuery(row.sender, search),
      );
    }
    if (status) rows = rows.filter((row) => row.status === status);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.receivedDate, new Date()).getTime() -
        this.toDate(a.receivedDate, new Date()).getTime(),
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toIncomingMail(row));
    return { items, total };
  }

  async findIncomingMailById(id: string) {
    const row = await this.findRowById(id);
    return row && !row.deletedAt ? this.toIncomingMail(row) : null;
  }

  async findIncomingMailByNumber(registrationNumber: string) {
    const rows = await readRows(this.schemas.incomingMail);
    const row = rows.find(
      (r) => r.registrationNumber === registrationNumber && !r.deletedAt,
    );
    return row ? this.toIncomingMail(row) : null;
  }

  async createIncomingMail(
    data: Omit<
      IncomingMailEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ) {
    const now = new Date();
    const id = randomUUID();
    await this.createRow({
      ...this.entityToRow(data),
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: "",
    });
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    } as IncomingMailEntity;
  }

  async updateIncomingMail(
    id: string,
    data: Partial<
      Omit<IncomingMailEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ) {
    await this.updateRow(id, {
      ...this.entityToRow(data),
      updatedAt: new Date().toISOString(),
    });
    const updated = await this.findIncomingMailById(id);
    if (!updated)
      throw new GoogleApiError(
        "NOT_FOUND",
        `Surat masuk ${id} tidak ditemukan.`,
      );
    return updated;
  }

  async softDeleteIncomingMail(id: string) {
    await this.updateRow(id, { deletedAt: new Date().toISOString() });
  }

  // Outgoing Mail
  async findManyOutgoingMails({
    search,
    status,
    page,
    limit,
  }: {
    search?: string;
    status?: OutgoingMailStatus;
    page: number;
    limit: number;
  }) {
    let rows = (await readRows(this.schemas.outgoingMail)).filter(
      (row) => !row.deletedAt,
    );
    if (search) {
      rows = rows.filter(
        (row) =>
          includesQuery(row.subject, search) ||
          includesQuery(row.registrationNumber, search) ||
          includesQuery(row.recipient, search),
      );
    }
    if (status) rows = rows.filter((row) => row.status === status);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.mailDate, new Date()).getTime() -
        this.toDate(a.mailDate, new Date()).getTime(),
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toOutgoingMail(row));
    return { items, total };
  }

  async findOutgoingMailById(id: string) {
    const row = await this.findRowById(id);
    return row && !row.deletedAt ? this.toOutgoingMail(row) : null;
  }

  async findOutgoingMailByNumber(registrationNumber: string) {
    const rows = await readRows(this.schemas.outgoingMail);
    const row = rows.find(
      (r) => r.registrationNumber === registrationNumber && !r.deletedAt,
    );
    return row ? this.toOutgoingMail(row) : null;
  }

  async createOutgoingMail(
    data: Omit<
      OutgoingMailEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ) {
    const now = new Date();
    const id = randomUUID();
    await this.createRow({
      ...this.entityToRow(data),
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: "",
    });
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    } as OutgoingMailEntity;
  }

  async updateOutgoingMail(
    id: string,
    data: Partial<
      Omit<OutgoingMailEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ) {
    await this.updateRow(id, {
      ...this.entityToRow(data),
      updatedAt: new Date().toISOString(),
    });
    const updated = await this.findOutgoingMailById(id);
    if (!updated)
      throw new GoogleApiError(
        "NOT_FOUND",
        `Surat keluar ${id} tidak ditemukan.`,
      );
    return updated;
  }

  async softDeleteOutgoingMail(id: string) {
    await this.updateRow(id, { deletedAt: new Date().toISOString() });
  }

  // Disposition
  async findManyDispositions({
    incomingMailId,
    assignedToId,
    status,
    page,
    limit,
  }: {
    incomingMailId?: string;
    assignedToId?: string;
    status?: DispositionStatus;
    page: number;
    limit: number;
  }) {
    let rows = (await readRows(this.schemas.disposition)).filter(
      (row) => !row.deletedAt,
    );
    if (incomingMailId)
      rows = rows.filter((row) => row.incomingMailId === incomingMailId);
    if (assignedToId)
      rows = rows.filter((row) => row.assignedToId === assignedToId);
    if (status) rows = rows.filter((row) => row.status === status);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.createdAt, new Date()).getTime() -
        this.toDate(a.createdAt, new Date()).getTime(),
    );

    const incomingRows = await readRows(this.schemas.incomingMail);
    const incomingLookup = new Map(incomingRows.map((r) => [r.id, r]));

    const total = rows.length;
    const items = rows.slice((page - 1) * limit, page * limit).map((row) => {
      const incoming = incomingLookup.get(row.incomingMailId);
      return {
        ...this.toDisposition(row),
        incomingMail: {
          registrationNumber: incoming?.registrationNumber ?? "",
          subject: incoming?.subject ?? "",
        },
      };
    });

    return { items, total };
  }

  async findDispositionById(id: string) {
    const row = await this.findRowById(id);
    return row ? this.toDisposition(row) : null;
  }

  async createDisposition(
    data: Omit<DispositionEntity, "id" | "createdAt" | "updatedAt">,
  ) {
    const now = new Date();
    const id = randomUUID();
    await this.createRow({
      ...this.entityToRow(data),
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: "",
    });
    return { ...data, id, createdAt: now, updatedAt: now } as DispositionEntity;
  }

  async updateDisposition(
    id: string,
    data: Partial<Omit<DispositionEntity, "id" | "createdAt" | "updatedAt">>,
  ) {
    await this.updateRow(id, {
      ...this.entityToRow(data),
      updatedAt: new Date().toISOString(),
    });
    const updated = await this.findDispositionById(id);
    if (!updated)
      throw new GoogleApiError("NOT_FOUND", `Disposisi ${id} tidak ditemukan.`);
    return updated;
  }

  async deleteDisposition(id: string) {
    await this.updateRow(id, { deletedAt: new Date().toISOString() });
  }

  // Administrative Document
  async findManyAdministrativeDocuments({
    search,
    status,
    documentType,
    page,
    limit,
  }: {
    search?: string;
    status?: AdministrativeDocumentStatus;
    documentType?: DocumentType;
    page: number;
    limit: number;
  }) {
    let rows = (await readRows(this.schemas.administrativeDocument)).filter(
      (row) => !row.deletedAt,
    );
    if (search) {
      rows = rows.filter(
        (row) =>
          includesQuery(row.title, search) ||
          includesQuery(row.documentNumber, search),
      );
    }
    if (status) rows = rows.filter((row) => row.status === status);
    if (documentType)
      rows = rows.filter((row) => row.documentType === documentType);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.createdAt, new Date()).getTime() -
        this.toDate(a.createdAt, new Date()).getTime(),
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toAdministrativeDocument(row));
    return { items, total };
  }

  async findAdministrativeDocumentById(id: string) {
    const row = await this.findRowById(id);
    return row && !row.deletedAt ? this.toAdministrativeDocument(row) : null;
  }

  async findAdministrativeDocumentByNumber(documentNumber: string) {
    const rows = await readRows(this.schemas.administrativeDocument);
    const row = rows.find(
      (r) => r.documentNumber === documentNumber && !r.deletedAt,
    );
    return row ? this.toAdministrativeDocument(row) : null;
  }

  async createAdministrativeDocument(
    data: Omit<
      AdministrativeDocumentEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ) {
    const now = new Date();
    const id = randomUUID();
    await this.createRow({
      ...this.entityToRow(data),
      id,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: "",
    });
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    } as AdministrativeDocumentEntity;
  }

  async updateAdministrativeDocument(
    id: string,
    data: Partial<
      Omit<
        AdministrativeDocumentEntity,
        "id" | "createdAt" | "updatedAt" | "deletedAt"
      >
    >,
  ) {
    await this.updateRow(id, {
      ...this.entityToRow(data),
      updatedAt: new Date().toISOString(),
    });
    const updated = await this.findAdministrativeDocumentById(id);
    if (!updated)
      throw new GoogleApiError(
        "NOT_FOUND",
        `Dokumen administrasi ${id} tidak ditemukan.`,
      );
    return updated;
  }

  async softDeleteAdministrativeDocument(id: string) {
    await this.updateRow(id, { deletedAt: new Date().toISOString() });
  }

  // Agenda Book (read-only)
  async findManyAgendaBooks({
    search,
    page,
    limit,
  }: {
    search?: string;
    page: number;
    limit: number;
  }) {
    let rows = await readRows(this.schemas.agendaBook);
    if (search) {
      rows = rows.filter(
        (row) =>
          includesQuery(row.title, search) ||
          includesQuery(row.description, search),
      );
    }

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.date, new Date()).getTime() -
        this.toDate(a.date, new Date()).getTime(),
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toAgendaBook(row));
    return { items, total };
  }

  async findAgendaBookById(id: string) {
    const row = await this.findRowById(id);
    return row ? this.toAgendaBook(row) : null;
  }

  // Document Archive (read-only)
  async findManyDocumentArchives({
    search,
    documentType,
    page,
    limit,
  }: {
    search?: string;
    documentType?: DocumentType;
    page: number;
    limit: number;
  }) {
    let rows = await readRows(this.schemas.documentArchive);
    if (search) {
      rows = rows.filter(
        (row) =>
          includesQuery(row.title, search) ||
          includesQuery(row.archiveNumber, search),
      );
    }
    if (documentType)
      rows = rows.filter((row) => row.documentType === documentType);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.archivedAt, new Date()).getTime() -
        this.toDate(a.archivedAt, new Date()).getTime(),
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toDocumentArchive(row));
    return { items, total };
  }

  async findDocumentArchiveById(id: string) {
    const row = await this.findRowById(id);
    return row ? this.toDocumentArchive(row) : null;
  }

  // Dashboard
  async getDashboardStats() {
    const [incomingMails, outgoingMails, dispositions, documents] =
      await Promise.all([
        readRows(this.schemas.incomingMail),
        readRows(this.schemas.outgoingMail),
        readRows(this.schemas.disposition),
        readRows(this.schemas.administrativeDocument),
      ]);

    return {
      totalIncomingMails: incomingMails.filter((row) => !row.deletedAt).length,
      totalOutgoingMails: outgoingMails.filter((row) => !row.deletedAt).length,
      pendingDispositions: dispositions.filter(
        (row) => !row.deletedAt && row.status === "PENDING",
      ).length,
      totalAdministrativeDocuments: documents.filter((row) => !row.deletedAt)
        .length,
    };
  }

  async countIncomingMailsByStatus() {
    const rows = (await readRows(this.schemas.incomingMail)).filter(
      (row) => !row.deletedAt,
    );
    return {
      received: rows.filter((row) => row.status === "RECEIVED").length,
      processed: rows.filter((row) => row.status === "PROCESSED").length,
      archived: rows.filter((row) => row.status === "ARCHIVED").length,
    };
  }

  async countOutgoingMailsByStatus() {
    const rows = (await readRows(this.schemas.outgoingMail)).filter(
      (row) => !row.deletedAt,
    );
    return {
      draft: rows.filter((row) => row.status === "DRAFT").length,
      approved: rows.filter((row) => row.status === "APPROVED").length,
      sent: rows.filter((row) => row.status === "SENT").length,
      archived: rows.filter((row) => row.status === "ARCHIVED").length,
    };
  }
}
