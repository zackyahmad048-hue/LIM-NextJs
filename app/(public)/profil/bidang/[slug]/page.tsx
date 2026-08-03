import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import { BIDANG, getBidangBySlug } from "@/config/bidang";

interface BidangPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BIDANG.filter((bidang) => bidang.slug !== "tim-wajib-khidmah").map(
    (bidang) => ({ slug: bidang.slug }),
  );
}

export async function generateMetadata({
  params,
}: BidangPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bidang = getBidangBySlug(slug);

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
  const bidang = getBidangBySlug(slug);

  if (!bidang) {
    notFound();
  }

  const lainnya = BIDANG.filter((item) => item.slug !== bidang.slug);

  return (
    <>
      <PageHeader
        title={bidang.title}
        description={bidang.description}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Cakupan Program</SectionLabel>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              {bidang.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <HubDot className="mt-1.5 h-2.5 w-2.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Bidang Lainnya</SectionLabel>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lainnya.map((item) => (
                <Link
                  key={item.slug}
                  href={`/profil/bidang/${item.slug}`}
                  className="group rounded-xl border border-primary/10 bg-muted/40 p-4 transition-colors hover:border-primary/40 hover:bg-muted/70"
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
        </div>
      </section>
    </>
  );
}
