"use server";

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
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
import {
  type ActionResult,
} from "@/modules/shared/presentation/action-result";

const PERMISSION_CREATE = ["program.create"];
const PERMISSION_UPDATE = ["program.update"];
const PERMISSION_DELETE = ["program.delete"];
const PERMISSION_PUBLISH = ["program.publish"];
const PERMISSION_CANCEL = ["program.cancel"];
const PERMISSION_COMPLETE = ["program.complete"];
const PERMISSION_ARCHIVE = ["program.archive"];
const PERMISSION_SCHEDULE_CREATE = ["program.schedule.create"];
const PERMISSION_SCHEDULE_DELETE = ["program.schedule.delete"];
const PERMISSION_COMMITTEE_CREATE = ["program.committee.create"];
const PERMISSION_COMMITTEE_DELETE = ["program.committee.delete"];
const PERMISSION_PARTICIPANT_CREATE = ["program.participant.create"];
const PERMISSION_PARTICIPANT_UPDATE = ["program.participant.update"];
const PERMISSION_PARTICIPANT_DELETE = ["program.participant.delete"];
const PERMISSION_ATTENDANCE_CREATE = ["program.attendance.create"];
const PERMISSION_ATTENDANCE_UPDATE = ["program.attendance.update"];
const PERMISSION_DOCUMENTATION_CREATE = ["program.documentation.create"];
const PERMISSION_DOCUMENTATION_DELETE = ["program.documentation.delete"];

const TRANSITION_PERMISSIONS: Record<string, string[]> = {
  PUBLISHED: PERMISSION_PUBLISH,
  REGISTRATION_OPEN: PERMISSION_PUBLISH,
  REGISTRATION_CLOSED: PERMISSION_UPDATE,
  ON_GOING: PERMISSION_UPDATE,
  COMPLETED: PERMISSION_COMPLETE,
  CANCELLED: PERMISSION_CANCEL,
  ARCHIVED: PERMISSION_ARCHIVE,
};

export async function createProgram(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = createProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Periksa kembali isian program." };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_CREATE);

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
    return { ok: true, message: "Program berhasil dibuat." };
  } catch (e) {
    if (e instanceof ProgramCodeExistsError) {
      return { ok: false, message: "Kode program sudah pernah dipakai." };
    }
    return { ok: false, message: "Gagal menyimpan program." };
  }
}

export async function updateProgram(
  id: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = updateProgramSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Periksa kembali isian program." };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_UPDATE);

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
    return { ok: true, message: "Perubahan program disimpan." };
  } catch (e) {
    if (e instanceof ProgramError) {
      return { ok: false, message: e.message };
    }
    return { ok: false, message: "Gagal menyimpan perubahan program." };
  }
}

export async function deleteProgram(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DELETE);
    await programService.delete(id);
    revalidatePath("/admin/program");
  } catch {
    return;
  }
}

export async function transitionProgramStatus(id: string, status: string) {
  try {
    const required =
      TRANSITION_PERMISSIONS[status] ?? PERMISSION_UPDATE;
    await requireSessionWithPermissions(required);
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
    await requireSessionWithPermissions(PERMISSION_SCHEDULE_CREATE);
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
    await requireSessionWithPermissions(PERMISSION_SCHEDULE_DELETE);
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
    await requireSessionWithPermissions(PERMISSION_COMMITTEE_CREATE);
    await programService.assignCommittee(programId, parsed.data);
    revalidatePath(`/admin/program/${programId}/committees`);
  } catch {
    return;
  }
}

export async function removeCommittee(id: string, programId: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_COMMITTEE_DELETE);
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
    await requireSessionWithPermissions(PERMISSION_PARTICIPANT_CREATE);
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
    await requireSessionWithPermissions(PERMISSION_PARTICIPANT_UPDATE);
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
    await requireSessionWithPermissions(PERMISSION_PARTICIPANT_DELETE);
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
    await requireSessionWithPermissions(PERMISSION_ATTENDANCE_CREATE);
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
    await requireSessionWithPermissions(PERMISSION_ATTENDANCE_UPDATE);
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
    await requireSessionWithPermissions(PERMISSION_DOCUMENTATION_CREATE);
    await programService.addDocumentation(programId, parsed.data);
    revalidatePath(`/admin/program/${programId}/documentation`);
  } catch {
    return;
  }
}

export async function removeDocumentation(id: string, programId: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DOCUMENTATION_DELETE);
    await programService.removeDocumentation(id);
    revalidatePath(`/admin/program/${programId}/documentation`);
  } catch {
    return;
  }
}
