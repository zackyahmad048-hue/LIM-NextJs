import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { getStructure } from "@/modules/cms/queries/structure.query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengurus Pusat | LIM Digital Platform",
  description:
    "Struktur Dewan Harian Pengurus Pusat Lembaga Ittihadul Muballighin.",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(-1)[0]
    .slice(0, 2)
    .toUpperCase();
}

export default async function PengurusPusatPage() {
  const structure = await getStructure();
  const pengurus = structure.centralBoard;

  return (
    <>
      <PageHeader
        centered
        title="Pengurus Pusat"
        description="Struktur Dewan Harian Pengurus Pusat Lembaga Ittihadul Muballighin."
      />
      <SiteSection>
        {pengurus.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/20 bg-card p-12 text-center shadow-sm">
            <p className="text-center text-sm text-muted-foreground">
              Belum ada data Pengurus Pusat.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {pengurus.map((orang, i) => (
              <Reveal key={orang.id} index={i} className="h-full">
                <div
                  className="group h-full rounded-xl border border-primary/25 bg-card p-5 shadow-sm transition-colors duration-300 ease-out hover:border-primary"
                >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 font-sans text-sm text-foreground">
                  {orang.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={orang.image}
                      alt={orang.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    initials(orang.name)
                  )}
                </div>
                <h2 className="mt-4 font-heading text-sm font-semibold text-balance text-foreground">
                  {orang.name}
                </h2>
                <p className="mt-1 font-sans text-[10px] uppercase text-primary">
                  {orang.position}
                </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </SiteSection>
    </>
  );
}