import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import PostCard from "@/components/website/cards/post-card";
import SiteSection from "@/components/website/layout/site-section";
import Reveal from "@/components/website/motion/reveal";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getPaginatedPosts, getCategories } from "@/modules/cms";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel & Kajian | LIM Digital Platform",
  description:
    "Artikel keislaman, kajian, dan tulisan inspiratif dari para muballigh.",
};

interface ArtikelSearchParams {
  page?: string;
  q?: string;
  kategori?: string;
}

const PAGE_LIMIT = 12;

function buildHref(
  page: number,
  filter: { q?: string; kategori?: string },
): string {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.kategori) params.set("kategori", filter.kategori);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/artikel?${query}` : "/artikel";
}

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<ArtikelSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() || undefined;
  const kategoriSlug = params.kategori?.trim() || undefined;

  const categories = await getCategories();
  const targetCategory = kategoriSlug
    ? categories.find((category) => category.slug === kategoriSlug)
    : undefined;

  const { posts, total } = await getPaginatedPosts({
    status: "published",
    page,
    limit: PAGE_LIMIT,
    search: q,
    categoryId: targetCategory?.id,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const filter = { q, kategori: kategoriSlug };

  return (
    <>
      <PageHeader
        title="Artikel & Kajian"
        description="Artikel keislaman, kajian, dan tulisan inspiratif dari para muballigh."
      />

      <SiteSection>
        <Reveal from="up">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Filter kategori artikel"
              className="flex flex-wrap items-center gap-1.5"
            >
              <FilterChip
                active={!kategoriSlug}
                href={buildHref(1, { ...filter, kategori: undefined })}
              >
                Semua
              </FilterChip>
              {categories
                .filter((category) => category._count.posts > 0)
                .sort((a, b) => b._count.posts - a._count.posts)
                .map((category) => (
                  <FilterChip
                    key={category.id}
                    active={kategoriSlug === category.slug}
                    href={buildHref(1, { ...filter, kategori: category.slug })}
                  >
                    {category.name}
                  </FilterChip>
                ))}
            </nav>

            <form
              method="get"
              action="/artikel"
              className="w-full max-w-xs"
            >
              <input type="hidden" name="kategori" value={kategoriSlug ?? ""} />
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  aria-label="Cari artikel"
                  placeholder="Cari artikel atau kajian..."
                  className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </div>
            </form>
          </div>
        </Reveal>

        <p className="mt-6 text-xs text-muted-foreground">
          Menampilkan {total} artikel
          {q && <span> untuk ”{q}”</span>}
          {targetCategory && <span> pada kategori {targetCategory.name}</span>}
          .
        </p>

        {posts.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} index={i}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-primary/20 bg-card p-12 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Belum ada artikel yang cocok dengan filter ini.
            </p>
            <Button variant="outline" size="sm" className="mt-5" asChild>
              <Link href="/artikel">Reset Filter</Link>
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Navigasi halaman artikel"
            className="mt-10 flex items-center justify-center gap-3"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={buildHref(page - 1, filter)}>Sebelumnya</Link>
              ) : (
                <span>Sebelumnya</span>
              )}
            </Button>

            <span className="font-data text-xs tabular-nums text-muted-foreground">
              Halaman {page} dari {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={buildHref(page + 1, filter)}>Berikutnya</Link>
              ) : (
                <span>Berikutnya</span>
              )}
            </Button>
          </nav>
        )}
      </SiteSection>
    </>
  );
}

function FilterChip({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3.5 text-xs font-medium transition-colors",
        active
          ? "border-foreground/30 bg-foreground/5 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
      )}
    >
      {children}
    </Link>
  );
}