"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  BAHASA_PENGANTAR_OPTIONS,
  KITAB_BERMAKNA_OPTIONS,
  LOKASI_MADRASAH,
  LOKASI_MADRASAH_LABELS,
  SATUAN_PENDIDIKAN,
  SATUAN_PENDIDIKAN_LABELS,
} from "@/modules/twk-lembaga/domain/entities";
import type {
  WajibKhidmahLokasiMadrasah,
  WajibKhidmahSatuanPendidikan,
} from "@/modules/twk-lembaga/domain/entities";
import type { WajibKhidmahLembagaInput } from "@/modules/twk-lembaga/validations/schema";

import { FieldWrapper, TextField } from "./fields";
import { Reveal, StepCard } from "./step-card";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<WajibKhidmahLembagaInput>;
}

function NumberField({
  label,
  id,
  value,
  onChange,
  required = false,
}: {
  label: string;
  id: string;
  value: number | "" | undefined;
  onChange(v: number | ""): void;
  required?: boolean;
}) {
  return (
    <FieldWrapper label={label} required={required}>
      <input
        id={id}
        type="number"
        min={0}
        inputMode="numeric"
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange("");
            return;
          }
          const num = Number(raw);
          if (Number.isFinite(num)) onChange(num);
        }}
        className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
      />
    </FieldWrapper>
  );
}

function MultiCheck({
  label,
  options,
  labels,
  selected,
  onToggle,
  required = false,
}: {
  label: string;
  options: readonly string[];
  labels?: Record<string, string>;
  selected: string[];
  onToggle(value: string): void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                checked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input hover:bg-muted/60"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onToggle(option)}
              />
              {labels?.[option] ?? option}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function StepKondisi({ form }: Props) {
  const watch = form.watch;

  const lokasi = (watch("lokasiMadrasah") ?? "") as
    WajibKhidmahLokasiMadrasah | "";

  const jenis = (watch("jenisSatuanPendidikan") ?? []) as
    WajibKhidmahSatuanPendidikan[];

  return (
    <StepCard
      title="Kondisi Lembaga"
      description="Deskripsi kondisi satuan pendidikan lembaga pemohon."
    >
      <div className="space-y-5">
        {/* Lokasi */}
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Lokasi Madrasah
            <span className="text-destructive"> *</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {LOKASI_MADRASAH.map((value) => {
              const selected = lokasi === value;
              return (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                    selected ? "border-primary bg-primary/5" : "border-input",
                  )}
                  aria-checked={selected}
                >
                  <input
                    type="radio"
                    name="lokasiMadrasah"
                    value={value}
                    checked={selected}
                    onChange={() =>
                      form.setValue("lokasiMadrasah", value, {
                        shouldValidate: true,
                      })
                    }
                    className="size-4 accent-primary"
                  />
                  {LOKASI_MADRASAH_LABELS[value]}
                </label>
              );
            })}
          </div>
          {form.formState.errors.lokasiMadrasah && (
            <p className="text-xs text-destructive">
              {form.formState.errors.lokasiMadrasah.message}
            </p>
          )}
        </div>

        {/* Jenis satuan pendidikan */}
        <MultiCheck
          label="Jenis Satuan Pendidikan"
          required
          options={SATUAN_PENDIDIKAN}
          labels={SATUAN_PENDIDIKAN_LABELS}
          selected={jenis}
          onToggle={(value) => {
            const current = jenis;
            const next = current.includes(value as never)
              ? current.filter((v) => v !== value)
              : [...current, value];
            form.setValue("jenisSatuanPendidikan", next as never, {
              shouldValidate: true,
            });
          }}
        />
        {form.formState.errors.jenisSatuanPendidikan && (
          <p className="text-xs text-destructive">
            {form.formState.errors.jenisSatuanPendidikan.message}
          </p>
        )}

        <Reveal show={jenis.includes("LAINNYA")}>
          <TextField
            label="Jenis Satuan Pendidikan Lainnya"
            id="jenis-lainnya"
            required
            value={form.watch("jenisSatuanPendidikanLainnya") ?? ""}
            onChange={(v) =>
              form.setValue("jenisSatuanPendidikanLainnya", v, {
                shouldValidate: true,
              })
            }
            placeholder="Tuliskan jenis satuan pendidikan"
          />
        </Reveal>

        {/* Kitab bermakna */}
        <MultiCheck
          label="Kitab yang Diajarkan Bermakna"
          required
          options={KITAB_BERMAKNA_OPTIONS}
          selected={(form.watch("kitabBermakna") ?? []) as string[]}
          onToggle={(value) => {
            const current = (form.watch("kitabBermakna") ?? []) as string[];
            const next = current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value];
            form.setValue("kitabBermakna", next as never, {
              shouldValidate: true,
            });
          }}
        />
        {form.formState.errors.kitabBermakna && (
          <p className="text-xs text-destructive">
            {form.formState.errors.kitabBermakna.message}
          </p>
        )}

        <Reveal show={(form.watch("kitabBermakna") ?? []).includes("Lainnya")}>
          <TextField
            label="Kitab Bermakna Lainnya"
            id="kitab-lainnya"
            value={form.watch("kitabBermaknaLainnya") ?? ""}
            onChange={(v) => form.setValue("kitabBermaknaLainnya", v)}
            placeholder="Tuliskan lainnya"
          />
        </Reveal>

        {/* Bahasa pengantar */}
        <MultiCheck
          label="Bahasa Pengantar dalam Kegiatan Belajar"
          required
          options={BAHASA_PENGANTAR_OPTIONS}
          selected={(form.watch("bahasaPengantar") ?? []) as string[]}
          onToggle={(value) => {
            const current = (form.watch("bahasaPengantar") ?? []) as string[];
            const next = current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value];
            form.setValue("bahasaPengantar", next as never, {
              shouldValidate: true,
            });
          }}
        />
        {form.formState.errors.bahasaPengantar && (
          <p className="text-xs text-destructive">
            {form.formState.errors.bahasaPengantar.message}
          </p>
        )}

        <Reveal
          show={(form.watch("bahasaPengantar") ?? []).includes("Lainnya")}
        >
          <TextField
            label="Bahasa Pengantar Lainnya"
            id="bahasa-lainnya"
            value={form.watch("bahasaPengantarLainnya") ?? ""}
            onChange={(v) => form.setValue("bahasaPengantarLainnya", v)}
            placeholder="Tuliskan lainnya"
          />
        </Reveal>

        {/* Jumlah */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="mb-3 text-sm font-semibold">
              Jumlah Pengurus
              <span className="text-destructive"> *</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Putra"
                id="jumlahPengurusPutra"
                required
                value={form.watch("jumlahPengurusPutra")}
                onChange={(v) => form.setValue("jumlahPengurusPutra", v)}
              />
              <NumberField
                label="Putri"
                id="jumlahPengurusPutri"
                required
                value={form.watch("jumlahPengurusPutri")}
                onChange={(v) => form.setValue("jumlahPengurusPutri", v)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-4">
            <p className="mb-3 text-sm font-semibold">
              Jumlah Santri
              <span className="text-destructive"> *</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Putra"
                id="jumlahSantriPutra"
                required
                value={form.watch("jumlahSantriPutra")}
                onChange={(v) => form.setValue("jumlahSantriPutra", v)}
              />
              <NumberField
                label="Putri"
                id="jumlahSantriPutri"
                required
                value={form.watch("jumlahSantriPutri")}
                onChange={(v) => form.setValue("jumlahSantriPutri", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </StepCard>
  );
}
