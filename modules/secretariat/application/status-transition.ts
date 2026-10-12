import type {
  AdministrativeDocumentStatus,
  DispositionStatus,
  IncomingMailStatus,
  OutgoingMailStatus,
} from "@/generated/client";

/**
 * Aturan transisi status per agregat. Fungsi murni — dapat diuji langsung
 * tanpa repository.
 */
export const VALID_INCOMING_MAIL_TRANSITIONS: Record<
  IncomingMailStatus,
  IncomingMailStatus[]
> = {
  RECEIVED: ["ARCHIVED"],
  ARCHIVED: [],
};

export const VALID_OUTGOING_MAIL_TRANSITIONS: Record<
  OutgoingMailStatus,
  OutgoingMailStatus[]
> = {
  DRAFT: ["SENT", "ARCHIVED"],
  SENT: ["DRAFT", "ARCHIVED"],
  ARCHIVED: [],
};

export const VALID_DISPOSITION_TRANSITIONS: Record<
  DispositionStatus,
  DispositionStatus[]
> = {
  PENDING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS: Record<
  AdministrativeDocumentStatus,
  AdministrativeDocumentStatus[]
> = {
  DRAFT: ["SUBMITTED", "REJECTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  APPROVED: ["ARCHIVED"],
  REJECTED: ["DRAFT"],
  ARCHIVED: [],
};

export function canTransition<T extends string>(
  validTransitions: Record<T, T[]>,
  from: T,
  to: T,
): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}
