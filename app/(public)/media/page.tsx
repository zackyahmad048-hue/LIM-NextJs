import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/website/page-header";
import { Button } from "@/components/ui/button";
import { getPublicMediaItems } from "@/modules/cms/queries/media.query";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri & Dokumentasi | LIM Digital Platform",
  description:
    "Dokumentasi kegiatan, foto, dan video Lembaga Ittihadul Muballighin.",
};

const IGNORED_FILES = new Set(["logo.png", "orangelim.png"]);

/** Ubah nama file menjadi teks alt yang layak dibaca: "DSC_4021.jpg" -> "DSC 4021". */
function humanizeFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export default async function MediaPage() {
  const items = (await getPublicMediaItems()).filter(
    (item) => !IGNORED_FILES.has(item.name),
  );

  return (
    <>
      <PageHeader
        title="Galeri & Dokumentasi"
        description="Dokumentasi kegiatan, foto, dan video Lembaga Ittihadul Muballighin."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-primary/10 bg-card transition hover:border-primary/35"
              >
                <Image
                  src={item.href}
                  alt={humanizeFileName(item.name)}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-card p-12 text-center">
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
