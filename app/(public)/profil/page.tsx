import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";

export const metadata: Metadata = {
  title: "Profil | LIM Digital Platform",
  description:
    "Mengenal Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang membangun peradaban umat.",
};

export default function ProfilPage() {
  return (
    <>
      <PageHeader
        title="Lembaga Ittihadul Muballighin"
        description="Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/15 bg-card p-7">
            <SectionLabel>Visi</SectionLabel>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh
              berkualitas, profesional, dan berakhlakul karimah di seluruh
              Indonesia.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Menyelenggarakan pendidikan dan pelatihan muballigh
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Memperkuat jaringan dakwah di seluruh Nusantara
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Mengembangkan program pemberdayaan masyarakat
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Menjalin kerja sama dengan lembaga dakwah lainnya
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
