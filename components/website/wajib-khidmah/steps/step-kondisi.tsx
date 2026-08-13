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
}: {
  label: string;
  id: string;
  value: number | "" | undefined;
  onChange(v: number | ""): void;
}) {
  return (
    <FieldWrapper label={label}>
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
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle(value: string): void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
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
              {option}
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
  const jenis = (watch("jenisSatuanPendidikan") ?? "") as
    WajibKhidmahSatuanPendidikan | "";

  return (
    <StepCard
      title="Kondisi Lembaga"
      description="Deskripsi kondisi satuan pendidikan lembaga pemohon."
    >
      <div className="space-y-5">
        {/* Lokasi */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Lokasi Madrasah</div>
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
        </div>

        {/* Jenis satuan pendidikan */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Jenis Satuan Pendidikan</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SATUAN_PENDIDIKAN.map((value) => {
              const selected = jenis === value;
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
                    name="jenisSatuanPendidikan"
                    value={value}
                    checked={selected}
                    onChange={() =>
                      form.setValue("jenisSatuanPendidikan", value, {
                        shouldValidate: true,
                      })
                    }
                    className="size-4 accent-primary"
                  />
                  {SATUAN_PENDIDIKAN_LABELS[value]}
                </label>
              );
            })}
          </div>
        </div>

        <Reveal show={jenis === "LAINNYA"}>
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
            <p className="mb-3 text-sm font-semibold">Jumlah Pengurus</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Putra"
                id="jumlahPengurusPutra"
                value={form.watch("jumlahPengurusPutra")}
                onChange={(v) => form.setValue("jumlahPengurusPutra", v)}
              />
              <NumberField
                label="Putri"
                id="jumlahPengurusPutri"
                value={form.watch("jumlahPengurusPutri")}
                onChange={(v) => form.setValue("jumlahPengurusPutri", v)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-4">
            <p className="mb-3 text-sm font-semibold">Jumlah Santri</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Putra"
                id="jumlahSantriPutra"
                value={form.watch("jumlahSantriPutra")}
                onChange={(v) => form.setValue("jumlahSantriPutra", v)}
              />
              <NumberField
                label="Putri"
                id="jumlahSantriPutri"
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
