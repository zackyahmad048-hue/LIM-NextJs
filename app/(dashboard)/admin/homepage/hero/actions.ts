"use server";

import { revalidatePath } from "next/cache";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { ActionResult } from "@/modules/shared/presentation/action-result";

function readValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateHeroConfig(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireSessionWithPermissions(["content.post.update"]);

    const statCards = [
      {
        value: readValue(formData, "stat1Value"),
        label: readValue(formData, "stat1Label"),
      },
      {
        value: readValue(formData, "stat2Value"),
        label: readValue(formData, "stat2Label"),
      },
      {
        value: readValue(formData, "stat3Value"),
        label: readValue(formData, "stat3Label"),
      },
    ].filter((s) => s.value || s.label);

    const payload = await getPayloadClient();
    await payload.updateGlobal({
      slug: "settings",
      data: {
        hero: {
          eyebrow: readValue(formData, "eyebrow"),
          title: readValue(formData, "title"),
          highlight: readValue(formData, "highlight"),
          tagline: readValue(formData, "tagline"),
          description: readValue(formData, "description"),
          image: readValue(formData, "image"),
          ctaLabel: readValue(formData, "ctaLabel"),
          ctaHref: readValue(formData, "ctaHref"),
          secondaryLabel: readValue(formData, "secondaryLabel"),
          secondaryHref: readValue(formData, "secondaryHref"),
          statCards,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/homepage/hero");
    return { ok: true, message: "Pengaturan hero disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan pengaturan hero." };
  }
}
