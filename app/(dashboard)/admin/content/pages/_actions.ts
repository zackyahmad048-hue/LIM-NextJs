"use server";

import { revalidatePath } from "next/cache";

import { getSitePageDefinition } from "@/config/site-pages";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import { sanitizeSitePageValues } from "@/modules/cms/queries/site-page.query";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import type { Page } from "@/payload-types";

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

    const payload = await getPayloadClient();
    const existing = await payload.find({
      collection: "pages",
      where: { key: { equals: key } },
      limit: 1,
      depth: 0,
    });
    const doc = existing.docs[0];

    if (doc) {
      await payload.update({
        collection: "pages",
        id: doc.id,
        data: { content: clean },
      });
    } else {
      await payload.create({
        collection: "pages",
        // key was validated against getSitePageDefinition above
        data: { key: key as Page["key"], content: clean },
      });
    }

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
