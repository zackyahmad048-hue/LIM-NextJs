"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
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
  updateAgendaBookSchema,
} from "../validations/schema";
import {
  SecretariatError,
  DuplicateNumberError,
} from "../domain/secretariat.errors";

const PERMISSION_INCOMING_CREATE = ["secretariat.incoming-mail.create"];
const PERMISSION_INCOMING_UPDATE = ["secretariat.incoming-mail.update"];
const PERMISSION_INCOMING_DELETE = ["secretariat.incoming-mail.delete"];
const PERMISSION_OUTGOING_CREATE = ["secretariat.outgoing-mail.create"];
const PERMISSION_OUTGOING_UPDATE = ["secretariat.outgoing-mail.update"];
const PERMISSION_OUTGOING_DELETE = ["secretariat.outgoing-mail.delete"];
const PERMISSION_DISPOSITION_CREATE = ["secretariat.disposition.create"];
const PERMISSION_DISPOSITION_UPDATE = ["secretariat.disposition.update"];
const PERMISSION_DISPOSITION_DELETE = ["secretariat.disposition.delete"];
const PERMISSION_DOCUMENT_CREATE = ["secretariat.document.create"];
const PERMISSION_DOCUMENT_UPDATE = ["secretariat.document.update"];
const PERMISSION_DOCUMENT_DELETE = ["secretariat.document.delete"];
const PERMISSION_AGENDA_CREATE = ["secretariat.agenda.create"];
const PERMISSION_AGENDA_UPDATE = ["secretariat.agenda.update"];
const PERMISSION_AGENDA_DELETE = ["secretariat.agenda.delete"];

export async function createIncomingMail(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createIncomingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_INCOMING_CREATE);
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
    revalidatePath("/admin/secretariat/surat-menyurat");
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
    await requireSessionWithPermissions(PERMISSION_INCOMING_UPDATE);
    const data: Record<string, unknown> = {};
    if (parsed.data.registrationNumber)
      data.registrationNumber = parsed.data.registrationNumber;
    if (parsed.data.sender) data.sender = parsed.data.sender;
    if (parsed.data.subject) data.subject = parsed.data.subject;
    if (parsed.data.senderAddress !== undefined)
      data.senderAddress = parsed.data.senderAddress || null;
    if (parsed.data.receivedDate)
      data.receivedDate = new Date(parsed.data.receivedDate);
    if (parsed.data.classification !== undefined)
      data.classification = parsed.data.classification || null;
    if (parsed.data.category !== undefined)
      data.category = parsed.data.category || null;
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes || null;
    if (parsed.data.attachmentUrl !== undefined)
      data.attachmentUrl = parsed.data.attachmentUrl || null;

    await secretariatService.updateIncomingMail(id, data);
    revalidatePath("/admin/secretariat/surat-menyurat");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteIncomingMail(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_INCOMING_DELETE);
    await secretariatService.deleteIncomingMail(id);
    revalidatePath("/admin/secretariat/surat-menyurat");
  } catch {
    return;
  }
}

export async function transitionIncomingMailStatus(id: string, status: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_INCOMING_UPDATE);
    await secretariatService.transitionIncomingMailStatus(id, status as any);
    revalidatePath("/admin/secretariat/surat-menyurat");
  } catch {
    return;
  }
}

export async function createOutgoingMail(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createOutgoingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  const intent = String(raw.action ?? "draft");

  try {
    const auth = await requireSessionWithPermissions(PERMISSION_OUTGOING_CREATE);
    const mail = await secretariatService.createOutgoingMail({
      recipient: parsed.data.recipient || null,
      subject: parsed.data.subject,
      senderName: parsed.data.senderName || null,
      mailDate: new Date(parsed.data.mailDate),
      levelCode: parsed.data.levelCode,
      categoryCode: parsed.data.categoryCode,
      content: parsed.data.content || null,
      attachmentUrl: parsed.data.attachmentUrl || null,
    });

    if (intent === "submit") {
      await secretariatService.transitionOutgoingMailStatus(mail.id, "SUBMITTED", {
        userId: auth.user.id,
        roleSlugs: auth.roleSlugs,
      });
    }

    revalidatePath("/admin/secretariat/surat-menyurat");
    revalidatePath("/admin/secretariat/outgoing-mail/list");
  } catch (e) {
    console.error("[createOutgoingMail]", e);
    return;
  }
  redirect("/admin/secretariat/surat-menyurat");
}

