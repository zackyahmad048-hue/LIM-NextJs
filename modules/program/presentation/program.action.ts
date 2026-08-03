"use server";

import { revalidatePath } from "next/cache";
import { programService } from "../application/service";
import {
  createProgramSchema,
  updateProgramSchema,
  createScheduleSchema,
  assignCommitteeSchema,
  registerParticipantSchema,
  addDocumentationSchema,
} from "../validations/schema";
import { ProgramError, ProgramCodeExistsError } from "../domain/program.errors";

export async function createProgram(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createProgramSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data = {
      code: parsed.data.code,
      name: parsed.data.name,
      type: parsed.data.type,
      description: parsed.data.description || null,
      personInChargeId: parsed.data.personInChargeId,
      registrationOpen: parsed.data.registrationOpen
        ? new Date(parsed.data.registrationOpen)
        : null,
      registrationClose: parsed.data.registrationClose
        ? new Date(parsed.data.registrationClose)
        : null,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    };
    await programService.create(data);
    revalidatePath("/admin/program");
  } catch (e) {
    if (e instanceof ProgramCodeExistsError) return;
    return;
  }
}

export async function updateProgram(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = updateProgramSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    const data: Record<string, unknown> = {};
    if (parsed.data.code) data.code = parsed.data.code;
    if (parsed.data.name) data.name = parsed.data.name;
    if (parsed.data.type) data.type = parsed.data.type;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description || null;
    if (parsed.data.personInChargeId)
      data.personInChargeId = parsed.data.personInChargeId;
    if (parsed.data.registrationOpen)
      data.registrationOpen = new Date(parsed.data.registrationOpen);
    if (parsed.data.registrationClose)
      data.registrationClose = new Date(parsed.data.registrationClose);
    if (parsed.data.startDate) data.startDate = new Date(parsed.data.startDate);
    if (parsed.data.endDate) data.endDate = new Date(parsed.data.endDate);

    await programService.update(id, data);
    revalidatePath("/admin/program");
  } catch (e) {
    if (e instanceof ProgramError) return;
    return;
  }
}

export async function deleteProgram(id: string) {
  try {
    await programService.delete(id);
    revalidatePath("/admin/program");
  } catch {
    return;
  }
}

export async function transitionProgramStatus(id: string, status: string) {
  try {
    await programService.transitionStatus(id, status as any);
    revalidatePath("/admin/program");
  } catch {
    return;
  }
}

export async function createSchedule(programId: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = createScheduleSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await programService.createSchedule(programId, {
      title: parsed.data.title,
      venueId: parsed.data.venueId || null,
      startTime: new Date(parsed.data.startTime),
      endTime: new Date(parsed.data.endTime),
      description: parsed.data.description || null,
    });
    revalidatePath(`/admin/program/${programId}/schedules`);
  } catch {
    return;
  }
}

export async function deleteSchedule(id: string, programId: string) {
  try {
    await programService.deleteSchedule(id);
    revalidatePath(`/admin/program/${programId}/schedules`);
  } catch {
    return;
  }
}

export async function assignCommittee(programId: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = assignCommitteeSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await programService.assignCommittee(programId, parsed.data);
    revalidatePath(`/admin/program/${programId}/committees`);
  } catch {
    return;
  }
}

export async function removeCommittee(id: string, programId: string) {
  try {
    await programService.removeCommittee(id);
    revalidatePath(`/admin/program/${programId}/committees`);
  } catch {
    return;
  }
}

export async function registerParticipant(
  programId: string,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData);
  const parsed = registerParticipantSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await programService.registerParticipant(programId, parsed.data.userId);
    revalidatePath(`/admin/program/${programId}/participants`);
  } catch {
    return;
  }
}

export async function updateParticipantStatus(
  id: string,
  programId: string,
  status: string,
) {
  try {
    await programService.updateParticipant(id, {
      registrationStatus: status as any,
    });
    revalidatePath(`/admin/program/${programId}/participants`);
  } catch {
    return;
  }
}

export async function removeParticipant(id: string, programId: string) {
  try {
    await programService.removeParticipant(id);
    revalidatePath(`/admin/program/${programId}/participants`);
  } catch {
    return;
  }
}

export async function checkInAttendance(
  participantId: string,
  programId: string,
) {
  try {
    await programService.checkIn(participantId, programId);
    revalidatePath(`/admin/program/${programId}/attendance`);
  } catch {
    return;
  }
}

export async function checkOutAttendance(
  participantId: string,
  programId: string,
) {
  try {
    await programService.checkOut(participantId, programId);
    revalidatePath(`/admin/program/${programId}/attendance`);
  } catch {
    return;
  }
}

export async function addDocumentation(programId: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = addDocumentationSchema.safeParse(raw);
  if (!parsed.success) return;

  try {
    await programService.addDocumentation(programId, parsed.data);
    revalidatePath(`/admin/program/${programId}/documentation`);
  } catch {
    return;
  }
}

export async function removeDocumentation(id: string, programId: string) {
  try {
    await programService.removeDocumentation(id);
    revalidatePath(`/admin/program/${programId}/documentation`);
  } catch {
    return;
  }
}
