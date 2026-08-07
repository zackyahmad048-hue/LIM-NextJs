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

const PERMISSION_UNIT_CREATE = ["organization.unit.create"];
const PERMISSION_UNIT_UPDATE = ["organization.unit.update"];
const PERMISSION_UNIT_DELETE = ["organization.unit.delete"];
const PERMISSION_OFFICER_CREATE = ["organization.officer.create"];
const PERMISSION_OFFICER_UPDATE = ["organization.officer.update"];
const PERMISSION_OFFICER_DELETE = ["organization.officer.delete"];

function revalidatePendataan() {
  revalidatePath("/admin/secretariat/pendataan");
}

export async function createUnitAction(formData: FormData) {
  const parsed = createUnitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

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
  } catch {
    return;
  }
}

export async function updateUnitAction(id: string, formData: FormData) {
  const parsed = updateUnitSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

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
  } catch {
    return;
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

export async function createOfficerAction(formData: FormData) {
  const parsed = createOfficerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

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
  } catch {
    return;
  }
}

export async function updateOfficerAction(id: string, formData: FormData) {
  const parsed = updateOfficerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

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
  } catch {
    return;
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
