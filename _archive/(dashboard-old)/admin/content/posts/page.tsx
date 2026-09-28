import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { TablePagination } from "@/components/admin/shared/table-pagination";
import { TableSearchForm } from "@/components/admin/shared/table-search-form";

import { getPaginatedPosts } from "@/modules/cms/queries/post.query";
import { PostsTable } from "./posts-table";

export const dynamic = "force-dynamic";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { posts, total } = await getPaginatedPosts({
    page: params.page ? Number(params.page) : 1,
    search: params.search,
  });
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 20;

  return (
    <PageContainer>
      <PageHeader
        title="Berita"
        description="Kelola artikel, berita, dan pengumuman website."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/content/posts/new">
              <Plus className="size-4" />
              Tulis berita
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        basePath="/admin/content/posts"
        defaultValue={params.search ?? ""}
        placeholder="Cari judul berita..."
      />

      {posts.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada berita.{" "}
          <Link href="/admin/content/posts/new" className="text-primary underline">
            Tulis berita pertama
          </Link>
        </p>
      )}

      <PostsTable data={posts} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/content/posts"
        queryParams={{ search: params.search }}
      />
    </PageContainer>
  );
}