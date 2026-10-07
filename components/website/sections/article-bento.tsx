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
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
      <Reveal from="left">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>{BENTO.label}</SectionLabel>
            {BENTO.description && (
              <p className="mt-4 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
                {BENTO.description}
              </p>
            )}
          </div>

          <Link
            href={BENTO.href}
            className="inline-flex items-center gap-2 font-data text-xs font-medium uppercase text-primary"
          >
            {BENTO.hrefLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      {posts.length > 0 ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="grid gap-8">
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
        <div className="mt-12 border border-dashed border-primary/25 bg-card p-14 text-center">
          <p className="text-base text-muted-foreground">
            Belum ada konten pada kategori ini.
          </p>
        </div>
      )}
    </section>
  );
}
