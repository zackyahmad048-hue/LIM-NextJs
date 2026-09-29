"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Save, UserPlus } from "lucide-react";

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
  createOfficerAction,
  updateOfficerAction,
} from "@/modules/organization/presentation/organization.action";
import { INITIAL_ACTION_RESULT } from "@/modules/shared/presentation/action-result";

export interface OfficerUnitOption {
  id: string;
  code: string;
  name: string;
}

interface OfficerFormProps {
  units: OfficerUnitOption[];
  mode: "create" | "edit";
  id?: string;
  defaultUnitId?: string;
  initial?: {
    name?: string;
    position?: string;
    isLeader?: boolean;
    phone?: string;
    email?: string;
    sortOrder?: number;
  };
}

const LEADER_POSITIONS = [
  "Ketua",
  "Wakil Ketua",
  "Sekretaris",
  "Bendahara",
];

export function OfficerForm({
  units,
  mode,
  id,
  defaultUnitId,
  initial,
}: OfficerFormProps) {
  const [unitId, setUnitId] = useState(defaultUnitId ?? units[0]?.id ?? "");

  const action =
    mode === "create"
      ? createOfficerAction
      : updateOfficerAction.bind(null, id as string);

  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_RESULT,
  );

  const fieldError = (name: string) => state.fieldErrors?.[name];

  const unitIdError = fieldError("unitId");
  const nameError = fieldError("name");
  const positionError = fieldError("position");
  const phoneError = fieldError("phone");
  const emailError = fieldError("email");
  const sortOrderError = fieldError("sortOrder");

  const cancelHref =
    unitId !== ""
      ? `/admin/secretariat/pendataan/units/${unitId}/officers`
      : "/admin/secretariat/pendataan";

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <Band>
        <FormGroup
          legend="Data Pengurus"
          description="Tandai &quot;Ketua&quot; bila pengurus ini pemimpin unit (hanya satu per unit)."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="unitId" className="text-xs">
                Unit
              </Label>
              <NativeSelect
                id="unitId"
                name="unitId"
                required
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                disabled={mode === "edit"}
                className="w-full"
                aria-invalid={unitIdError ? true : undefined}
                aria-describedby={unitIdError ? "unitId-error" : undefined}
              >
                {units.map((unit) => (
                  <NativeSelectOption key={unit.id} value={unit.id}>
                    {unit.code} — {unit.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {unitIdError && (
                <p id="unitId-error" role="alert" className="text-xs text-destructive">
                  {unitIdError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                defaultValue={initial?.name}
                placeholder="Nama lengkap pengurus"
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

            <div className="space-y-1.5">
              <Label htmlFor="position" className="text-xs">
                Jabatan
              </Label>
              <Input
                id="position"
                name="position"
                required
                list="leader-positions"
                defaultValue={initial?.position}
                placeholder="Contoh: Sekretaris"
                className="rounded-md text-xs"
                aria-invalid={positionError ? true : undefined}
                aria-describedby={
                  positionError ? "position-error" : undefined
                }
              />
              <datalist id="leader-positions">
                {LEADER_POSITIONS.map((position) => (
                  <option key={position} value={position} />
                ))}
              </datalist>
              {positionError && (
                <p id="position-error" role="alert" className="text-xs text-destructive">
                  {positionError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">
                No. HP / WhatsApp
              </Label>
              <Input
                id="phone"
                name="phone"
                autoComplete="tel"
                defaultValue={initial?.phone ?? ""}
                placeholder="0812xxxx"
                className="rounded-md text-xs"
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? "phone-error" : undefined}
              />
              {phoneError && (
                <p id="phone-error" role="alert" className="text-xs text-destructive">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={initial?.email ?? ""}
                placeholder="email@contoh.id"
                className="rounded-md text-xs"
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p id="email-error" role="alert" className="text-xs text-destructive">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="isLeader"
                name="isLeader"
                type="checkbox"
                value="true"
                defaultChecked={initial?.isLeader ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <Label htmlFor="isLeader" className="text-xs">
                Pengurus ini Ketua / pemimpin unit
              </Label>
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
          <Link href={cancelHref}>Batal</Link>
        </Button>
        <Button type="submit" size="sm" disabled={pending}>
          {mode === "create" ? (
            <UserPlus className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {pending
            ? "Menyimpan..."
            : mode === "create"
              ? "Simpan Pengurus"
              : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}