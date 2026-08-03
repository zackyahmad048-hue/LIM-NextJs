"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createWajibKhidmahMember,
  updateWajibKhidmahMember,
} from "@/modules/twk/presentation/twk.action";
import {
  wajibKhidmahMemberSchema,
  type WajibKhidmahMemberInput,
} from "@/modules/twk/validations/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { MemberRow } from "./types";

interface Props {
  member?: MemberRow;
  onSuccess(): void;
}

export function MemberForm({ member, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<WajibKhidmahMemberInput>({
    resolver: zodResolver(wajibKhidmahMemberSchema),
    defaultValues: {
      nama: member?.nama ?? "",
      alamat: member?.alamat ?? "",
      kelas: member?.kelas ?? "",
      posWajibKhidmah: member?.posWajibKhidmah ?? "",
      tempatWajibKhidmah: member?.tempatWajibKhidmah ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      nama: member?.nama ?? "",
      alamat: member?.alamat ?? "",
      kelas: member?.kelas ?? "",
      posWajibKhidmah: member?.posWajibKhidmah ?? "",
      tempatWajibKhidmah: member?.tempatWajibKhidmah ?? "",
    });
  }, [member, form]);

  async function submit(values: WajibKhidmahMemberInput) {
    const formData = new FormData();
    formData.append("nama", values.nama);
    formData.append("alamat", values.alamat ?? "");
    formData.append("kelas", values.kelas ?? "");
    formData.append("posWajibKhidmah", values.posWajibKhidmah ?? "");
    formData.append("tempatWajibKhidmah", values.tempatWajibKhidmah ?? "");

    const result = member
      ? await updateWajibKhidmahMember(member.id, formData)
      : await createWajibKhidmahMember(formData);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      member
        ? "Anggota berhasil diperbarui."
        : "Anggota berhasil ditambahkan.",
    );

    router.refresh();
    form.reset();
    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nama">
          Nama <span className="text-destructive">*</span>
        </Label>
        <Input id="nama" {...form.register("nama")} />
        {form.formState.errors.nama && (
          <p className="text-sm text-destructive">
            {form.formState.errors.nama.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Input id="alamat" {...form.register("alamat")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kelas">Kelas</Label>
          <Input id="kelas" {...form.register("kelas")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="posWajibKhidmah">Pos Wajib Khidmah</Label>
          <Input id="posWajibKhidmah" {...form.register("posWajibKhidmah")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tempatWajibKhidmah">Tempat Wajib Khidmah</Label>
        <Input
          id="tempatWajibKhidmah"
          {...form.register("tempatWajibKhidmah")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Menyimpan..."
            : member
              ? "Update"
              : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
