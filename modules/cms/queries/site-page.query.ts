import { prisma } from "@/modules/shared/infrastructure/prisma";
import {
  SITE_PAGE_KEYS,
  getSitePageDefinition,
  type SitePageField,
} from "@/config/site-pages";

export interface ContentPair {
  title: string;
  description: string;
}

interface TypedContent {
  headerTitle: string;
  headerDescription: string;
  [key: string]: unknown;
}

export interface ProfilContent extends TypedContent {
  visi: string;
  misi: string[];
}

export interface TentangContent extends TypedContent {
  sejarah: string;
  keunggulan: ContentPair[];
  tujuan: string[];
}

export interface VisiMisiContent extends TypedContent {
  visi: string;
  misi: ContentPair[];
}

export interface FalakContent extends TypedContent {
  metode: string;
}

export interface KontakContent extends TypedContent {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface TimWajibKhidmahContent extends TypedContent {
  sectionTitle: string;
  description: string;
  peran: string[];
  memberNote: string;
}

export interface AboutContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: ContentPair[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readField(field: SitePageField, stored: unknown, fallback: unknown) {
  if (field.type === "text" || field.type === "textarea") {
    return typeof stored === "string" ? stored : String(fallback ?? "");
  }

  if (field.type === "list-simple") {
    if (Array.isArray(stored)) {
      return stored.filter((item): item is string => typeof item === "string");
    }
    const fallbackList = Array.isArray(fallback)
      ? fallback.filter((item): item is string => typeof item === "string")
      : [];
    return fallbackList;
  }

  if (field.type === "list-pair") {
    if (Array.isArray(stored)) {
      return stored
        .filter((item): item is ContentPair => isRecord(item))
        .map((item) => ({
          title: String(item.title ?? ""),
          description: String(item.description ?? ""),
        }))
        .filter((item) => item.title || item.description);
    }
    const fallbackList = Array.isArray(fallback)
      ? fallback.filter((item): item is ContentPair => isRecord(item))
      : [];
    return fallbackList;
  }

  return fallback;
}

export async function getSitePageValues(
  key: string,
): Promise<Record<string, unknown>> {
  const def = getSitePageDefinition(key);
  if (!def) throw new Error(`Halaman tidak dikenal: ${key}`);

  let stored: unknown;
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    stored = setting ? JSON.parse(setting.value) : null;
  } catch {
    stored = null;
  }

  const values: Record<string, unknown> = {};
  for (const field of def.fields) {
    const raw = isRecord(stored) ? stored[field.key] : undefined;
    values[field.key] = readField(field, raw, def.defaults[field.key]);
  }
  return values;
}

export function sanitizeSitePageValues(
  key: string,
  raw: unknown,
): Record<string, unknown> | null {
  const def = getSitePageDefinition(key);
  if (!def) return null;

  const source = isRecord(raw) ? raw : {};
  const values: Record<string, unknown> = {};
  for (const field of def.fields) {
    values[field.key] = readField(
      field,
      source[field.key],
      def.defaults[field.key],
    );
  }
  return values;
}

export interface SitePageStatus {
  key: string;
  route: string;
  title: string;
  updatedAt: Date | null;
}

export async function getSitePageStatuses(): Promise<SitePageStatus[]> {
  const settings = await prisma.setting.findMany({
    where: { key: { in: SITE_PAGE_KEYS } },
    select: { key: true, updatedAt: true },
  });

  return SITE_PAGE_KEYS.map((key) => {
    const def = getSitePageDefinition(key)!;
    return {
      key,
      route: def.route,
      title: def.title,
      updatedAt: settings.find((s) => s.key === key)?.updatedAt ?? null,
    };
  });
}

export async function getAboutContent(): Promise<AboutContent> {
  const values = await getSitePageValues("homepage.about");
  return {
    badge: String(values.badge ?? ""),
    title: String(values.title ?? ""),
    subtitle: String(values.subtitle ?? ""),
    description: String(values.description ?? ""),
    image: String(values.image ?? ""),
    features: Array.isArray(values.features)
      ? (values.features as ContentPair[])
      : [],
  };
}

export async function getProfilContent(): Promise<ProfilContent> {
  const values = await getSitePageValues("page:profil");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    visi: String(values.visi ?? ""),
    misi: Array.isArray(values.misi) ? (values.misi as string[]) : [],
  };
}

export async function getTentangContent(): Promise<TentangContent> {
  const values = await getSitePageValues("page:tentang");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    sejarah: String(values.sejarah ?? ""),
    keunggulan: Array.isArray(values.keunggulan)
      ? (values.keunggulan as ContentPair[])
      : [],
    tujuan: Array.isArray(values.tujuan) ? (values.tujuan as string[]) : [],
  };
}

export async function getVisiMisiContent(): Promise<VisiMisiContent> {
  const values = await getSitePageValues("page:visi-misi");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    visi: String(values.visi ?? ""),
    misi: Array.isArray(values.misi) ? (values.misi as ContentPair[]) : [],
  };
}

export async function getFalakContent(): Promise<FalakContent> {
  const values = await getSitePageValues("page:falak");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    metode: String(values.metode ?? ""),
  };
}

export async function getKontakContent(): Promise<KontakContent> {
  const values = await getSitePageValues("page:kontak");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    address: String(values.address ?? ""),
    phone: String(values.phone ?? ""),
    email: String(values.email ?? ""),
    whatsapp: String(values.whatsapp ?? ""),
  };
}

export async function getTimWajibKhidmahContent(): Promise<TimWajibKhidmahContent> {
  const values = await getSitePageValues("page:tim-wajib-khidmah");
  return {
    headerTitle: String(values.headerTitle ?? ""),
    headerDescription: String(values.headerDescription ?? ""),
    sectionTitle: String(values.sectionTitle ?? ""),
    description: String(values.description ?? ""),
    peran: Array.isArray(values.peran) ? (values.peran as string[]) : [],
    memberNote: String(values.memberNote ?? ""),
  };
}
