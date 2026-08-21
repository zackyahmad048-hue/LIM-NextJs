"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataColumnHeader } from "@/components/admin/shared/data-table";

import { DeleteCategoryDialog } from "./delete.dialog";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { posts: number };
}

export function getCategoryColumns(
  onEdit: (category: CategoryWithCount) => void,
): ColumnDef<CategoryWithCount>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataColumnHeader column={column} title="Nama" />,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => <DataColumnHeader column={column} title="Slug" />,
    },
    {
      id: "postCount",
      accessorFn: (row) => row._count.posts,
      header: ({ column }) => (
        <DataColumnHeader column={column} title="Berita" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="h-5 px-2 text-[11px] tabular-nums">
          {row.original._count.posts}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
      cell: ({ row }) => {
        const cell = new Date(row.original.createdAt).toLocaleDateString("id-ID");
        return <span className="tabular-nums">{cell}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Buka menu aksi">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit
            </DropdownMenuItem>

            <DeleteCategoryDialog
              id={row.original.id}
              name={row.original.name}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
