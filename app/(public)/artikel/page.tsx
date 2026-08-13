import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import PostCard from "@/components/website/cards/post-card";
import { Button } from "@/components/ui/button";
import { getPaginatedPosts } from "@/modules/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel & Kajian | LIM Digital Platform",
  description:
    "Artikel keislaman, kajian, dan tulisan inspiratif dari para muballigh.",
};

export default async function ArtikelPage() {
  const { posts } = await getPaginatedPosts({
    status: "published",
    page: 1,
    limit: 12,
  });

  return (
    <>
      <PageHeader
        title="Artikel & Kajian"
        description="Artikel keislaman, kajian, dan tulisan inspiratif dari para muballigh."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada artikel yang dipublikasikan.
            </p>
            <Button variant="outline" size="sm" className="mt-5" asChild>
              <Link href="/falak">Lihat Layanan Falak</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
