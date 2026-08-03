"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MemberForm } from "./member.form";
import type { MemberRow } from "./types";

interface MemberDialogProps {
  open: boolean;
  member?: MemberRow;
  onOpenChange(open: boolean): void;
}

export function MemberDialog({
  open,
  member,
  onOpenChange,
}: MemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {member ? "Edit Anggota" : "Tambah Anggota"}
          </DialogTitle>

          <DialogDescription>
            {member
              ? "Perbarui data anggota Wajib Khidmah."
              : "Tambahkan anggota Wajib Khidmah baru."}
          </DialogDescription>
        </DialogHeader>

        <MemberForm member={member} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
