import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface PageData {
  key: string;
  title: string;
  content: string;
  updatedAt: Date | null;
}

const PAGE_KEYS = [
  { key: "page:profil", title: "Profil" },
  { key: "page:visi-misi", title: "Visi & Misi" },
  { key: "page:tentang", title: "Tentang Kami" },
] as const;

export async function getPages(): Promise<PageData[]> {
  const settings = await prisma.setting.findMany({
    where: { key: { in: PAGE_KEYS.map((p) => p.key) } },
  });

  return PAGE_KEYS.map((pk) => {
    const setting = settings.find((s) => s.key === pk.key);
    let content = "";
    try {
      const parsed = JSON.parse(setting?.value ?? "{}");
      content = parsed.content ?? "";
    } catch {
      content = setting?.value ?? "";
    }

    return {
      key: pk.key,
      title: pk.title,
      content,
      updatedAt: setting?.updatedAt ?? null,
    };
  });
}

export async function getPage(key: string): Promise<PageData | null> {
  const pk = PAGE_KEYS.find((p) => p.key === key);
  if (!pk) return null;

  const setting = await prisma.setting.findUnique({ where: { key } });
  let content = "";
  try {
    const parsed = JSON.parse(setting?.value ?? "{}");
    content = parsed.content ?? "";
  } catch {
    content = setting?.value ?? "";
  }

  return {
    key: pk.key,
    title: pk.title,
    content,
    updatedAt: setting?.updatedAt ?? null,
  };
}

export async function savePage(key: string, content: string) {
  return prisma.setting.upsert({
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
}
