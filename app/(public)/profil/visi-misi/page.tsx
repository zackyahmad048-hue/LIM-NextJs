import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Visi</SectionLabel>
            <p className="mt-5 font-display text-lg italic leading-8 text-foreground">
              {visiMisi.visi}
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-5 space-y-5">
              {visiMisi.misi.map((item, index) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 font-sans text-xs text-primary">
                    {roman[index] ?? String(index + 1)}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-balance text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}