"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Building2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
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

  const fieldError = (name: string) => state.fieldErrors?.[name];

  const codeError = fieldError("code");
  const levelError = fieldError("level");
  const nameError = fieldError("name");
  const parentIdError = fieldError("parentId");
  const sortOrderError = fieldError("sortOrder");

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Band>
        <FormGroup
          legend="Informasi Unit"
          description="Kode unit dipakai sebagai kolom kedua nomor surat (contoh: PP.I, PW.V, PC.I.3)."
        >
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
                aria-invalid={codeError ? true : undefined}
                aria-describedby={codeError ? "code-error" : undefined}
              />
              {codeError && (
                <p id="code-error" role="alert" className="text-xs text-destructive">
                  {codeError}
                </p>
              )}
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
                aria-invalid={levelError ? true : undefined}
                aria-describedby={levelError ? "level-error" : undefined}
              >
                {LEVEL_OPTIONS.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {levelError && (
                <p id="level-error" role="alert" className="text-xs text-destructive">
                  {levelError}
                </p>
              )}
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
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? "name-error" : undefined}
              />
              {nameError && (
                <p id="name-error" role="alert" className="text-xs text-destructive">
                  {nameError}
                </p>
              )}
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
                aria-invalid={parentIdError ? true : undefined}
                aria-describedby={
                  parentIdError
                    ? "parentId-error"
                    : "parentId-helper"
                }
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
              {parentIdError ? (
                <p id="parentId-error" role="alert" className="text-xs text-destructive">
                  {parentIdError}
                </p>
              ) : (
                <p id="parentId-helper" className="text-[11px] text-muted-foreground">
                  {level === "PC"
                    ? "Cabang tanpa induk diperbolehkan untuk wilayah yang belum terdata."
                    : "Wilayah dan Cabang otomatis masuk kaskade struktur."}
                </p>
              )}
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
                aria-invalid={sortOrderError ? true : undefined}
                aria-describedby={
                  sortOrderError ? "sortOrder-error" : undefined
                }
              />
              {sortOrderError && (
                <p id="sortOrder-error" role="alert" className="text-xs text-destructive">
                  {sortOrderError}
                </p>
              )}
            </div>
          </div>
        </FormGroup>
      </Band>

      <ActionResultMessage state={state} />

      <div className="sticky bottom-4 flex justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/secretariat/pendataan">Batal</Link>
        </Button>
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