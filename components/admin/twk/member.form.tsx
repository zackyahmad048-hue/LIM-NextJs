"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import {
  createWajibKhidmahMember,
  updateWajibKhidmahMember,
} from "@/modules/twk/presentation/twk.action";
import {
  POS_WAJIB_KHIDMAH,
  TUGAS_POS_ELIGIBLE,
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

function buildDefaultValues(member: MemberRow | undefined): WajibKhidmahMemberInput {
  return {
    nama: member?.nama ?? "",
    asalDaerah: member?.asalDaerah ?? "",
    alamatLembaga: member?.alamatLembaga ?? "",
    posWajibKhidmah: (member?.posWajibKhidmah ?? "") as
      | (typeof POS_WAJIB_KHIDMAH)[number]
      | "",
    tempatWajibKhidmah:
      member?.tempatWajibKhidmah && member.tempatWajibKhidmah.length > 0
        ? member.tempatWajibKhidmah
        : [""],
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

  const [tempatList, setTempatList] = useState<string[]>([]);

  useEffect(() => {
    const defaults = buildDefaultValues(member);
    form.reset(defaults);
    setTempatList(defaults.tempatWajibKhidmah ?? [""]);
  }, [member, form]);

  const status = form.watch("status");
  const pos = form.watch("posWajibKhidmah");
  const tugasEligible = (TUGAS_POS_ELIGIBLE as readonly string[]).includes(
    pos ?? "",
  );
  const errors = form.formState.errors;

  async function submit(values: WajibKhidmahMemberInput) {
    const formData = new FormData();
    formData.append("nama", values.nama);
    if (values.asalDaerah) formData.append("asalDaerah", values.asalDaerah);
    if (values.alamatLembaga)
      formData.append("alamatLembaga", values.alamatLembaga);
    if (values.posWajibKhidmah)
      formData.append("posWajibKhidmah", values.posWajibKhidmah);
    for (const tempat of tempatList
      .map((value) => value.trim())
      .filter((value) => value.length > 0)) {
      formData.append("tempatWajibKhidmah", tempat);
    }
    if (tugasEligible && values.tugasKhidmah)
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
          <Label>Tempat Khidmah</Label>
          <div className="space-y-2">
            {tempatList.map((place, index) => (
              <div key={index} className="flex items-start gap-2">
                <Input
                  value={place}
                  maxLength={100}
                  onChange={(event) => {
                    const next = [...tempatList];
                    next[index] = event.target.value;
                    setTempatList(next);
                  }}
                  aria-label={`Tempat Khidmah ${index + 1}`}
                  placeholder="Contoh: seksi, mustahiq, mudarris, wali asuh"
                />
                {tempatList.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Hapus tempat ${index + 1}`}
                    onClick={() =>
                      setTempatList(tempatList.filter((_, i) => i !== index))
                    }
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTempatList([...tempatList, ""])}
          >
            <Plus className="size-4" />
            Tambah tempat
          </Button>
          <p className="text-xs text-muted-foreground">
            Isi sub-domain kerja. Tambahkan baris baru bila peserta memiliki
            lebih dari satu jabatan.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {tugasEligible && (
          <div className="space-y-2">
            <Label htmlFor="tugasKhidmah">
              Tugas Khidmah <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tugasKhidmah"
              placeholder="Contoh: Pengajar"
              {...form.register("tugasKhidmah")}
            />
            <p className="text-xs text-muted-foreground">
              Diisi dengan job peserta wajib khidmah.
            </p>
            {errorMessage(errors, "tugasKhidmah") && (
              <p className="text-sm text-destructive">
                {errorMessage(errors, "tugasKhidmah")}
              </p>
            )}
          </div>
        )}

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
            placeholder="Catatan evaluasi dan kinerja peserta."
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
            placeholder="Rekapitulasi absensi dari sub-domain."
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