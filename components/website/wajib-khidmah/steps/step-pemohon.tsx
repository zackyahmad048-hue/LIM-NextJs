"use client";

import type { UseFormReturn } from "react-hook-form";

import { FileUploadField } from "../file-upload-field";
import { TextField } from "./fields";
import { Reveal, StepCard } from "./step-card";

import {
  STATUS_PEMOHON,
  STATUS_PEMOHON_LABELS,
} from "@/modules/twk-lembaga/domain/entities";
import type { WajibKhidmahStatusPemohon } from "@/modules/twk-lembaga/domain/entities";
import type { WajibKhidmahLembagaInput } from "@/modules/twk-lembaga/validations/schema";

interface Props {
  form: UseFormReturn<WajibKhidmahLembagaInput>;
}

const prefixPengasuh = "pengasuh" as const;
const prefixPj = "penanggungJawab" as const;

interface PemohonSectionProps {
  form: UseFormReturn<WajibKhidmahLembagaInput>;
  prefix: "pengasuh" | "penanggungJawab";
}

function PemohonSection({ form, prefix }: PemohonSectionProps) {
  const pj = prefix === "penanggungJawab";
  const title = pj ? "Penanggung Jawab" : "Pengasuh";

  const namaKey = `${prefix}Nama` as keyof WajibKhidmahLembagaInput;
  const statusKey = `${prefix}Status` as keyof WajibKhidmahLembagaInput;
  const statusLainnyaKey =
    `${prefix}StatusLainnya` as keyof WajibKhidmahLembagaInput;
  const alumniKey = `${prefix}AlumniAngkatan` as keyof WajibKhidmahLembagaInput;
  const teleponKey = `${prefix}Telepon` as keyof WajibKhidmahLembagaInput;
  const fotoKey = `${prefix}FotoFileId` as keyof WajibKhidmahLembagaInput;

  const status = (form.watch(statusKey) ?? "") as
    WajibKhidmahStatusPemohon | "";
  const isAlumni = status === "ALUMNI_LIRBOYO";
  const isLainnya = status === "LAINNYA";

  const nama = (form.watch(namaKey) ?? "") as string;
  const alumni = (form.watch(alumniKey) ?? "") as string;
  const statusLainnya = (form.watch(statusLainnyaKey) ?? "") as string;
  const telepon = (form.watch(teleponKey) ?? "") as string;

  const statusOptions = STATUS_PEMOHON.map((value) => ({
    value,
    label: STATUS_PEMOHON_LABELS[value],
  }));

  const statusError = form.formState.errors[statusKey];
  const namaError = form.formState.errors[namaKey];
  const teleponError = form.formState.errors[teleponKey];

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <TextField
          label={`Nama ${title}`}
          id={`${prefix}-nama`}
          required
          value={nama}
          onChange={(v) => form.setValue(namaKey, v, { shouldValidate: true })}
          placeholder={`Nama lengkap ${title.toLowerCase()}`}
        />
        {namaError && (
          <p className="text-xs text-destructive">{namaError.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div id={`${prefix}-status-label`} className="text-sm font-medium">
          Status {title}
          <span className="text-destructive"> *</span>
        </div>
        <div
          role="radiogroup"
          aria-labelledby={`${prefix}-status-label`}
          className="space-y-2"
        >
          {statusOptions.map((option) => {
            const selected = status === option.value;
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-input px-3 py-2 text-sm transition-colors hover:bg-muted/50 aria-checked:border-primary aria-checked:bg-primary/5"
                aria-checked={selected}
              >
                <input
                  type="radio"
                  name={`${prefix}Status`}
                  value={option.value}
                  checked={selected}
                  onChange={() =>
                    form.setValue(statusKey, option.value, {
                      shouldValidate: true,
                    })
                  }
                  className="size-4 accent-primary"
                />
                <span className="flex-1">{option.label}</span>
              </label>
            );
          })}
        </div>
        {statusError && (
          <p className="text-xs text-destructive">{statusError.message}</p>
        )}

        <Reveal show={isAlumni}>
          <TextField
            label="Alumni Lirboyo — Tahun/Angkatan Lulus"
            id={`${prefix}-alumni`}
            required
            value={alumni}
            onChange={(v) =>
              form.setValue(alumniKey, v, { shouldValidate: true })
            }
            placeholder="Contoh: 2015 / Angkatan 2011"
            hint="Diisi jika status alumni Lirboyo."
            className="pt-1"
          />
        </Reveal>

        <Reveal show={isLainnya}>
          <TextField
            label={`Status ${title} (yang lain)`}
            id={`${prefix}-lainnya`}
            required
            value={statusLainnya}
            onChange={(v) =>
              form.setValue(statusLainnyaKey, v, { shouldValidate: true })
            }
            placeholder="Tuliskan status pemohon"
            className="pt-1"
          />
        </Reveal>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <TextField
            label={`Nomor Telepon ${title}`}
            id={`${prefix}-telepon`}
            required
            value={telepon}
            onChange={(v) =>
              form.setValue(teleponKey, v, { shouldValidate: true })
            }
            placeholder="08xxxxxxxxxx"
          />
          {teleponError && (
            <p className="text-xs text-destructive">{teleponError.message}</p>
          )}
        </div>
        <FileUploadField
          label={`Foto ${title}`}
          description="Format 3:4, maksimal 200 KB."
          kind="foto"
          required
          onChange={(v) => form.setValue(fotoKey, v ?? "")}
        />
      </div>
    </div>
  );
}

export function StepPengasuh({ form }: Props) {
  return (
    <StepCard
      title="Identitas Pemohon — Pengasuh"
      description="Data pengasuh lembaga pemohon."
    >
      <PemohonSection form={form} prefix={prefixPengasuh} />
    </StepCard>
  );
}

export function StepPenanggungJawab({ form }: Props) {
  return (
    <StepCard
      title="Identitas Pemohon — Penanggung Jawab"
      description="Data penanggung jawab lembaga pemohon."
    >
      <PemohonSection form={form} prefix={prefixPj} />
    </StepCard>
  );
}
