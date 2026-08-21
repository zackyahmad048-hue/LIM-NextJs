"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/admin/shared/section-card";

import type { LetterNumberingConfig } from "@/modules/secretariat/infrastructure/letter-numbering.config";
import type { NumberingPeriod } from "@/modules/secretariat/application/letter-number.rules";
import {
  setLetterNextSequence,
  updateLetterNumberingSettings,
} from "@/modules/secretariat/presentation/secretariat.action";

interface LevelRow {
  code: string;
  label: string;
}

export function NumberingSettingsForm({
  config,
}: {
  config: LetterNumberingConfig;
}) {
  const router = useRouter();
  const [periods, setPeriods] = useState<NumberingPeriod[]>(config.periods);
  const [levelCodes, setLevelCodes] = useState<LevelRow[]>(config.levelCodes);
  const [saving, setSaving] = useState(false);
  const [sequenceBusy, setSequenceBusy] = useState(false);

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      const result = await updateLetterNumberingSettings(null, formData);
      if (result.success) {
        toast.success(result.message ?? "Pengaturan penomoran disimpan.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Gagal menyimpan pengaturan.");
      }
    } finally {
      setSaving(false);
    }
  }

  function updatePeriod(index: number, field: "startYear" | "endYear", value: number) {
    setPeriods((prev) =>
      prev.map((period, i) => (i === index ? { ...period, [field]: value } : period)),
    );
  }

  function updateLevel(index: number, field: "code" | "label", value: string) {
    setLevelCodes((prev) =>
      prev.map((level, i) => (i === index ? { ...level, [field]: value } : level)),
    );
  }

  async function handleSetSequence(formData: FormData) {
    setSequenceBusy(true);
    try {
      const result = await setLetterNextSequence(formData);
      if (result.success) {
        toast.success(result.message ?? "Nomor urut berikutnya diatur.");
        router.refresh();
      } else {
        toast.error(result.message ?? "Gagal mengatur nomor urut.");
      }
    } finally {
      setSequenceBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <form action={handleSave} className="space-y-3">
        <input type="hidden" name="periods" value={JSON.stringify(periods)} />
        <input
          type="hidden"
          name="levelCodes"
          value={JSON.stringify(levelCodes)}
        />

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Format & Digit</h2>
            <p className="text-xs text-muted-foreground">
              Template memakai placeholder yang dibatasi tanda kurung kurawal.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="formatTemplate" className="text-xs">
                Format Template
              </Label>
              <Input
                id="formatTemplate"
                name="formatTemplate"
                defaultValue={config.formatTemplate}
                placeholder="{seq}/{level}/{category}/{bulan}/{tahun}"
                className="rounded-md font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sequenceDigits" className="text-xs">
                Digit Nomor Urut
              </Label>
              <Input
                id="sequenceDigits"
                name="sequenceDigits"
                type="number"
                min={2}
                max={6}
                defaultValue={config.sequenceDigits}
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-semibold">Periode Kepengurusan</h2>
              <p className="text-xs text-muted-foreground">
                Rentang tahun menentukan periode aktif penomoran surat.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setPeriods((prev) => [
                  ...prev,
                  {
                    startYear: Math.max(...prev.map((p) => p.endYear), 2024) + 1,
                    endYear: Math.max(...prev.map((p) => p.endYear), 2024) + 5,
                  },
                ])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>

          <div className="space-y-2">
            {periods.map((period, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1900}
                  value={period.startYear}
                  onChange={(event) =>
                    updatePeriod(index, "startYear", Number(event.target.value))
                  }
                  className="rounded-md text-xs"
                  aria-label={`Tahun mulai periode ${index + 1}`}
                />
                <span className="text-xs text-muted-foreground">s/d</span>
                <Input
                  type="number"
                  min={1900}
                  value={period.endYear}
                  onChange={(event) =>
                    updatePeriod(index, "endYear", Number(event.target.value))
                  }
                  className="rounded-md text-xs"
                  aria-label={`Tahun akhir periode ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setPeriods((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-semibold">Kode Tingkat</h2>
              <p className="text-xs text-muted-foreground">
                Opsi tingkat kepengurusan untuk form surat keluar.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setLevelCodes((prev) => [...prev, { code: "", label: "" }])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>

          <div className="space-y-2">
            {levelCodes.map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={level.code}
                  onChange={(event) =>
                    updateLevel(index, "code", event.target.value)
                  }
                  placeholder="Kode (mis. PP.III)"
                  className="rounded-md font-mono text-xs"
                  aria-label={`Kode tingkat ${index + 1}`}
                />
                <Input
                  value={level.label}
                  onChange={(event) =>
                    updateLevel(index, "label", event.target.value)
                  }
                  placeholder="Label (mis. Bidang III)"
                  className="rounded-md text-xs"
                  aria-label={`Label tingkat ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setLevelCodes((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Simpan Pengaturan
          </Button>
        </div>
      </form>

      <SectionCard className="rounded-lg p-4">
        <div className="mb-4 border-b pb-3">
          <h2 className="text-base font-semibold">Nomor Urut Berikutnya</h2>
          <p className="text-xs text-muted-foreground">
            Koreksi manual nomor urut yang akan dipakai per periode.
          </p>
        </div>

        <div className="space-y-2">
          {periods.map((period) => (
            <form
              key={`${period.startYear}-${period.endYear}`}
              action={handleSetSequence}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="w-28 text-sm font-medium tabular-nums">
                {period.startYear}/{period.endYear}
              </span>
              <input type="hidden" name="periodYear" value={period.startYear} />
              <Input
                name="sequence"
                type="number"
                min={1}
                defaultValue={
                  config.nextSequence?.[String(period.startYear)] ?? 1
                }
                className="w-28 rounded-md text-xs"
                aria-label={`Nomor urut berikutnya periode ${period.startYear}`}
              />
              <Button type="submit" variant="outline" size="sm" disabled={sequenceBusy}>
                <RefreshCcw className="size-3.5" />
                Atur
              </Button>
            </form>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
