import { prisma } from "@/modules/shared/infrastructure/prisma";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type {
  AdministrativeDocument,
  AgendaBook,
  Disposition,
  DocumentArchive,
  IncomingMail,
  OutgoingMail,
} from "@/payload-types";
import type {
  IncomingMailEntity,
  OutgoingMailEntity,
  DispositionEntity,
  AdministrativeDocumentEntity,
  AgendaBookEntity,
  DocumentArchiveEntity,
  QrPagePositionMm,
  QrPositionMm,
} from "../domain/entities";
import type { SecretariatRepository } from "../domain/repository";

function pagePosJson(
  value: QrPagePositionMm | null | undefined,
): { page: number; x: number; y: number } | null | undefined {
  if (value == null) return value;
  return { page: value.page, x: value.x, y: value.y };
}

function posJson(
  value: QrPositionMm | null | undefined,
): { x: number; y: number } | null | undefined {
  if (value == null) return value;
  return { x: value.x, y: value.y };
}

function mapAgenda(doc: AgendaBook): AgendaBookEntity {
  return {
    id: String(doc.id),
    date: new Date(doc.date),
    title: doc.title,
    description: doc.description ?? null,
    location: doc.location ?? null,
    participants: doc.participants ?? null,
    notes: doc.notes ?? null,
    createdAt: new Date(doc.createdAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

async function fetchActiveAgendas(): Promise<AgendaBookEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "agenda-books",
    limit: 1000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapAgenda)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function mapIncomingMail(doc: IncomingMail): IncomingMailEntity {
  return {
    id: String(doc.id),
    registrationNumber: doc.registrationNumber,
    sender: doc.sender,
    subject: doc.subject,
    senderAddress: doc.senderAddress ?? null,
    receivedDate: new Date(doc.receivedDate),
    status: doc.status,
    classification: doc.classification ?? null,
    category: doc.category ?? null,
    notes: doc.notes ?? null,
    attachmentUrl: doc.attachmentUrl ?? null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
    archivedAt: doc.archivedAt ? new Date(doc.archivedAt) : null,
  };
}

async function fetchIncomingMails(): Promise<IncomingMailEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "incoming-mails",
    limit: 10000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapIncomingMail)
    .sort((a, b) => b.receivedDate.getTime() - a.receivedDate.getTime());
}

function mapOutgoingMail(doc: OutgoingMail): OutgoingMailEntity {
  return {
    id: String(doc.id),
    registrationNumber: doc.registrationNumber,
    recipient: doc.recipient ?? null,
    subject: doc.subject,
    senderName: doc.senderName ?? null,
    mailDate: new Date(doc.mailDate),
    status: doc.status,
    categoryCode: doc.categoryCode ?? null,
    content: doc.content ?? null,
    sentAt: doc.sentAt ? new Date(doc.sentAt) : null,
    archivedAt: doc.archivedAt ? new Date(doc.archivedAt) : null,
    sequence: doc.sequence ?? null,
    levelCode: doc.levelCode ?? null,
    romanMonth: doc.romanMonth ?? null,
    periodYear: doc.periodYear ?? null,
    fullNumber: doc.fullNumber ?? null,
    verificationCode: doc.verificationCode ?? null,
    qrFileId: doc.qrFileId ?? null,
    attachmentUrl: doc.attachmentUrl ?? null,
    ketuaName: doc.ketuaName ?? null,
    ketuaPosition: doc.ketuaPosition ?? null,
    sekretarisName: doc.sekretarisName ?? null,
    sekretarisPosition: doc.sekretarisPosition ?? null,
    qrKetuaPosition: (doc.qrKetuaPosition as QrPagePositionMm | null) ?? null,
    qrSekretarisPosition:
      (doc.qrSekretarisPosition as QrPagePositionMm | null) ?? null,
    qrVerifikasiPosition:
      (doc.qrVerifikasiPosition as unknown as QrPositionMm | null) ?? null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

async function fetchOutgoingMails(): Promise<OutgoingMailEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "outgoing-mails",
    limit: 10000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapOutgoingMail)
    .sort((a, b) => b.mailDate.getTime() - a.mailDate.getTime());
}