export async function updateOutgoingMail(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateOutgoingMailSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_OUTGOING_UPDATE);
    const data: Record<string, unknown> = {};
    if (parsed.data.recipient) data.recipient = parsed.data.recipient;
    if (parsed.data.subject) data.subject = parsed.data.subject;
    if (parsed.data.content !== undefined)
      data.content = parsed.data.content || null;
    if (parsed.data.senderName !== undefined)
      data.senderName = parsed.data.senderName || null;
    if (parsed.data.mailDate) data.mailDate = new Date(parsed.data.mailDate);
    if (parsed.data.levelCode) data.levelCode = parsed.data.levelCode;
    if (parsed.data.categoryCode) data.categoryCode = parsed.data.categoryCode;
    if (parsed.data.attachmentUrl !== undefined)
      data.attachmentUrl = parsed.data.attachmentUrl || null;

    await secretariatService.updateOutgoingMail(id, data);
    revalidatePath("/admin/secretariat/outgoing-mail/list");
    revalidatePath("/admin/secretariat/surat-menyurat");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteOutgoingMail(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_OUTGOING_DELETE);
    await secretariatService.deleteOutgoingMail(id);
    revalidatePath("/admin/secretariat/outgoing-mail/list");
  } catch {
    return;
  }
}

export async function transitionOutgoingMailStatus(id: string, status: string) {
  try {
    const auth = await requireSessionWithPermissions(PERMISSION_OUTGOING_UPDATE);
    await secretariatService.transitionOutgoingMailStatus(id, status as any, {
      userId: auth.user.id,
      roleSlugs: auth.roleSlugs,
    });
    revalidatePath("/admin/secretariat/outgoing-mail/list");
    revalidatePath("/admin/secretariat/surat-menyurat");
    return { success: true };
  } catch (e) {
    if (e instanceof SecretariatError) {
      return { success: false, message: e.message };
    }
    return { success: false, message: "Terjadi kesalahan." };
  }
}

export async function createDisposition(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createDispositionSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_DISPOSITION_CREATE);
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
    await requireSessionWithPermissions(PERMISSION_DISPOSITION_UPDATE);
    const data: Record<string, unknown> = {};
    if (parsed.data.incomingMailId)
      data.incomingMailId = parsed.data.incomingMailId;
    if (parsed.data.assignedToId) data.assignedToId = parsed.data.assignedToId;
    if (parsed.data.instruction) data.instruction = parsed.data.instruction;
    if (parsed.data.priority) data.priority = parsed.data.priority;
    if (parsed.data.dueDate !== undefined)
      data.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null;
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
    await requireSessionWithPermissions(PERMISSION_DISPOSITION_DELETE);
    await secretariatService.deleteDisposition(id);
    revalidatePath("/admin/secretariat/dispositions");
  } catch {
    return;
  }
}

export async function transitionDispositionStatus(id: string, status: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DISPOSITION_UPDATE);
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
    await requireSessionWithPermissions(PERMISSION_DOCUMENT_CREATE);
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

export async function updateAdministrativeDocument(
  id: string,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData);
  const parsed = updateAdministrativeDocumentSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_DOCUMENT_UPDATE);
    const data: Record<string, unknown> = {};
    if (parsed.data.documentNumber)
      data.documentNumber = parsed.data.documentNumber;
    if (parsed.data.documentType) data.documentType = parsed.data.documentType;
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description || null;
    if (parsed.data.content !== undefined)
      data.content = parsed.data.content || null;

    await secretariatService.updateAdministrativeDocument(id, data);
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch (e) {
    if (e instanceof SecretariatError) return;
    return;
  }
}

export async function deleteAdministrativeDocument(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DOCUMENT_DELETE);
    await secretariatService.deleteAdministrativeDocument(id);
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch {
    return;
  }
}

export async function transitionAdministrativeDocumentStatus(
  id: string,
  status: string,
) {
  try {
    await requireSessionWithPermissions(PERMISSION_DOCUMENT_UPDATE);
    await secretariatService.transitionAdministrativeDocumentStatus(
      id,
      status as any,
    );
    revalidatePath("/admin/secretariat/administrative-documents");
  } catch {
    return;
  }
}

export async function createAgendaBook(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createAgendaBookSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_AGENDA_CREATE);
    await secretariatService.createAgendaBook({
      date: new Date(parsed.data.date),
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      participants: parsed.data.participants || null,
      notes: parsed.data.notes || null,
    });
    revalidatePath("/admin/secretariat/agenda");
  } catch {
    return;
  }
}

export async function updateAgendaBook(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateAgendaBookSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await requireSessionWithPermissions(PERMISSION_AGENDA_UPDATE);
    const data: Record<string, unknown> = {};
    if (parsed.data.date) data.date = parsed.data.date;
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description || null;
    if (parsed.data.location !== undefined)
      data.location = parsed.data.location || null;
    if (parsed.data.participants !== undefined)
      data.participants = parsed.data.participants || null;
    if (parsed.data.notes !== undefined)
      data.notes = parsed.data.notes || null;

    await secretariatService.updateAgendaBook(id, data as any);
    revalidatePath("/admin/secretariat/agenda");
  } catch {
    return;
  }
}

export async function deleteAgendaBook(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_AGENDA_DELETE);
    await secretariatService.deleteAgendaBook(id);
    revalidatePath("/admin/secretariat/agenda");
  } catch {
    return;
  }
}
