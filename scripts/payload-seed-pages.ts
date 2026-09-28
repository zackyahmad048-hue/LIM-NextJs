import "dotenv/config";

import { DEFAULT_HERO_CONFIG } from "@/config/hero";
import { SITE_PAGES } from "@/config/site-pages";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { Page } from "@/payload-types";

export async function seedSitePages(): Promise<void> {
  const payload = await getPayloadClient();

  for (const def of Object.values(SITE_PAGES)) {
    const existing = await payload.find({
      collection: "pages",
      where: { key: { equals: def.key } },
      limit: 1,
      depth: 0,
    });

    const content = def.defaults;
    const doc = existing.docs[0];

    if (doc) {
      await payload.update({
        collection: "pages",
        id: doc.id,
        data: { content },
        depth: 0,
      });
    } else {
      await payload.create({
        collection: "pages",
        data: { key: def.key as Page["key"], content },
        depth: 0,
      });
    }
    console.log(`seeded page: ${def.key}`);
  }

  const settings = await payload.findGlobal({ slug: "settings" });
  const heroEmpty =
    !settings.hero ||
    (!settings.hero.title &&
      !settings.hero.highlight &&
      !settings.hero.description);

  if (heroEmpty) {
    await payload.updateGlobal({
      slug: "settings",
      data: {
        hero: {
          eyebrow: DEFAULT_HERO_CONFIG.eyebrow,
          title: DEFAULT_HERO_CONFIG.title,
          highlight: DEFAULT_HERO_CONFIG.highlight,
          tagline: DEFAULT_HERO_CONFIG.tagline ?? "",
          description: DEFAULT_HERO_CONFIG.description,
          image: DEFAULT_HERO_CONFIG.image,
          ctaLabel: DEFAULT_HERO_CONFIG.ctaLabel,
          ctaHref: DEFAULT_HERO_CONFIG.ctaHref,
          secondaryLabel: DEFAULT_HERO_CONFIG.secondaryLabel,
          secondaryHref: DEFAULT_HERO_CONFIG.secondaryHref,
          // strip ids — payload array parent_id is integer; string nanoids break postgres
          statCards: DEFAULT_HERO_CONFIG.statCards.map((c) => ({
            value: c.value,
            label: c.label,
          })),
        },
      },
    });
    console.log("seeded settings.hero defaults");
  } else {
    console.log("settings.hero already set — skip");
  }
}

async function main() {
  await seedSitePages();
  console.log("done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
