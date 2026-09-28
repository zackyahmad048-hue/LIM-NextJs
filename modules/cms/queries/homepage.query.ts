import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import {
  HOMEPAGE_SECTIONS,
  type HomepageSectionDescriptor,
} from "@/config/home";

export interface HomepageSectionStatus extends HomepageSectionDescriptor {
  stored: boolean;
  updatedAt: Date | null;
}

export async function getHomepageSectionStatuses(): Promise<
  HomepageSectionStatus[]
> {
  const keys = HOMEPAGE_SECTIONS.map((section) => section.settingKey);
  let pages: { key: string; updatedAt: string }[] = [];
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "pages",
      where: { key: { in: keys } },
      limit: keys.length,
      depth: 0,
    });
    pages = res.docs.map((doc) => ({
      key: String(doc.key),
      updatedAt: doc.updatedAt,
    }));
  } catch {
    pages = [];
  }

  return HOMEPAGE_SECTIONS.map((section) => {
    const page = pages.find((candidate) => candidate.key === section.settingKey);
    return {
      ...section,
      stored: Boolean(page),
      updatedAt: page ? new Date(page.updatedAt) : null,
    };
  });
}
