"use client";

import { useState } from "react";
import { FolderTree, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SectionCard } from "@/components/admin/shared/section-card";

import { CategoryDialog } from "./dialog";
import { CategoryTable } from "./table";

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
}

export function CategoryModule({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount>();

  function handleCreate() {
    setSelectedCategory(undefined);
    setOpen(true);
  }

  function handleEdit(category: CategoryWithCount) {
    setSelectedCategory(category);
    setOpen(true);
  }

  return (
    <>
      <SectionCard className="rounded-lg bg-background p-4 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <FolderTree className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Daftar kategori</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.length} kategori aktif tersedia untuk konten website.
              </p>
            </div>
          </div>

          <Button size="sm" onClick={handleCreate}>
            <Plus className="size-4" />
            Tambah kategori
          </Button>
        </div>
      </SectionCard>

      <SectionCard className="rounded-lg bg-background p-0 shadow-none">
        <CategoryTable data={data} onEdit={handleEdit} />
      </SectionCard>

      <CategoryDialog
        open={open}
        category={selectedCategory}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setSelectedCategory(undefined);
        }}
      />
    </>
  );
}
