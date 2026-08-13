"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";

import { wajibKhidmahLembagaSchema } from "@/modules/twk-lembaga/validations/schema";
import type { WajibKhidmahLembagaInput } from "@/modules/twk-lembaga/validations/schema";
import { createWajibKhidmahLembaga } from "@/modules/twk-lembaga/presentation/lembaga.action";

import { StepIdentitas } from "./steps/step-identitas";
import { StepPengasuh, StepPenanggungJawab } from "./steps/step-pemohon";
import { StepKondisi } from "./steps/step-kondisi";
import { StepPermohonan } from "./steps/step-permohonan";
import { SuccessScreen } from "./success-screen";

type FormValues = WajibKhidmahLembagaInput;

const STEPS = [
  { key: "identitas", label: "Identitas Lembaga" },
  { key: "pengasuh", label: "Pengasuh" },
  { key: "penanggung", label: "Penanggung Jawab" },
  { key: "kondisi", label: "Kondisi Lembaga" },
  { key: "permohonan", label: "Permohonan & Upload" },
] as const;

function buildDefaultValues(): FormValues {
  return {
    namaLembagaPendidikan: "",
    rtRw: "",
    desaKelurahan: "",
    kecamatan: "",
    kabupatenKota: "",
    provinsi: "",
    teleponLembaga: "",
    mediaSosialLembaga: "",
    pengasuhNama: "",
    pengasuhStatus: "",
    pengasuhStatusLainnya: "",
    pengasuhAlumniAngkatan: "",
    pengasuhTelepon: "",
    pengasuhFotoFileId: "",
    penanggungJawabNama: "",
    penanggungJawabStatus: "",
    penanggungJawabStatusLainnya: "",
    penanggungJawabAlumniAngkatan: "",
    penanggungJawabTelepon: "",
    penanggungJawabFotoFileId: "",
    lokasiMadrasah: "",
    jenisSatuanPendidikan: "",
    jenisSatuanPendidikanLainnya: "",
    kitabBermakna: [],
    kitabBermaknaLainnya: "",
    bahasaPengantar: [],
    bahasaPengantarLainnya: "",
    jumlahPengurusPutra: "",
    jumlahPengurusPutri: "",
    jumlahSantriPutra: "",
    jumlahSantriPutri: "",
    jumlahGuruBantuDimohon: "",
    tugasGuruBantu: "",
    kitabDiajarkanGuruBantu: "",
    catatanCalonGuruBantu: "",
  };
}

