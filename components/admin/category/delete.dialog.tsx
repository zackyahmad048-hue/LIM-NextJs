"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteCategory } from "@/modules/cms/presentation/category.action";

import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  id: string;
  name: string;
}

export function DeleteCategoryDialog({ id, name }: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  return (
    <>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        Hapus
      </DropdownMenuItem>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Hapus kategori"
        description={`Kategori "${name}" akan dihapus.`}
        onConfirm={async () => {
          const result = await deleteCategory(id);

          if (!result.ok) {
            toast.error(result.message);

            return;
          }

          toast.success("Kategori dihapus.");

          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
