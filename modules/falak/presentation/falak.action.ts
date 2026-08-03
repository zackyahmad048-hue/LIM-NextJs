"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/modules/shared/infrastructure/require-session";
import { falakService } from "@/modules/falak/application/service";
import {
  hisabInputSchema,
  rukyatInputSchema,
  eclipseInputSchema,
} from "@/modules/falak/validations/schema";

export async function createHisab(input: {
  calculationDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}) {
  const session = await requireSession();
  const parsed = hisabInputSchema.parse(input);
  await falakService.saveHisab({
    ...parsed,
    calculatedById: session.user.id,
  });
  revalidatePath("/admin/falak/hisab");
}

export async function deleteHisab(id: string) {
  await requireSession();
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
  const session = await requireSession();
  const parsed = rukyatInputSchema.parse(input);
  await falakService.createRukyat({
    ...parsed,
    observerId: session.user.id,
    result: parsed.result as "VISIBLE" | "NOT_VISIBLE" | "CLOUDY" | "UNKNOWN",
  });
  revalidatePath("/admin/falak/rukyat");
}

export async function verifyRukyat(id: string) {
  await requireSession();
  await falakService.verifyRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

export async function confirmRukyat(id: string) {
  await requireSession();
  await falakService.confirmRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

export async function archiveRukyat(id: string) {
  await requireSession();
  await falakService.archiveRukyat(id);
  revalidatePath("/admin/falak/rukyat");
}

export async function createEclipse(input: {
  eclipseType: "SOLAR" | "LUNAR";
  eclipseDate: Date;
  visibility?: string;
  details?: Record<string, unknown>;
}) {
  await requireSession();
  const parsed = eclipseInputSchema.parse(input);
  await falakService.createEclipse({
    ...parsed,
    eclipseType: parsed.eclipseType as "SOLAR" | "LUNAR",
  });
  revalidatePath("/admin/falak/eclipse");
}
