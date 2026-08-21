import { DEFAULT_HERO_CONFIG, HERO_CONFIG_SETTING_KEY } from "@/config/hero";
import { PrismaSettingRepository } from "@/modules/settings/infrastructure/setting.repository";
import type { HeroConfig } from "@/types/hero";

const settingRepository = new PrismaSettingRepository();

function isHeroConfig(value: unknown): value is HeroConfig {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.eyebrow === "string" &&
    typeof c.title === "string" &&
    typeof c.highlight === "string" &&
    typeof c.description === "string" &&
    typeof c.image === "string" &&
    typeof c.ctaLabel === "string" &&
    typeof c.ctaHref === "string" &&
    typeof c.secondaryLabel === "string" &&
    typeof c.secondaryHref === "string"
  );
}

export async function getHeroConfig(): Promise<HeroConfig> {
  let setting;
  try {
    setting = await settingRepository.findByKey(HERO_CONFIG_SETTING_KEY);
  } catch {
    return DEFAULT_HERO_CONFIG;
  }

  if (!setting) return DEFAULT_HERO_CONFIG;

  try {
    const parsed = JSON.parse(setting.value) as unknown;
    if (isHeroConfig(parsed)) return parsed;
  } catch {
    return DEFAULT_HERO_CONFIG;
  }

  return DEFAULT_HERO_CONFIG;
}
