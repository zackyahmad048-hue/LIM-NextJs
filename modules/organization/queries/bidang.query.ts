import { BIDANG, type Bidang } from "@/config/bidang";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { Bidang as PayloadBidangDoc } from "@/payload-types";

function toBidang(doc: PayloadBidangDoc): Bidang {
  return {
    slug: doc.slug,
    title: doc.title,
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    points: (doc.points ?? [])
      .map((point) => point.value ?? "")
      .filter(Boolean),
  };
}

/**
 * Daftar bidang dari Payload (sumber utama setelah migrasi).
 * Jatuh ke `BIDANG` statis bila Payload kosong / gagal diakses.
 */
export async function getBidangList(): Promise<Bidang[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "bidangs",
      limit: 100,
      sort: "sortOrder",
      depth: 0,
    });
    if (res.docs.length > 0) {
      return res.docs.map(toBidang);
    }
  } catch {
    // fall through ke konfigurasi statis
  }
  return BIDANG;
}

export async function getBidangBySlug(
  slug: string,
): Promise<Bidang | undefined> {
  const list = await getBidangList();
  return list.find((bidang) => bidang.slug === slug);
}