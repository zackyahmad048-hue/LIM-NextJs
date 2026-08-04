"use server";

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { falakService } from "@/modules/falak/application/service";
import {
  hisabInputSchema,
  rukyatInputSchema,
  eclipseInputSchema,
} from "@/modules/falak/validations/schema";

const PERMISSION_HISAB_CALCULATE = ["falak.hisab.calculate"];
const PERMISSION_HISAB_ARCHIVE = ["falak.hisab.archive"];
const PERMISSION_RUKYAT_CREATE = ["falak.rukyat.create"];
const PERMISSION_RUKYAT_VERIFY = ["falak.rukyat.verify"];
const PERMISSION_RUKYAT_CONFIRM = ["falak.rukyat.confirm"];
const PERMISSION_RUKYAT_ARCHIVE = ["falak.rukyat.archive"];
const PERMISSION_ECLIPSE_CALCULATE = ["falak.eclipse.calculate"];

export async function createHisab(input: {
  calculationDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}) {
  const session = await requireSessionWithPermissions(PERMISSION_HISAB_CALCULATE);
  const parsed = hisabInputSchema.parse(input);
  await falakService.saveHisab({
    ...parsed,
    calculatedById: session.user.id,
  });
  revalidatePath("/admin/falak/hisab");
}

export async function deleteHisab(id: string) {
  await requireSessionWithPermissions(PERMISSION_HISAB_ARCHIVE);
  await falakService.deleteHisab(id);
  revalidatePath("/admin/falak/hisab");
}

export async function createRukyat(input: {
  observationDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
  weather: string;
  result: "VISIBLE" | "NOT_VISIBLE" | "CLOUDY" | "UNKNOWN";
  notes?: string;
}) {
  const session = await requireSessionWithPermissions(PERMISSION_RUKYAT_CREATE);
  const parsed = rukyatInputSchema.parse(input);
  await falakService.createRukyat({
    ...parsed,
    observerId: session.user.id,
    result: parsed.result as "VISIBLE" | "NOT_VISIBLE" | "CLOUDY" | "UNKNOWN",
  });
  revalidatePath("/admin/falak/rukyat");
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

export async function createEclipse(input: {
  eclipseType: "SOLAR" | "LUNAR";
  eclipseDate: Date;
  visibility?: string;
  details?: Record<string, unknown>;
}) {
  await requireSessionWithPermissions(PERMISSION_ECLIPSE_CALCULATE);
  const parsed = eclipseInputSchema.parse(input);
  await falakService.createEclipse({
    ...parsed,
    eclipseType: parsed.eclipseType as "SOLAR" | "LUNAR",
  });
  revalidatePath("/admin/falak/eclipse");
}
