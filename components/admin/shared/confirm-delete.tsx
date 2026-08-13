"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { cn } from "@/lib/utils";

type DeleteResult =
  | { ok?: boolean; message?: string }
  | void
  | undefined
  | null;

interface ConfirmDeleteProps<TArgs extends unknown[]> {
  onConfirm: (...args: TArgs) => Promise<DeleteResult>;
  args: TArgs;
  title: string;
  description: string;
  className?: string;
  label?: string;
}

export function ConfirmDelete<TArgs extends unknown[]>({
  onConfirm,
  args,
  title,
  description,
  className,
  label = "Hapus",
}: ConfirmDeleteProps<TArgs>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={label}
        className={cn("text-destructive hover:text-destructive", className)}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-3.5" />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        onConfirm={async () => {
          const result = await onConfirm(...args);

          if (result && result.ok === false) {
            toast.error(result.message ?? "Gagal menghapus.");
            return;
          }

          toast.success("Berhasil dihapus.");

          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}