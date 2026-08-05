"use server";

import { revalidatePath } from "next/cache";

import { getSitePageDefinition } from "@/config/site-pages";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import { sanitizeSitePageValues } from "@/modules/cms/queries/site-page.query";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function saveSitePageContent(
  key: string,
  values: Record<string, unknown>,
) {
  try {
    await requireSessionWithPermissions(["content.post.update"]);

    const def = getSitePageDefinition(key);
    if (!def) {
      return { ok: false as const, message: "Halaman tidak dikenal." };
    }

    const clean = sanitizeSitePageValues(key, values);
    if (!clean) {
      return { ok: false as const, message: "Konten halaman tidak valid." };
    }

    await prisma.setting.upsert({
      where: { key },
      create: {
        key,
        value: JSON.stringify(clean),
        type: "JSON",
        description: `Konten halaman ${def.title}`,
      },
      update: {
        value: JSON.stringify(clean),
        type: "JSON",
      },
    });

    revalidatePath("/admin/content/pages");
    revalidatePath(`/admin/content/pages/${key}`);
    revalidatePath("/");
    if (def.route.startsWith("/") && !def.route.includes("#")) {
      revalidatePath(def.route);
    }

    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}
