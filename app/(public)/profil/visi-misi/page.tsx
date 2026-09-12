import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { getVisiMisiContent } from "@/modules/cms/queries/site-page.query";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Visi & Misi | LIM Digital Platform",
  description:
    "Arah dan tujuan Lembaga Ittihadul Muballighin dalam membangun peradaban umat.",
};

const roman = ["I", "II", "III", "IV", "V", "VI"];

export default async function VisiMisiPage() {
  const visiMisi = await getVisiMisiContent();

  return (
    <>
      <PageHeader
        title={visiMisi.headerTitle}
        description={visiMisi.headerDescription}
      />

      <SiteSection>
        <div className="space-y-8">
          <Reveal>
            <div className="rounded-xl border border-primary/25 bg-card p-7 shadow-sm sm:p-8">
              <SectionLabel>Visi</SectionLabel>
              <p className="mt-5 font-heading text-lg italic leading-8 text-foreground">
                {visiMisi.visi}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-primary/25 bg-card p-7 shadow-sm sm:p-8">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-5 space-y-5">
              {visiMisi.misi.map((item, index) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 font-sans text-xs text-primary">
                    {roman[index] ?? String(index + 1)}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-balance text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
              </ul>
            </div>
          </Reveal>
</div>
      </SiteSection>
    </>
  );
}