"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/modules/shared/infrastructure/prisma";
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

export async function savePageContent(key: string, content: string) {
  try {
    await requireSessionWithPermissions(["content.post.update"]);

    await prisma.setting.upsert({
      where: { key },
      create: {
        key,
        value: JSON.stringify({ content }),
        type: "JSON",
      },
      update: {
        value: JSON.stringify({ content }),
        type: "JSON",
      },
    });

    revalidatePath("/admin/content/pages");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}
