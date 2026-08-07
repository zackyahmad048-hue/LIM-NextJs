"use client";

import { useState } from "react";
import { Save, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { SectionCard } from "@/components/admin/shared/section-card";

import {
  createOfficerAction,
  updateOfficerAction,
} from "@/modules/organization/presentation/organization.action";

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

  return (
    <form action={action} className="max-w-2xl space-y-3">
      <SectionCard className="rounded-lg p-4">
        <div className="mb-4 border-b pb-3">
          <h2 className="text-base font-semibold">Data Pengurus</h2>
          <p className="text-xs text-muted-foreground">
            Tandai &quot;Ketua&quot; bila pengurus ini pemimpin unit (hanya satu
            per unit).
          </p>
        </div>

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
            >
              {units.map((unit) => (
                <NativeSelectOption key={unit.id} value={unit.id}>
                  {unit.code} — {unit.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs">
              Nama
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initial?.name}
              placeholder="Nama lengkap pengurus"
              className="rounded-md text-xs"
            />
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
            />
            <datalist id="leader-positions">
              {LEADER_POSITIONS.map((position) => (
                <option key={position} value={position} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs">
              No. HP / WhatsApp
            </Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={initial?.phone ?? ""}
              placeholder="0812xxxx"
              className="rounded-md text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initial?.email ?? ""}
              placeholder="email@contoh.id"
              className="rounded-md text-xs"
            />
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
            />
          </div>
        </div>
      </SectionCard>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="sm">
          {mode === "create" ? (
            <UserPlus className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {mode === "create" ? "Simpan Pengurus" : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
