import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import { Button } from "@/components/ui/button";
import MediaLightboxGrid from "@/components/website/media/media-lightbox-grid";
import { getPublicMedia } from "@/modules/cms/queries/media.query";
import { IGNORED_MEDIA_FILES } from "@/lib/media";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri & Dokumentasi | LIM Digital Platform",
  description:
    "Dokumentasi kegiatan, foto, dan video Lembaga Ittihadul Muballighin.",
};

export default async function MediaPage() {
  const items = (await getPublicMedia()).filter(
    (item) => !IGNORED_MEDIA_FILES.has(item.name),
  );

  return (
    <>
      <PageHeader
        title="Galeri & Dokumentasi"
        description="Dokumentasi kegiatan, foto, dan video Lembaga Ittihadul Muballighin."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {items.length > 0 ? (
          <MediaLightboxGrid items={items} />
        ) : (
          <div className="rounded-xl border border-dashed border-primary/20 bg-card p-12 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Belum ada dokumentasi.
            </p>
            <Button variant="outline" size="sm" className="mt-5" asChild>
              <Link href="/kontak">Hubungi Sekretariat</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}