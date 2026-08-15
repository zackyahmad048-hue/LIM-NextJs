"use client";

import type { UseFormReturn } from "react-hook-form";

import { FieldWrapper, TextField } from "./fields";
import { StepCard } from "./step-card";
import type { WajibKhidmahLembagaInput } from "@/modules/twk-lembaga/validations/schema";

interface Props {
  form: UseFormReturn<WajibKhidmahLembagaInput>;
}

export function StepIdentitas({ form }: Props) {
  const { register, formState } = form;
  const e = formState.errors;

  return (
    <StepCard
      title="Identitas Lembaga"
      description="Informasi umum lembaga pendidikan pemohon."
    >
      <div className="space-y-4">
        <TextField
          label="Nama Lembaga Pendidikan"
          id="namaLembagaPendidikan"
          required
          value={form.watch("namaLembagaPendidikan")}
          onChange={(v) =>
            form.setValue("namaLembagaPendidikan", v, { shouldValidate: true })
          }
          placeholder="Contoh: TPQ Al-Falah"
        />
        {e.namaLembagaPendidikan && (
          <p className="-mt-3 text-xs text-destructive">
            {e.namaLembagaPendidikan.message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <TextField
              label="RT/RW"
              id="rtRw"
              required
              value={form.watch("rtRw") ?? ""}
              onChange={(v) => form.setValue("rtRw", v, { shouldValidate: true })}
              placeholder="Contoh: 001/003"
            />
            {e.rtRw && (
              <p className="text-xs text-destructive">{e.rtRw.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <TextField
              label="Desa/Kelurahan"
              id="desaKelurahan"
              required
              value={form.watch("desaKelurahan") ?? ""}
              onChange={(v) =>
                form.setValue("desaKelurahan", v, { shouldValidate: true })
              }
              placeholder="Nama desa/kelurahan"
            />
            {e.desaKelurahan && (
              <p className="text-xs text-destructive">{e.desaKelurahan.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <TextField
              label="Kecamatan"
              id="kecamatan"
              required
              value={form.watch("kecamatan") ?? ""}
              onChange={(v) =>
                form.setValue("kecamatan", v, { shouldValidate: true })
              }
              placeholder="Nama kecamatan"
            />
            {e.kecamatan && (
              <p className="text-xs text-destructive">{e.kecamatan.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <TextField
              label="Kabupaten/Kota"
              id="kabupatenKota"
              required
              value={form.watch("kabupatenKota") ?? ""}
              onChange={(v) =>
                form.setValue("kabupatenKota", v, { shouldValidate: true })
              }
              placeholder="Nama kabupaten/kota"
            />
            {e.kabupatenKota && (
              <p className="text-xs text-destructive">{e.kabupatenKota.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <TextField
              label="Provinsi"
              id="provinsi"
              required
              value={form.watch("provinsi") ?? ""}
              onChange={(v) =>
                form.setValue("provinsi", v, { shouldValidate: true })
              }
              placeholder="Nama provinsi"
            />
            {e.provinsi && (
              <p className="text-xs text-destructive">{e.provinsi.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <TextField
              label="Nomor Telepon Lembaga"
              id="teleponLembaga"
              required
              value={form.watch("teleponLembaga") ?? ""}
              onChange={(v) =>
                form.setValue("teleponLembaga", v, { shouldValidate: true })
              }
              placeholder="08xxxxxxxxxx"
            />
            {e.teleponLembaga && (
              <p className="text-xs text-destructive">{e.teleponLembaga.message}</p>
            )}
          </div>
        </div>

        <FieldWrapper label="Akun Media Sosial Lembaga (jika ada)">
          <input
            id="mediaSosialLembaga"
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            placeholder="Instagram, Facebook, atau lainnya"
            {...register("mediaSosialLembaga")}
          />
        </FieldWrapper>
      </div>
    </StepCard>
  );
}