export function PermohonanWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(wajibKhidmahLembagaSchema) as Resolver<FormValues>,
    defaultValues: buildDefaultValues(),
    mode: "onTouched",
  });

  const stepFields: Record<
    (typeof STEPS)[number]["key"],
    Array<keyof FormValues>
  > = {
    identitas: [
      "namaLembagaPendidikan",
      "rtRw",
      "desaKelurahan",
      "kecamatan",
      "kabupatenKota",
      "provinsi",
      "teleponLembaga",
      "mediaSosialLembaga",
    ],
    pengasuh: [
      "pengasuhNama",
      "pengasuhStatus",
      "pengasuhStatusLainnya",
      "pengasuhAlumniAngkatan",
      "pengasuhTelepon",
      "pengasuhFotoFileId",
    ],
    penanggung: [
      "penanggungJawabNama",
      "penanggungJawabStatus",
      "penanggungJawabStatusLainnya",
      "penanggungJawabAlumniAngkatan",
      "penanggungJawabTelepon",
      "penanggungJawabFotoFileId",
    ],
    kondisi: [
      "lokasiMadrasah",
      "jenisSatuanPendidikan",
      "jenisSatuanPendidikanLainnya",
      "kitabBermakna",
      "kitabBermaknaLainnya",
      "bahasaPengantar",
      "bahasaPengantarLainnya",
      "jumlahPengurusPutra",
      "jumlahPengurusPutri",
      "jumlahSantriPutra",
      "jumlahSantriPutri",
    ],
    permohonan: [
      "jumlahGuruBantuDimohon",
      "tugasGuruBantu",
      "kitabDiajarkanGuruBantu",
      "catatanCalonGuruBantu",
      "dokumenPermohonanFileId",
    ],
  };

  async function handleNext() {
    const fields = stepFields[STEPS[step].key];
    const valid = await form.trigger(fields as (keyof FormValues)[]);
    if (!valid) {
      const firstError = Object.values(form.formState.errors)[0]?.message;
      if (firstError) toast.error(String(firstError));
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    const valid = await form.trigger();
    if (!valid) {
      const firstError = Object.values(form.formState.errors)[0]?.message;
      if (firstError) toast.error(String(firstError));
      return;
    }

    setSubmitting(true);
    const values = form.getValues();
    const formData = new FormData();
    appendFormData(formData, values);

    const result = await createWajibKhidmahLembaga(null, formData);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message ?? "Gagal mengirim permohonan.");
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return <SuccessScreen />;
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm pb-24 sm:p-8 sm:pb-8">
      {/* Stepper */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Langkah {step + 1} dari {STEPS.length}
          </span>
          <span className="font-medium text-foreground">
            {STEPS[step].label}
          </span>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 overflow-hidden rounded bg-border">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              transition={SPRING_LAYOUT}
            />
          </div>

          <ol className="relative flex justify-between">
            {STEPS.map((item, index) => {
              const active = index === step;
              const done = index < step;
              return (
                <li key={item.key} className="flex flex-col items-center">
                  <motion.button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    aria-label={`${item.label}: ${done ? "selesai" : active ? "sedang berlangsung" : "belum"}`}
                    whileHover={reduce ? undefined : { scale: 1.08 }}
                    whileTap={reduce ? undefined : { scale: 0.94 }}
                    transition={SPRING_LAYOUT}
                    onClick={() => {
                      if (index < step) setStep(index);
                    }}
                    disabled={index > step}
                    className={cn(
                      "z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      done &&
                        "border-primary bg-primary text-primary-foreground",
                      active &&
                        "border-primary bg-background text-primary ring-4 ring-primary/20",
                      !done &&
                        !active &&
                        "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : <span className="tabular-nums">{index + 1}</span>}
                  </motion.button>
                  <span
                    className={cn(
                      "mt-2 hidden text-[11px] font-medium sm:block",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Step content */}
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={STEPS[step].key}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: 28 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: -28 }
            }
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="min-h-80"
          >
            {step === 0 && <StepIdentitas form={form} />}
            {step === 1 && <StepPengasuh form={form} />}
            {step === 2 && <StepPenanggungJawab form={form} />}
            {step === 3 && <StepKondisi form={form} />}
            {step === 4 && <StepPermohonan form={form} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0 || submitting}
        >
          <ChevronLeft className="size-4" />
          Kembali
        </Button>

        {isLast ? (
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Kirim Permohonan
                <Check className="size-4" />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            Lanjut
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Sticky mobile action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0 || submitting}
          >
            <ChevronLeft className="size-4" />
            Kembali
          </Button>
          {isLast ? (
            <Button
              type="button"
              className="flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={handleNext}>
              Lanjut
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function appendFormData(formData: FormData, values: FormValues): void {
  const set = (key: string, value: string | number | null | undefined) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
  };

  set("namaLembagaPendidikan", values.namaLembagaPendidikan);
  set("rtRw", values.rtRw);
  set("desaKelurahan", values.desaKelurahan);
  set("kecamatan", values.kecamatan);
  set("kabupatenKota", values.kabupatenKota);
  set("provinsi", values.provinsi);
  set("teleponLembaga", values.teleponLembaga);
  set("mediaSosialLembaga", values.mediaSosialLembaga);

  set("pengasuhNama", values.pengasuhNama);
  set(
    "pengasuhStatus",
    (values.pengasuhStatus as string | undefined) || undefined,
  );
  set("pengasuhStatusLainnya", values.pengasuhStatusLainnya);
  set("pengasuhAlumniAngkatan", values.pengasuhAlumniAngkatan);
  set("pengasuhTelepon", values.pengasuhTelepon);
  set("pengasuhFotoFileId", values.pengasuhFotoFileId);

  set("penanggungJawabNama", values.penanggungJawabNama);
  set(
    "penanggungJawabStatus",
    (values.penanggungJawabStatus as string | undefined) || undefined,
  );
  set("penanggungJawabStatusLainnya", values.penanggungJawabStatusLainnya);
  set("penanggungJawabAlumniAngkatan", values.penanggungJawabAlumniAngkatan);
  set("penanggungJawabTelepon", values.penanggungJawabTelepon);
  set("penanggungJawabFotoFileId", values.penanggungJawabFotoFileId);

  set(
    "lokasiMadrasah",
    (values.lokasiMadrasah as string | undefined) || undefined,
  );
  set(
    "jenisSatuanPendidikan",
    (values.jenisSatuanPendidikan as string | undefined) || undefined,
  );
  set("jenisSatuanPendidikanLainnya", values.jenisSatuanPendidikanLainnya);
  for (const v of values.kitabBermakna ?? [])
    formData.append("kitabBermakna", v);
  set("kitabBermaknaLainnya", values.kitabBermaknaLainnya);
  for (const v of values.bahasaPengantar ?? [])
    formData.append("bahasaPengantar", v);
  set("bahasaPengantarLainnya", values.bahasaPengantarLainnya);
  set(
    "jumlahPengurusPutra",
    (values.jumlahPengurusPutra as number | null | undefined) ?? undefined,
  );
  set(
    "jumlahPengurusPutri",
    (values.jumlahPengurusPutri as number | null | undefined) ?? undefined,
  );
  set(
    "jumlahSantriPutra",
    (values.jumlahSantriPutra as number | null | undefined) ?? undefined,
  );
  set(
    "jumlahSantriPutri",
    (values.jumlahSantriPutri as number | null | undefined) ?? undefined,
  );

  set(
    "jumlahGuruBantuDimohon",
    (values.jumlahGuruBantuDimohon as number | undefined) ?? undefined,
  );
  set("tugasGuruBantu", values.tugasGuruBantu);
  set("kitabDiajarkanGuruBantu", values.kitabDiajarkanGuruBantu);
  set("catatanCalonGuruBantu", values.catatanCalonGuruBantu);
  set("dokumenPermohonanFileId", values.dokumenPermohonanFileId);
}
