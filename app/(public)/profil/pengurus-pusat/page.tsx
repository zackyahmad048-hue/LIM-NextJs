import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {pengurus.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-card p-12 text-center">
            <p className="text-center text-sm text-muted-foreground">
              Belum ada data Pengurus Pusat.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {pengurus.map((orang) => (
              <div
                key={orang.id}
                className="group rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] p-5 backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] transition-colors hover:border-primary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-sans text-sm text-primary">
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
                <h3 className="mt-4 font-display text-sm font-semibold text-balance text-foreground">
                  {orang.name}
                </h3>
                <p className="mt-1 font-sans text-[10px] uppercase text-primary">
                  {orang.position}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}