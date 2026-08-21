import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import { getTimWajibKhidmahContent } from "@/modules/cms/queries/site-page.query";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tim Wajib Khidmah | LIM Digital Platform",
  description:
    "Penugasan anggota LIM untuk melayani kegiatan dan kebutuhan organisasi selama masa khidmah.",
};

export default async function TimWajibKhidmahPage() {
  const content = await getTimWajibKhidmahContent();

  return (
    <>
      <PageHeader
        centered
        title={content.headerTitle}
        description={content.headerDescription}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-primary/15 bg-card px-6 py-12 sm:px-10 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>{content.sectionTitle}</SectionLabel>
            <p className="mt-6 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              {content.description}
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {content.peran.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-primary/10 bg-muted/40 p-4"
              >
                <HubDot className="mt-1.5 h-2.5 w-2.5 shrink-0" />
                <span className="text-sm leading-6 text-foreground/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {content.memberNote && (
            <div className="mx-auto mt-10 max-w-3xl border-t border-border/60 pt-6 text-center">
              <p className="text-xs leading-6 text-muted-foreground">
                {content.memberNote}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
