"use server";

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { falakService } from "@/modules/falak/application/service";

const PERMISSION_HISAB_ARCHIVE = ["falak.hisab.archive"];
const PERMISSION_RUKYAT_VERIFY = ["falak.rukyat.verify"];
const PERMISSION_RUKYAT_CONFIRM = ["falak.rukyat.confirm"];
const PERMISSION_RUKYAT_ARCHIVE = ["falak.rukyat.archive"];


export async function deleteHisab(id: string) {
  await requireSessionWithPermissions(PERMISSION_HISAB_ARCHIVE);
  await falakService.deleteHisab(id);
  revalidatePath("/admin/falak/hisab");
}


export async function verifyRukyat(id: string) {
  await requireSessionWithPermissions(PERMISSION_RUKYAT_VERIFY);
  await falakService.verifyRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

export async function confirmRukyat(id: string) {
  await requireSessionWithPermissions(PERMISSION_RUKYAT_CONFIRM);
  await falakService.confirmRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

export async function archiveRukyat(id: string) {
  await requireSessionWithPermissions(PERMISSION_RUKYAT_ARCHIVE);
  await falakService.archiveRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

