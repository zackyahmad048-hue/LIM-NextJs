"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  deactivateWajibKhidmahMember,
  reactivateWajibKhidmahMember,
} from "@/modules/twk/presentation/twk.action";
import { DEACTIVATED_STATUSES } from "@/modules/twk/domain/entities";
import type { WajibKhidmahStatus } from "@/modules/twk/domain/entities";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

interface DeactivateProps {
  id: string;
  nama: string;
  onDeactivated?(): void;
  trigger?: React.ReactNode;
}

export function DeactivateMemberDialog({
  id,
  nama,
  onDeactivated,
  trigger,
}: DeactivateProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<WajibKhidmahStatus>("GUGUR");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!reason.trim()) {
      toast.error("Alasan penonaktifan wajib diisi.");
      return;
    }
    setPending(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    formData.append("reason", reason.trim());

    const result = await deactivateWajibKhidmahMember(formData);
    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`${nama} telah dinonaktifkan.`);
    setOpen(false);
    setReason("");
    setStatus("GUGUR");
    router.refresh();
    onDeactivated?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          {trigger}
        </span>
      ) : (
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          Nonaktifkan
        </DropdownMenuItem>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nonaktifkan anggota</DialogTitle>
          <DialogDescription>
            Data &quot;{nama}&quot; akan dipertahankan untuk arsip. Anggota
            yang Gugur/Bebas Tugas/Qodlo masih bisa dilanjutkan di tahun depan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deactivate-status">Status Non-aktif</Label>
            <NativeSelect
              id="deactivate-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as WajibKhidmahStatus)
              }
            >
              {DEACTIVATED_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deactivate-reason">
              Alasan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="deactivate-reason"
              rows={3}
              placeholder="Contoh: Sakit, Pulang tanpa izin, Masa tugas selesai."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={pending || !reason.trim()}
          >
            {pending ? "Menyimpan..." : "Nonaktifkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReactivateProps {
  id: string;
  nama: string;
  trigger?: React.ReactNode;
}

export function ReactivateMemberDialog({ id, nama, trigger }: ReactivateProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit() {
    setPending(true);
    const result = await reactivateWajibKhidmahMember(id);
    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(`${nama} telah diaktifkan kembali.`);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <span
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          {trigger}
        </span>
      ) : (
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          Aktifkan kembali
        </DropdownMenuItem>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aktifkan kembali anggota</DialogTitle>
          <DialogDescription>
            Status &quot;{nama}&quot; akan diubah menjadi Aktif. Keterangan
            akan direset ke &quot;-&quot;.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Batal
          </Button>
          <Button type="button" onClick={submit} disabled={pending}>
            {pending ? "Menyimpan..." : "Aktifkan Kembali"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
