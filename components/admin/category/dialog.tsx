"use client";

import type { Category } from "@/generated/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CategoryForm } from "./form";

interface CategoryDialogProps {
  open: boolean;
  category?: Category;
  onOpenChange(open: boolean): void;
}

export function CategoryDialog({
  open,
  category,
  onOpenChange,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Kategori" : "Tambah Kategori"}
          </DialogTitle>

          <DialogDescription>
            {category
              ? "Perbarui informasi kategori."
              : "Tambahkan kategori baru."}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          category={category}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
