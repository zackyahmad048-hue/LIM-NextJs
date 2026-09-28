import Link from "next/link";
import Reveal from "@/components/website/motion/reveal";
import PostCard from "@/components/website/cards/post-card";
import SiteSection from "@/components/website/layout/site-section";
import { getPublishedPostsByCategorySlug } from "@/modules/cms";
import { CardSkeleton } from "@/components/website/ui/skeleton";

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
    <SiteSection as="div">
      <Reveal from="left">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-medium text-foreground">
              {BENTO.label}
            </h2>
            {BENTO.description && (
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-pretty text-muted-foreground">
                {BENTO.description}
              </p>
            )}
          </div>

          <Link
            href={BENTO.href}
            className="group text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {BENTO.hrefLabel}
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
          <p className="text-sm text-muted-foreground mb-4">
            Belum ada konten pada kategori ini.
          </p>
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Jelajahi semua artikel
          </Link>
        </div>
      )}
    </SiteSection>
  );
}
