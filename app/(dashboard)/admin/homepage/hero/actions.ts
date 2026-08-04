"use server";

import { revalidatePath } from "next/cache";

import { HERO_CONFIG_SETTING_KEY } from "@/config/hero";
import { SettingType } from "@/generated/enums";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { PrismaSettingRepository } from "@/modules/settings/infrastructure/setting.repository";
import type { HeroConfig } from "@/types/hero";

const settingRepository = new PrismaSettingRepository();

function readValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateHeroConfig(formData: FormData) {
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

  const config: HeroConfig = {
    eyebrow: readValue(formData, "eyebrow"),
    title: readValue(formData, "title"),
    highlight: readValue(formData, "highlight"),
    description: readValue(formData, "description"),
    image: readValue(formData, "image"),
    ctaLabel: readValue(formData, "ctaLabel"),
    ctaHref: readValue(formData, "ctaHref"),
    secondaryLabel: readValue(formData, "secondaryLabel"),
    secondaryHref: readValue(formData, "secondaryHref"),
    statCards,
  };

  await settingRepository.upsertValue({
    key: HERO_CONFIG_SETTING_KEY,
    value: JSON.stringify(config),
    type: SettingType.JSON,
    description: "Konfigurasi hero section pada landing page.",
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage/hero");
}
