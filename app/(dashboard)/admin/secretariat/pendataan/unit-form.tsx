"use client";

import { useState, useActionState } from "react";
import { Building2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionResultMessage } from "@/components/admin/shared/action-result-message";

import {
  createUnitAction,
  updateUnitAction,
} from "@/modules/organization/presentation/organization.action";
import { INITIAL_ACTION_RESULT } from "@/modules/shared/presentation/action-result";
import type { UnitLevel } from "@/generated/client";

export interface UnitOption {
  id: string;
  code: string;
  name: string;
  level: UnitLevel;
}

interface UnitFormProps {
  units: UnitOption[];
  mode: "create" | "edit";
  id?: string;
  initial?: {
    code?: string;
    name?: string;
    level?: UnitLevel;
    parentId?: string | null;
    sortOrder?: number;
  };
}

const LEVEL_OPTIONS: { value: UnitLevel; label: string }[] = [
  { value: "PP", label: "Pengurus Pusat" },
  { value: "PW", label: "Pengurus Wilayah" },
  { value: "PC", label: "Pengurus Cabang" },
];

export function UnitForm({ units, mode, id, initial }: UnitFormProps) {
  const [level, setLevel] = useState<UnitLevel>(initial?.level ?? "PP");
  const [parentId, setParentId] = useState(initial?.parentId ?? "");

  const parentOptions = units.filter((unit) =>
    level === "PW" ? unit.level === "PP" : level === "PC" ? unit.level === "PW" : false,
  );

  const action =
    mode === "create"
      ? createUnitAction
      : updateUnitAction.bind(null, id as string);

  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_RESULT,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-3">
      <SectionCard className="rounded-lg p-4">
        <div className="mb-4 border-b pb-3">
          <h2 className="text-base font-semibold">Informasi Unit</h2>
          <p className="text-xs text-muted-foreground">
            Kode unit dipakai sebagai kolom kedua nomor surat (contoh: PP.I,
            PW.V, PC.I.3).
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs">
              Kode Unit
            </Label>
            <Input
              id="code"
              name="code"
              required
              defaultValue={initial?.code}
              placeholder="Contoh: PP.I atau PW.V"
              className="rounded-md font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="level" className="text-xs">
              Tingkat
            </Label>
            <NativeSelect
              id="level"
              name="level"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value as UnitLevel);
                setParentId("");
              }}
              className="w-full"
            >
              {LEVEL_OPTIONS.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="name" className="text-xs">
              Nama Unit
            </Label>
            <Input
              id="name"
              name="name"
              required
              autoComplete="off"
              defaultValue={initial?.name}
              placeholder="Contoh: Pengurus Wilayah Jawa Timur"
              className="rounded-md text-xs"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="parentId" className="text-xs">
              Unit Induk {level === "PP" ? "(tidak diperlukan)" : ""}
            </Label>
            <NativeSelect
              id="parentId"
              name="parentId"
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
              disabled={parentOptions.length === 0 && level !== "PC"}
              className="w-full"
            >
              <NativeSelectOption value="">
                {level === "PW"
                  ? "— Pengurus Pusat (PP) —"
                  : level === "PC"
                    ? "Pilih Pengurus Wilayah (opsional)"
                    : "Unit Pusat tidak memiliki induk"}
              </NativeSelectOption>
              {parentOptions.map((unit) => (
                <NativeSelectOption key={unit.id} value={unit.id}>
                  {unit.code} — {unit.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <p className="text-[11px] text-muted-foreground">
              {level === "PC"
                ? "Cabang tanpa induk diperbolehkan untuk wilayah yang belum terdata."
                : "Wilayah dan Cabang otomatis masuk kaskade struktur."}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder" className="text-xs">
              Urutan
            </Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={initial?.sortOrder ?? 0}
              className="rounded-md text-xs"
            />
          </div>
        </div>
      </SectionCard>

      <ActionResultMessage state={state} />

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {mode === "create" ? (
            <Building2 className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {pending
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Unit"
              : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
