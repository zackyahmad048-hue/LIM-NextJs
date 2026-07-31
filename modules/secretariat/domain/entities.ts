import type {
  IncomingMailStatus,
  OutgoingMailStatus,
  DispositionStatus,
  AdministrativeDocumentStatus,
  DocumentType,
} from "@/generated/client";

export interface IncomingMailEntity {
  id: string;
  registrationNumber: string;
  sender: string;
  subject: string;
  senderAddress: string | null;
  receivedDate: Date;
  status: IncomingMailStatus;
  classification: string | null;
  category: string | null;
  notes: string | null;
  attachmentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OutgoingMailEntity {
  id: string;
  registrationNumber: string;
  recipient: string | null;
  subject: string;
  senderName: string | null;
  mailDate: Date;
  status: OutgoingMailStatus;
  documentNumber: string | null;
  documentType: DocumentType | null;
  content: string | null;
  approvedById: string | null;
  approvedAt: Date | null;
  attachmentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DispositionEntity {
  id: string;
  incomingMailId: string;
  assignedToId: string;
  instruction: string;
  priority: string;
  status: DispositionStatus;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdministrativeDocumentEntity {
  id: string;
  documentNumber: string;
  documentType: DocumentType;
  title: string;
  description: string | null;
  content: string | null;
  status: AdministrativeDocumentStatus;
  submittedById: string | null;
  submittedAt: Date | null;
  approvedById: string | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface AgendaBookEntity {
  id: string;
  date: Date;
  title: string;
  description: string | null;
  location: string | null;
  participants: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface DocumentArchiveEntity {
  id: string;
  archiveNumber: string;
  title: string;
  documentType: DocumentType;
  category: string | null;
  retentionYear: number | null;
  archivedAt: Date;
  createdAt: Date;
}
