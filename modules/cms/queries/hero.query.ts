import { DEFAULT_HERO_CONFIG, HERO_CONFIG_SETTING_KEY } from "@/config/hero";
import { PrismaSettingRepository } from "@/modules/settings/infrastructure/setting.repository";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
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
    typeof c.secondaryHref === "string" &&
    (c.tagline === undefined || typeof c.tagline === "string")
  );
}

function pickStr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function fromPayloadHero(hero: unknown): HeroConfig | null {
  if (!hero || typeof hero !== "object") return null;
  const h = hero as Record<string, unknown>;
  const hasSignal =
    pickStr(h.title, "") !== "" ||
    pickStr(h.highlight, "") !== "" ||
    pickStr(h.description, "") !== "";
  if (!hasSignal) return null;

  const rawCards = Array.isArray(h.statCards) ? h.statCards : [];
  const statCards = rawCards
    .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === "object")
    .map((c) => ({
      value: String(c.value ?? ""),
      label: String(c.label ?? ""),
    }))
    .filter((c) => c.value || c.label);

  return {
    eyebrow: pickStr(h.eyebrow, DEFAULT_HERO_CONFIG.eyebrow),
    title: pickStr(h.title, DEFAULT_HERO_CONFIG.title),
    highlight: pickStr(h.highlight, DEFAULT_HERO_CONFIG.highlight),
    tagline: pickStr(h.tagline, DEFAULT_HERO_CONFIG.tagline ?? ""),
    description: pickStr(h.description, DEFAULT_HERO_CONFIG.description),
    image: pickStr(h.image, DEFAULT_HERO_CONFIG.image),
    ctaLabel: pickStr(h.ctaLabel, DEFAULT_HERO_CONFIG.ctaLabel),
    ctaHref: pickStr(h.ctaHref, DEFAULT_HERO_CONFIG.ctaHref),
    secondaryLabel: pickStr(h.secondaryLabel, DEFAULT_HERO_CONFIG.secondaryLabel),
    secondaryHref: pickStr(h.secondaryHref, DEFAULT_HERO_CONFIG.secondaryHref),
    statCards: statCards.length > 0 ? statCards : DEFAULT_HERO_CONFIG.statCards,
  };
}

async function fromLegacyPrisma(): Promise<HeroConfig | null> {
  let setting;
  try {
    setting = await settingRepository.findByKey(HERO_CONFIG_SETTING_KEY);
  } catch {
    return null;
  }
  if (!setting) return null;
  try {
    const parsed = JSON.parse(setting.value) as unknown;
    if (isHeroConfig(parsed)) {
      return { ...parsed, tagline: parsed.tagline ?? DEFAULT_HERO_CONFIG.tagline };
    }
  } catch {
    return null;
  }
  return null;
}

export async function getHeroConfig(): Promise<HeroConfig> {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "settings" });
    const fromPayload = fromPayloadHero(settings.hero);
    if (fromPayload) return fromPayload;
  } catch {
    // fall through to legacy / defaults
  }

  const legacy = await fromLegacyPrisma();
  if (legacy) return legacy;

  return DEFAULT_HERO_CONFIG;
}