type DispositionWithMail = DispositionEntity & {
  incomingMail: { registrationNumber: string; subject: string };
};

function dispositionIncomingId(doc: Disposition): string {
  const rel = doc.incomingMail;
  if (rel && typeof rel === "object") return String(rel.id);
  return rel == null ? "" : String(rel);
}

function mapDisposition(doc: Disposition): DispositionEntity {
  return {
    id: String(doc.id),
    incomingMailId: dispositionIncomingId(doc),
    assignedToId: doc.assignedToId,
    instruction: doc.instruction,
    priority: doc.priority,
    status: doc.status,
    dueDate: doc.dueDate ? new Date(doc.dueDate) : null,
    notes: doc.notes ?? null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

async function fetchDispositions(): Promise<DispositionWithMail[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "dispositions",
    limit: 10000,
    depth: 1,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map((doc) => {
      const rel = doc.incomingMail;
      const mail =
        rel && typeof rel === "object"
          ? { registrationNumber: rel.registrationNumber, subject: rel.subject }
          : { registrationNumber: "", subject: "" };
      return { ...mapDisposition(doc), incomingMail: mail };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function resolveUserNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(ids.filter(Boolean))];
  const numeric = unique.map(Number).filter(Number.isInteger);
  const legacy = unique.filter((id) => !Number.isInteger(Number(id)));
  if (numeric.length > 0) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "users",
      where: { id: { in: numeric } },
      limit: numeric.length,
      depth: 0,
    });
    for (const user of res.docs) map.set(String(user.id), user.name ?? "");
  }
  if (legacy.length > 0) {
    const users = await prisma.user.findMany({
      where: { id: { in: legacy } },
      select: { id: true, name: true },
    });
    for (const user of users) map.set(user.id, user.name);
  }
  return map;
}

