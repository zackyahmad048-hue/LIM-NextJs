import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { getFalakContent } from "@/modules/cms/queries/site-page.query";
import { FALAK_TOOLS } from "@/config/falak";

export const revalidate = 3600;

export default async function FalakPage() {
  const falak = await getFalakContent();
  const tools = FALAK_TOOLS;

  return (
    <>
      <PageHeader
        title={falak.headerTitle}
        description={falak.headerDescription}
      />

      <SiteSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Reveal key={tool.href} index={i} className="h-full">
                <Link
                  href={tool.href}
                  className="group relative flex h-full flex-col rounded-xl border border-primary/25 bg-card p-6 shadow-sm transition-colors duration-300 ease-out hover:border-primary"
                >
                  <div className="flex items-center justify-end">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h2 className="mt-8 font-heading text-xl font-semibold text-balance text-foreground">
                    {tool.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {tool.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-[gap] group-hover:gap-3">
                    <HubDot className="h-2 w-2" />
                    Buka Instrumen
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-xl border border-primary/25 bg-card p-6 shadow-sm sm:p-8">
            <SectionLabel>Metode Perhitungan</SectionLabel>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {falak.metode}
            </p>
          </div>
        </Reveal>
      </SiteSection>
    </>
  );
}