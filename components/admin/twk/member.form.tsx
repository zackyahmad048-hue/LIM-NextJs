"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";

import {
  createWajibKhidmahMember,
  updateWajibKhidmahMember,
} from "@/modules/twk/presentation/twk.action";
import {
  POS_WAJIB_KHIDMAH,
  WAJIB_KHIDMAH_STATUS_LABELS,
  type WajibKhidmahStatus,
} from "@/modules/twk/domain/entities";
import {
  wajibKhidmahMemberSchema,
  type WajibKhidmahMemberInput,
} from "@/modules/twk/validations/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

import type { MemberRow } from "./types";

interface Props {
  member?: MemberRow;
  onSuccess(): void;
}

const STATUS_OPTIONS = Object.entries(WAJIB_KHIDMAH_STATUS_LABELS) as Array<
  [WajibKhidmahStatus, string]
>;

function errorMessage(
  errors: Record<string, { message?: string } | undefined>,
  key: string,
): string | undefined {
  return errors[key]?.message;
}

function buildDefaultValues(
  member: MemberRow | undefined,
): WajibKhidmahMemberInput {
  return {
    nama: member?.nama ?? "",
    asalDaerah: member?.asalDaerah ?? "",
    alamatLembaga: member?.alamatLembaga ?? "",
    posWajibKhidmah: (member?.posWajibKhidmah ?? "") as
      | (typeof POS_WAJIB_KHIDMAH)[number]
      | "",
    tempatWajibKhidmah: member?.tempatWajibKhidmah ?? "",
    tugasKhidmah: member?.tugasKhidmah ?? "",
    status: member?.status ?? "AKTIF",
    keterangan: member?.keterangan ?? "",
    catatan: member?.catatan ?? "",
    absensi: member?.absensi ?? "",
  };
}

export function MemberForm({ member, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<WajibKhidmahMemberInput>({
    resolver: zodResolver(
      wajibKhidmahMemberSchema,
    ) as Resolver<WajibKhidmahMemberInput>,
    defaultValues: buildDefaultValues(member),
  });

  useEffect(() => {
    form.reset(buildDefaultValues(member));
  }, [member, form]);

  const status = form.watch("status");
  const errors = form.formState.errors;

  async function submit(values: WajibKhidmahMemberInput) {
    const formData = new FormData();
    formData.append("nama", values.nama);
    if (values.asalDaerah) formData.append("asalDaerah", values.asalDaerah);
    if (values.alamatLembaga)
      formData.append("alamatLembaga", values.alamatLembaga);
    if (values.posWajibKhidmah)
      formData.append("posWajibKhidmah", values.posWajibKhidmah);
    if (values.tempatWajibKhidmah)
      formData.append("tempatWajibKhidmah", values.tempatWajibKhidmah);
    if (values.tugasKhidmah)
      formData.append("tugasKhidmah", values.tugasKhidmah);
    formData.append("status", values.status ?? "AKTIF");
    if (values.keterangan) formData.append("keterangan", values.keterangan);
    if (values.catatan) formData.append("catatan", values.catatan);
    if (values.absensi) formData.append("absensi", values.absensi);

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
        {errorMessage(errors, "nama") && (
          <p className="text-sm text-destructive">
            {errorMessage(errors, "nama")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="asalDaerah">Asal Daerah</Label>
          <Input
            id="asalDaerah"
            placeholder="Contoh: Kediri - Jawa Timur"
            {...form.register("asalDaerah")}
          />
          {errorMessage(errors, "asalDaerah") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "asalDaerah")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamatLembaga">Alamat Lembaga</Label>
          <Input
            id="alamatLembaga"
            placeholder="Alamat lembaga tempat khidmah"
            {...form.register("alamatLembaga")}
          />
          {errorMessage(errors, "alamatLembaga") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "alamatLembaga")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="posWajibKhidmah">Pos Wajib Khidmah</Label>
          <NativeSelect
            id="posWajibKhidmah"
            {...form.register("posWajibKhidmah")}
          >
            <option value="">— Pilih Pos —</option>
            {POS_WAJIB_KHIDMAH.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </NativeSelect>
          {errorMessage(errors, "posWajibKhidmah") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "posWajibKhidmah")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tempatWajibKhidmah">Tempat Khidmah</Label>
          <Input
            id="tempatWajibKhidmah"
            placeholder="Contoh: PP. Lirboyo"
            {...form.register("tempatWajibKhidmah")}
          />
          {errorMessage(errors, "tempatWajibKhidmah") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "tempatWajibKhidmah")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tugasKhidmah">Tugas Khidmah</Label>
          <Input
            id="tugasKhidmah"
            placeholder="Contoh: Pengajar"
            {...form.register("tugasKhidmah")}
          />
          {errorMessage(errors, "tugasKhidmah") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "tugasKhidmah")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-destructive">*</span>
          </Label>
          <NativeSelect id="status" {...form.register("status")}>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </NativeSelect>
          {errorMessage(errors, "status") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "status")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keterangan">
          Keterangan{" "}
          {status !== "AKTIF" && (
            <span className="text-destructive">*</span>
          )}
        </Label>
        <Textarea
          id="keterangan"
          rows={2}
          placeholder="-"
          aria-describedby="keterangan-helper"
          {...form.register("keterangan")}
        />
        <p
          id="keterangan-helper"
          className="text-xs text-muted-foreground"
        >
          {status === "AKTIF"
            ? "Isi dengan tanda '-' untuk anggota Aktif."
            : "Wajib diisi dengan alasan penonaktifan."}
        </p>
        {errorMessage(errors, "keterangan") && (
          <p className="text-sm text-destructive">
            {errorMessage(errors, "keterangan")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="catatan">Catatan</Label>
          <Textarea
            id="catatan"
            rows={2}
            placeholder="Catatan progres atau track record khusus."
            {...form.register("catatan")}
          />
          {errorMessage(errors, "catatan") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "catatan")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="absensi">Absensi</Label>
          <Input
            id="absensi"
            placeholder="Contoh: Safar 1448 H"
            {...form.register("absensi")}
          />
          {errorMessage(errors, "absensi") && (
            <p className="text-sm text-destructive">
              {errorMessage(errors, "absensi")}
            </p>
          )}
        </div>
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