function mapAdministrativeDoc(
  doc: AdministrativeDocument,
): AdministrativeDocumentEntity {
  return {
    id: String(doc.id),
    documentNumber: doc.documentNumber,
    documentType: doc.documentType,
    title: doc.title,
    description: doc.description ?? null,
    content: doc.content ?? null,
    attachmentUrl: doc.attachmentUrl ?? null,
    status: doc.status,
    submittedById: doc.submittedById ?? null,
    submittedAt: doc.submittedAt ? new Date(doc.submittedAt) : null,
    approvedById: doc.approvedById ?? null,
    approvedAt: doc.approvedAt ? new Date(doc.approvedAt) : null,
    archivedAt: doc.archivedAt ? new Date(doc.archivedAt) : null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

async function fetchAdministrativeDocuments(): Promise<
  AdministrativeDocumentEntity[]
> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "administrative-documents",
    limit: 10000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapAdministrativeDoc)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function mapDocumentArchive(doc: DocumentArchive): DocumentArchiveEntity {
  return {
    id: String(doc.id),
    archiveNumber: doc.archiveNumber,
    title: doc.title,
    documentType: doc.documentType,
    category: doc.category ?? null,
    retentionYear: doc.retentionYear ?? null,
    archivedAt: new Date(doc.archivedAt),
    createdAt: new Date(doc.createdAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

async function fetchDocumentArchives(): Promise<DocumentArchiveEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "document-archives",
    limit: 10000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapDocumentArchive)
    .sort(
      (a, b) => b.archivedAt.getTime() - a.archivedAt.getTime(),
    );
}

export const prismaSecretariatRepository: SecretariatRepository = {
  // Incoming Mail (Payload)
  async findManyIncomingMails({ search, status, page, limit }) {
    let items = await fetchIncomingMails();
    if (status) items = items.filter((m) => m.status === status);
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.registrationNumber.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q),
      );
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  },

  async findIncomingMailById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "incoming-mails",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapIncomingMail(doc) : null;
  },

  async findIncomingMailByNumber(registrationNumber) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "incoming-mails",
      where: { registrationNumber: { equals: registrationNumber } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc ? mapIncomingMail(doc) : null;
  },

  async createIncomingMail(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "incoming-mails",
      data: {
        registrationNumber: data.registrationNumber,
        sender: data.sender,
        subject: data.subject,
        senderAddress: data.senderAddress ?? undefined,
        receivedDate: data.receivedDate.toISOString(),
        status: data.status,
        classification: data.classification ?? undefined,
        category: data.category ?? undefined,
        notes: data.notes ?? undefined,
        attachmentUrl: data.attachmentUrl ?? undefined,
        archivedAt:
          data.status === "ARCHIVED" ? new Date().toISOString() : undefined,
      },
    });
    return mapIncomingMail(doc);
  },

  async updateIncomingMail(id, data) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID surat masuk tidak valid: ${id}`);
    const payload = await getPayloadClient();
    const payloadData: Partial<IncomingMail> = {};
    if (data.registrationNumber !== undefined)
      payloadData.registrationNumber = data.registrationNumber;
    if (data.sender !== undefined) payloadData.sender = data.sender;
    if (data.subject !== undefined) payloadData.subject = data.subject;
    if (data.senderAddress !== undefined)
      payloadData.senderAddress = data.senderAddress;
    if (data.receivedDate !== undefined)
      payloadData.receivedDate = data.receivedDate.toISOString();
    if (data.status !== undefined) payloadData.status = data.status;
    if (data.classification !== undefined)
      payloadData.classification = data.classification;
    if (data.category !== undefined) payloadData.category = data.category;
    if (data.notes !== undefined) payloadData.notes = data.notes;
    if (data.attachmentUrl !== undefined)
      payloadData.attachmentUrl = data.attachmentUrl;
    if (data.archivedAt !== undefined)
      payloadData.archivedAt = data.archivedAt
        ? data.archivedAt.toISOString()
        : null;
    const doc = await payload.update({
      collection: "incoming-mails",
      id: n,
      data: payloadData,
    });
    return mapIncomingMail(doc);
  },

  async softDeleteIncomingMail(id) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID surat masuk tidak valid: ${id}`);
    const payload = await getPayloadClient();
    await payload.update({
      collection: "incoming-mails",
      id: n,
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async findArchivedIncomingMails({ search, limit = 100 }) {
    let items = (await fetchIncomingMails()).filter(
      (m) => m.status === "ARCHIVED",
    );
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.registrationNumber.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q),
      );
    items = items.sort(
      (a, b) =>
        (b.archivedAt?.getTime() ?? 0) - (a.archivedAt?.getTime() ?? 0),
    );
    return items.slice(0, limit);
  },

  // Outgoing Mail (Payload)
  async findManyOutgoingMails({ search, status, page, limit }) {
    let items = await fetchOutgoingMails();
    if (status) items = items.filter((m) => m.status === status);
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.registrationNumber.toLowerCase().includes(q) ||
          (m.recipient ?? "").toLowerCase().includes(q),
      );
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  },

  async findOutgoingMailById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "outgoing-mails",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapOutgoingMail(doc) : null;
  },

  async findOutgoingMailByNumber(registrationNumber) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "outgoing-mails",
      where: { registrationNumber: { equals: registrationNumber } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc ? mapOutgoingMail(doc) : null;
  },

  async findOutgoingMailByVerificationCode(code) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "outgoing-mails",
      where: {
        or: [
          { verificationCode: { equals: code } },
          { fullNumber: { equals: code } },
        ],
      },
      limit: 5,
      depth: 0,
    });
    const doc = res.docs.find((d) => !d.deletedAt);
    return doc ? mapOutgoingMail(doc) : null;
  },

  async createOutgoingMail(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "outgoing-mails",
      data: {
        registrationNumber: data.registrationNumber,
        recipient: data.recipient ?? undefined,
        subject: data.subject,
        senderName: data.senderName ?? undefined,
        mailDate: data.mailDate.toISOString(),
        status: data.status,
        categoryCode: data.categoryCode ?? undefined,
        content: data.content ?? undefined,
        sentAt: data.sentAt ? data.sentAt.toISOString() : undefined,
        archivedAt: data.archivedAt ? data.archivedAt.toISOString() : undefined,
        sequence: data.sequence ?? undefined,
        levelCode: data.levelCode ?? undefined,
        romanMonth: data.romanMonth ?? undefined,
        periodYear: data.periodYear ?? undefined,
        fullNumber: data.fullNumber ?? undefined,
        verificationCode: data.verificationCode ?? undefined,
        qrFileId: data.qrFileId ?? undefined,
        attachmentUrl: data.attachmentUrl ?? undefined,
        ketuaName: data.ketuaName ?? undefined,
        ketuaPosition: data.ketuaPosition ?? undefined,
        sekretarisName: data.sekretarisName ?? undefined,
        sekretarisPosition: data.sekretarisPosition ?? undefined,
        qrKetuaPosition: pagePosJson(data.qrKetuaPosition),
        qrSekretarisPosition: pagePosJson(data.qrSekretarisPosition),
        qrVerifikasiPosition: posJson(data.qrVerifikasiPosition),
      },
    });
    return mapOutgoingMail(doc);
  },

  async updateOutgoingMail(id, data) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID surat keluar tidak valid: ${id}`);
    const payload = await getPayloadClient();
    const payloadData: Partial<OutgoingMail> = {};
    if (data.registrationNumber !== undefined)
      payloadData.registrationNumber = data.registrationNumber;
    if (data.recipient !== undefined) payloadData.recipient = data.recipient;
    if (data.subject !== undefined) payloadData.subject = data.subject;
    if (data.senderName !== undefined) payloadData.senderName = data.senderName;
    if (data.mailDate !== undefined)
      payloadData.mailDate = data.mailDate.toISOString();
    if (data.status !== undefined) payloadData.status = data.status;
    if (data.categoryCode !== undefined)
      payloadData.categoryCode = data.categoryCode;
    if (data.content !== undefined) payloadData.content = data.content;
    if (data.sentAt !== undefined)
      payloadData.sentAt = data.sentAt ? data.sentAt.toISOString() : null;
    if (data.archivedAt !== undefined)
      payloadData.archivedAt = data.archivedAt
        ? data.archivedAt.toISOString()
        : null;
    if (data.sequence !== undefined) payloadData.sequence = data.sequence;
    if (data.levelCode !== undefined) payloadData.levelCode = data.levelCode;
    if (data.romanMonth !== undefined)
      payloadData.romanMonth = data.romanMonth;
    if (data.periodYear !== undefined)
      payloadData.periodYear = data.periodYear;
    if (data.fullNumber !== undefined) payloadData.fullNumber = data.fullNumber;
    if (data.verificationCode !== undefined)
      payloadData.verificationCode = data.verificationCode;
    if (data.qrFileId !== undefined) payloadData.qrFileId = data.qrFileId;
    if (data.attachmentUrl !== undefined)
      payloadData.attachmentUrl = data.attachmentUrl;
    if (data.ketuaName !== undefined) payloadData.ketuaName = data.ketuaName;
    if (data.ketuaPosition !== undefined)
      payloadData.ketuaPosition = data.ketuaPosition;
    if (data.sekretarisName !== undefined)
      payloadData.sekretarisName = data.sekretarisName;
    if (data.sekretarisPosition !== undefined)
      payloadData.sekretarisPosition = data.sekretarisPosition;
    if (data.qrKetuaPosition !== undefined)
      payloadData.qrKetuaPosition = pagePosJson(data.qrKetuaPosition);
    if (data.qrSekretarisPosition !== undefined)
      payloadData.qrSekretarisPosition = pagePosJson(
        data.qrSekretarisPosition,
      );
    if (data.qrVerifikasiPosition !== undefined)
      payloadData.qrVerifikasiPosition = posJson(data.qrVerifikasiPosition);
    const doc = await payload.update({
      collection: "outgoing-mails",
      id: n,
      data: payloadData,
    });
    return mapOutgoingMail(doc);
  },

  async softDeleteOutgoingMail(id) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID surat keluar tidak valid: ${id}`);
    const payload = await getPayloadClient();
    await payload.update({
      collection: "outgoing-mails",
      id: n,
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async findArchivedOutgoingMails({ search, limit = 100 }) {
    let items = (await fetchOutgoingMails()).filter(
      (m) => m.status === "ARCHIVED",
    );
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          (m.fullNumber ?? "").toLowerCase().includes(q) ||
          (m.recipient ?? "").toLowerCase().includes(q),
      );
    items = items.sort(
      (a, b) =>
        (b.archivedAt?.getTime() ?? 0) - (a.archivedAt?.getTime() ?? 0),
    );
    return items.slice(0, limit);
  },

  // Disposition (Payload)
  async findManyDispositions({
    incomingMailId,
    assignedToId,
    status,
    page,
    limit,
  }) {
    let items = await fetchDispositions();
    if (incomingMailId)
      items = items.filter((d) => d.incomingMailId === incomingMailId);
    if (assignedToId)
      items = items.filter((d) => d.assignedToId === assignedToId);
    if (status) items = items.filter((d) => d.status === status);
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  },

  async findDispositionById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "dispositions",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapDisposition(doc) : null;
  },

  async createDisposition(data) {
    const mailId = Number(data.incomingMailId);
    if (!Number.isInteger(mailId))
      throw new Error(`ID surat masuk tidak valid: ${data.incomingMailId}`);
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "dispositions",
      data: {
        incomingMail: mailId,
        assignedToId: data.assignedToId,
        instruction: data.instruction,
        priority: data.priority || "NORMAL",
        status: data.status || "PENDING",
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        notes: data.notes ?? undefined,
      },
    });
    return mapDisposition(doc);
  },

  async updateDisposition(id, data) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID disposisi tidak valid: ${id}`);
    const payload = await getPayloadClient();
    const payloadData: Partial<Disposition> = {};
    if (data.incomingMailId !== undefined) {
      const mailId = Number(data.incomingMailId);
      if (!Number.isInteger(mailId))
        throw new Error(`ID surat masuk tidak valid: ${data.incomingMailId}`);
      payloadData.incomingMail = mailId;
    }
    if (data.assignedToId !== undefined)
      payloadData.assignedToId = data.assignedToId;
    if (data.instruction !== undefined)
      payloadData.instruction = data.instruction;
    if (data.priority !== undefined) payloadData.priority = data.priority;
    if (data.status !== undefined) payloadData.status = data.status;
    if (data.dueDate !== undefined)
      payloadData.dueDate = data.dueDate ? data.dueDate.toISOString() : null;
    if (data.notes !== undefined) payloadData.notes = data.notes;
    const doc = await payload.update({
      collection: "dispositions",
      id: n,
      data: payloadData,
    });
    return mapDisposition(doc);
  },

  async deleteDisposition(id) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID disposisi tidak valid: ${id}`);
    const payload = await getPayloadClient();
    await payload.update({
      collection: "dispositions",
      id: n,
      data: { deletedAt: new Date().toISOString() },
    });
  },

  // Administrative Document
  // Administrative Document (Payload)
  async findManyAdministrativeDocuments({
    search,
    status,
    documentType,
    page,
    limit,
  }) {
    let items = await fetchAdministrativeDocuments();
    if (status) items = items.filter((d) => d.status === status);
    if (documentType) items = items.filter((d) => d.documentType === documentType);
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.documentNumber.toLowerCase().includes(q),
      );
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  },

  async findAdministrativeDocumentById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "administrative-documents",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapAdministrativeDoc(doc) : null;
  },

  async findAdministrativeDocumentByNumber(documentNumber) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "administrative-documents",
      where: { documentNumber: { equals: documentNumber } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc ? mapAdministrativeDoc(doc) : null;
  },

  async createAdministrativeDocument(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "administrative-documents",
      data: {
        documentNumber: data.documentNumber,
        documentType: data.documentType,
        title: data.title,
        description: data.description ?? undefined,
        content: data.content ?? undefined,
        attachmentUrl: data.attachmentUrl ?? undefined,
        status: data.status,
        submittedById: data.submittedById ?? undefined,
        submittedAt: data.submittedAt ? data.submittedAt.toISOString() : undefined,
        approvedById: data.approvedById ?? undefined,
        approvedAt: data.approvedAt ? data.approvedAt.toISOString() : undefined,
        archivedAt:
          data.status === "ARCHIVED" ? new Date().toISOString() : undefined,
      },
    });
    return mapAdministrativeDoc(doc);
  },

  async updateAdministrativeDocument(id, data) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID dokumen tidak valid: ${id}`);
    const payload = await getPayloadClient();
    const payloadData: Partial<AdministrativeDocument> = {};
    if (data.documentNumber !== undefined)
      payloadData.documentNumber = data.documentNumber;
    if (data.documentType !== undefined)
      payloadData.documentType = data.documentType;
    if (data.title !== undefined) payloadData.title = data.title;
    if (data.description !== undefined)
      payloadData.description = data.description;
    if (data.content !== undefined) payloadData.content = data.content;
    if (data.attachmentUrl !== undefined)
      payloadData.attachmentUrl = data.attachmentUrl;
    if (data.status !== undefined) payloadData.status = data.status;
    if (data.submittedById !== undefined)
      payloadData.submittedById = data.submittedById;
    if (data.submittedAt !== undefined)
      payloadData.submittedAt = data.submittedAt
        ? data.submittedAt.toISOString()
        : null;
    if (data.approvedById !== undefined)
      payloadData.approvedById = data.approvedById;
    if (data.approvedAt !== undefined)
      payloadData.approvedAt = data.approvedAt
        ? data.approvedAt.toISOString()
        : null;
    if (data.archivedAt !== undefined)
      payloadData.archivedAt = data.archivedAt
        ? data.archivedAt.toISOString()
        : null;
    const doc = await payload.update({
      collection: "administrative-documents",
      id: n,
      data: payloadData,
    });
    return mapAdministrativeDoc(doc);
  },

  async softDeleteAdministrativeDocument(id) {
    const n = Number(id);
    if (!Number.isInteger(n))
      throw new Error(`ID dokumen tidak valid: ${id}`);
    const payload = await getPayloadClient();
    await payload.update({
      collection: "administrative-documents",
      id: n,
      data: { deletedAt: new Date().toISOString() },
    });
  },

  // Agenda Book (Payload)
  async findManyAgendaBooks({ search, page, limit }) {
    const all = (await fetchActiveAgendas()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
    const q = search?.trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.description ?? "").toLowerCase().includes(q),
        )
      : all;
    const start = (page - 1) * limit;
    return { items: filtered.slice(start, start + limit), total: filtered.length };
  },

  async findAgendaBookById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "agenda-books",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapAgenda(doc) : null;
  },

  async createAgendaBook(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "agenda-books",
      data: {
        date: data.date.toISOString(),
        title: data.title,
        description: data.description ?? undefined,
        location: data.location ?? undefined,
        participants: data.participants ?? undefined,
        notes: data.notes ?? undefined,
      },
    });
    return mapAgenda(doc);
  },

  async updateAgendaBook(id, data) {
    const n = Number(id);
    if (!Number.isInteger(n)) throw new Error(`ID agenda tidak valid: ${id}`);
    const payload = await getPayloadClient();
    const payloadData: Partial<AgendaBook> = {};
    if (data.date !== undefined) payloadData.date = data.date.toISOString();
    if (data.title !== undefined) payloadData.title = data.title;
    if (data.description !== undefined)
      payloadData.description = data.description;
    if (data.location !== undefined) payloadData.location = data.location;
    if (data.participants !== undefined)
      payloadData.participants = data.participants;
    if (data.notes !== undefined) payloadData.notes = data.notes;
    const doc = await payload.update({
      collection: "agenda-books",
      id: n,
      data: payloadData,
    });
    return mapAgenda(doc);
  },

  async softDeleteAgendaBook(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) throw new Error(`ID agenda tidak valid: ${id}`);
    const payload = await getPayloadClient();
    await payload.update({
      collection: "agenda-books",
      id: n,
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async findAgendasInRange({ from, to }) {
    const all = await fetchActiveAgendas();
    return all.filter((a) => a.date >= from && a.date <= to);
  },

  // Document Archive (read-only)
  // Document Archive (Payload)
  async findManyDocumentArchives({ search, documentType, page, limit }) {
    let items = await fetchDocumentArchives();
    if (documentType) items = items.filter((d) => d.documentType === documentType);
    const q = search?.trim().toLowerCase();
    if (q)
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.archiveNumber.toLowerCase().includes(q),
      );
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + limit), total };
  },

  async findDocumentArchiveById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "document-archives",
      where: { id: { equals: n } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc && !doc.deletedAt ? mapDocumentArchive(doc) : null;
  },

  // Dashboard
  async getDashboardStats() {
    const [
      outgoingMails,
      incomingMails,
      pendingDispositions,
      adminDocs,
      agendas,
    ] = await Promise.all([
      fetchOutgoingMails(),
      fetchIncomingMails(),
      fetchDispositions().then(
        (d) => d.filter((x) => x.status === "PENDING").length,
      ),
      fetchAdministrativeDocuments(),
      fetchActiveAgendas(),
    ]);

    return {
      totalIncomingMails: incomingMails.length,
      totalOutgoingMails: outgoingMails.length,
      pendingDispositions,
      totalAdministrativeDocuments: adminDocs.length,
      totalAgenda: agendas.length,
    };
  },

  async findRecentOutgoingMails(limit) {
    const items = await fetchOutgoingMails();
    return items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  async findRecentIncomingMails(limit) {
    const items = await fetchIncomingMails();
    return items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  async findUpcomingAgendas({ from, limit }) {
    const all = await fetchActiveAgendas();
    return all.filter((a) => a.date >= from).slice(0, limit);
  },

  async countIncomingMailsByStatus() {
    const all = await fetchIncomingMails();
    const received = all.filter((m) => m.status === "RECEIVED").length;
    const processed = all.filter((m) => m.status === "PROCESSED").length;
    const archived = all.filter((m) => m.status === "ARCHIVED").length;
    return { received, processed, archived };
  },

  async countOutgoingMailsByStatus() {
    const all = await fetchOutgoingMails();
    const draft = all.filter((m) => m.status === "DRAFT").length;
    const sent = all.filter((m) => m.status === "SENT").length;
    const archived = all.filter((m) => m.status === "ARCHIVED").length;
    return { draft, sent, archived };
  },

  async getSuratMenyuratStats() {
    const [outgoingMails, incomingMails] = await Promise.all([
      fetchOutgoingMails(),
      fetchIncomingMails(),
    ]);
    const latestIssued = outgoingMails
      .filter((m) => m.fullNumber)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    return {
      outgoingTotal: outgoingMails.length,
      incomingTotal: incomingMails.length,
      archivedTotal: outgoingMails.filter((m) => m.status === "ARCHIVED").length,
      pendingCount: outgoingMails.filter((m) => m.status === "DRAFT").length,
      latestIssued: latestIssued ?? null,
    };
  },

  async countIncomingMailsByMonth(year) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year + 1}-01-01`);
    const counts = new Map<number, number>();
    for (const m of await fetchIncomingMails()) {
      if (m.receivedDate >= start && m.receivedDate < end) {
        const month = m.receivedDate.getMonth() + 1;
        counts.set(month, (counts.get(month) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([month, count]) => ({ month, count }));
  },

  async countOutgoingMailsByMonth(year) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year + 1}-01-01`);
    const counts = new Map<number, number>();
    for (const m of await fetchOutgoingMails()) {
      if (m.createdAt >= start && m.createdAt < end) {
        const month = m.createdAt.getMonth() + 1;
        counts.set(month, (counts.get(month) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([month, count]) => ({ month, count }));
  },

  async findDashboardDispositions(limit) {
    const all = (await fetchDispositions())
      .filter((d) => d.status === "PENDING" || d.status === "IN_PROGRESS")
      .sort(
        (a, b) =>
          (a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER),
      );
    const taken = all.slice(0, limit);
    const names = await resolveUserNames(taken.map((d) => d.assignedToId));
    const now = new Date();
    return taken
      .map((d) => ({
        ...d,
        assignedTo: names.has(d.assignedToId)
          ? { id: d.assignedToId, name: names.get(d.assignedToId)! }
          : null,
        overdue: d.dueDate !== null && d.dueDate < now,
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
      fetchDispositions().then((d) =>
        d.filter((x) => x.status === "PENDING" || x.status === "IN_PROGRESS")
          .length,
      ),
      fetchOutgoingMails().then(
        (m) => m.filter((x) => x.status === "DRAFT").length,
      ),
      fetchIncomingMails().then(
        (m) => m.filter((x) => x.status === "RECEIVED").length,
      ),
      fetchAdministrativeDocuments().then(
        (d) => d.filter((x) => x.status === "SUBMITTED").length,
      ),
    ]);

    return {
      pendingDispositions,
      draftOutgoing,
      receivedIncoming,
      submittedDocuments,
    };
  },

  async countIncomingMailsByMonthRange(from, to) {
    const counts = new Map<string, { year: number; month: number; count: number }>();
    for (const m of await fetchIncomingMails()) {
      if (m.receivedDate >= from && m.receivedDate < to) {
        const year = m.receivedDate.getFullYear();
        const month = m.receivedDate.getMonth() + 1;
        const key = `${year}-${month}`;
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { year, month, count: 1 });
      }
    }
    return [...counts.values()].sort(
      (a, b) => a.year - b.year || a.month - b.month,
    );
  },

  async countOutgoingMailsByMonthRange(from, to) {
    const counts = new Map<
      string,
      { year: number; month: number; count: number }
    >();
    for (const m of await fetchOutgoingMails()) {
      if (m.createdAt >= from && m.createdAt < to) {
        const year = m.createdAt.getFullYear();
        const month = m.createdAt.getMonth() + 1;
        const key = `${year}-${month}`;
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { year, month, count: 1 });
      }
    }
    return [...counts.values()].sort(
      (a, b) => a.year - b.year || a.month - b.month,
    );
  },

  async countMissingAttachments() {
    const [outgoingMails, incomingMails, adminDocs] = await Promise.all([
      fetchOutgoingMails(),
      fetchIncomingMails(),
      fetchAdministrativeDocuments(),
    ]);
    return {
      outgoing: outgoingMails.filter((m) => !m.attachmentUrl).length,
      incoming: incomingMails.filter((m) => !m.attachmentUrl).length,
      documents: adminDocs.filter((d) => !d.attachmentUrl).length,
    };
  },
};

export const secretariatRepository: SecretariatRepository =
  prismaSecretariatRepository;
