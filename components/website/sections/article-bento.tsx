import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/website/motion/reveal";
import SectionLabel from "@/components/shared/section-label";
import PostCard from "@/components/website/cards/post-card";
import { getPublishedPostsByCategorySlug } from "@/modules/cms";

const BENTO = {
  label: "Kajian & Artikel",
  description:
    "Tulisan keislaman dan kajian dari para muballigh LIM.",
  href: "/artikel",
  hrefLabel: "Semua Artikel",
  categorySlug: "artikel",
  limit: 3,
};

export default async function ArticleBento() {
  const posts = await getPublishedPostsByCategorySlug(
    BENTO.categorySlug,
    BENTO.limit,
  );

  const [featured, ...rest] = posts;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <Reveal from="left">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>{BENTO.label}</SectionLabel>
            {BENTO.description && (
              <p className="mt-2 max-w-lg text-sm leading-6 text-pretty text-muted-foreground">
                {BENTO.description}
              </p>
            )}
          </div>

          <Link
            href={BENTO.href}
            className="group inline-flex items-center gap-1.5 font-data text-[11px] font-medium uppercase text-primary"
          >
            {BENTO.hrefLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="grid gap-5">
            {rest.map((post, i) => (
              <Reveal key={post.id} index={i} className="h-full">
                <PostCard post={post} size="default" className="h-full" />
              </Reveal>
            ))}
          </div>

          {featured && (
            <Reveal delay={0.1} className="h-full">
              <PostCard post={featured} size="feature" className="h-full" />
            </Reveal>
          )}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-primary/25 bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada konten pada kategori ini.
          </p>
        </div>
      )}
    </section>
  );
}
