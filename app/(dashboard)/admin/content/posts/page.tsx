import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
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
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 20;
  const { posts, total } = await getPaginatedPosts({
    page,
    search: params.search,
  });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

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

      <Band variant="raised" className="mt-4">
        <PostsTable data={posts} page={page} pageCount={pageCount} />
      </Band>
    </PageContainer>
  );
}