import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionLabel from "@/components/shared/section-label";
import PostCard from "@/components/website/cards/post-card";
import { getPublishedPostsByCategorySlug } from "@/modules/cms";
import type { HomeGridConfig } from "@/config/home";

export default async function PostGrid({ grid }: { grid: HomeGridConfig }) {
  const posts = await getPublishedPostsByCategorySlug(
    grid.categorySlug,
    grid.limit,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>{grid.title}</SectionLabel>
          {grid.description && (
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              {grid.description}
            </p>
          )}
        </div>

        <Link
          href={grid.href}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-primary"
        >
          {grid.hrefLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Belum ada konten pada kategori ini.
          </p>
        </div>
      )}
    </section>
  );
}
