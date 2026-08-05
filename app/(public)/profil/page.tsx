import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import { getProfilContent } from "@/modules/cms/queries/site-page.query";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Profil | LIM Digital Platform",
  description:
    "Mengenal Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang membangun peradaban umat.",
};

export default async function ProfilPage() {
  const profil = await getProfilContent();

  return (
    <>
      <PageHeader
        title={profil.headerTitle}
        description={profil.headerDescription}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/15 bg-card p-7">
            <SectionLabel>Visi</SectionLabel>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {profil.visi}
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              {profil.misi.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <HubDot className="mt-1.5 h-2.5 w-2.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}