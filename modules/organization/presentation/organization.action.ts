"use server";

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { organizationService } from "../application/service";
import {
  createOfficerSchema,
  createUnitSchema,
  updateOfficerSchema,
  updateUnitSchema,
} from "../validations/schema";
import type { ActionResult } from "@/modules/shared/presentation/action-result";

const PERMISSION_UNIT_CREATE = ["organization.unit.create"];
const PERMISSION_UNIT_UPDATE = ["organization.unit.update"];
const PERMISSION_UNIT_DELETE = ["organization.unit.delete"];
const PERMISSION_OFFICER_CREATE = ["organization.officer.create"];
const PERMISSION_OFFICER_UPDATE = ["organization.officer.update"];
const PERMISSION_OFFICER_DELETE = ["organization.officer.delete"];

function revalidatePendataan() {
  revalidatePath("/admin/secretariat/pendataan");
}

function firstIssueMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues?: { message?: string }[] }).issues)
  ) {
    const message = (error as { issues: { message?: string }[] }).issues[0]
      ?.message;
    if (message) return message;
  }
  return "Periksa kembali isian formulir.";
}

export async function createUnitAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createUnitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: firstIssueMessage(parsed.error) };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_UNIT_CREATE);
    await organizationService.createUnit({
      code: parsed.data.code,
      name: parsed.data.name,
      level: parsed.data.level,
      parentId: parsed.data.parentId || undefined,
      sortOrder: parsed.data.sortOrder,
    });
    revalidatePendataan();
    return { ok: true, message: "Unit berhasil disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan unit." };
  }
}

export async function updateUnitAction(
  id: string,
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateUnitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: firstIssueMessage(parsed.error) };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_UNIT_UPDATE);
    await organizationService.updateUnit(id, {
      code: parsed.data.code,
      name: parsed.data.name,
      level: parsed.data.level,
      parentId: parsed.data.parentId || undefined,
      sortOrder: parsed.data.sortOrder,
    });
    revalidatePendataan();
    return { ok: true, message: "Perubahan unit disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan perubahan unit." };
  }
}

export async function deleteUnitAction(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_UNIT_DELETE);
    await organizationService.deleteUnit(id);
    revalidatePendataan();
  } catch {
    return;
  }
}

export async function createOfficerAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = createOfficerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: firstIssueMessage(parsed.error) };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_OFFICER_CREATE);
    await organizationService.createOfficer({
      unitId: parsed.data.unitId,
      name: parsed.data.name,
      position: parsed.data.position,
      isLeader: parsed.data.isLeader,
      phone: parsed.data.phone || undefined,
      email: parsed.data.email || undefined,
      sortOrder: parsed.data.sortOrder,
    });
    revalidatePendataan();
    return { ok: true, message: "Pengurus berhasil disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan pengurus." };
  }
}

export async function updateOfficerAction(
  id: string,
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateOfficerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: firstIssueMessage(parsed.error) };
  }

  try {
    await requireSessionWithPermissions(PERMISSION_OFFICER_UPDATE);
    await organizationService.updateOfficer(id, {
      name: parsed.data.name,
      position: parsed.data.position,
      isLeader: parsed.data.isLeader,
      phone: parsed.data.phone || undefined,
      email: parsed.data.email || undefined,
      sortOrder: parsed.data.sortOrder,
    });
    revalidatePendataan();
    return { ok: true, message: "Perubahan pengurus disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan perubahan pengurus." };
  }
}

export async function deleteOfficerAction(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_OFFICER_DELETE);
    await organizationService.deleteOfficer(id);
    revalidatePendataan();
  } catch {
    return;
  }
}