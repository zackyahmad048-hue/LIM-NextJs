import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FolioSection from "@/components/website/taqwim/folio-section";
import Reveal from "@/components/website/taqwim/reveal";
import PostCard from "@/components/website/cards/post-card";
import { Button } from "@/components/ui/button";
import { getPublishedPostsByCategorySlug } from "@/modules/cms";
import type { HomeGridConfig } from "@/config/home";

export default async function PostGrid({ grid }: { grid: HomeGridConfig }) {
  const posts = await getPublishedPostsByCategorySlug(
    grid.categorySlug,
    grid.limit,
  );

  return (
    <FolioSection
      arabic={grid.arabic}
      label={grid.title}
      contentClassName="py-8 sm:py-10 lg:py-14"
    >
      <Reveal from="left">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {grid.description && (
            <p className="max-w-lg text-sm leading-6 text-pretty text-muted-foreground">
              {grid.description}
            </p>
          )}

          <Link
            href={grid.href}
            className="group inline-flex items-center gap-1.5 font-data text-[11px] font-medium uppercase text-primary"
          >
            {grid.hrefLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-primary/25 bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada konten pada kategori ini.
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href={grid.href}>{grid.hrefLabel}</Link>
            </Button>
          </div>
        )}
      </Reveal>
    </FolioSection>
  );
}
