"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteWajibKhidmahMember } from "@/modules/twk/presentation/twk.action";

import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  id: string;
  nama: string;
}

export function DeleteMemberDialog({ id, nama }: Props) {
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
        title="Hapus anggota"
        description={`Anggota "${nama}" akan dihapus permanen.`}
        onConfirm={async () => {
          const result = await deleteWajibKhidmahMember(id);

          if (!result.ok) {
            toast.error(result.message);

            return;
          }

          toast.success("Anggota dihapus.");

          setOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
