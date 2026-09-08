"use client";

import Link from "next/link";
import { Archive, Pencil, RotateCcw, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";
import { formatDateId } from "@/lib/format";

import type { getPaginatedPosts } from "@/modules/cms/queries/post.query";

import {
  publishPost,
  archivePost,
  restorePostToDraft,
  deletePost,
} from "./_actions";

type Post = Awaited<ReturnType<typeof getPaginatedPosts>>["posts"][number];

function getPostStatus(post: {
  published: boolean;
  publishedAt: Date | null;
}) {
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

const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => (
      <div className="max-w-80">
        <p className="truncate text-sm font-medium">{row.original.title}</p>
        <p className="truncate text-xs text-admin-content-fg/60">
          /{row.original.slug}
        </p>
      </div>
    ),
  },
  {
    id: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.category.name}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={getPostStatus(row.original)} />,
  },
  {
    id: "author",
    header: "Author",
    cell: ({ row }) => (
      <span className="text-xs text-admin-content-fg/80">
        {row.original.author.name}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right text-sm font-medium text-admin-content-fg/70">
        Aksi
      </div>
    ),
    cell: ({ row }) => {
      const status = getPostStatus(row.original);
      return (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="sm" aria-label="Edit berita">
            <Link href={`/admin/content/posts/${row.original.id}/edit`}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>
          {status !== "Published" && (
            <form action={publishPost.bind(null, row.original.id)}>
              <Button variant="ghost" size="sm" aria-label="Publikasikan berita">
                <Send className="size-3.5" />
              </Button>
            </form>
          )}
          {status === "Published" && (
            <form action={archivePost.bind(null, row.original.id)}>
              <Button variant="ghost" size="sm" aria-label="Arsipkan berita">
                <Archive className="size-3.5" />
              </Button>
            </form>
          )}
          {status === "Archived" && (
            <form action={restorePostToDraft.bind(null, row.original.id)}>
              <Button variant="ghost" size="sm" aria-label="Pulihkan ke draft">
                <RotateCcw className="size-3.5" />
              </Button>
            </form>
          )}
          <ConfirmDelete
            onConfirm={deletePost}
            args={[row.original.id]}
            title="Hapus berita"
            description={`Berita "${row.original.title}" akan dihapus permanen.`}
            label="Hapus berita"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => (
      <div className="text-right text-sm font-medium text-admin-content-fg/70">
        Update
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-right text-xs tabular-nums text-admin-content-fg/60">
        {formatDateId(row.original.updatedAt)}
      </span>
    ),
  },
];

export function PostsTable({ data }: { data: Post[] }) {
  return <DataTable columns={columns} data={data} />;
}