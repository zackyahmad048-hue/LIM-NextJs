"use client";

import type { UseFormReturn } from "react-hook-form";

import { FileUploadField } from "../file-upload-field";
import { FieldWrapper, TextField } from "./fields";
import { StepCard } from "./step-card";

import { GURU_BANTU_DIMOHON_OPTIONS } from "@/modules/twk-lembaga/domain/entities";
import type { WajibKhidmahLembagaInput } from "@/modules/twk-lembaga/validations/schema";
import { cn } from "@/lib/utils";

interface Props {
  form: UseFormReturn<WajibKhidmahLembagaInput>;
}

export function StepPermohonan({ form }: Props) {
  const chosen = (form.watch("jumlahGuruBantuDimohon") ?? "") as number | "";

  return (
    <StepCard
      title="Permohonan Guru Bantu"
      description="Rincian permohonan guru bantu dari lembaga pemohon."
    >
      <div className="space-y-5">
        <FieldWrapper label="Jumlah Guru Bantu yang Dimohon" required>
          <div className="flex gap-2">
            {GURU_BANTU_DIMOHON_OPTIONS.map((option) => {
              const selected = chosen === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    form.setValue("jumlahGuruBantuDimohon", option as never, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "flex h-12 w-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:bg-muted/60",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </FieldWrapper>

        <TextField
          label="Tugas yang Diamanatkan kepada Guru Bantu"
          id="tugas"
          value={form.watch("tugasGuruBantu") ?? ""}
          onChange={(v) => form.setValue("tugasGuruBantu", v)}
          placeholder="Contoh: Mengajar TPQ, membantu pengurus madrasah"
        />

        <TextField
          label="Kitab yang Akan Diajarkan oleh Guru Bantu"
          id="kitab"
          value={form.watch("kitabDiajarkanGuruBantu") ?? ""}
          onChange={(v) => form.setValue("kitabDiajarkanGuruBantu", v)}
          placeholder="Contoh: Tashrif, Nahwu Shorof, Fiqh"
        />

        <FieldWrapper label="Catatan untuk Calon Guru Bantu">
          <textarea
            id="catatan"
            rows={4}
            value={form.watch("catatanCalonGuruBantu") ?? ""}
            onChange={(event) =>
              form.setValue("catatanCalonGuruBantu", event.target.value)
            }
            placeholder="Catatan tambahan bagi calon guru bantu (opsional)."
            className="min-h-24 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </FieldWrapper>

        <FileUploadField
          label="Dokumen Permohonan"
          description="Surat permohonan dalam format PDF, maksimal 5 MB."
          kind="dokumen"
          onChange={(v) => form.setValue("dokumenPermohonanFileId", v ?? "")}
        />
      </div>
    </StepCard>
  );
}
