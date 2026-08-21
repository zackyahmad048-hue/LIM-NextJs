"use client";

import { DataTable } from "@/components/admin/shared/data-table";

import { getCategoryColumns } from "./columns";

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

interface Props {
  data: CategoryWithCount[];
  onEdit(category: CategoryWithCount): void;
}

export function CategoryTable({ data, onEdit }: Props) {
  return <DataTable columns={getCategoryColumns(onEdit)} data={data} />;
}
