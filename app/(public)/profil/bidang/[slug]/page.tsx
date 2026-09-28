import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { Check } from "lucide-react";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import {
  getBidangBySlug,
  getBidangList,
} from "@/modules/organization/queries/bidang.query";

interface BidangPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBidangList()
    .then((list) =>
      list
        .filter((bidang) => bidang.slug !== "tim-wajib-khidmah")
        .map((bidang) => ({ slug: bidang.slug })),
    )
    .then((params) => params);
}

export async function generateMetadata({
  params,
}: BidangPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bidang = await getBidangBySlug(slug);

  if (!bidang) {
    return { title: "Bidang | LIM Digital Platform" };
  }

  return {
    title: `${bidang.title} | LIM Digital Platform`,
    description: bidang.description,
  };
}

export default async function BidangPage({ params }: BidangPageProps) {
  const { slug } = await params;
  const bidang = await getBidangBySlug(slug);

  if (!bidang) {
    notFound();
  }

  const lainnya = (await getBidangList()).filter(
    (item) => item.slug !== bidang.slug,
  );

  return (
    <>
      <PageHeader
        title={bidang.title}
        description={bidang.description}
      />

      <SiteSection>
        <div className="space-y-8">
          <Reveal>
            <div className="rounded-xl border border-primary/25 bg-card p-7 shadow-sm sm:p-8">
              <SectionLabel>Cakupan Program</SectionLabel>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
                {bidang.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-primary/25 bg-card p-7 shadow-sm sm:p-8">
              <SectionLabel>Bidang Lainnya</SectionLabel>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {lainnya.map((item) => (
                <Link
                  key={item.slug}
                  href={`/profil/bidang/${item.slug}`}
                  className="group rounded-lg border border-primary/10 bg-muted/40 p-4 transition-colors hover:border-primary/40 hover:bg-muted/70"
                >
                  <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.tagline}
                  </p>
                </Link>
              ))}
            </div>
            </div>
          </Reveal>
        </div>
      </SiteSection>
    </>
  );
}
