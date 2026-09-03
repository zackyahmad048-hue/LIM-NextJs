import { prisma } from "@/modules/shared/infrastructure/prisma";
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
  let settings: { key: string; updatedAt: Date }[] = [];
  try {
    settings = await prisma.setting.findMany({
      where: { key: { in: keys } },
      select: { key: true, updatedAt: true },
    });
  } catch {
    settings = [];
  }

  return HOMEPAGE_SECTIONS.map((section) => {
    const stored = settings.find(
      (setting) => setting.key === section.settingKey,
    );
    return {
      ...section,
      stored: Boolean(stored),
      updatedAt: stored?.updatedAt ?? null,
    };
  });
}
