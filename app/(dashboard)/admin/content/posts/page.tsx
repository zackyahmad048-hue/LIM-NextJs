import Link from "next/link";
import { Archive, Pencil, Plus, RotateCcw, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import { getRecentPosts } from "@/modules/cms/queries/post.query";

import {
  publishPost,
  archivePost,
  restorePostToDraft,
  deletePost,
} from "./_actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getPostStatus(post: { published: boolean; publishedAt: Date | null }) {
  if (post.published) return "Published";
  if (post.publishedAt) return "Archived";
  return "Draft";
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Published"
      ? "default"
      : status === "Archived"
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant} className="h-5 px-2 text-[11px]">
      {status}
    </Badge>
  );
}

export default async function PostsPage() {
  const posts = await getRecentPosts(50);

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

      <AdminTable
        title="Daftar berita"
        description={`${posts.length} berita terbaru.`}
        columns={[
          {
            key: "judul",
            label: "Judul",
            render: (post) => (
              <div className="max-w-[320px]">
                <p className="truncate text-sm font-medium">{post.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{post.slug}
                </p>
              </div>
            ),
          },
          {
            key: "kategori",
            label: "Kategori",
            render: (post) => (
              <span className="text-xs">{post.category.name}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (post) => <StatusBadge status={getPostStatus(post)} />,
          },
          {
            key: "author",
            label: "Author",
            render: (post) => (
              <span className="text-xs">{post.author.name}</span>
            ),
          },
          {
            key: "aksi",
            label: "Aksi",
            align: "right",
            render: (post) => {
              const status = getPostStatus(post);
              return (
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="sm" aria-label="Edit berita">
                    <Link href={`/admin/content/posts/${post.id}/edit`}>
                      <Pencil className="size-3.5" />
                    </Link>
                  </Button>
                  {status !== "Published" && (
                    <form action={publishPost.bind(null, post.id)}>
                      <Button variant="ghost" size="sm" aria-label="Publikasikan berita">
                        <Send className="size-3.5" />
                      </Button>
                    </form>
                  )}
                  {status === "Published" && (
                    <form action={archivePost.bind(null, post.id)}>
                      <Button variant="ghost" size="sm" aria-label="Arsipkan berita">
                        <Archive className="size-3.5" />
                      </Button>
                    </form>
                  )}
                  {status === "Archived" && (
                    <form action={restorePostToDraft.bind(null, post.id)}>
                      <Button variant="ghost" size="sm" aria-label="Pulihkan ke draft">
                        <RotateCcw className="size-3.5" />
                      </Button>
                    </form>
                  )}
                  <ConfirmDelete
                    onConfirm={deletePost}
                    args={[post.id]}
                    title="Hapus berita"
                    description={`Berita "${post.title}" akan dihapus permanen.`}
                    label="Hapus berita"
                  />
                </div>
              );
            },
          },
          {
            key: "update",
            label: "Update",
            align: "right",
            render: (post) => (
              <span className="text-right text-xs tabular-nums text-muted-foreground">
                {formatDate(post.updatedAt)}
              </span>
            ),
          },
        ]}
        data={posts}
        emptyMessage={
          <>
            Belum ada berita.{" "}
            <Link
              href="/admin/content/posts/new"
              className="text-primary underline"
            >
              Tulis berita pertama
            </Link>
          </>
        }
      />
    </PageContainer>
  );
}
