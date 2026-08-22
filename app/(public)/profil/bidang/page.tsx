import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import { HubDot } from "@/components/shared/hub-dot";
import { BIDANG } from "@/config/bidang";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bidang | LIM Digital Platform",
  description:
    "Bidang-bidang kegiatan Lembaga Ittihadul Muballighin meliputi berbagai program dan layanan untuk masyarakat.",
};

export default function BidangIndexPage() {
  return (
    <>
      <PageHeader
        title="Bidang-Bidang"
        description="Berbagai bidang kegiatan Lembaga Ittihadul Muballighin dalam melayani masyarakat."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BIDANG.map((bidang) => (
            <Link
              key={bidang.slug}
              href={`/profil/bidang/${bidang.slug}`}
              className="group rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] p-5 backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] transition-colors hover:border-primary/40"
            >
              <h2 className="text-sm font-semibold text-balance text-foreground">
                {bidang.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {bidang.tagline}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {bidang.description.length > 100
                  ? `${bidang.description.slice(0, 100)}...`
                  : bidang.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {bidang.points.slice(0, 2).map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    <HubDot className="h-1.5 w-1.5" />
                    {point.length > 25 ? `${point.slice(0, 25)}...` : point}
                  </span>
                ))}
                {bidang.points.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{bidang.points.length - 2} lainnya
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}