"use server";

import { revalidatePath } from "next/cache";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { saveStructure } from "@/modules/cms/queries/structure.query";
import type { OrgStructure } from "@/modules/cms/queries/structure.query";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function saveStructureAction(data: OrgStructure) {
  try {
    await requireSessionWithPermissions(["structure.update"]);
    await saveStructure(data);
    revalidatePath("/admin/structure");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}
