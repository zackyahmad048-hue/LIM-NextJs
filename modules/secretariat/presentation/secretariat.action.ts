"use server";

import { revalidatePath } from "next/cache";
import { secretariatService } from "../application/service";
import {
  createIncomingMailSchema,
  updateIncomingMailSchema,
  createOutgoingMailSchema,
  updateOutgoingMailSchema,
  createDispositionSchema,
  updateDispositionSchema,
  createAdministrativeDocumentSchema,
  updateAdministrativeDocumentSchema,
  createAgendaBookSchema,
  createDocumentArchiveSchema,
} from "../validations/schema";
import {
  SecretariatError,
  EntityNotFoundError,
  DuplicateNumberError,
} from "../domain/secretariat.errors";

export async function createIncomingMail(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createIncomingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await secretariatService.createIncomingMail({
      registrationNumber: parsed.data.registrationNumber,
      sender: parsed.data.sender,
      subject: parsed.data.subject,
      senderAddress: parsed.data.senderAddress || null,
      receivedDate: new Date(parsed.data.receivedDate),
      classification: parsed.data.classification || null,
      category: parsed.data.category || null,
      notes: parsed.data.notes || null,
      attachmentUrl: parsed.data.attachmentUrl || null,
    });
    revalidatePath("/admin/secretariat/incoming-mails");
  } catch (e) {
    if (e instanceof DuplicateNumberError) return;
    return;
  }
}

export async function updateIncomingMail(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateIncomingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data: Record<string, unknown> = {};
    if (parsed.data.registrationNumber) data.registrationNumber = parsed.data.registrationNumber;
    if (parsed.data.sender) data.sender = parsed.data.sender;
    if (parsed.data.subject) data.subject = parsed.data.subject;
    if (parsed.data.senderAddress !== undefined) data.senderAddress = parsed.data.senderAddress || null;
    if (parsed.data.receivedDate) data.receivedDate = new Date(parsed.data.receivedDate);
    if (parsed.data.classification !== undefined) data.classification = parsed.data.classification || null;
    if (parsed.data.category !== undefined) data.category = parsed.data.category || null;
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes || null;
    if (parsed.data.attachmentUrl !== undefined) data.attachmentUrl = parsed.data.attachmentUrl || null;

    await secretariatService.updateIncomingMail(id, data);
    revalidatePath("/admin/secretariat/incoming-mails");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteIncomingMail(id: string) {
  try {
    await secretariatService.deleteIncomingMail(id);
    revalidatePath("/admin/secretariat/incoming-mails");
  } catch {
    return;
  }
}

export async function transitionIncomingMailStatus(id: string, status: string) {
  try {
    await secretariatService.transitionIncomingMailStatus(id, status as any);
    revalidatePath("/admin/secretariat/incoming-mails");
  } catch {
    return;
  }
}

export async function createOutgoingMail(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createOutgoingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await secretariatService.createOutgoingMail({
      registrationNumber: parsed.data.registrationNumber,
      recipient: parsed.data.recipient,
      subject: parsed.data.subject,
      senderName: parsed.data.senderName || null,
      mailDate: new Date(parsed.data.mailDate),
      documentNumber: parsed.data.documentNumber || null,
      documentType: parsed.data.documentType ?? null,
      attachmentUrl: parsed.data.attachmentUrl || null,
    });
    revalidatePath("/admin/secretariat/outgoing-mails");
  } catch (e) {
    if (e instanceof DuplicateNumberError) return;
    return;
  }
}

export async function updateOutgoingMail(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateOutgoingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data: Record<string, unknown> = {};
    if (parsed.data.registrationNumber) data.registrationNumber = parsed.data.registrationNumber;
    if (parsed.data.recipient) data.recipient = parsed.data.recipient;
    if (parsed.data.subject) data.subject = parsed.data.subject;
    if (parsed.data.senderName !== undefined) data.senderName = parsed.data.senderName || null;
    if (parsed.data.mailDate) data.mailDate = new Date(parsed.data.mailDate);
    if (parsed.data.documentNumber !== undefined) data.documentNumber = parsed.data.documentNumber || null;
    if (parsed.data.documentType !== undefined) data.documentType = parsed.data.documentType ?? null;
    if (parsed.data.attachmentUrl !== undefined) data.attachmentUrl = parsed.data.attachmentUrl || null;

    await secretariatService.updateOutgoingMail(id, data);
    revalidatePath("/admin/secretariat/outgoing-mails");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteOutgoingMail(id: string) {
  try {
    await secretariatService.deleteOutgoingMail(id);
    revalidatePath("/admin/secretariat/outgoing-mails");
  } catch {
    return;
  }
}

export async function transitionOutgoingMailStatus(id: string, status: string) {
  try {
    await secretariatService.transitionOutgoingMailStatus(id, status as any);
    revalidatePath("/admin/secretariat/outgoing-mails");
  } catch {
    return;
  }
}

export async function createDisposition(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createDispositionSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await secretariatService.createDisposition({
      incomingMailId: parsed.data.incomingMailId,
      assignedToId: parsed.data.assignedToId,
      instruction: parsed.data.instruction,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      notes: parsed.data.notes || null,
    });
    revalidatePath("/admin/secretariat/dispositions");
  } catch {
    return;
  }
}

export async function updateDisposition(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateDispositionSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data: Record<string, unknown> = {};
    if (parsed.data.incomingMailId) data.incomingMailId = parsed.data.incomingMailId;
    if (parsed.data.assignedToId) data.assignedToId = parsed.data.assignedToId;
    if (parsed.data.instruction) data.instruction = parsed.data.instruction;
    if (parsed.data.priority) data.priority = parsed.data.priority;
    if (parsed.data.dueDate !== undefined) data.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes || null;

    await secretariatService.updateDisposition(id, data);
    revalidatePath("/admin/secretariat/dispositions");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteDisposition(id: string) {
  try {
    await secretariatService.deleteDisposition(id);
    revalidatePath("/admin/secretariat/dispositions");
  } catch {
    return;
  }
}

export async function transitionDispositionStatus(id: string, status: string) {
  try {
    await secretariatService.transitionDispositionStatus(id, status as any);
    revalidatePath("/admin/secretariat/dispositions");
  } catch {
    return;
  }
}

export async function createAdministrativeDocument(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createAdministrativeDocumentSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await secretariatService.createAdministrativeDocument({
      documentNumber: parsed.data.documentNumber,
      documentType: parsed.data.documentType,
      title: parsed.data.title,
      description: parsed.data.description || null,
      content: parsed.data.content || null,
    });
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch (e) {
    if (e instanceof DuplicateNumberError) return;
    return;
  }
}

export async function updateAdministrativeDocument(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateAdministrativeDocumentSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data: Record<string, unknown> = {};
    if (parsed.data.documentNumber) data.documentNumber = parsed.data.documentNumber;
    if (parsed.data.documentType) data.documentType = parsed.data.documentType;
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.description !== undefined) data.description = parsed.data.description || null;
    if (parsed.data.content !== undefined) data.content = parsed.data.content || null;

    await secretariatService.updateAdministrativeDocument(id, data);
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteAdministrativeDocument(id: string) {
  try {
    await secretariatService.deleteAdministrativeDocument(id);
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch {
    return;
  }
}

export async function transitionAdministrativeDocumentStatus(id: string, status: string) {
  try {
    await secretariatService.transitionAdministrativeDocumentStatus(id, status as any);
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch {
    return;
  }
}
